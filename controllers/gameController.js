const games = {};
exports.testController = (req,res) => {

    res.json({message : "Game controller is working"});
}
exports.createGame = (req,res) => {

    const gameId = Date.now();

    games[gameId] = {

        gameId : gameId,
        status : "active",
        createdAt : new Date(),
        location : null,
        players:{},
        guesses: []
    };

    res.json({

        message : "Game created successfully",
        gameId : gameId
    });
};

exports.getGame = (req,res) => {

    const gameId = req.params.gameId;

    const game = games[gameId];

    if(!game){
        return res.status(404).json({
            message : "Game not found"
        });
    }
        
    return res.json(game);
}
exports.joinGame = (req,res) => {

    const {gameId,playerId,role} = req.body;

    const game = games[gameId];
    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }
    if(game.players[playerId]){
        return res.json({message:"Player already joined"});
    }
    const guess_exists = Object.values(game.players).find(p => p.role === "guesser");
    if(role === "guesser" && guess_exists){
        return res.status(400).json({message : "guesser already exists"})

    }
    game.players[playerId] = {

        role,
        score : role === "guesser" ? 100 : null
    }
    return res.json({message: "Player joined sucessfully"});

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
        player.score -= 10;

        game.guesses.push({playerId,guess,timestamp : new Date()});
        res.json(
            {   
                message : "guess received", 
                guesses : game.guesses,
                score : player.score, 
            });

}