const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weather-result");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        weatherResult.innerHTML = "";
        return;
    }

    getWeather(city);
});

async function getWeather(city) {
    try {
        message.textContent = "Loading...";
        weatherResult.innerHTML = "";

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            message.textContent = "City not found.";
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;
        const cityName = location.name;
        const country = location.country;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const currentWeather = weatherData.current_weather;

        message.textContent = "";

        weatherResult.innerHTML = `
            <div class="weather-card">
                <h2>${cityName}, ${country}</h2>
                <p>Temperature: ${currentWeather.temperature}°C</p>
                <p>Wind Speed: ${currentWeather.windspeed} km/h</p>
                <p>Weather Code: ${currentWeather.weathercode}</p>
            </div>
        `;

    } catch (error) {
        message.textContent = "Something went wrong. Please try again.";
        weatherResult.innerHTML = "";
        console.log(error);
    }
}