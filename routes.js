const express = require("express");

const controller = require("./lib/controller");
const errors = require("./lib/errors");

const getGameStatus = require("./controllers/get-game-status");
const resetGame = require("./controllers/reset-game");
const attack = require("./controllers/attack");
const placeFleet = require("./controllers/place-fleet");

const router = express.Router();

// Simple health check endpoint
router.get("/", (request, response) => {
    response.status(200).json({
        timestamp: new Date()
    });
});

// Get current game status
router.get("/api", controller(getGameStatus), errors);

// Reset game
router.post("/api/reset", controller(resetGame), errors);

// Attack on a tile
router.post("/api/attack", controller(attack), errors);

// Place a ship
router.post("/api/ship", controller(placeFleet), errors);

module.exports = router;
