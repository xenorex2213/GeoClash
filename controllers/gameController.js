const Game = require("../models/Game");
const axios = require("axios");

// ---------------- DISTANCE FUNCTION ----------------
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// ---------------- TEST ----------------
exports.testController = (req, res) => {
    res.json({ message: "Game controller is working" });
};

// ---------------- CREATE GAME ----------------
exports.createGame = async (req, res) => {
    const gameId = Math.random().toString(10).substring(2, 6);

    const game = new Game({
        gameId,
        status: "lobby",
        createdAt: new Date(),

        mode: req.body.mode || "text",

        location: null,
        players: new Map(),

        totalRounds: req.body.totalRounds || 3,
        currentRound: 1,
        rounds: [],

        guesses: [],
        revealedHints: [],
        wrongAttempts: 0
    });

    await game.save();

    res.json({ message: "Game created", gameId });
};

// ---------------- GET GAME ----------------
exports.getGame = async (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.query;

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    let gameData = game.toObject();
    gameData.players = Object.fromEntries(game.players);

    const player = game.players.get(playerId);

    if (player?.role === "guesser" && game.status === "playing") {
        gameData.location = null;
    }

    res.json({ game: gameData });
};

// ---------------- JOIN GAME ----------------
exports.joinGame = async (req, res) => {
    const { gameId, playerId } = req.body;

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    if (game.players.get(playerId)) {
        return res.json({ message: "Already joined" });
    }

    game.players.set(playerId, {
        role: null,
        roundScore: 100,
        totalScore: 0
    });

    if (game.players.size === 2) {
        game.status = "role";
    }

    await game.save();
    res.json({ message: "Joined successfully" });
};

// ---------------- ASSIGN ROLE ----------------
exports.assignRole = async (req, res) => {
    const { gameId } = req.body;

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    if (game.status !== "role") {
        return res.status(400).json({ message: "Already assigned" });
    }

    const ids = Array.from(game.players.keys());
    if (ids.length !== 2) {
        return res.status(400).json({ message: "Need 2 players" });
    }

    let p1 = game.players.get(ids[0]);
    let p2 = game.players.get(ids[1]);

    if (Math.random() < 0.5) {
        p1.role = "setter";
        p2.role = "guesser";
    } else {
        p2.role = "setter";
        p1.role = "guesser";
    }

    game.players.set(ids[0], p1);
    game.players.set(ids[1], p2);

    game.status = "playing";

    await game.save();

    res.json({ players: Object.fromEntries(game.players) });
};

// ---------------- SET LOCATION ----------------
exports.setLocation = async (req, res) => {
    const { gameId, playerId, location } = req.body;

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const player = game.players.get(playerId);
    if (!player || player.role !== "setter") {
        return res.status(403).json({ message: "Only setter allowed" });
    }

    try {
        const response = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
                params: {
                    q: location,
                    key: process.env.OPENCAGE_KEY,
                    limit: 1
                }
            }
        );

        if (!response.data.results.length) {
            return res.status(400).json({ message: "Invalid location" });
        }

        const result = response.data.results[0];
        const c = result.components;

        game.location = {
            continent: c.continent || null,
            country: c.country || null,
            state: c.state || null,
            city: c.city || c.town || c.village || location,
            lat: result.geometry.lat,
            lng: result.geometry.lng
        };

        game.wrongAttempts = 0;

        await game.save();

        res.json({ message: "Location set" });

    } catch {
        res.status(500).json({ message: "Location error" });
    }
};

// ---------------- HELPER FUNCTIONS ----------------
async function handleCorrect(game, player, playerId, res) {

    const roundScore = player.roundScore;

    player.totalScore += roundScore;
    game.players.set(playerId, player);

    game.rounds.push({
        roundNumber: game.currentRound,
        guesses: game.guesses,
        revealedHints: game.revealedHints,
        wrongAttempts: game.wrongAttempts,
        winner: playerId,
        scores: new Map([[playerId, roundScore]])
    });

    if (game.currentRound < game.totalRounds) {

        game.currentRound++;

        game.location = null;
        game.guesses = [];
        game.revealedHints = [];
        game.wrongAttempts = 0;

        for (const [id, p] of game.players) {
            p.roundScore = 100;
            game.players.set(id, p);
        }

        game.status = "role";

    } else {
        game.status = "completed";
    }

    await game.save();

    return res.json({
        message: "Correct!",
        roundScore,
        totalScore: player.totalScore,
        status: game.status
    });
}

async function handleWrong(game, player, playerId, res, distance = null, guessText = "") {

    game.wrongAttempts++;
    player.roundScore -= 10;

    game.players.set(playerId, player);

    game.guesses.push({
        playerId,
        guess: distance ? `${Math.round(distance)} km away` : (guessText || ""),
        timeStamp: new Date()
    });

    const a = game.wrongAttempts;

    if (a === 1) game.revealedHints.push("Continent: " + game.location.continent);
    else if (a === 2) game.revealedHints.push("Country: " + game.location.country);
    else if (a === 3) game.revealedHints.push("State: " + game.location.state);

    game.markModified("revealedHints");

    await game.save();

    return res.json({
        message: "Wrong!",
        score: player.roundScore,
        distance
    });
}

// ---------------- SUBMIT GUESS ----------------
exports.submitGuess = async (req, res) => {
    const { gameId, playerId, guess, lat, lng } = req.body;

    const game = await Game.findOne({ gameId });
    if (!game) return res.status(404).json({ message: "Game not found" });

    const player = game.players.get(playerId);
    if (!player || player.role !== "guesser") {
        return res.status(403).json({ message: "Only guesser allowed" });
    }

    if (!game.location) {
        return res.status(400).json({ message: "Location not set" });
    }

    // 🗺️ MAP MODE
    if (game.mode === "map") {

        if (!lat || !lng) {
            return res.status(400).json({ message: "Coordinates required" });
        }

        const distance = getDistance(lat, lng, game.location.lat, game.location.lng);

        if (distance <= 1000) {
            return handleCorrect(game, player, playerId, res);
        } else {
            return handleWrong(game, player, playerId, res, distance);
        }
    }

    // 📝 TEXT MODE
    if (game.mode === "text") {

        if (guess.toLowerCase() === game.location.city.toLowerCase()) {
            return handleCorrect(game, player, playerId, res);
        } else {
            return handleWrong(game, player, playerId, res, null, guess);
        }
    }
};