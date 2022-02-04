let webAPIurl = "https://api.openweathermap.org"
let webAPIkey = "&appid=17d4b6198b69187e630a6b25bc625c64"
let ocEndpt = '/data/2.5/onecall?';
let presetLocations = ['Columbus', 'Dallas', 'Idaho Falls', 'Los Angeles', 'Minneapolis', 'Orlando', 'Phoenix', 'Vancouver'];
let present = moment().format('YYYY/MM/DD')
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
let locationTitle;
const locationhistoryBtn = document.querySelector('#search-buttons')
const search = document.querySelector('#city-search-button');
const searchInput = document.querySelector('#city-search');
const primeLocation = document.querySelector('#prime-card-city');
const primeDate = document.querySelector('#prime-card-date');
const primeImg = document.querySelector('#prime-card-icon');
const primeTmp = document.querySelector('#prime-card-temp');
const primeWnd = document.querySelector('#prime-card-wind');
const primeHmd = document.querySelector('#prime-card-pressure');
const primeUV = document.querySelector('#prime-card-uv');
const upcomingSection = document.querySelectorAll('.forecast-card');
const upcomingDate = document.querySelectorAll('.forecast-date');
const upcomingImg = document.querySelectorAll('.forecast-icon');
const upcomingTmp = document.querySelectorAll('.forecast-temp');
const upcomingWnd = document.querySelectorAll('.forecast-wind');
const upcomingHmd = document.querySelectorAll('.forecast-pressure');

getWeatherInfo = () => {
    let geocodingEndpoint = '/geo/1.0/direct?'
    let apiParam = `q=${locationTitle}`;

    fetch(`${webAPIurl}${geocodingEndpoint}${apiParam}${webAPIkey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        getWeather(data);
    })
    .catch(function (error) {
        alert('Error: enter only the city name');
    })
}

getWeather = (weatherData) => {
    let lat = weatherData[0].lat;
    let lon = weatherData[0].lon;
    fetch(`${webAPIurl}${ocEndpt}lat=${lat}&lon=${lon}&units=imperial${webAPIkey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayWeather(weatherData, data);
            displayForecast(data);
        })
}

displayWeather = (coordinatesData, openWeatherData) => {
    primeLocation.textContent = coordinatesData[0].name;
    primeImg.src = `http://openweathermap.org/img/wn/${openWeatherData.current.weather[0].icon}@2x.png`
    primeTmp.textContent = `${Math.trunc(openWeatherData.current.temp)}\xB0F`;
    primeWnd.textContent = `${openWeatherData.current.wind_speed} mph`;
    primeHmd.textContent = `${openWeatherData.current.pressure} mb`;
    primeUV.textContent = Math.trunc(openWeatherData.current.uvi);
    primeUV.parentElement.classList.remove('low');
    primeUV.parentElement.classList.remove('moderate');
    primeUV.parentElement.classList.remove('high');
    primeUV.parentElement.classList.remove('very-high');
    primeUV.parentElement.classList.remove('severe');

    if (primeUV.textContent <= 2) {
        primeUV.parentElement.classList.add('low');
    } else if (primeUV.textContent <= 5) {
        primeUV.parentElement.classList.add('moderate')
    } else if (primeUV.textContent <= 7) {
        primeUV.parentElement.classList.add('high')
    }
    else if (primeUV.textContent <= 10) {
        primeUV.parentElement.classList.add('very-high')
    } else {
        primeUV.parentElement.classList.add('severe');
    }
};

displayForecast = (openWeatherData) => {
    for (let i = 0; i < upcomingSection.length; i++) {
        upcomingDate[i].textContent = moment().add((i+1), 'days').format('YYYY/MM/DD');
        upcomingImg[i].src = `http://openweathermap.org/img/wn/${openWeatherData.daily[i].weather[0].icon}@2x.png`;
        upcomingTmp[i].textContent = `${Math.trunc(openWeatherData.daily[i].temp.day)}\xB0F`;
        upcomingWnd[i].textContent = `${openWeatherData.daily[i].wind_speed} mph`;
        upcomingHmd[i].textContent = `${openWeatherData.daily[i].pressure} mb`;
    }
};

showSearchHistory = () => {
    locationhistoryBtn.textContent = '';
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    locationTitle = searchHistory[0];
    for (let i = 0; i < searchHistory.length; i++) {
        let button = document.createElement('button');
        button.textContent = searchHistory[i];
        button.classList.add('btn');
        button.classList.add('btn-secondary');
        button.classList.add('btn-block');
        button.classList.add('mb-2');
        button.classList.add('searched-cities-btn');
        button.addEventListener('click', function(event) {
            locationTitle = event.target.textContent
            getWeatherInfo();
        })
        locationhistoryBtn.appendChild(button);
    }
};

search.addEventListener('click', function (event) {
    event.preventDefault();
    
    locationTitle = searchInput.value.toLowerCase().trim();
    getWeatherInfo();
    
    searchInput.value = '';
});

init = () => {
    primeDate.textContent = ` ${present}`
    showSearchHistory();
    getWeatherInfo();
}

init();