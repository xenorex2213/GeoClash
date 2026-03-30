const Game = require("../models/Game")

const axios = require("axios");
exports.testController = (req,res) => {

    res.json({message : "Game controller is working"});
}
exports.createGame = async (req,res) => {

    const gameId = Math.random().toString(10).substring(2,6);
    const game = new Game ({

        gameId : gameId,
        status : "lobby",
        createdAt : new Date(),
        location : null,
        players : {},
        guesses : [],
        revealedHints : [],
        wrongAttempts : 0
    });
    await game.save();

    res.json({

        message : "Game created successfully",
        gameId : gameId
    });
};
exports.getGame = async (req,res) => {

    const gameId = req.params.gameId;
    const playerId = req.query.playerId;
    const game = await Game.findOne({gameId});

    if(!game){
        return res.status(404).json({
            message : "Game not found"
        });
    }
    let gameData = game.toObject();

    const player = game.players.get(playerId);
    if(player?.role === "guesser" && game.status === "playing"){
        gameData.location = null;
    }
    return res.json({game : gameData,hints:game.revealedHints});
}
exports.joinGame = async (req,res) => {

    const {gameId,playerId} = req.body;

    const game = await Game.findOne({gameId});
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    
    if(game.players.get(playerId)){
        return res.json({message:"Player already joined"});
    }
    game.players.set(playerId,{
        role : null,
        score : 100
    });
    if(game.players.size === 2){
        game.status = "role";
    }
    await game.save();
    console.log("players : ",game.players.size);
    console.log("status after joining : ",game.status)
    res.json({message: "Player joined successfully"});

}
exports.assignRole = async (req,res) => {

    console.log("assignRole called");
    const {gameId} = req.body;
    const game = await Game.findOne({gameId});
    console.log("status : ",game.status);
    if(!game){
        return res.status(404).json({message:"Game not found"});
    }

    if(game.status !== "role"){
        return res.status(400).json({message:"Roles already assigned"});
    }
    const playerIds = Array.from(game.players.keys());
    if(playerIds.length!==2){
        
        return res.status(400).json({message:"Need 2 Players"})
    };
    let p1 = game.players.get(playerIds[0]);
    let p2 = game.players.get(playerIds[1]);
    if(Math.random() < 0.5){
        p1.role = "setter";
        p2.role = "guesser";
    }
    else{
        p2.role = "setter";
        p1.role = "guesser";
    }
    game.players.set(playerIds[0],p1);
    game.players.set(playerIds[1],p2);

    game.status = "playing";
    console.log("status : ",game.status);

    await game.save();
    
    res.json({message:"Role set successfully",players : Object.fromEntries(game.players)});
};
exports.setLocation  = async (req,res) => {

    const {gameId,playerId,location} = req.body;
    const game = await Game.findOne({gameId});
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    const player = game.players.get(playerId);

    if(!player || player.role !== "setter"){

        return res.status(403).json({message : "only setter can set location"})

    }
    try{

        const apiKey = process.env.OPENCAGE_KEY;
        const response = await axios.get("https://api.opencagedata.com/geocode/v1/json",
            {
                params:{

                    q : location,
                    key : apiKey,
                    limit : 1

                }
            }
        );
        if(response.data.results.length === 0){
            return res.status(400).json({message : "Invalid city name"});
        }
        const result = response.data.results[0];
        const components = result.components;
        game.location = {

            continent : components.continent || null,
            country : components.country || null,
            state : components.state || null,
            city : components.city || components.town || components.village || location,
            lat : result.geometry.lat,
            lng : result.geometry.lng
        };
        game.wrongAttempts = 0;
        await game.save();


        return res.json({message:"location set successfully",location:game.location});

    }
    catch(error){
        return res.status(500).json({message:"Error validating location"})
    }
    
}
exports.submitGuess = async (req,res) => {

        const {gameId,playerId,guess} = req.body;

        if(!gameId||!playerId||!guess){
            return res.status(400).json({message : "game id ,player id and guess are required"})
        };
        const game = await Game.findOne({gameId});

        if(!game){
            return res.status(404).json({message:"game not found"});
        }
        const player = game.players.get(playerId);

        if (!player || player.role !== "guesser") {
        return res.status(403).json({
                message: "Only guesser can submit guesses"
            });
        }
        if(!game.location){
            return res.status(400).json({message:"location not set yet"});
        }
        if(guess.toLowerCase() === game.location.city.toLowerCase()){
            game.status = "completed";
            await game.save();
            return res.json({status : game.status,score : player.score})
        }
        game.wrongAttempts++;
        player.score -= 10;
        game.guesses.push({playerId,guess,timestamp : new Date()});
        if(game.wrongAttempts === 1){
            game.revealedHints.push("Continent : "+game.location.continent);
            await game.save();
            return res.json(
                    {  
                        message:"Incorrect Guess !! Try again.\nHint : Continent ->  "+game.location.continent,
                        score : player.score
                    }
                );
        }
        if(game.wrongAttempts === 2){
            game.revealedHints.push("Country : "+game.location.country);
            await game.save();
            return res.json(
                {
                    message:"Incorrect Guess !! Try again.\nHint : Country ->  "+game.location.country,
                    score : player.score
                }
            );
        }
        if(game.wrongAttempts === 3){
            game.revealedHints.push("State : "+game.location.state);
            await game.save();
            return res.json(
                {
                    message:"Incorrect Guess !! Try again.\nHint : State ->  "+game.location.state,score:player.score
                }
            );
        }
        if(game.wrongAttempts >= 4){
            await game.save();

            return res.json({
                message:"Incorrect Guess !! Try again.\nAll Hints:\n" + game.revealedHints.join("\n"),
                score:player.score,
                hints: game.revealedHints

            })
        }
        
    
}