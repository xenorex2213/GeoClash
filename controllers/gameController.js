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
        score : 0

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

exports.submitGuess = (req,res) => {


        const {gameId,guess} = req.body;


        if(!gameId||!guess){
            return res.status(400).json({message : "game id and geuss are required"})
        };
        const game = games[gameId];

        if(!game){
            return res.status(404).json({message:"game not found"});
        }
        game.score -= 10;
        game.lastguess = guess;

        res.json({message : "guess received" , gameId : gameId,guess : guess,score : game.score})

}