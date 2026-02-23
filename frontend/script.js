let wrongGuesses = 0;

let locationData = {
continent:"Asia",
country:"India",
state:"Tamil Nadu",
city:"Chennai",
lat:13.0827,
lng:80.2707
};

function submitGuess(){

let guess = document.getElementById("guessInput").value.toLowerCase();
let log = document.getElementById("gameLog");

if(guess === locationData.city.toLowerCase()){

log.innerHTML += "<li>🎉 Correct Guess! You found the city!</li>";
alert("Correct! You found the city!");

}
else{

wrongGuesses++;

log.innerHTML += "<li>❌ Wrong guess: "+guess+"</li>";

revealHint();

}

document.getElementById("guessInput").value="";
}

function revealHint(){

if(wrongGuesses==1)
document.getElementById("continent").innerText=locationData.continent;

else if(wrongGuesses==2)
document.getElementById("country").innerText=locationData.country;

else if(wrongGuesses==3)
document.getElementById("state").innerText=locationData.state;

else if(wrongGuesses==4)
document.getElementById("city").innerText=locationData.city;

}


// Initialize map
var map = L.map('map').setView([20,0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© OpenStreetMap contributors'
}).addTo(map);

var marker;


// Distance calculation (Haversine formula)
function getDistance(lat1, lon1, lat2, lon2){

const R = 6371;

const dLat = (lat2-lat1) * Math.PI/180;
const dLon = (lon2-lon1) * Math.PI/180;

const a =
Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(lat1*Math.PI/180) *
Math.cos(lat2*Math.PI/180) *
Math.sin(dLon/2) *
Math.sin(dLon/2);

const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

return R * c;

}


// Map click event
map.on('click', function(e){

if(marker){
map.removeLayer(marker);
}

marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);

let distance = getDistance(
e.latlng.lat,
e.latlng.lng,
locationData.lat,
locationData.lng
);

showDistanceHint(distance);

});


// Show distance hint
function showDistanceHint(distance){

let log = document.getElementById("gameLog");

if(distance < 100){

log.innerHTML += "<li>🎯 Very Hot! Only "+Math.round(distance)+" km away</li>";

}

else if(distance < 500){

log.innerHTML += "<li>🔥 Hot! "+Math.round(distance)+" km away</li>";

}

else if(distance < 1500){

log.innerHTML += "<li>🌤 Warm! "+Math.round(distance)+" km away</li>";

}

else{

log.innerHTML += "<li>❄ Cold! "+Math.round(distance)+" km away</li>";

}

}