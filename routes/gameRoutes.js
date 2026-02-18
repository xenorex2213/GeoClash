const express = require("express");
const router = express.Router();


const { testController,createGame, getGame,submitGuess } = require("../controllers/gameController");
router.get("/test",testController);
router.post("/create",createGame);
router.get("/:gameId",getGame);
router.post("/guess",submitGuess)

module.exports = router;