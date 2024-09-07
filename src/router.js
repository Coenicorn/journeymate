const express = require("express");
const router = express.Router();
const path = require("path");
const executeQuery = require("./dbconnection.js");
const uuid = require("uuid");
const argon2 = require("argon2"); // hashing functions
const { hashPasswordWithSalt, verifyPasswordWithSalt } = require("./util.js");

// specify app router to handle incoming requests from the client
router.post("/signup", (request, response) => {
    // DEBUG log the request
    // console.log(request.body);

    const body = request.body;

    const email = body.email;
    const username = body.username;
    const password = body.password;
    const location_lat = body.location_lat;
    const location_long = body.location_long;
    const userUUID = uuid.v4();

    const passwordhash = hashPasswordWithSalt;

    console.log(passwordhash);

    // upload to database
    // executeQuery(`INSERT INTO userdata (id, email, password, name, location_lat, location_long) VALUE ('${uuid.v7()}', '${email}', '${password}', '${username}', '${location_lat}', '${location_long}')`);

    response.status(200);
    response.sendFile("index.html", { root: path.join(__dirname, "public") });
});

router.post("/signin", (request, response) => {
    // WIP
});

module.exports = router;