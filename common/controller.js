function setupAdapters(adapterList) {
    return adapterList.map(
        // eslint-disable-next-line global-require
        (adapterPath) => require(`../${ adapterPath }`)
    ).reduce((previous, current) => ({ ...previous, ...current }), {});
}

class Controller {
    constructor(delegate) {
        this.delegate = delegate;

        // Preload all the adapters
        this.adapterList = (
            this.mock ? [] : this.delegate.adapters || []
        );
    }

    async perform({
        request,
        overrideAdapters
    }) {
        const adapters = overrideAdapters || setupAdapters(this.adapterList);

        // Perform delegate
        return this.delegate.perform({
            adapters,
            request
        });
    }

    static mock(baseController) {
        const controller = new this(baseController);
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
