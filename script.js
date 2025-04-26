const apiKey = '39e617cb5b0837b1b06f3cdcb9fe9bfa'; // Your API Key

function getWeather() {
    const city = document.getElementById("city").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById("city-name").innerText = `${data.name}, ${data.sys.country}`;
                document.getElementById("date").innerText = new Date().toDateString();
                document.getElementById("temperature").innerText = `${Math.round(data.main.temp)}°C`;
                document.getElementById("weather-desc").innerText = data.weather[0].description;
                document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
                document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} m/s`;
                document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

                document.getElementById("weather-section").classList.remove("hidden");

                updateBackground(data.weather[0].main);
                getForecast(city);
            } else {
                alert("City not found!");
            }
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function updateBackground(weatherCondition) {
    document.body.className = '';
    removeEffects();

    if (weatherCondition === "Clear") {
        document.body.classList.add('clear');
        loadParticles();
    } else if (weatherCondition === "Clouds") {
        document.body.classList.add('cloudy');
    } else if (weatherCondition === "Rain") {
        document.body.classList.add('rainy');
        addRain();
    } else if (weatherCondition === "Snow") {
        document.body.classList.add('snow');
        addSnow();
    } else if (weatherCondition === "Thunderstorm") {
        document.body.classList.add('stormy');
    }
}

function addRain() {
    let rain = document.createElement('div');
    rain.classList.add('rain');
    document.body.appendChild(rain);
}

function addSnow() {
    let snow = document.createElement('div');
    snow.classList.add('snow');
    document.body.appendChild(snow);
}

function removeEffects() {
    const rain = document.querySelector('.rain');
    const snow = document.querySelector('.snow');
    if (rain) rain.remove();
    if (snow) snow.remove();
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }
}

function loadParticles() {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 50
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.5
            },
            "size": {
                "value": 3
            },
            "move": {
                "enable": true,
                "speed": 1
            }
        }
    });
}
function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.getElementById("forecast");
            forecastContainer.innerHTML = "";

            const forecastList = data.list.filter(item => item.dt_txt.includes("12:00:00"));

            forecastList.slice(0, 5).forEach(day => {
                const date = new Date(day.dt_txt);
                const options = { weekday: 'short' };
                const dayName = date.toLocaleDateString(undefined, options);

                const temp = Math.round(day.main.temp);
                const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
                const description = day.weather[0].main;

                const forecastCard = `
                    <div class="d-flex align-items-center glass-small p-2 rounded">
                        <img src="${iconUrl}" alt="${description}" width="50">
                        <div class="ms-3">
                            <h6 class="mb-0">${dayName}</h6>
                            <small>${description} | ${temp}°C</small>
                        </div>
                    </div>
                `;
                forecastContainer.innerHTML += forecastCard;
            });
        })
        .catch(error => console.error("Error fetching forecast:", error));
}

// Dark Mode Toggle
const toggleBtn = document.getElementById('toggleDark');
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleBtn.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
});
