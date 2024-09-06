const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
  });

  const geoapifyAPI = "https://api.geoapify.com/v1/geocode/search?text={search}&apiKey=4db075d5fc424f58a614eb428bd951b7";
  
  readline.question('Voer vertrek locatie in:\n', async (zoekOpdracht) => {
	console.log('Op zoek naar het dichtstbijzijnde station...');
  
	let apiSearch = geoapifyAPI.replace("{search}", zoekOpdracht).replace(" ", "%20");
  
	try {
	  const response = await fetch(apiSearch);
	  const data = await response.json();
	  const results = new Map([]);

	  data.features.forEach((feature, index) => {
		const { properties, geometry} = feature;

		const resultaatRanking = {
			importance: properties.rank.importance, // 0.2000097
			popularity: properties.rank.popularity, // 6.195578271911652
			confidence: properties.rank.confidence, // 0.9
			isFullMatch: properties.rank.match_type === 'full_match' // true
		};

		const resultaat = {
			name: properties.name, // Parkeerterrein station Hoevelaken 
			country: properties.country, // Netherlands
			city: properties.city, // Hoevelaken
			postcode: properties.postcode, // 3871 MZ
			streetName: properties.street, // Stoutenburgerlaan
			lon: properties.lon, // 5.457981164706014 | double
			lat: properties.lat, // 52.1677176 | double
			formatted: properties.formatted, // Parkeerterrein station Hoevelaken, Stoutenburgerlaan, 3871 MZ Hoevelaken, Netherlands
			adres_line1: properties.address_line1, // Parkeerterrein station Hoevelaken
			adres_line2: properties.address_line2, // Stoutenburgerlaan, 3871 MZ Hoevelaken, Netherlands
			category: properties.category, // parking.cars
			rank: resultaatRanking // zie resultaatRanking
		};

		results.set(index, resultaat);
	  });

	  results.forEach((result, index) => {
		console.log("Resultaat #"+(index+1)+": ");
		console.log("  " + result.adres_line2);
		console.log("  " + result.lon);
		console.log("  " + result.lat);
		console.log("  Importance: " + result.rank.importance);
	  });

	} catch (error) {
	  console.error('Error:', error);
	}
  
	readline.close();
  });
  