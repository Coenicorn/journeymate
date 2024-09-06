const express = require("express");
const router = express.Router();
const path = require("path");
const executeQuery = require("./dbconnection.js");
const uuid = require("uuid");

// specify app router to handle incoming requests from the client
router.post("/signup", (request, response) => {
    // DEBUG log the request
    // console.log(request.body);

    const body = request.body;

    const email = body.email;
    const username = body.username;
    const password = body.password;
    const location = body.location;

    // upload to database
    executeQuery(`INSERT INTO userdata (id, email, password, name, location) VALUE ('${uuid.v7()}', '${email}', '${password}', '${username}', '${location}')`);

    response.status(200);
    response.sendFile("index.html", { root: path.join(__dirname, "public") });
});

module.exports = router;