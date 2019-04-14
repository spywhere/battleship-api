const ExpressLink = require("../links/express");

module.exports = (app) => {
    const router = app.router();

    ExpressLink.init(app, router).link([{
        // Attack on a tile
        method: "post",
        path: "/attack",
        controller: "attacker/attack"
    }]);

    return router;
};
