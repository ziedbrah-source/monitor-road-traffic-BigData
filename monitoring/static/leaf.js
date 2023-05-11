var map = L.map('mapid').setView([36.8065, 10.1815], 13);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osm.addTo(map);

var source = new EventSource('/topic/my-topic'); 
source.addEventListener('message', function(e){

  console.log('Message');
  obj = JSON.parse(e.data);
  console.log(obj);

  if(obj && obj.sessionId){
    trackers.set(obj.sessionId,obj)
    //if alert dislay it
    if(obj.alert == "true"){
      showAlert("the car with session id " + obj.sessionId+ " passed the limit with speed "+ obj.speed) ;
    }
  }
}, false);



var isPaused = false ;
var trackers = new Map();
    

if(!navigator.geolocation) {
  console.log("Your browser doesn't support geolocation feature!")
} else {
  setInterval(() => {
     // navigator.geolocation.getCurrentPosition(getPosition)
     if(!isPaused){
          clearMap();
          displayPositions() ;
          updatePositions() ;
     }
  }, 1000);
}


function displayPositions(){
  // const tunisCityMarker = L.marker([tunisBaseCords.latitude,tunisBaseCords.longitude], {
  //     }).addTo(map);
  //     tunisCityMarker.bindPopup('<h2>Tunis</h2>');
  trackers.forEach((value, key) => {
  if(value){
      const marker2 = L.marker([value.latitude,value.longitude], {
          
          // icon: L.icon({
          // iconUrl: './car.png',
          // iconSize: [32, 32],
          // iconAnchor: [16, 16],
          // popupAnchor: [0, -16]
          // })
      }).addTo(map);
      marker2.bindPopup('<h2>Hello World!</h2><p>Speed : '+ value.speed+'</p>');
  }

  });
}

function clearMap(){
  map.eachLayer((layer) => {
  if (layer instanceof L.Marker || layer instanceof L.Path) {
      map.removeLayer(layer);
  }
  });
}

function updatePositions(){

}
function pause(){
  isPaused = true ;
}
function continu(){
  isPaused = false ;
}

function showAlert(msg) {
  // Create the alert element
  var alertElement = document.createElement('div');
  const leftDivElement = document.getElementById('right');
  alertElement.className = 'alert';
  alertElement.textContent = msg;

  // Append the alert element to the body
  leftDivElement.appendChild(alertElement);
}

function pause(){
  isPaused = true ;
}
function continu(){
  isPaused = false ;
}