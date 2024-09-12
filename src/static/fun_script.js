function redirectToRandomUrl() {
    // Predefined list of URLs with their corresponding weights
    const urls = [
        { url: 'https://example.com/egg1', weight: 0.5 },  // 50% chance
        { url: 'https://example.com/egg2', weight: 0.3 },  // 30% chance
        { url: 'https://example.com/egg3', weight: 0.15 }, // 15% chance
        { url: 'https://example.com/egg4', weight: 0.05 }  // 5% chance
    ];
    
    // Create an array with cumulative weights
    let cumulativeWeights = [];
    let sum = 0;
    urls.forEach(item => {
        sum += item.weight;
        cumulativeWeights.push(sum);
    });

    // Generate a random number between 0 and 1
    const randomNum = Math.random();

    // Find the first URL that has a cumulative weight greater than the random number
    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (randomNum <= cumulativeWeights[i]) {
            window.location.href = urls[i].url;
            break;
        }
    }
}