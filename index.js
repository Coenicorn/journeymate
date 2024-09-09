const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function formatDate(date, format) {
    const map = {
      'YYYY': date.getFullYear(),
      'MM': ('0' + (date.getMonth() + 1)).slice(-2),
      'DD': ('0' + date.getDate()).slice(-2),
      'HH': ('0' + date.getHours()).slice(-2),
      'mm': ('0' + date.getMinutes()).slice(-2),
      'ss': ('0' + date.getSeconds()).slice(-2)
    };
  
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, matched => map[matched]);
}
  

const geoapifyAPI = "https://api.geoapify.com/v1/geocode/search?text={search}&apiKey=4db075d5fc424f58a614eb428bd951b7";
const nsAPIKey = "a0595411f0ee485c8b291e973d18bca2";
const nsStationURL = "https://gateway.apiportal.ns.nl/nsapp-stations/v2/nearest?lat={lat}&lng={lng}&limit=1&includeNonPlannableStations=false";
const nsReisInfoURL = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?fromStation={fromStation}&toStation=UT&dateTime={dateTime}&searchForArrival=true&addChangeTime=5";

; // [&viaStation]

function getUserInput(vraag) {
    return new Promise((resolve) => {
        readline.question(vraag + '\n', (input) => {
            resolve(input);
        });
    });
}

async function main() {
    try {
        const zoekOpdracht = await getUserInput("Voer je vertrek plaats in:");
        console.log('Op zoek naar het dichtstbijzijnde station...');

        let apiSearch = geoapifyAPI.replace("{search}", encodeURIComponent(zoekOpdracht));

        const response = await fetch(apiSearch);
        const data = await response.json();
        const results = new Map([]);

        data.features.forEach((feature, index) => {
            const { properties, geometry } = feature;

            const resultaatRanking = {
                importance: properties.rank.importance,
                popularity: properties.rank.popularity,
                confidence: properties.rank.confidence,
                isFullMatch: properties.rank.match_type === 'full_match'
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
                rank: resultaatRanking
            };

            results.set(index, resultaat);
        });

        results.forEach((result, index) => {
            console.log("Resultaat #" + (index + 1) + ": ");
            console.log("  " + result.adres_line2);
            console.log("  " + result.lon);
            console.log("  " + result.lat);
            console.log("  Importance: " + result.rank.importance);
        });

console.log("\n--------------------------------\n");

const chosenNumber = await getUserInput("Kies het getal van het resultaat waar je wilt vertrekken:");

if(chosenNumber > results.size || chosenNumber < 0 ){
console.log("Resultaat bestaat niet. Kies opnieuw.\n\n\n");
main();
}

// NS API
        const vertrek = results.get(chosenNumber - 1);
        const nsApiRequest = nsStationURL
            .replace("{lat}", vertrek.lat)
            .replace("{lng}", vertrek.lon)

        const nsResponse = await fetch(nsApiRequest, {
            headers: {
                'Ocp-Apim-Subscription-Key': nsAPIKey
            }
        });

const nsStationData = await nsResponse.json();

const station =  {
    name: nsStationData.payload[0].namen.lang,
    code: nsStationData.payload[0].code
}

console.log("Station gevonden: " + station.name);
console.log("Code: " + station.code + "\n\n");

// NS ROUTE PLANNER

var currentDate = new Date();

currentDate.setUTCHours(8); // UTC time
currentDate.setUTCMinutes(34); // aankomsttijd op Utrecht Centraal, vanuit gaande dat tram om 8:39 vertrekt naar HU

var rfc3339Date = currentDate.toISOString().replace("Z", "+0200"); 

const nsApiReisRequest = nsReisInfoURL
    .replace("{fromStation}", station.code)
    .replace("{dateTime}", encodeURIComponent(rfc3339Date));

const nsReisResponse = await fetch(nsApiReisRequest, {
headers: {
    'Ocp-Apim-Subscription-Key': nsAPIKey
}
});

const nsReisData = await nsReisResponse.json();

const availableTrips = new Map([]);
const stops = new Map([]);

nsReisData.trips.forEach((trip, index) => {

    console.log("Trip #"+ (trip.idx + 1));
    
    
    trip.legs.forEach((leg, legIndex) => {

        const reis = {
            id: trip.idx,
            duration: trip.actualDurationInMinutes,
            direction: trip.direction,
            vertrekTijd: trip.legs[legIndex].origin.plannedDateTime,
            aankomstTijd: trip.legs[legIndex].destination.plannedDateTime,
            vertrekPeron: trip.legs[legIndex].origin.actualTrack,
            aankomstPeron: trip.legs[legIndex].destination.actualTrack,
        };

        

        availableTrips.set(index, reis);
        
        const tripStops = [];

        leg.stops.forEach((loopStop, stopIndex) => {
            
            const stop = {
                name: loopStop.name,
                routeIdx: loopStop.routeIdx,
                plannedDeparureDateTime: loopStop.plannedDepartureDateTime,
                plannedDepartureTrack: loopStop.plannedDepartureTrack,
                cancelled: loopStop.cancelled
            };

            console.log(stop.name);
            
            tripStops.push(stop);

        });

        stops.set(trip.idx, tripStops);
        //console.log(" Aantal stops: " + tripStops.length);
        //console.log(" Keer overstappen: " + (trip.legs.length - 1));

        const tempDate = new Date(reis.aankomstTijd);
        console.log(" " + formatDate(tempDate, 'YYYY-MM-DD HH:mm:ss') + "\n");
    });
});

    const tripNummer = await getUserInput("Hoelaat wil je aankomen:\n");

    // verder met tripNummer.

    } catch (error) {
        console.error('Error:', error);
    } finally {
        readline.close();
    }
}

main();