const latLng = {
    lat: 31.771959,
    lng: 35.217018
};

const domElements = {
    googleMap: document.querySelector(".map"),
    input: document.querySelector(".user-input__input"),
    inputButton: document.querySelector(".input-button")
};

validateElements(domElements);

const apiKeys = {
    opencagedataKey: 'd0decebee7324f53adbbda88faa214c1',
    openweatherKey: '7efc52ee16cbc00b541bf0b93742b3bb'
};

async function getWeather(lat, lng) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKeys.openweatherKey}`).catch((err) =>{
        throw new Error('openweather request failed');
    });
    const data = await response.json();
    return data;
}

async function getCoords(address) {
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${apiKeys.opencagedataKey}`).catch((err) =>{
        throw new Error('opencagedata request failed');
    });
    const data = await response.json();
    return data.results[0].geometry;
}

function initMap() {
    let map = new google.maps.Map(domElements.googleMap, {
        center: latLng,
        zoom: 8
    });
    map.setOptions({ draggableCursor: 'pointer' });

    domElements.inputButton.addEventListener("click", function (e) {
        getCoords(domElements.input.value).then(function (res) {
            map.setCenter(res);
            map.setZoom(12);

        }).catch(function (err) {
            console.log(err);
            window.alert("Invalid Address, please try again");
        });
    });

    domElements.input.addEventListener("keyup", function (e) {
        if (e.keyCode === 13) {
            domElements.inputButton.click();
        }
    });

    map.addListener("click", function (e) {
        latLng.lat = e.latLng.lat();
        latLng.lng = e.latLng.lng();
        const weather = getWeather(latLng.lat, latLng.lng).then(function (data) {
            const temp = `${data.main.temp} &#8451;`;
            const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            const location = data.name;
            const humidity = data.main.humidity;
            const currTime = moment().format("ddd, hA").toString();
            const weatherDesc = data.weather[0].description;

            const popupContent = `<div class="window-content">
            <div class="window-content__weather-info">
            <span>${location}: ${temp}</span>
            <span>Status: ${weatherDesc}</span>            
            <span>Humidity: ${humidity}</span>
            <span>Time: ${currTime}</span>
            </div>
            <img src=${weatherIcon} alt="image failed to load">
            </div>`;

            const infoPopup = new google.maps.InfoWindow({
                content: popupContent
            });
            infoPopup.setPosition(latLng);
            infoPopup.open(map);
        });
    });
}

function validateElements(elementsHolder) {
    if (!elementsHolder.googleMap || !elementsHolder.input || !elementsHolder.inputButton) {
        throw new Error('one or more of the elements dont exist');
    }
}







