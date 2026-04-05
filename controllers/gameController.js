const Game = require("../models/Game");
const axios = require("axios");

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

    res.json({
        message: "Game created successfully",
        gameId
    });
};

// ---------------- GET GAME ----------------
exports.getGame = async (req, res) => {
    const { gameId } = req.params;
    const { playerId } = req.query;

    const game = await Game.findOne({ gameId });

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    let gameData = game.toObject();
    gameData.players = Object.fromEntries(game.players);

    const player = game.players.get(playerId);

    // hide location from guesser
    if (player?.role === "guesser" && game.status === "playing") {
        gameData.location = null;
    }

    return res.json({ game: gameData });
};

// ---------------- JOIN GAME ----------------
exports.joinGame = async (req, res) => {
    const { gameId, playerId } = req.body;

    const game = await Game.findOne({ gameId });

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    if (game.players.get(playerId)) {
        return res.json({ message: "Player already joined" });
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

    res.json({ message: "Player joined successfully" });
};

// ---------------- ASSIGN ROLE ----------------
exports.assignRole = async (req, res) => {
    const { gameId } = req.body;

    const game = await Game.findOne({ gameId });

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    if (game.status !== "role") {
        return res.status(400).json({ message: "Roles already assigned" });
    }

    const playerIds = Array.from(game.players.keys());

    if (playerIds.length !== 2) {
        return res.status(400).json({ message: "Need 2 players" });
    }

    let p1 = game.players.get(playerIds[0]);
    let p2 = game.players.get(playerIds[1]);

    if (Math.random() < 0.5) {
        p1.role = "setter";
        p2.role = "guesser";
    } else {
        p2.role = "setter";
        p1.role = "guesser";
    }

    game.players.set(playerIds[0], p1);
    game.players.set(playerIds[1], p2);

    game.status = "playing";

    await game.save();

    res.json({
        message: "Roles assigned",
        players: Object.fromEntries(game.players)
    });
};

// ---------------- SET LOCATION ----------------
exports.setLocation = async (req, res) => {
    const { gameId, playerId, location } = req.body;

    const game = await Game.findOne({ gameId });

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    const player = game.players.get(playerId);

    if (!player || player.role !== "setter") {
        return res.status(403).json({
            message: "Only setter can set location"
        });
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

        if (response.data.results.length === 0) {
            return res.status(400).json({ message: "Invalid city" });
        }

        const result = response.data.results[0];
        const components = result.components;

        game.location = {
            continent: components.continent || null,
            country: components.country || null,
            state: components.state || null,
            city:
                components.city ||
                components.town ||
                components.village ||
                location,
            lat: result.geometry.lat,
            lng: result.geometry.lng
        };

        game.wrongAttempts = 0;

        await game.save();

        return res.json({
            message: "Location set",
            location: game.location
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error validating location"
        });
    }
};

// ---------------- SUBMIT GUESS ----------------
exports.submitGuess = async (req, res) => {
    const { gameId, playerId, guess } = req.body;

    const game = await Game.findOne({ gameId });

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    const player = game.players.get(playerId);

    if (!player || player.role !== "guesser") {
        return res.status(403).json({
            message: "Only guesser can guess"
        });
    }

    if (!game.location) {
        return res.status(400).json({
            message: "Location not set"
        });
    }

    // ---------------- CORRECT GUESS ----------------
    if (guess.toLowerCase() === game.location.city.toLowerCase()) {

        const roundScore = player.roundScore;

        // add to total
        player.totalScore += roundScore;
        game.players.set(playerId, player);

        // save round history
        game.rounds.push({
            roundNumber: game.currentRound,
            guesses: game.guesses,
            revealedHints: game.revealedHints,
            wrongAttempts: game.wrongAttempts,
            winner: playerId,
            scores: new Map([[playerId, roundScore]])
        });

        // next round or finish
        if (game.currentRound < game.totalRounds) {

            game.currentRound++;

            // reset round
            game.location = null;
            game.guesses = [];
            game.revealedHints = [];
            game.wrongAttempts = 0;

            // reset all players
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
            message: "Correct Guess!",
            roundScore,
            totalScore: player.totalScore,
            currentRound: game.currentRound,
            status: game.status
        });
    }

    // ---------------- WRONG GUESS ----------------
    game.wrongAttempts++;
    player.roundScore -= 10;

    game.players.set(playerId, player);

    game.guesses.push({
        playerId,
        guess,
        timeStamp: new Date()
    });

    const attempts = game.wrongAttempts;

    if (attempts === 1) {
        game.revealedHints.push("Continent: " + game.location.continent);
    } else if (attempts === 2) {
        game.revealedHints.push("Country: " + game.location.country);
    } else if (attempts === 3) {
        game.revealedHints.push("State: " + game.location.state);
    }

    game.markModified("revealedHints");

    await game.save();

    return res.json({
        message: "Incorrect Guess!",
        score: player.roundScore,
        hints: game.revealedHints
    });
};