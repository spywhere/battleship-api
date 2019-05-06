const express = require("express");

const Controller = require("./common/controller");
const errors = require("./lib/errors");

const getGameStatus = require("./controllers/get-game-status");
const resetGame = require("./controllers/reset-game");
const attack = require("./controllers/attack");
const placeFleet = require("./controllers/place-fleet");

const router = express.Router();

function linkController(delegate) {
    const controller = new Controller(delegate);

    return (request, response) => {
        const delegateRequest = {
            header: request.headers || {},
            query: request.query || {},
            parameter: request.params || {},
            body: request.body || {}
        };

        controller.perform({
            request: delegateRequest
        }).then((delegateResponse) => {
            const responseObject = delegateResponse || {};

            if (responseObject.header) {
                response.set(responseObject.header);
            }

            if (typeof(responseObject.body) === "object") {
                response.status(
                    responseObject.status || 200
                ).json(
                    responseObject.body
                );
            } else {
                response.status(
                    responseObject.status || 200
                ).send(
                    responseObject.body
                );
            }
        }).catch((error) => {
            let statusCode = 500;
            let body = (process.env.NODE_ENV === "production" ? undefined : {
                name: error.name || undefined,
                message: error.message || undefined,
                stack: error.stack || undefined
            });

            if (error instanceof errors.HTTPError) {
                const { statusCode: newStatusCode } = error;
                statusCode = newStatusCode;
                body = {
                    statusCode: error.statusCode || undefined,
                    message: error.message || undefined,
                    code: error.errorCode || undefined
                };
            }

            response.status(statusCode).send(body);
        });
    };
}

// Simple health check endpoint
router.get("/", (request, response) => {
    response.status(200).json({
        timestamp: new Date()
    });
});

// Get current game status
router.get("/api", linkController(getGameStatus));

// Reset game
router.post("/api/reset", linkController(resetGame));

// Attack on a tile
router.post("/api/attack", linkController(attack));

// Place a ship
router.post("/api/ship", linkController(placeFleet));

module.exports = router;
