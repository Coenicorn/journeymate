const { validateSessionToken } = require("../authenticate");
const { debuglog } = require("../util");

const router = require("express").Router();

// this file serves as the root for api calls under #/api/
// if you want to interact with endpoints listed below, call them by their respective
// endpoint name, e.g. #/api/auth

router.use("/auth", require("./auth"));
// validate auth header
router.use(async (request, response) => {
    if (!request.headers.authorization) {
        response.status(401).json({ status: "missing authentication headers" });
        return;
    }

    const token = request.headers.authorization;
    const tokenData = await validateSessionToken(token);

    if (tokenData === 0) {
        response.status(401).json({ status: "invalid session token", invalidToken: 1 });
        debuglog(`token (${token}) failed authentication`);
        return;
    }

    next();
});
router.use("/planner", require("./planner"));
router.use("/game", require("./game"));
router.use("/user", require("./user"));

module.exports = router;