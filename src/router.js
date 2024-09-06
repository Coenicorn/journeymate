const express = require("express");
const router = express.Router();

// specify app router to handle incoming requests from the client
router.get("/signin", (request, response) => {
    // DEBUG log the request
    console.log(request.body);

    response.status(200);
    response.send("OK");
});