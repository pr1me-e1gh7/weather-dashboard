// Elements and Variables
let webAPIurl = "https://api.openweathermap.org"
let webAPIkey = "&appid=17d4b6198b69187e630a6b25bc625c64"
let ocEndpt = '/data/2.5/onecall?';
let presetLocations = ['Columbus', 'Dallas', 'Idaho Falls', 'Los Angeles', 'Minneapolis', 'Orlando', 'Phoenix', 'Vancouver'];
let current = moment().format('YYYY/MM/DD')
let searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
let locationTitle;
const locationhistoryBtn = document.querySelector('#search-buttons')
const searchFeature = document.querySelector('#city-search-button');
const searchData = document.querySelector('#city-search');
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
const upcomingPrs = document.querySelectorAll('.forecast-pressure');

// Search Section setup
displaySearchHistory = () => {
    locationhistoryBtn.textContent = '';
    if (searchHistory === undefined || searchHistory === null) {
        localStorage.setItem('searchHistory', JSON.stringify(presetLocations));
    }
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

// Search Button listener
searchFeature.addEventListener('click', function (event) {
    event.preventDefault();
    
    locationTitle = searchData.value.toLowerCase().trim();
    getWeatherInfo();
    
    searchData.value = '';
});

// Obtain Weather Info
getWeatherInfo = () => {
    let gcEndpt = '/geo/1.0/direct?'
    let APIparameter = `q=${locationTitle}`;

    fetch(`${webAPIurl}${gcEndpt}${APIparameter}${webAPIkey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        getWeather(data);
    })
    // Error message if city entered is invalid
    .catch(function (error) {
        alert('Error: enter only the city name');
    })
}

// Latitude + Longitude
getWeather = (weatherData) => {
    let latitude = weatherData[0].lat;
    let longitude = weatherData[0].lon;
    fetch(`${webAPIurl}${ocEndpt}lat=${latitude}&lon=${longitude}&units=imperial${webAPIkey}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayWeather(weatherData, data);
            displayForecast(data);
        })
}

// Prime Section info pull
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

// Upcoming Forecast info pull
displayForecast = (openWeatherData) => {
    for (let i = 0; i < upcomingSection.length; i++) {
        upcomingDate[i].textContent = moment().add((i+1), 'days').format('YYYY/MM/DD');
        upcomingImg[i].src = `http://openweathermap.org/img/wn/${openWeatherData.daily[i].weather[0].icon}@2x.png`;
        upcomingTmp[i].textContent = `${Math.trunc(openWeatherData.daily[i].temp.day)}\xB0F`;
        upcomingWnd[i].textContent = `${openWeatherData.daily[i].wind_speed} mph`;
        upcomingPrs[i].textContent = `${openWeatherData.daily[i].pressure} mb`;
    }
};

// Fills page with content
init = () => {
    primeDate.textContent = ` ${current}`
    displaySearchHistory();
    getWeatherInfo();
}

init();