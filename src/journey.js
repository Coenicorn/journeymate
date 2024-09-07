const nsApiKey = process.env.NSAPIKEY;
const geoApiKey = process.env.GEOAPIKEY;
const geoapifyEndpoint = process.env.GEOAPIFYENDPOINT;
const nsStationsEndpoint = process.env.NSSTATIONSENDPOINT

/* DEBUG */
const TESTStartingPoint = "goudriaanstraat";
const TESTDestination = "utrecht centraal";

// helper function to insert API key
async function fetchNSAPI(requestURI) {
    return new Promise((resolve, reject) => {
        fetch(requestURI, {
            headers: {
                "Ocp-Apim-Subscription-Key": nsApiKey
            }
        })
        .catch(reason => reject(reason))
        .then(result => resolve(result));
    });
}

// helper function to insert geoapify key
async function fetchGeoAPI(requestURI) {
    return new Promise((resolve, reject) => {        
        const url = new URL(requestURI);

        // add the api key to the URL
        url.searchParams.set("apiKey", geoApiKey);

        // console.log(url);

        fetch(url)
        .catch(reason => reject(reason))
        .then(result => resolve(result));
    });
}

async function getLocationData(rawQuery) {
    // put query into URI
    let query = geoapifyEndpoint.replace("{search}", encodeURIComponent(rawQuery));

    console.log(query);

    const response = await fetchGeoAPI(query);
    const responseData = await response.json();

    // check if the data is valid
    if (!responseData.features) {
        console.log("Error finding location data");
        return [];
    }

    const features = responseData.features;

    const possibleLocations = [];

    features.forEach((feature, i) => {
        console.log(`#${i}`);
        console.log(feature.properties.formatted);

        console.log(feature);
    });

}

getLocationData(TESTStartingPoint);
getLocationData(TESTDestination);