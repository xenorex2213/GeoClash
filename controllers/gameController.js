const games = {};
const axios = require("axios");
exports.testController = (req,res) => {

    res.json({message : "Game controller is working"});
}
exports.createGame = (req,res) => {

    const gameId = Math.random().toString(10).substring(2,6);
    games[gameId] = {

        gameId : gameId,
        status : "lobby",
        createdAt : new Date(),
        location : null,
        players:{},
        guesses: [],
        revealedHints: []

    };

    res.json({

        message : "Game created successfully",
        gameId : gameId
    });
};
exports.getGame = (req,res) => {

    const gameId = req.params.gameId;
    const game = games[gameId];
    const playerId = req.query.playerId;

    if(!game){
        return res.status(404).json({
            message : "Game not found"
        });
    }
    const player = game.players[playerId];
    if(player?.role === "guesser" && game.status === "playing"){
        const hideGame = {...game,location : null,hints : game.revealedHints};
        return res.json({game,hints:game.revealedHints});
    }
    return res.json(game);
}
exports.joinGame = (req,res) => {

    const {gameId,playerId} = req.body;

    const game = games[gameId];
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    
    if(game.players[playerId]){
        return res.json({message:"Player already joined"});
    }
    game.players[playerId] = {
        role : null,
        score : 100
    };
    if(Object.keys(game.players).length == 2){
        game.status = "role";
    }
    res.json({message: "Player joined successfully"});

}
exports.assignRole = (req,res) => {

    const {gameId} = req.body;
    const game = games[gameId];

    if(!game){
        return res.status(404).json({message:"Game not found"});
    }

    if(game.status !== "role"){
        return res.status(400).json({message:"Roles already assigned"});
    }
    const playerIds = Object.keys(game.players)
    if(playerIds.length!==2){
        
        return res.status(400).json({message:"Need 2 Players"})
    };

    if(Math.random() < 0.5){
        game.players[playerIds[0]].role = "setter";
        game.players[playerIds[1]].role = "guesser";
    }
    else{
        game.players[playerIds[1]].role = "setter";
        game.players[playerIds[0]].role = "guesser";
    }

    game.status = "playing"
    
    res.json({message:"Role set successfully",players : game.players});
};
exports.setLocation  = async( req,res) => {

    const {gameId,playerId,location} = req.body;


    const game = games[gameId];
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    const player = game.players[playerId];

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

        return res.json({message:"location set successfully",location:game.location});

    }
    catch(error){
        return res.status(500).json({message:"Error validating location"})
    }
    
}
exports.submitGuess = (req,res) => {

        const {gameId,playerId,guess} = req.body;

        if(!gameId||!playerId||!guess){
            return res.status(400).json({message : "game id ,player id and guess are required"})
        };
        const game = games[gameId];

        if(!game){
            return res.status(404).json({message:"game not found"});
        }
        const player = game.players[playerId];

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
            return res.json({status : game.status,score : player.score})

        }
        game.wrongAttempts++;
        player.score -= 10;
        game.guesses.push({playerId,guess,timestamp : new Date()});

        if(game.wrongAttempts === 1){
            game.revealedHints.push("Continent : "+game.location.continent);
            return res.json(
                    {  
                        message:"Incorrect Guess !! Try again.\nHint : Continent ->  "+game.location.continent,
                        score : player.score
                    }
                );
        }
        if(game.wrongAttempts === 2){
            game.revealedHints.push("Country : "+game.location.country);

            return res.json(
                {
                    message:"Incorrect Guess !! Try again.\nHint : Country ->  "+game.location.country,
                    score : player.score
                }
            );
        }
        if(game.wrongAttempts === 3){
            game.revealedHints.push("State : "+game.location.state);
            return res.json(
                {
                    message:"Incorrect Guess !! Try again.\nHint : State ->  "+game.location.state,score:player.score
                }
            );
        }
        if(game.wrongAttempts >= 4){
            return res.json({
                message:"Incorrect Guess !! Try again.\nAll Hints:\n" + game.revealedHints.join("\n"),
                score:player.score,
                hints: game.revealedHints

            })
        }
        
    
}