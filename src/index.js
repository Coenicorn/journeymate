const express = require("express");
const dotenv = require("@dotenvx/dotenvx").config();
const path = require("path");
const bodyparser = require("body-parser");
const executeQuery = require("./dbconnection.js");

const app = express();

const EXPRESSPORT = 3000;

// middleware
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

// server static content
app.use(express.static(
    path.join(__dirname, "static")
));

// use api router
app.use("/api", require("./api/"));

// start server on port 3000
app.listen(EXPRESSPORT, () => {
    console.log("listening on port " + EXPRESSPORT);
});