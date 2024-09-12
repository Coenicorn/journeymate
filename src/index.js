const express = require("express");
const config = require("./config.js");
const path = require("path");
const bodyparser = require("body-parser");
const { executeQuery } = require("./db.js");
const cors = require("cors");

const app = express();

// middleware
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());

// server static content
app.use(express.static(
    path.join(__dirname, "static")
));
app.use(cors());

// use api router
app.use("/api", require("./api/"));

// 404 handling
app.use((req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, "static/404.html"));
    } else if (req.accepts("json")) {
        res.json({ status: "404 not found" });
    } else {
        res.type("txt").send("404 not found");
    }
});

// start server on port 3000
app.listen(config.serverPort, () => {
    console.log("listening on port " + config.serverPort);
});