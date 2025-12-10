const input = document.getElementById('location');
const form = document.getElementById('weather-form');
const result = document.getElementById('weather-result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = input.value.trim();

    if (!location) {
        showError("Please enter a valid location.");
        return;
    }

    showLoading();
    try {
        const weatherData = await fetchWeatherData(location);
        displayWeatherData(weatherData);
    } catch (error) {
        showError(error.message || "Failed to fetch weather data.");
    }
});

async function fetchWeatherData(location) {
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}`;
    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
        throw new Error("Network error while fetching location data.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Location not found. Please try a different city.");
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherURL);

    if (!weatherResponse.ok) {
        throw new Error("Network error while fetching weather data.");
    }

    const weatherData = await weatherResponse.json();
    return { ...weatherData, locationName: `${name}, ${country}` };
}

function displayWeatherData(data) {
    const {
        current_weather: { temperature, windspeed, winddirection },
        current_weather_units: { temperature: tempUnit, windspeed: windUnit, winddirection: dirUnit },
        locationName
    } = data;

    result.style.display = "block";
    result.innerHTML = `
        <h2 style="margin-bottom: 10px;">Current Weather in ${locationName}</h2>
        <p><strong>Temperature:</strong> ${temperature} ${tempUnit}</p>
        <p><strong>Wind Speed:</strong> ${windspeed} ${windUnit}</p>
        <p><strong>Wind Direction:</strong> ${winddirection}${dirUnit} (relative to North)</p>
    `;
}

function showLoading() {
    result.style.display = "block";
    result.innerHTML = "<p>Loading weather data...</p>";
}

function showError(message) {
    result.style.display = "block";
    result.innerHTML = `<p style="color: red; font-weight: bold;">${message}</p>`;
}
