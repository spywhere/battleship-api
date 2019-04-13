const express = require("express");
const logger = require("./common/logger");
const config = require("./common/config")("app");

const app = express();

app.listen(config.port, () => {
    logger.info(`Server listened on port ${ config.port }`);
});
