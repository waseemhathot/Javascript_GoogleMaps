

let googleMap = document.querySelector(".map");
let input = document.querySelector(".user-input__input");
let inputButton = document.querySelector(".input-button");
let latLng = {lat: 31.771959, lng: 35.217018};


async function getWeather(lat, lng){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=7efc52ee16cbc00b541bf0b93742b3bb`);
    let data = await response.json();
    console.log(data);
    return JSON.stringify(data.main.temp);
}


async function getCoords(address){
    let response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=d0decebee7324f53adbbda88faa214c1`);
    let data = await response.json();
    return data.results[0].geometry;
}


function initMap(){
    let map = new google.maps.Map(googleMap, {
        center: latLng,
        zoom: 8
    });
    map.setOptions({draggableCursor: 'pointer'});

    inputButton.addEventListener("click", function(e){
        getCoords(input.value).then(function(res){
            map.setCenter(res);
            map.setZoom(9);
            
        }).catch(function(err){
            console.log(err);
            window.alert("Invalid Address, please try again");                
        });
    });

    input.addEventListener("keyup", function(e){
        if(e.keyCode === 13){  
            inputButton.click();
        }
    });


    map.addListener("click", function(e){
        latLng.lat = e.latLng.lat();
        latLng.lng = e.latLng.lng();

        let weather = getWeather(latLng.lat, latLng.lng).then(function(data){
            let temp = `${data} &#8451;`;
            let popupContent =`<div class="popup-window">${temp}</div>`;
            let infoPopup = new google.maps.InfoWindow({
                content: popupContent

            });
            infoPopup.setPosition(latLng);
            infoPopup.open(map);
        })
        
       
    });
}








