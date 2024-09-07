const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const executeQuery = require("./dbconnection.js");

const app = express();

const EXPRESSPORT = 3000;

// middleware
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
// server main pages
app.use(express.static(
    path.join(__dirname, "public")
));
// custom routes for api requests
app.use(require("./router"));

// start server on port 3000
app.listen(EXPRESSPORT, () => {
    console.log("listening on port " + EXPRESSPORT);
});