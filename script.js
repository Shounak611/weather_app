const input = document.getElementById('location');
const button = document.getElementById('submit');
const result = document.getElementById('weather-result');

button.addEventListener('click', async (e) => {
    e.preventDefault();
    const location = input.value;
    const weatherData = await fetchWeatherData(location);
    displayWeatherData(weatherData);
});

async function fetchWeatherData(location) {
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${location}`;
    const geoResponse = await fetch(geoURL);

    const geoData = await geoResponse.json();
    const { latitude, longitude } = geoData.results[0];
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();
    console.log(weatherData);
    return weatherData;
}

function displayWeatherData(weatherData) {
    const {
        current_weather: { temperature, windspeed: windSpeed, winddirection: windDirection },
        current_weather_units: { temperature: tempUnit, windspeed: windUnit, winddirection: windDirectionUnit }
    } = weatherData;

    result.innerHTML = `
        <h2>Current Weather</h2>
        <p><span style="font-weight: bold;">Temperature</span>: ${temperature} ${tempUnit}</p>
        <p><span style="font-weight: bold;">Wind Speed</span>: ${windSpeed} ${windUnit}</p>
        <p><span style="font-weight: bold;">Wind Direction</span>: ${windDirection} ${windDirectionUnit}</p>
    `;
}
