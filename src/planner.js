const config = require("./config.js");
const { debuglog } = require("./util.js");
const { executeQuery } = require("./db.js");

const stationUserData = new Map(); /* maps station uid to array with users which will be in that station at some time */

function pushNewStation(stationName, uid) {

}

async function test() {
    const startLocations = await getLocations("breda");
    console.log(startLocations);
    const startStations = await getStations(startLocations[0]); // my chosen result
    console.log(startStations);

    const endLocations = await getLocations("utrecht centraal");
    console.log(endLocations);
    const endStations = await getStations(endLocations[0]);
    console.log(endStations);

    const routes = await getRoutes(startStations[0], endStations[0]);
    console.log(routes);
}

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
    var currentDate = new Date(); //een datum aanmaken voor een richtlijn voor de aankomsttijd (werkt niet helemaal)
    currentDate.setUTCHours(8); // UTC time
    currentDate.setUTCMinutes(34); // aankomsttijd op Utrecht Centraal, vanuit gaande dat tram om 8:39 vertrekt naar HU
    var rfc3339Date = currentDate.toISOString().replace("Z", "+0200");

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
            uid: loopTrip.uid
        };

        availableTrips.push(trip); // voeg de trip toe aan alle beschikbare trips
    });

    return availableTrips;
    
    // Functie voor het uploaden naar de server. data: availableTrips.get(vraag -1)

    // user moet kiezen welke trip
    // print trip informatie over de gekozen trip
    // speel de trip informatie door naar de database voor server-side processing voor kruisend station
    // laat user weten dat zijn of haar reis is opgeslagen, en dat diegene moet wachten op een match
}

module.exports = { getLocations, getRoutes, getStations };