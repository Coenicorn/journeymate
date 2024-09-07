const express = require("express");
const router = express.Router();
const path = require("path");
const executeQuery = require("./dbconnection.js");
const uuid = require("uuid");
const argon2 = require("argon2"); // hashing functions
const { hashPasswordWithSalt, verifyPasswordWithSalt } = require("./util.js");

// specify app router to handle incoming requests from the client
router.post("/signup", async (request, response) => {
    // DEBUG log the request
    // console.log(request.body);

    const body = request.body;

    const email = body.email;
    const username = body.username;
    const password = body.password;
    const userUUID = uuid.v4();

    if (!email || !username || !password) {
        response.status(400).send("One or more attributes are missing from request. Required attributes are: {email, username, password}");
    }

    const passwordhash = await hashPasswordWithSalt(password, userUUID);

    console.log(passwordhash);

    // upload to database
    // executeQuery(`INSERT INTO userdata (id, email, password, name, location_lat, location_long) VALUE ('${uuid.v7()}', '${email}', '${password}', '${username}', '${location_lat}', '${location_long}')`);

    if (request.accepts().includes("application/json")) {
        response.status(200).json({
            passwordHash: passwordhash
        });
    } else {
        response.sendFile("index.html", { root: path.join(__dirname, "public") });
    }

    response.end();
});

router.post("/auth", async (request, response) => {
    
})

module.exports = router;