const { validateSessionToken } = require("../../authenticate");
const { getUsers } = require("../../util");

const router = require("express").Router();

router.get("/", async (request, response) => {

    let user = await getUsers(null, response.locals.tokenData.uuid);

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