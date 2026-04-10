const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["lobby", "role", "playing", "completed"],
        default: "lobby"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    mode: {
        type:String,
        enum : ["text","map"],
        default : "text"
    },
    // 🟢 ROUND CONTROL
    totalRounds: {
        type: Number,
        default: 2
    },

    currentRound: {
        type: Number,
        default: 1
    },

    lastSetterId: {
        type: String,
        default: null
    },

    // 🌍 CURRENT LOCATION (hidden from guesser)
    location: {
        continent: String,
        country: String,
        state: String,
        city: String,
        lat: Number,
        lng: Number
    },

    aiHint: {
        type: String,
        default: null
    },

    // 👥 PLAYERS
    players: {
        type: Map,
        of: {
            role: String,
            roundScore: {
                type: Number,
                default: 100
            },
            totalScore: {
                type: Number,
                default: 0
            }
        },
        default: {}
    },

    // 🔴 CURRENT ROUND DATA (LIVE)
    guesses: {
        type: [
            {
                playerId: String,
                guess: String,
                timeStamp: Date
            }
        ],
        default: []
    },

    revealedHints: {
        type: [String],
        default: []
    },

    wrongAttempts: {
        type: Number,
        default: 0
    },

    // 🔵 ROUND HISTORY
    rounds: {
        type: [
            {
                roundNumber: Number,

                guesses: [
                    {
                        playerId: String,
                        guess: String,
                        timeStamp: Date
                    }
                ],

                revealedHints: [String],
                wrongAttempts: Number,

                winner: String,

                aiHint: String,

                scores: {
                    type: Map,
                    of: Number
                },

                // optional but useful 👇
                location: {
                    city: String,
                    country: String
                }
            }
        ],
        default: []
    }
});

module.exports = mongoose.model("Game", gameSchema);