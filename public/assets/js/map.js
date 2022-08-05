const logo = document.querySelector('.navbar-brand img')
    
logo.src = 'assets/images/logo/deepcontrol_black_logo.png';
window.onscroll = function () {
    const header_navbar = document.querySelector(".navbar-area");
    const sticky = header_navbar.offsetTop;

    if (window.pageYOffset > sticky) {
      header_navbar.classList.add("sticky");
      logo.src = 'assets/images/logo/deepcontrol_black_logo.png';
    } else {
      header_navbar.classList.remove("sticky");
      logo.src = 'assets/images/logo/deepcontrol_black_logo.png';
    }
};

let apiLink = 'http://iot.deepsystem.space:8034/events-api?i=DCECC4D88E830095&limit=500';
let map;
let directionsService;
let directionsRenderer;
let startP;
let endP;

async function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setPanel(document.getElementById("sidebar"));
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.63966752, lng: 32.80661392 },
    zoom: 18,
  });
  directionsRenderer.setMap(map);

  const apiFetch = await fetch(apiLink, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
})

    const apiData = await apiFetch.json()

    let marker;
    let infowindow = new google.maps.InfoWindow();
    const classicIcon = '/assets/images/classic-marker.png'
    const destinationIcon = '/assets/images/destination-marker.png'
    const startIcon = '/assets/images/start-marker.png'

    for (const event of apiData.event) {
        const rxInfo = JSON.parse(event.rxInfo);

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(event.Latitude, event.Longitude),
            map: map,
            icon: classicIcon
          });

          google.maps.event.addListener(marker, 'click', function(){
            if(!startP){
                startP = { lat: event.Latitude, lng: event.Longitude }
                visitedStart = this;
                this.setIcon(startIcon)
            } else if (!endP && startP){
                endP = { lat: event.Latitude, lng: event.Longitude }
                visitedDest = this;
                this.setIcon(destinationIcon)
                displayRoute();
            }
            else if (endP && startP){
                visitedStart.setIcon(classicIcon)
                visitedDest.setIcon(classicIcon)
                endP = null;
                startP = { lat: event.Latitude, lng: event.Longitude }
                visitedStart = this
                this.setIcon(startIcon)
            }
        });
    }
  
  
}

window.initMap = initMap;

function displayRoute() {
        var start = startP
        var end =  endP
        console.log(start,end)
        var request = {
          origin: start,
          destination: end,
          travelMode: 'DRIVING'
        };
        directionsService.route(request, function(result, status) {
          if (status == 'OK') {
            directionsRenderer.setDirections(result);
          }
        });
}

let allShowing = true;

document.getElementById('navButtons').innerHTML += `
<div class="button home-btn">
<button id="sonNokta" class="btn">Sadece Son Noktayı Göster</button>
</div>
`
document.getElementById('sonNokta').addEventListener('click', function () {
    if(allShowing){
        apiLink = 'http://iot.deepsystem.space:8034/events-api?i=DCECC4D88E830095&limit=1'
        initMap();
        this.innerText = "Tüm Noktaları Göster"
        allShowing = false;
    } else {
        apiLink = 'http://iot.deepsystem.space:8034/events-api?i=DCECC4D88E830095&limit=500'
        initMap();
        this.innerText = "Sadece Son Noktayı Göster"
        allShowing = true;
    }
})
