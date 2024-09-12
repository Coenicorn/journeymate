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
        console.log('Locatie ophalen...');

        const results = await getLocations(zoekOpdracht);
            results.forEach((result, index) => {
                console.log("#" + (index + 1) + " - " + result.formatted + "\n");
            });
            
        console.log("\n--------------------------------\n");

        const chosenNumber = await getUserInput("Kies het getal van het resultaat waar je wilt vertrekken:");

        if(chosenNumber > results.size || chosenNumber < 0 ){
        console.log("Resultaat bestaat niet. Kies opnieuw.\n\n\n");
        return main();
        }

        const stResult = await getStation(results, chosenNumber);

        await getRoute(stResult);

    // verder met tripNummer.

    } catch (error) {
        console.error('Error:', error);
    } finally {
        readline.close();
    }
}

async function getLocations(input){

    return new Promise(async(resolve) => {

        try{
            let apiSearch = geoapifyAPI.replace("{search}", encodeURIComponent(input));
    
            const response = await fetch(apiSearch);
            const data = await response.json();
            const results = [];

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

                if(resultaat.country != "Netherlands"){
                    return;
                }
    
                results.push(resultaat);
            });
             resolve(results);
        } catch (error) {
            console.error('Error:', error);
            resolve([])
        }

    });
}

async function getStation(results, chosenNumber){
// NS API
    const vertrek = results[(chosenNumber - 1)];
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

    return station;
}

async function getRoute(station){
    // NS ROUTE PLANNER
var currentDate = new Date(); //een datum aanmaken voor een richtlijn voor de aankomsttijd (werkt niet helemaal)
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
const availableTrips = new Map([]); // reisinformatie

    nsReisData.trips.forEach((loopTrip, index) => {

        console.log("Trip nummer #" + (loopTrip.idx + 1));
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
                    isCancelled: loopStop.cancelled 
                }
                legStops.push(stop); // voeg stop toe aan traject
                console.log(" -" + stop.name)
            });
        });
        console.log("\n");

        // Buiten legs loop
        const trip = {
            index: loopTrip.idx,
            actualDurationInMinutes: loopTrip.actualDurationInMinutes,
            plannedDurationInMinutes: loopTrip.plannedDurationInMinutes,
            transfers: loopTrip.transfers,
            stops: legStops // voeg traject toe aan de trip
        }
        availableTrips.set(loopTrip.idx, trip); // voeg de trip toe aan alle beschikbare trips
    });

    const vraag = await getUserInput("Welke trip wil je selecteren?");
    if(vraag > availableTrips.size || vraag < 0 ){
        console.log("Resultaat bestaat niet. Kies opnieuw.\n\n\n");
        return main();
    }
    // Functie voor het uploaden naar de server. data: availableTrips.get(vraag -1)
    
    // user moet kiezen welke trip
    // print trip informatie over de gekozen trip
    // speel de trip informatie door naar de database voor server-side processing voor kruisend station
    // laat user weten dat zijn of haar reis is opgeslagen, en dat diegene moet wachten op een match
}

main();