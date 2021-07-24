var day = (moment().format("DDDDYYYY"));
var dayInc = 0;
var hour = moment().hours();
var Sector = ["N","NNE","NNE","NE","NE","ENE","ENE","E","E","ESE","ESE","SE","SE","SSE","SSE","S","S","SSW","SSW","SW","SW","WSW","WSW","W","W","WNW","WNW","NW","NW","NNW","NNW","N"];

let loiArray = [];
let currentLocation = {lat:"",lng:""};
let npsApiKey = "71YJlvXLD5CwfW1xEAbx30SgczpxdaZPp5HVB1eL";
let openWeatherApiKey = "c6372f1324c78c2e38ccaa1ebef5b15c";
let searchPage = 0;
let searchLimit = 50;
// Open Layerts appears keyless 


function gatherCampsites(){
    var searchStr = (document.querySelector("#searchTerm").value).toUpperCase();
    var apiUrl = "https://developer.nps.gov/api/v1/campgrounds?stateCode=" + searchStr + "&api_key=" + npsApiKey + "&start=" + searchPage + "&limit=" + searchLimit;
    fetch(apiUrl)
    .then(campSiteResponse => campSiteResponse.json())
    .then(campSiteResponse =>{
      console.log(campSiteResponse);
      var campsEl = document.getElementById("camp-list");
      while (campsEl.hasChildNodes()) {  
        campsEl.removeChild(campsEl.firstChild);
      };

      // if (campSiteResponse.total < (searchPage + searchLimit)){
      //   var buttonLimit = (searchPage + searchLimit) - campSiteResponse.total
      // }else{
      //   var buttonLimit = searchLimit 
      // }
      for (let i = 0; i < campSiteResponse.data.length; i++) {
        var campText = campSiteResponse.data[i].name;
        if (campSiteResponse.data[i].latLong){
          loiArray[i] = campSiteResponse.data[i].latLong;
          var btnColor = "btn";
        }else{
          var btnColor = "btn-error"
        }
        $('#camp-list').append(
            $('<li>').append(  
            $(document.createElement('button')).prop({
                type: 'button',
                innerHTML: campText,
                class: btnColor,
                id: campSiteResponse.data[i].id,
                // click: (this, specCampsites)
            })
            )      
        );
        var btn = document.getElementById(campSiteResponse.data[i].id);
        btn.addEventListener("click", specCampsites);
      };
      if (campSiteResponse.total > (searchPage + searchLimit)){
        btnColor = "btn-next";
        $('#camp-list').append(
          $('<li>').append(  
          $(document.createElement('button')).prop({
              type: 'button',
              innerHTML: "NEXT PAGE",
              class: btnColor,
              id: "NEXT-PAGE",
              // click: (this, specCampsites)
            })
          )
        )
        var btn = document.getElementById("NEXT-PAGE");
        btn.addEventListener("click", nextPage);
      };
      if (searchPage >= searchLimit){
        btnColor = "btn-prev";
        $('#camp-list').append(
          $('<li>').append(  
          $(document.createElement('button')).prop({
              type: 'button',
              innerHTML: "PREV PAGE",
              class: btnColor,
              id: "PREV-PAGE",
              // click: (this, specCampsites)
            })
          )
        )
        var btn = document.getElementById("PREV-PAGE");
        btn.addEventListener("click", prevPage);
      };
    })
};

function nextPage(){
  searchPage = searchPage + searchLimit;
  gatherCampsites();
};

function prevPage(){
  searchPage = searchPage - searchLimit;
  gatherCampsites();
};

function specCampsites(){
    searchStr = this.id;
    var apiUrl = "https://developer.nps.gov/api/v1/campgrounds?id=" + searchStr + "&api_key=" + npsApiKey;
    fetch(apiUrl)
    .then(campSiteResponse => campSiteResponse.json())
    .then(campSiteResponse =>{
      console.log(campSiteResponse)
      var api2Url = "https://api.openweathermap.org/data/2.5/onecall?lat="+campSiteResponse.data[0].latitude+"&lon="+campSiteResponse.data[0].longitude+"&exclude=minutely,hourly&appid=" +  openWeatherApiKey;
      fetch(api2Url)
      .then(weatherResponse => weatherResponse.json())
      .then(weatherResponse => {
        console.log(weatherResponse)
        //setting 5 day forcast
        currentLocation = {lat:campSiteResponse.data[0].latitude,lng:campSiteResponse.data[0].longitude};
        updateMap(); 
        for (let i = 1; i < 6; i++) {
            document.querySelector("#Day"+i+"-temp").textContent = "Hi Temp: " + (((weatherResponse.daily[i].temp.max-273.15) * (9/5)) + 32).toFixed(2);
            document.querySelector("#Day"+i+"-wind").textContent = "Wind: " + Sector[(Math.round(weatherResponse.daily[i].wind_deg / 11.25))] + "@" + weatherResponse.daily[i].wind_speed.toFixed(0);
            document.querySelector("#Day"+i+"-hum").textContent = "Humidity: " + weatherResponse.daily[i].humidity;
            document.querySelector("#Day"+i+"-icon").src="http://openweathermap.org/img/wn/" + weatherResponse.daily[i].weather[0].icon + "@2x.png";
        };
      });
    });
};

function updateMap(){
  var mapEl = document.getElementById("map");
  while (mapEl.hasChildNodes()) {  
    mapEl.removeChild(mapEl.firstChild);
  };

  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([parseFloat(currentLocation.lng), parseFloat(currentLocation.lat)]),
      zoom: 15
    })
  });
};

