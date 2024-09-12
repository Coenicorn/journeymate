const { validateSessionToken } = require("../../authenticate");

const router = require("express").Router();

router.use("/question", async (request, response) => {
    // WIP
    // get random question from questions.json

    const token = request.body.token;

    const tokenData = await validateSessionToken(token);

    if (tokenData === 0) {
        response.status(401).json({ status: "invalid session token", invalidToken: 1 });
        return;
    }

    response.end();
});

module.exports = router;