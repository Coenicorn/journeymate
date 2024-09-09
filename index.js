const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const geoapifyAPI = "https://api.geoapify.com/v1/geocode/search?text={search}&apiKey=4db075d5fc424f58a614eb428bd951b7";
const nsAPIKey = "a0595411f0ee485c8b291e973d18bca2";
const nsStationURL = "https://gateway.apiportal.ns.nl/nsapp-stations/v2/nearest?lat={lat}&lng={lng}&limit=2&includeNonPlannableStations=false";

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
            .replace("{lng}", vertrek.lon);

        const nsResponse = await fetch(nsApiRequest, {
            headers: {
                'Ocp-Apim-Subscription-Key': nsAPIKey
            }
        });

const nsStationData = await nsResponse.json();

console.log(nsStationData.payload); // rauwe data


    } catch (error) {
        console.error('Error:', error);
    } finally {
readline.close();
}
}

main();