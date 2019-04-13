// This file are solely for scaling purpose
const logger = console;

module.exports = {
    info: (message) => logger.info("%s", message),
    warn: (message) => logger.warn("%s", message),
    error: (message) => logger.error("%s", message),
    debug: (message) => logger.debug("%s", message)
};
