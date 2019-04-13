const ExpressLink = require("../links/express");

module.exports = (app) => {
    const router = app.router();

    ExpressLink.init(app, router).link([{
        // Place a ship
        method: "post",
        path: "/ship",
        controller: "defender/place-fleet"
    }]);

    return router;
};
