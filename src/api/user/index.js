const { validateSessionToken } = require("../../authenticate");
const { getUsers } = require("../../util");

const router = require("express").Router();

router.get("/", async (request, response) => {

    const token = request.body.token;

    const tokenData = await validateSessionToken(token);

    if (tokenData === 0) {
        response.status(401).json({ status: "invalid session token", invalidToken: 1 });
        return;
    }

    let user = await getUsers(null, tokenData[0].uuid);

    if (user.length !== 1) {
        response.status(400).json({ status: "No users found" });
        return;
    }

    user = user[0];

    // return user data
    const data = {
        username: user.username,
        uuid: user.uuid
    };

    response.status(200).json(data);

});

module.exports = router;