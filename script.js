const mapDiv = document.getElementById("map");
const getLocationBtn = document.getElementById("getLocationBtn");
const timezone = document.getElementById("timezone");
const lat = document.getElementById("lat");
const long = document.getElementById("long");
const offsetstd = document.getElementById("offsetstd");
const offsetstdseconds = document.getElementById("offsetstdseconds");
const offsetdts = document.getElementById("offsetdts");
const offsetdtsseconds = document.getElementById("offsetdtsseconds");
const country = document.getElementById("country");
const city = document.getElementById("city");
const postalcode = document.getElementById("postalcode");

const removeLocationBtn = document.getElementById("removeLocationBtn");
getLocationBtn.addEventListener("click", getLocation);
const latitude = localStorage.getItem("lat");
const longitude = localStorage.getItem("long");
const x = document.getElementById("demo");
function getLocation() {
  console.log("Navigator", navigator);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}
var loc = {};
function showPosition(position) {
  const address = document.getElementById("inputtext").value;

  if (address == "") {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);
    localStorage.setItem("lat", latitude);
    localStorage.setItem("long", longitude);
    const URL = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=c090f9290b7d460cade8dfa6137675b1`;
    console.log(URL);
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=c090f9290b7d460cade8dfa6137675b1`)
      .then((resp) => resp.json())
      .then((result) => {
        console.log(result);
        loc = result;
        console.log(loc.results[0]);
        timezone.innerHTML = loc.results[0].timezone.name;
        lat.innerHTML = loc.results[0].lat;
        long.innerHTML = loc.results[0].lon;
        offsetstd.innerHTML = loc.results[0].timezone.offset_STD;
        offsetstdseconds.innerHTML = loc.results[0].timezone.offset_STD_seconds;
        offsetdts.innerHTML = loc.results[0].timezone.offset_DST;
        offsetdtsseconds.innerHTML = loc.results[0].timezone.offset_DST_seconds;
        country.innerHTML = loc.results[0].country_code;
        postalcode.innerHTML = loc.results[0].postcode;
        city.innerHTML = loc.results[0].city;
      });
    //
    displayMap(latitude, longitude);
  } else {
      map.innerHTML = "";
      fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=c090f9290b7d460cade8dfa6137675b1`)
      .then((resp) => resp.json())
      .then((geocodingResult) => {
          console.log(geocodingResult);
          obj = geocodingResult;
          const nlat = obj.features[0].properties.lat;
          const nlon = obj.features[0].properties.lon;
          
          fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${nlat}&lon=${nlon}&format=json&apiKey=c090f9290b7d460cade8dfa6137675b1`)
          .then((resp) => resp.json())
          .then((result) => {
              console.log(result);
              loc = result;
              console.log(loc.results[0]);
              timezone.innerHTML = loc.results[0].timezone.name;
              lat.innerHTML = loc.results[0].lat;
              long.innerHTML = loc.results[0].lon;
              offsetstd.innerHTML = loc.results[0].timezone.offset_STD;
              offsetstdseconds.innerHTML = loc.results[0].timezone.offset_STD_seconds;
              offsetdts.innerHTML = loc.results[0].timezone.offset_DST;
              offsetdtsseconds.innerHTML = loc.results[0].timezone.offset_DST_seconds;
              country.innerHTML = loc.results[0].country_code;
              postalcode.innerHTML = loc.results[0].postcode;
              city.innerHTML = loc.results[0].city;
              x.innerHTML = "Latitude: " + nlat + "<br>Longitude: " + nlon;
            });
            //
            displayMap(nlat, nlon);
        });
    }
}
var obj = {};
function displayMap(latitude, longitude) {
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", mapUrl);
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "500");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "border:0");
    mapDiv.appendChild(iframe);
}
removeLocationBtn.addEventListener("click", () => {
    // remove latitude and longitude from local storage
    localStorage.removeItem("lat");
    localStorage.removeItem("long");
    // enable getLocation button and remove map
    getLocationBtn.disabled = false;
    mapDiv.innerHTML = "";
    x.innerHTML = "";
    timezone.innerHTML = '';
    lat.innerHTML = '';
    long.innerHTML = '';
    offsetstd.innerHTML = '';
    offsetstdseconds.innerHTML = '';
    offsetdts.innerHTML = '';
    offsetdtsseconds.innerHTML = '';
    country.innerHTML = '';
    postalcode.innerHTML = '';
    city.innerHTML = '';
});
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred.";
      break;
  }
}
console.log(latitude, longitude);
if (latitude && longitude) {
  //   getLocationBtn.disabled = true;
  displayMap(latitude, longitude);
}
