class HTTPError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}

module.exports = (error, request, response, next) => {
    let statusCode = 500;
    let body = {
        name: error.name || undefined,
        message: error.message || undefined,
        stack: error.stack || undefined
    };

    if (error instanceof HTTPError) {
        const { statusCode: newStatusCode } = error;
        statusCode = newStatusCode;
        body = {
            statusCode: error.statusCode || undefined,
            message: error.message || undefined,
            code: error.errorCode || undefined
        };
    }

    response.status(statusCode).send(body);
};

module.exports.HTTPError = HTTPError;
