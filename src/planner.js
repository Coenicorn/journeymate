const config = require("./config.js");
const { debuglog, getUsers } = require("./util.js");
const { executeQuery } = require("./db.js");
const { storeCredentials } = require("./authenticate.js");
const inspect = require("util").inspect;

const stationUserData = new Map(); /* maps station uuid to array with users which will be in that station at some time */

async function test() {
    const startLocations = await getLocations("breda");
    console.log("start locations");
    console.log(inspect(startLocations, {showHidden: false, depth: null, colors: true}));
    const startStations = await getStations(startLocations[0]); // my chosen result
    console.log("startStations");
    console.log(inspect(startStations, {showHidden: false, depth: null, colors: true}));

    const endLocations = await getLocations("utrecht centraal");
    console.log("end locations")
    console.log(inspect(endLocations, {showHidden: false, depth: null, colors: true}));
    const endStations = await getStations(endLocations[0]);
    console.log("end station")
    console.log(inspect(endStations, {showHidden: false, depth: null, colors: true}));

    const routes = await getRoutes(startStations[0], endStations[0]);
    console.log("route")
    console.log(inspect(routes, {showHidden: false, depth: null, colors: true}));
}
// test();

/**
 * @description fetches all possible locations under a certain name
 * @returns array with possible locations
 * @note ignores locations outside the netherlands
 */
async function getLocations(input) {
    return new Promise(async (resolve, reject) => {
        try {
            let apiSearch = config.geoapifyEndpoint.replace(
                "{search}",
                encodeURIComponent(input)
            );

            const response = await fetch(apiSearch);
            const data = await response.json();

            const results = [];

            data.features.forEach((feature, index) => {
                const { properties, geometry } = feature;

                const resultaatRanking = {
                    importance: properties.rank.importance,
                    popularity: properties.rank.popularity,
                    confidence: properties.rank.confidence,
                    isFullMatch: properties.rank.match_type === "full_match",
                };

                const resultaat = {
                    name: properties.name,
                    country: properties.country,
                    city: properties.city,
                    postcode: properties.postcode,
                    streetName: properties.street,
                    lon: properties.lon,
                    lat: properties.lat,
                    formatted: properties.formatted,
                    adres_line1: properties.address_line1,
                    adres_line2: properties.address_line2,
                    category: properties.category,
                    rank: resultaatRanking,
                };

                if (resultaat.country != "Netherlands") {
                    return;
                }

                results.push(resultaat);
            });
            resolve(results);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * @description gets stations close to location
 * @returns array of possible stations closest to location
 */
async function getStations(location /* taken from previous function */) {
    // NS API
    const nsApiRequest = config.nsStationsEndpoint
        .replace("{lat}", location.lat)
        .replace("{lng}", location.lon);

    const nsResponse = await fetch(nsApiRequest, {
        headers: {
            "Ocp-Apim-Subscription-Key": config.nsApiKey,
        },
    });

    const nsStationData = await nsResponse.json();

    return nsStationData.payload;
}

/**
 * @description gets train routes from location to location
 * @returns array of route objects
 * @note only includes train transports
 */
async function getRoutes(vertrekStation, eindStation) {
    // NS ROUTE PLANNER
    let currentDate = new Date(); //een datum aanmaken voor een richtlijn voor de aankomsttijd (werkt niet helemaal)
    // currentDate.setUTCHours(8); // UTC time
    // currentDate.setUTCMinutes(34); // aankomsttijd op Utrecht Centraal, vanuit gaande dat tram om 8:39 vertrekt naar HU
    let rfc3339Date = currentDate.toISOString().split(".")[0] + "+0200";
    console.log(rfc3339Date);

    const nsApiReisRequest = config.nsReisInfoEndpoint
        .replace("{fromStation}", vertrekStation.code)
        .replace("{toStation}", eindStation.code)
        .replace("{dateTime}", encodeURIComponent(rfc3339Date));

    const nsReisResponse = await fetch(nsApiReisRequest, {
        headers: {
            "Ocp-Apim-Subscription-Key": config.nsApiKey,
        },
    });

    const nsReisData = await nsReisResponse.json();
    const availableTrips = []; // reisinformatie

    console.log("what")

    nsReisData.trips.forEach((loopTrip, index) => {
        const legStops = []; // Stops van traject

        // Legs loop
        loopTrip.legs.forEach((loopLeg, legIndex) => {
            // Stops loop
            loopLeg.stops.forEach((loopStop, stopIndex) => {
                const stop = {
                    name: loopStop.name,
                    plannedDepartureDateTime: loopStop.plannedDepartureDateTime,
                    plannedDepartureTrack: loopStop.plannedDepartureTrack,
                    plannedArrivalTrack: loopStop.plannedArrivalTrack,
                    actualArrivalTrack: loopStop.actualArrivalTrack,
                    isCancelled: loopStop.cancelled,
                    code: loopStop.uicCode
                };
                legStops.push(stop); // voeg stop toe aan traject
            });
        });

        // Buiten legs loopgetStations
        const trip = {
            actualDurationInMinutes: loopTrip.actualDurationInMinutes,
            plannedDurationInMinutes: loopTrip.plannedDurationInMinutes,
            transfers: loopTrip.transfers,
            stops: legStops, // voeg traject toe aan de trip
            trainType: loopTrip.modalityListItems,
            uid: loopTrip.uid,
        };

        availableTrips.push(trip); // voeg de trip toe aan alle beschikbare trips
        
        console.log(loopTrip.uid);
    });

    return availableTrips;
    
    // Functie voor het uploaden naar de server. data: availableTrips.get(vraag -1)

    // user moet kiezen welke trip
    // print trip informatie over de gekozen trip
    // speel de trip informatie door naar de database voor server-side processing voor kruisend station
    // laat user weten dat zijn of haar reis is opgeslagen, en dat diegene moet wachten op een match
}

const stationsData = new Map([]); /* key = station code, value = [user1, user2, ..., userN] */

function formatUser(uuid, trip) {
    return { uuid: uuid, selectedTrip: trip };
}

function removeUserFromStationsData(uuid) {
    // I hate this so much this needs to be better
    stationsData.forEach((station) => {
        station = station.filter((user) => { return user.uuid !== uuid });
    });
}

/**
 * @description stores a user's trip choice
 * @returns 1 on failure, 0 on success
 */
function chooseTrip(userUUID, trip /* view getRoutes for object properties */) {
    // clear previous trips from user
    removeUserFromStationsData(userUUID);

    addUserToRoutes(formatUser(userUUID, trip));

    debuglog(`user (${userUUID}) chose new trip`);
}

function addUserToRoutes(user){
    // console.log(user);

    user.selectedTrip.stops.forEach((stop, stopIndex) => {

        let routeUsers = stationsData.get(stop.code);

        if(routeUsers === undefined){
            // Station doesn't exist yet, so create new users entry
            routeUsers = [];
        }

        // Add first user to the newly created station
        routeUsers.push(user);

        stationsData.set(stop.code, routeUsers)

        // console.log("User " + user.uuid + " added to station " + stop.code);
        // console.log(stop);
    });
}

function getUserStations(user) {

    const matchingUsers = new Map([]);

    user.selectedTrip.stops.forEach((stop, index) => {

        const code = stop.code;

        const mapEntry = stationsData.get(code);

        if (!mapEntry) return;

        mapEntry.forEach((otherUser) => {
            if (user.uuid === otherUser.uuid) return;

            let matchingStations = matchingUsers.get(otherUser.uuid);
            
            if (matchingStations === undefined) {
                matchingStations = []; // array does not yet exist, create it
            }

            matchingStations.push(stop);

            matchingUsers.set(otherUser.uuid, matchingStations);
        });

        // match found
        // matchingStations.push(stop);
        
    });

    return matchingUsers;
}

function matchToJson(match) {
    return Object.fromEntries(match);
}

async function getTrip(beginLot, endLot, uuid) {
    const startLocations = await getLocations(beginLot);
    const endLocations = await getLocations(endLot);

    const startStations = await getStations(startLocations[0]);
    const endStations = await getStations(endLocations[0]);

    const route = await getRoutes(startStations[0], endStations[0]);

    return route;
}

async function veryBigTest() {
    const user = (await getUsers("c"))[0];

    const trip = await getTrip("hilversum", "utrecht centraal", user.uuid);

    // console.log(matchToJson(match));

    console.log(trip[0]);
}
// veryBigTest();

module.exports = { getLocations, getRoutes, getStations, chooseTrip };