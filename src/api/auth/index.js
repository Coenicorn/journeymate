const router = require("express").Router();
const { storeCredentials } = require("../../authenticate.js");
const { executeQuery } = require("../../db.js");
const { hashString, generateUUID, hashPasswordSalt, getUsers } = require("../../util.js");

router.post("/", (request, response) => {
    // username password based authentication
    response.status(200).end();
});

router.post("/signup", async (request, response) => {
    function fail(reason) {
        response.status(400).send(`Invalid request: ${reason}`);
    }
   
    // signup with username and password
    const body = request.body;

    const username = body.username; if (!username) fail("No username provided");

    // check if username exists
    const user = await getUsers(username);

    console.log(user);

    const email = body.email; if (!email) fail("No email provided");
    const password = body.password; if (!username) fail("No password provided");
    const location_lat = body.location_lat; if (!location_lat) fail("Missing location data");
    const location_long = body.location_long; if (!location_long) fail("Missing location data");
    const uuid = generateUUID();

    const result = await storeCredentials(uuid, username, email, password);

    if (result !== 0) {
        // error
        fail("failed authentication");
    } else {
        // response.redirect("/");
        response.end();
    }
});

module.exports = router;