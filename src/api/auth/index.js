const router = require("express").Router();
const executeQuery = require("../../dbconnection.js");
const 

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

    const passwordhash = 
    
    executeQuery(`INSERT INTO userdata (id, email, password, name, location_lat, location_long) VALUE ('${uuid.v7()}', '${email}', '${passwordhash}', '${username}', '${location_lat}', '${location_long}')`);

    response.status(200);
});

module.exports = router;