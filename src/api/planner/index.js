const router = require("express").Router();
const { validateSessionToken } = require("../../authenticate.js");
const planner = require("../../planner.js");

// WIP
router.get("/getLocations", async (request, response) => {
    const token = request.body.token;
    const tokenIsNotValid = await validateSessionToken(token);

    if (tokenIsNotValid) {
        response.status(400).json({ status: "Invalid session token" });
        return;
    }

    const location = request.body.location;

    if (typeof(location) !== "string") {
        response.status(400).json({ status: "Invalid location input parameter; must be string" });
        return;
    }
    
    try {
        const locations = await planner.getLocations(location);

        response.status(200).json(locations);
    } catch(e) {
        response.status(500).json({ status: "something went wrong" });
        log(e.message);
    }
});

router.get("/getStations", async (request, response) => {
    const token = request.body.token;
    const tokenIsNotValid = await validateSessionToken(token);

    if (tokenIsNotValid) {
        response.status(400).json({ status: "Invalid session token" });
        return;
    }

    const location = request.body.location;

    if (typeof(location) !== "object") {
        response.status(400).json({ status: "Invalid location input parameter; must be string" });
        return;
    }

    try {
        const stations = await planner.getStations(location);

        response.status(200).json(stations);
    } catch(e) {
        response.status(500).json({ status: "something went wrong" });
        log(e.message);
    }

    response.status(200).end();
});

router.get("/getRoutes", async (request, response) => {
    const token = request.body.token;
    const tokenIsNotValid = await validateSessionToken(token);

    if (tokenIsNotValid) {
        response.status(400).json({ status: "Invalid session token" });
        return;
    }

    const startStation = request.body.startStation;
    const endStation = request.body.endStation;

    if (typeof(startStation) !== "object") {
        response.status(400).json({ status: "Invalid start station input parameter; must be object" });
        return;
    }
    if (typeof(endStation) !== "object") {
        response.status(400).json({ status: "Invalid end station input parameter; must be object" });
        return;
    }


    try {
        const routes = await planner.getRoutes(startStation, endStation);

        response.status(200).json(routes);
    } catch(e) {
        response.status(500).json({ status: "something went wrong" });
        log(e.message);
    }

    response.status(200).end();
});

module.exports = router;