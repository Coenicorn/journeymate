const router = require("express").Router();
const { validateSessionToken } = require("../../authenticate.js");
const planner = require("../../planner.js");
const { log, debuglog, getUsers } = require("../../util.js");

// WIP
router.get("/getLocations", async (request, response) => {

    const location = request.body.location;

    console.log(location);

    if (typeof(location) !== "string") {
        response.status(400).json({ status: "Invalid location input parameter; must be string" });
        return;
    }
    
    try {
        const locations = await planner.getLocations(location);

        if (typeof(locations) === "string") {
            response.status(400).json({ status: locations });
            return;
        }

        debuglog(`sent locations data for: ${location}`);

        response.status(200).json({ locations: locations });
    } catch(e) {
        response.status(500).json({ status: "something went wrong" });
        log(e);
    }
});

router.get("/getStations", async (request, response) => {

    const location = request.body.location;

    if (typeof(location) !== "object") {
        response.status(400).json({ status: "Invalid location input parameter; must be string" });
        return;
    }

    try {
        const stations = await planner.getStations(location);

        if (location.formatted) debuglog(`sent stations data for: ${location.formatted}`);

        response.status(200).json({ stations: stations });
    } catch(e) {
        response.status(500).json({ status: "something went wrong" });
        log(e);
    }

    response.status(200).end();
});

router.get("/getRoutes", async (request, response) => {

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

        debuglog("sent route {id=} for (");
        if (startStation.code) debuglog(" - from: " + startStation.code);
        if (endStation.code) debuglog(" - from: " + endStation.code);
        debuglog(")")

        response.status(200).json({ routes: routes });
    } catch(e) {
        response.status(500).json({ status: "something went wrong" });
        log(e);
    }

    response.status(200).end();
});

router.post("/selectTrip", async (request, response) => {

    // get trip and verify format
    const trip = request.body.trip;
    if (!trip) {
        response.status(400).json({ status: "Missing trip value" });
        return;
    }
    if (!(
        trip.actualDurationInMinutes &&
        trip.plannedDurationInMinutes,
        trip.transfers,
        trip.stops,
        trip.trainType,
        trip.uuid,
        trip.origin,
        trip.destination
    )) {
        response.status(400).json({ status: "Incorrect payload content" });
        return;
    }

    const user  = await getUsers(null, uuid);

    if (user.length !== 1) {
        response.status(500).json({ status: "failed to fetch user" });
        return;
    }

    planner.chooseTrip(uuid, trip);

    response.status(200).json({ status: "Successfully selected trip" });

});

module.exports = router;