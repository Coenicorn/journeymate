const express = require("express");
const config = require("./config.js");
const path = require("path");
const bodyparser = require("body-parser");
const { executeQuery } = require("./db.js");

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

// 404 handling
app.use((req, res) => {
    res.status(404);

    if (req.accepts(''))
});

// start server on port 3000
app.listen(EXPRESSPORT, () => {
    console.log("listening on port " + EXPRESSPORT);
});