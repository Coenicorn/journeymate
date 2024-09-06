const express = require("express");
const dotenv = require("@dotenvx/dotenvx").config();
const mysql = require("mysql");
const path = require("path");

const app = express();

// get environment variables
const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBSERVERNAME = process.env.DBSERVERNAME;

const EXPRESSPORT = 3000;

// json middleware
app.use(express.json());
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