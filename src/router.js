const express = require("express");
const router = express.Router();
const path = require("path");

// specify app router to handle incoming requests from the client
router.post("/signup", (request, response) => {
    // DEBUG log the request
    console.log(request.body);

    response.status(200);
    response.sendFile("index.html", { root: path.join(__dirname, "public") });
});

module.exports = router;