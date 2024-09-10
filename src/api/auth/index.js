const router = require("express").Router();
const { storeCredentials } = require("../../authenticate.js");
const { executeQuery } = require("../../db.js");
const { hashString, generateUUID, hashPasswordSalt } = require("../../util.js");

router.use("/", (request, response) => {
    // username password based authentication
    
});

router.use("/signup", (request, response) => {
    function fail(reason) {
        response.status(400).send(`Invalid request: ${reason}`);
    }
   
    // signup with username and password
    const body = request.body;
    
    const email = body.email; if (!email) fail("No email provided");
    const username = body.username; if (!username) fail("No username provided");
    const password = body.password; if (!username) fail("No password provided");
    const location_lat = body.location_lat; if (!location_lat) fail("Missing location data");
    const location_long = body.location_long; if (!location_long) fail("Missing location data");
    const uuid = generateUUID();

    const passwordhash = hashPasswordSalt(password, uuid);
    
    storeCredentials()

    response.status(200);
});

module.exports = router;