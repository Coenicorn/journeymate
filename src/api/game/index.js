const { validateSessionToken } = require("../../authenticate");

const router = require("express").Router();

router.use("/question", async (request, response) => {
    // WIP
    // get random question from questions.json

    const token = request.body.token;

    const tokenResult = await validateSessionToken(token);

    console.log(tokenResult);

    response.end();
});

module.exports = router;