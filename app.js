const express = require("express");
const bodyPaser = require("body-parser");

const logger = require("./common/logger");
const http = require("./common/http");
const config = require("./common/config")("app");
const routes = require("./routes");

const app = express();

app.use(bodyPaser.json());

app.use(routes({
    ...app,
    router: express.Router
}));

app.use((request, response) => response.status(http.code.notFound).send());

app.listen(config.port, () => {
    logger.info(`Server listened on port ${ config.port }`);
});
