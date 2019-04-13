const Config = require("./config");
const logger = require("./logger");
const loader = require("./loader");

function loadAdapters(adapterPaths) {
    return adapterPaths.map((adapterPath) => {
        const requirePath = loader.getRequirePath(
            "/adapters", `${ adapterPath }`
        );

        if (!requirePath) {
            throw new Error(`Adapter "${ adapterPath }" is not found.`);
        }

        // eslint-disable-next-line global-require
        return require(requirePath)();
    });
}

function setupAdapters({
    adapterList, httpRequest, config, app, request
}) {
    return adapterList.map(
        (adapter) => adapter.export({
            httpRequest,
            config,
            app,
            request
        })
    ).reduce((previous, current) => ({ ...previous, ...current }), {});
}

class Controller {
    static load(delegateOrPath) {
        if (typeof(delegateOrPath) === "string") {
            try {
                return new this(
                    loader.getControllerDelegate(delegateOrPath)
                );
            } catch (error) {
                logger.error(error);
                return undefined;
            }
        }

        return new this(delegateOrPath);
    }

    constructor(delegate) {
        this.delegate = delegate;

        // Preload all the adapters
        this.adapterList = (
            this.mock ? [] : loadAdapters(this.delegate.adapters || [])
        );
    }

    async perform({
        request,
        baseConfig,
        app,
        rawRequest,
        overrideAdapters
    }) {
        const config = {
            get: (key) => baseConfig[key],
            // eslint-disable-next-line new-cap
            for: (configPath) => Config(configPath)
        };

        const adapters = overrideAdapters || setupAdapters({
            adapterList: this.adapterList,
            httpRequest: rawRequest,
            config, app, request
        });

        // Perform delegate
        return this.delegate.perform({
            config,
            adapters,
            request
        });
    }

    static mock(baseController) {
        const controller = this.load(baseController);
        if (!controller) {
            throw new Error("Cannot load a controller");
        }
        controller.mock = true;

        function convertToHTTPRequest(request) {
            return {
                header: (name) => (request.header || {})[name],
                headers: request.header || {},
                query: request.query || {},
                params: request.parameter || {},
                body: request.body || {},
                connection: {
                    remoteAddress: "127.0.0.1"
                }
            };
        }

        return {
            perform: async({ config, adapters, request: rawRequest } = {}) => {
                const httpRequest = convertToHTTPRequest(rawRequest || {});

                const delegateRequest = {
                    header: httpRequest.headers || {},
                    query: httpRequest.query || {},
                    parameter: httpRequest.params || {},
                    body: httpRequest.body || {}
                };

                return controller.perform({
                    request: delegateRequest,
                    baseConfig: config || {},
                    rawRequest: httpRequest,
                    overrideAdapters: adapters || {}
                });
            }
        };
    }
}

module.exports = Controller;
