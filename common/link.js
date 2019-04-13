const Controller = require("./controller");

class Link {
    constructor(app) {
        this.app = app;
    }

    link(links) {
        for (const link of links) {
            // Preload controller
            const controller = Controller.load(
                link.controller
            );

            this.setupDelegate({
                // Expose link options
                ...link,
                // eslint-disable-next-line no-loop-func
                perform: async({
                    request,
                    baseConfig,
                    rawRequest
                }) => controller.perform({
                    request,
                    baseConfig,
                    app: this.app,
                    rawRequest
                })
            });
        }
    }
}

module.exports = Link;
