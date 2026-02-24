const express = require("express");
const router = express.Router();


const { testController,createGame, getGame,submitGuess,setLocation, joinGame,assignRole} = require("../controllers/gameController");
router.get("/test",testController);
router.post("/create",createGame);
router.get("/:gameId",getGame);
router.post("/join",joinGame)
router.post("/place",setLocation);
router.post("/guess",submitGuess);
router.post("/role",assignRole);


module.exports = router