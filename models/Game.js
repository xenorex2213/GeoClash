const mongoose = require("mongoose");
const gameSchema = new mongoose.Schema({
    gameId : String,
    status : String,
    createdAt : Date,
    
    location : {
        continent : String,
        country : String,
        state : String,
        city : String,
        lat : Number,
        lng : Number

    },
    players:{
        type: Map,
        of: {
            role:String,
            score:Number
        }
    },

    guesses : [
        {
            playerId : String,
            guess:String,
            timeStamp : Date

        }
    ],
    revealedHints : [String],
    wrongAtemmpts : Number
});
module.exports = mongoose.model('Game',gameSchema);