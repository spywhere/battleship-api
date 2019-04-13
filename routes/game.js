const ExpressLink = require("../links/express");

module.exports = (app) => {
    const router = app.router();

    ExpressLink.init(app, router).link([{
        // Get current game status
        method: "get",
        path: "/",
        controller: "game/get-game-status"
    }, {
        // Reset game
        method: "post",
        path: "/reset",
        controller: "game/reset-game"
    }]);

    return router;
};
