const attacker = require("./attacker");
const defender = require("./defender");
const game = require("./game");

module.exports = (app) => {
    const router = app.router();

    // Simple health check endpoint
    router.get("/", (request, response) => {
        response.status(200).json({
            timestamp: new Date()
        });
    });

    // Usually will be separated by resource, for example
    //   Game
    //     GET  /game
    //     POST /game/reset
    //   Attacker
    //     POST /attacker/attack
    //   Defender
    //     POST /defender/place
    router.use("/api", game(app));
    router.use("/api", attacker(app));
    router.use("/api", defender(app));

    return router;
};
