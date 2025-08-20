let input = document.querySelector("#cityInput");
let button = document.querySelector("button");
let city = document.querySelector("#city");
let gps = document.querySelector("#gps");
let temperature = document.querySelector("#temperature");
let details = document.querySelector("#details");

async function fetchCoordinates() {
    let userInput = input.value

    if (userInput === "") {
        city.innerText = "Veuillez entrer une ville.";
        gps.innerText = "";
        temperature.innerText = "-°C";
        details.innerText = "";
        return;
    }

    city.innerText = "Chargement...";
    gps.innerText = "";
    temperature.innerText = "-°C";
    details.innerText = "";

    let url = `https://nominatim.openstreetmap.org/search?q=${userInput}&format=json&addressdetails=1&limit=1`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.length === 0) {
        city.innerText = "Ville non trouvée.";
        gps.innerText = "";
        temperature.innerText = "-°C";
        details.innerText = "";
        return;
    }

    let lat = data[0].lat;
    let lon = data[0].lon;
    let cityName = data[0].display_name

    city.innerText = userInput;
    gps.innerText = `Latitude: ${lat}, Longitude: ${lon}`;

    fetchWeather(lat, lon);
}

async function fetchWeather(lat, lon) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,relative_humidity_2m`;
    let response = await fetch(url);
    let data = await response.json();

    let temp = data.current.temperature_2m;
    let humidity = data.current.relative_humidity_2m;
    let rain = data.current.precipitation;

    temperature.innerText = `${temp}°C`;
    details.innerText = `Humidité : ${humidity}% | Précipitations : ${rain} mm`;
}

button.addEventListener("click", () => {
    fetchCoordinates();
});
