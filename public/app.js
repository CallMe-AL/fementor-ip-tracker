const searchInput = document.getElementById('search-ip');
const searchBtn = document.querySelector('.search-btn');

let searchValue = '';
let MAP_KEY = '';

// testing
// let url = 'http://localhost:3001'; 

// development
let url = 'https://fementor-ip-tracker.herokuapp.com';

// **************
// input code
// **************
searchInput.addEventListener('change', (e) => {
  searchValue = e.target.value.trim();
  
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (searchValue === '') return;

  // spaces apart search by period, then tests if the string can be converted to a number
  // possible flaw: rare ips that have characters
  let tempVal = searchValue.replaceAll('.', ' ');

  if (isNaN(parseInt(tempVal))) {
    let tempVal = {
      ip: false,
      value: searchValue
    }

    searchValue = tempVal;
  } else {
    let tempVal = {
      ip: true,
      value: searchValue
    }

    searchValue = tempVal;
  }

  searchForInput(searchValue);

  // another solution: split apart by period, then test if the array length is equal to four
  // maybe less efficient: what if domain has a lot of decimals?
  // 
  // if (searchValue.split('.').length === 4) {
  //   let tempVal = {
  //     ip: true,
  //     value: searchValue
  //   }

  //   searchValue = tempVal;
  // } else {
  //   let tempVal = {
  //     ip: false,
  //     value: searchValue
  //   }

  //   searchValue = tempVal;
  // }

  // console.log('value: ', searchValue);
});

// **************
// ipify code
// **************
const searchForInput = (input) => {
  if (input.ip) {
    const ip = `ipAddress=${input.value}`;
    fetch(`${url}/server/ip?${ip}`)
      .then(res => res.json())
      .then(data => {
        const obj = JSON.parse(data.body);
        MAP_KEY = data.mapKey;
        updateText(obj);
        updateMap(obj);   
      })
      .catch(err => console.log(err))
  } else {
    const domain = `domain=${input.value}`;
    fetch(`${url}/server/domain?${domain}`)
      .then(res => res.json())
      .then(data => {
        const obj = JSON.parse(data.body);
        MAP_KEY = data.mapKey;
        updateText(obj);
        updateMap(obj);        
      })
      .catch(err => console.log(err))
  }
}

const updateText = (info) => {
  const ipText = document.querySelector('.ip-text');
  const locationText = document.querySelector('.location-text');
  const timezoneText = document.querySelector('.timezone-text');
  const ispText = document.querySelector('.isp-text');

  ipText.textContent = info.ip;
  locationText.textContent = `${info.location.city}, ${info.location.region} ${info.location.postalCode}`;
  timezoneText.textContent = 'UTC ' + info.location.timezone;
  ispText.textContent = info.isp;
}

// // **************
// // leaflet code
// // **************
let map = null;

const updateMap = (data) => {
  if (map) {
    map.remove();
  }

  map = L.map('map').setView([data.location.lat, data.location.lng], 10);

  // creating icon
  const iconArrow = L.icon({
    iconUrl: 'images/icon-location.svg',

    iconSize: [46, 56]
  });

  // creating tile  
  // ********************
  // ADD URL RESTRICTIONS
  // ********************
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a  contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: MAP_KEY
    }).addTo(map);
  
  

  // adding marker
  const marker = L.marker([data.location.lat, data.location.lng], {icon: iconArrow}).addTo(map);
  // change to location?*********
  marker.bindPopup(`<b>${searchValue.value ? searchValue.value : searchValue.ip}</b><br>Here be things.`).openPopup();
}


window.addEventListener('load', () => {
  fetch(`${url}/server/ip?ipAddress`)
      .then(res => res.json())
      .then(data => {
        // save mapkey to MAP_KEY variable
        MAP_KEY = data.mapKey;
        // then parse the rest of the body
        data = JSON.parse(data.body);        
        searchValue = data;
        updateText(searchValue);
        updateMap(searchValue);
      })
      .catch(err => console.log(err));
});