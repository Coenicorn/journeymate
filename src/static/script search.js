// Assuming geoapifyAPI is defined
const geoapifyAPI = 'https://api.geoapify.com/v1/geocode/search?text={search}&apiKey=4db075d5fc424f58a614eb428bd951b7';
const nsAPIKey = "a0595411f0ee485c8b291e973d18bca2";
const nsStationURL = "https://gateway.apiportal.ns.nl/nsapp-stations/v2/nearest?lat={lat}&lng={lng}&limit=1&includeNonPlannableStations=false";
const nsReisInfoURL = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?fromStation={fromStation}&toStation=UT&dateTime={dateTime}&searchForArrival=true&addChangeTime=5";

document.getElementById('locationForm').addEventListener('submit', async function(e) {
    e.preventDefault();  // Prevent the form from submitting the usual way

    const input = document.getElementById('locationInput').value;  // Get the input value
    const container = document.getElementById('myDropdown');
    const container2 = document.getElementById('myDropdown2');
    const lat = null;
    
    // Clear previous results
    container.innerHTML = '';

    // Call the getLocations function with the input value
    const locations = await getLocations(input);
    console.log(locations);
    
    // Create result items
    locations.forEach((location, index) => {
        const resultDiv = document.createElement('button');
        resultDiv.textContent = `${location.formatted}`;
        
        // Optionally, set an ID or data attribute for each result
        resultDiv.id = `result${index}`;
        resultDiv.dataset.lat = location.lat;
        resultDiv.dataset.lon = location.lon;
        resultDiv.dataset.zip = location.postcode;
        
        // Add an event listener if needed
         // Add an event listener to log lat and lon to the console
         resultDiv.addEventListener('click', async () => {
            console.log(`Latitude: ${resultDiv.dataset.lat}, Longitude: ${resultDiv.dataset.lon}`);
            const station = await getStation(resultDiv.dataset.lat, resultDiv.dataset.lon);
            console.log(station);
            const routes = await getRoute(station);
            console.log(routes);
            // map [index, reis]
            //array = Array.from(routes,)
            document.getElementById("myDropdown").style.display = 'none';
            document.getElementById("myDropdown2").style.display = 'block';
            // routes.forEach((trip, tripIndex) => {
                
            //     console.log("Aantal stops: " + trip.stops.length);
            //     console.log("Vertrektijd: " + trip.stops[0].plannedDepartureDateTime);

            // });

            
            routes.forEach((trip, index) => {
                const resultDiv = document.createElement('button');
                const parsedTime = formatDate(new Date(trip.stops[0].plannedDepartureDateTime), "MM-DD HH:mm");
                const parsedArrivalTime = formatDate(new Date(trip.stops[trip.stops.length - 1].plannedArrivalDateTime), "MM-DD HH:mm");
                resultDiv.textContent = `${trip.stops[0].name} (Vertrek: ${parsedTime}) (Duur: ${trip.actualDurationInMinutes}min.) --> ${trip.stops[trip.stops.length - 1].name} (Aankomst: ${parsedArrivalTime})`;
            
                // Optionally, set an ID or data attribute for each result
                resultDiv.id = `result${index}`;
                // Loop through each stop and set a data attribute if needed
                trip.stops.forEach((stop, stopIndex) => {
                    resultDiv.dataset[`stopName${stopIndex}`] = `stop name:    ${stop.name},    departure time:    ${stop.plannedDepartureDateTime},    arival time:    ${stop.plannedArrivalDateTime}`;
                    //resultDiv.dataset[`plannedDepartureDateTime${stopIndex}`] = stop.plannedDepartureDateTime;
                    //resultDiv.dataset[`plannedArrivalDateTime${stopIndex}`] = stop.plannedArrivalDateTime;
                    
                });
                
                // Append the result to the container
                container2.appendChild(resultDiv); 
            });

        });
        
        // Append the result to the container
        container.appendChild(resultDiv);
    });

    // If no results, display a message
    if (locations.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.textContent = 'No results found.';
        container.appendChild(noResultsDiv);
    }
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

async function getLocations(input) {
    return new Promise(async (resolve) => {
        try {
            let apiSearch = geoapifyAPI.replace("{search}", encodeURIComponent(input));
    
            const response = await fetch(apiSearch);
            const data = await response.json();
            const results = [];
    
            data.features.forEach((feature) => {
                const { properties } = feature;
    
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

                if (resultaat.country != "Netherlands") {
                    return;
                }
    
                results.push(resultaat);
            });
            resolve(results);
        } catch (error) {
            console.error('Error:', error);
            resolve([]);
        }
    });
}

async function getStation(lat, lon){
    // NS API
    const nsApiRequest = nsStationURL
        .replace("{lat}", lat)
        .replace("{lng}", lon)
    
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

        //console.log("Trip nummer #" + (loopTrip.idx + 1));
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
                    plannedArrivalDateTime: loopStop.plannedArrivalDateTime,
                    isCancelled: loopStop.cancelled 
                }
                legStops.push(stop); // voeg stop toe aan traject
                //console.log(" -" + stop.name)
            });
        });
        //console.log("\n");

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

    return availableTrips; // returned map [index, reis]
    
    // user moet kiezen welke trip
    // print trip informatie over de gekozen trip
    // speel de trip informatie door naar de database voor server-side processing voor kruisend station
    // laat user weten dat zijn of haar reis is opgeslagen, en dat diegene moet wachten op een match
}