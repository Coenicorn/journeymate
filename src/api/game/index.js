const { validateSessionToken } = require("../../authenticate");

const router = require("express").Router();

router.use("/question", async (request, response) => {
    // WIP
    // get random question from questions.json

    response.end();
});

module.exports = router;