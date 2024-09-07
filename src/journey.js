const nsApiKey = process.env.NSAPIKEY;
const geoapifyEndpoint = process.env.GEOAPIFYENDPOINT;
const nsStationsEndpoint = process.env.NSSTATIONSENDPOINT

/* DEBUG */
const TESTStartingPoint = "hilv";
const TESTDestination = "utrech";

// helper function to insert API key
async function fetchNSAPI(request) {
    return new Promise((resolve, reject) => {
        fetch(request, {
            headers: {
                "Ocp-Apim-Subscription-Key": nsApiKey
            }
        })
        .catch(reason => reject(reason))
        .then(result => resolve(result));
    });
}

async function getLocationData(rawQuery) {
    // put query into URI
    let query = geoapifyEndpoint.replace("{search}", encodeURIComponent(rawQuery));

    const responseData = await (await fetch(query).then()).json();

    if (!responseData.features) {
        console.log("Error finding location data");
        return [];
    }

    const features = responseData.features;

    const possibleLocations = [];

    for (let i = 0; i < response)

}

getLocationData(TESTDestination);