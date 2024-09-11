const router = require("express").Router();
const { storeCredentials, verifyCredentials, newSession } = require("../../authenticate.js");
const { executeQuery } = require("../../db.js");
const { hashString, generateUUID, hashPasswordSalt, getUsers, log, debuglog } = require("../../util.js");

router.post("/signin", async (request, response) => {
    // username password based authentication
    const body = request.body;

    const password = body.password;
    const username = body.username;

    const users = await getUsers(username);

    if (users.length !== 1) {
        response.status(400).json({ status: "user not registered" });
        return;
    }

    const uuid = users[0].uuid;

    const result = await verifyCredentials(uuid, password);

    debuglog(`new signin request from ${users[0].username}`);

    if (result) {
        // fail
        response.status(400).json(result);
    } else {
        const token = await newSession(uuid);

        if (typeof(token) === "string") {
            // fail
            response.status(500).json(token);
        } else {
            response.status(200).json(token);
        }
    }
});

router.post("/signup", async (request, response) => {
    function fail(reason) {
        response.status(400).json({ status: `Invalid request: ${reason}`});
    }
   
    // signup with username and password
    const body = request.body;

    debuglog(`new signup request ${body}`);

    const username = body.username; if (!username) { fail("No username provided"); return; }

    // check if username exists
    const user = await getUsers(username);

    const email = body.email; if (!email) { fail("No email provided"); return; }
    const password = body.password; if (!username) {fail("No password provided"); return; }
    // const location_lat = body.location_lat; if (!location_lat) {fail("Missing location data"); return; }
    // const location_long = body.location_long; if (!location_long) {fail("Missing location data"); return; }
    const uuid = generateUUID();

    const result = await storeCredentials(uuid, username, email, password);

    if (result !== 0) {
        // error
        fail(result);
    } else {
        response.status(200).json({ status: "Succesfully logged in!" });

        log(`new signup from user ${username}`);
    }
});

router.post("/validateToken", async (request, response) => {
    const token = request.body.token;
    const tokenIsNotValid = await validateSessionToken(token);

    if (tokenIsNotValid) {
        response.status(400).json({ status: "Invalid session token", invalidToken: 1 });
    } else {
        response.status(200).json({ status: "Valid session token", invalidToken: 0 });
    }
});

module.exports = router;