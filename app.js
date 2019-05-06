const express = require("express");
const bodyPaser = require("body-parser");

const routes = require("./routes");

const app = express();

const appPort = +(process.env.APP_PORT) || 3000;

app.use(bodyPaser.json());

app.use(routes);

app.use((request, response) => response.status(404).send());

app.listen(appPort, () => {
    console.info(`Server listened on port ${ appPort }`);
});
