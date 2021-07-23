var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();
var Sector = ["N","NNE","NNE","NE","NE","ENE","ENE","E","E","ESE","ESE","SE","SE","SSE","SSE","S","S","SSW","SSW","SW","SW","WSW","WSW","W","W","WNW","WNW","NW","NW","NNW","NNW","N"];

let loiArray = [];
let currentLocation = {lat:"",lng:""};
let npsApiKey = "71YJlvXLD5CwfW1xEAbx30SgczpxdaZPp5HVB1eL";
let openWeatherApiKey = "3212807212bfb01b6636f32077439307032f440";
// Open Layerts appears keyless 7E99AF3C-193D-4F89-8AA3-A799590CB89C


function gatherCampsites(){
    var searchStr = (document.querySelector("#searchTerm").value).toUpperCase();
 
    var apiUrl = 'https://developer.nps.gov/api/v1/campgrounds?stateCode=' + searchStr + '&api_key=71YJlvXLD5CwfW1xEAbx30SgczpxdaZPp5HVB1eL'
    fetch(apiUrl)
    .then(campSiteResponse => campSiteResponse.json())
    .then(campSiteResponse =>{
      console.log(campSiteResponse);
      var campsEl = document.getElementById("camp-list");
      while (campsEl.hasChildNodes()) {  
        campsEl.removeChild(campsEl.firstChild);
      };
      for (let i = 0; i < campSiteResponse.total; i++) {
        var campText = campSiteResponse.data[i].name;
        loiArray[i] = campSiteResponse.data[i].latLong;
        $('#camp-list').append(
            $('<li>').append(  
            $(document.createElement('button')).prop({
                type: 'button',
                innerHTML: campText,
                class: 'btn',
                id: campSiteResponse.data[i].id,
                // click: (this, specCampsites)
            })
            )      
        );
        var btn = document.getElementById(campSiteResponse.data[i].id);
        btn.addEventListener("click", specCampsites);
        };
    })
};


function specCampsites(){
    searchStr = this.id;
    var apiUrl = 'https://developer.nps.gov/api/v1/campgrounds?id=' + searchStr + '&api_key=71YJlvXLD5CwfW1xEAbx30SgczpxdaZPp5HVB1eL'
    fetch(apiUrl)
    .then(campSiteResponse => campSiteResponse.json())
    .then(campSiteResponse =>{
      console.log(campSiteResponse);
      })
      var api2Url = "https://api.openweathermap.org/data/2.5/onecall?lat="+campSiteResponse.data[0].latitude+"&lon="+campSiteResponse.data[0].longitude+"&exclude=minutely,hourly&appid=c6372f1324c78c2e38ccaa1ebef5b15c"
      fetch(api2Url)
      .then(weatherResponse => weatherResponse.json())
      .then(weatherResponse => {

        //setting 5 day forcast
        for (let i = 1; i < 6; i++) {
            document.querySelector("#Day"+i+"-temp").textContent = "Hi Temp: " + (((weatherResponse.daily[i].temp.max-273.15) * (9/5)) + 32).toFixed(2);
            document.querySelector("#Day"+i+"-wind").textContent = "Wind: " + Sector[(Math.round(weatherResponse.daily[i].wind_deg / 11.25))] + "@" + weatherResponse.daily[i].wind_speed.toFixed(0);
            document.querySelector("#Day"+i+"-hum").textContent = "Humidity: " + weatherResponse.daily[i].humidity;
            document.querySelector("#Day"+i+"-icon").src="http://openweathermap.org/img/wn/" + weatherResponse.daily[i].weather[0].icon + "@2x.png";
        };
      });
};






        //Error catch and warning
        // .catch(function() {
        //   searchStr = '';
        //   document.querySelector("#searchTerm").value = "";
        //   searchedCities = JSON.parse(localStorage.getItem("searchedCities"));
        //   let popped = searchedCities.pop();
        //   localStorage.setItem("searchedCities" , JSON.stringify(searchedCities));
        //   console.log("error");
        //   document.querySelector("#submit-search").textContent = "City Not Found";
        //   document.querySelector("#submit-search").style.backgroundColor = "red";
        //   loadCities();
        //   window.setTimeout(resetSubmitButton, 3000); 
        // });