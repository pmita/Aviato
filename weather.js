//Shortcut functions to create new elements in the DOM
function createNode(element){
    return document.createElement(element);
}
function append(parent, el){
    return parent.appendChild(el);
}

var counter = 0, isTrue= true;

//What happens when user presses SEARCH
function getInputLocation(){
    counter = counter +1;
    var inputCityUserWantsToTravel = document.getElementById("LocationUserWantsToCheck").value;
    var weatherDOM = document.getElementById('weatherDataDiv');
    var weatherAPI_Url = 'https://api.openweathermap.org/data/2.5/weather?q=' + inputCityUserWantsToTravel + '&appid=a1e599b4e637db406be9c5363793e1db';
    var flightAPI_Url = 'http://www.json-generator.com/api/json/get/bVtfFgaycy?indent=2';
    if ((inputCityUserWantsToTravel.length) && (isTrue)) {
        fetchWeatherData(weatherDOM, weatherAPI_Url, counter); 
        fetchFlightData(inputCityUserWantsToTravel,flightAPI_Url);
    } else{
        console.log('error');
    }
};


function fetchWeatherData(weatherDOM, weatherAPI_Url){
    fetch(weatherAPI_Url)
    .then((resp) => resp.json())
    .then(function(weather_respDataInJson){

        let weatherResponseDataInJson = weather_respDataInJson;
    
        let li = createNode('li'),
        img = createNode('img'),
        span = createNode('span');
        var icon_link = 'http://openweathermap.org/img/wn/' + weatherResponseDataInJson.weather[0].icon +'@2x.png';
        img.src = icon_link;
              
        span.innerHTML = `${weatherResponseDataInJson.weather[0].description}`;
        append(li, img);
        append(li,span);
        append(weatherDOM,li);
})
    .catch(function(error){
        console.log(error);
    });
}

function fetchFlightData(inputCityUserWantsToTravel,flightAPI_Url){
    fetch (flightAPI_Url)
     .then((response) => response.json())
      .then(function(flight_responseDataInJson){
            let flightResponseDataInJson = flight_responseDataInJson;
          //This is correct -> console.log(flightResponseDataInJson[0].scheduledFlights[0].arrivalAirport);  
          createTableFromJSON(inputCityUserWantsToTravel, flightResponseDataInJson);
        })
       .catch(function(error){
           console.log(error);
        });
}


//what happens after flight API data are fetched
function createTableFromJSON(inputCityUserWantsToTravel, flightResponseDataInJson){
        var table = document.createElement("table");
        var tr = table.insertRow(-1);
        var tableHeaderCell_flightNumberRow = document.createElement("th"); tableHeaderCell_flightNumberRow.innerHTML = "Flight Number"; tr.appendChild(tableHeaderCell_flightNumberRow);
        var tableHeaderCell_durationRow = document.createElement("th"); tableHeaderCell_durationRow.innerHTML = "Duration"; tr.appendChild(tableHeaderCell_durationRow);
        var tableHeaderCell_categoryRow = document.createElement("th"); tableHeaderCell_categoryRow.innerHTML = "Category"; tr.appendChild(tableHeaderCell_categoryRow);
        var tableHeaderCell_priceRow = document.createElement("th"); tableHeaderCell_priceRow.innerHTML = "Price &#163;"; tr.appendChild(tableHeaderCell_priceRow);

        var goodCities = false;
        for (var j=0; j <200; j++){
            if (inputCityUserWantsToTravel.toUpperCase() == flightResponseDataInJson[0].scheduledFlights[j].arrivalAirport){
                goodCities = true;
                tr = table.insertRow(-1);
                for (var k=0; k < flightResponseDataInJson[0].scheduledFlights[j].sittingOptions.length; k++){
                    var tableBodyCell_flightNumberRow = tr.insertCell(-1); tableBodyCell_flightNumberRow.innerHTML =  flightResponseDataInJson[0].scheduledFlights[j].carrierFsCode + "-"+ flightResponseDataInJson[0].scheduledFlights[j].flightNumber;
                    var tableBodyCell_durationRow = tr.insertCell(-1); tableBodyCell_durationRow.innerHTML = flightResponseDataInJson[0].scheduledFlights[j].durationInHours + " , " +flightResponseDataInJson[0].scheduledFlights[j].durationInMinutes;
                    var tableBodyCell_categoryRow = tr.insertCell(-1); tableBodyCell_categoryRow.innerHTML = flightResponseDataInJson[0].scheduledFlights[j].sittingOptions[k].seatClass + "-" + flightResponseDataInJson[0].scheduledFlights[j].sittingOptions[k].seatSection + flightResponseDataInJson[0].scheduledFlights[j].sittingOptions[k].seatRow;
                    var tableBodyCell_priceRow = tr.insertCell(-1); tableBodyCell_priceRow.innerHTML = flightResponseDataInJson[0].scheduledFlights[j].sittingOptions[k].seatPrice;
                    tr = table.insertRow(-1);   
                }
            }
        }

        if (goodCities ==false){
            tr = table.insertRow(-1);
            var tableBodyCell_flightNumberRow = tr.insertCell(-1); tableBodyCell_flightNumberRow.innerHTML =  "No flights";
            var tableBodyCell_durationRow = tr.insertCell(-1); tableBodyCell_durationRow.innerHTML =  "-";
            var tableBodyCell_categoryRow = tr.insertCell(-1); tableBodyCell_categoryRow.innerHTML =  "-";
            var tableBodyCell_priceRow = tr.insertCell(-1); tableBodyCell_priceRow.innerHTML = "-";
        }
        var divContainer = document.getElementById("flightDataDiv");
        divContainer.innerHTML ="";
        append(divContainer,table);
}
