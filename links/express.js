const Link = require("../common/link");
const config = require("../common/config");
const http = require("../common/http");
const errors = require("../common/errors");

class ExpressLink extends Link {
    static init(app, router) {
        return new this(app, router);
    }

    constructor(app, router) {
        super(app);
        this.router = router;
    }

    setupDelegate({ method, path, perform }) {
        this.router[method](
            path,
            (request, response) => {
                const delegateRequest = {
                    header: request.headers || {},
                    query: request.query || {},
                    parameter: request.params || {},
                    body: request.body || {}
                };

                perform({
                    request: delegateRequest,
                    baseConfig: config("app", {}),
                    rawRequest: request
                }).then((delegateResponse) => {
                    const responseObject = delegateResponse || {};

                    if (responseObject.header) {
                        response.set(responseObject.header);
                    }

                    if (typeof(responseObject.body) === "object") {
                        response.status(
                            responseObject.status || http.code.ok
                        ).json(
                            responseObject.body
                        );
                    } else {
                        response.status(
                            responseObject.status || http.code.ok
                        ).send(
                            responseObject.body
                        );
                    }
                }).catch((error) => {
                    const {
                        status, body
                    } = errors.convertToHTTPResponse(error);
                    response.status(status).send(body);
                });
            }
        );
    }
}

module.exports = ExpressLink;
