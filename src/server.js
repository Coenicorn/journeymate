const express = require("express");
const dotenv = require("@dotenvx/dotenvx").config();
const mysql = require("mysql");

const app = express();

const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER;
const DBNAME = process.env.DBNAME;
const DBSERVERNAME = process.env.DBSERVERNAME;

const EXPRESSPORT = 3000;

app.use(express.static(
    "public"
));

app.listen(EXPRESSPORT, () => {
    console.log("listening on port " + EXPRESSPORT);
});