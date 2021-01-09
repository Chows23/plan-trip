import regeneratorRuntime from "regenerator-runtime";

const originForm = document.querySelector('.origin-form');
const destinationForm = document.querySelector('.destination-form');
const input = document.querySelector('input');
const desInput = document.querySelector('.desInput');

const originsList = document.querySelector('.origins');
const destinationsList = document.querySelector('.destinations');

const planTrip = document.querySelector('.plan-trip');
const myTrip = document.querySelector('.my-trip');

let originsDataLong, originsDataLat;
let destinationDataLong, destinationDataLat;

function getStartLocation(search_text) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?bbox=-97.325875,49.766204,-96.953987,49.99275&limit=10&access_token=pk.eyJ1IjoiY2hvd3MyMyIsImEiOiJja2pmZ3NudjEyNXo0MnluMDBmMnZyeWR4In0.7uCSt7JWoiQmAHMjQy7nyg
  `).then(response => {
    response.json().then(data => {
      createStartLocation(data.features)
    })
  })
}

function getDestination(search_text) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search_text}.json?bbox=-97.325875,49.766204,-96.953987,49.99275&limit=10&access_token=pk.eyJ1IjoiY2hvd3MyMyIsImEiOiJja2pmZ3NudjEyNXo0MnluMDBmMnZyeWR4In0.7uCSt7JWoiQmAHMjQy7nyg
  `).then(response => {
    response.json().then(data => {
      createDestination(data.features)
    })
  })
}

function createStartLocation(data) {
  originsList.innerHTML = '';
  if (data.length !== 0) {
    for (const value in data) {
      let coords = data[value].center;
      originsList.insertAdjacentHTML('beforeend',
        `<li data-long="${coords[0]}" data-lat="${coords[1]}" class="">
        <div class="name">${data[value].text}</div>
        <div>${data[value].properties.address}</div>
      </li>
      `)
    }
  } else {
    console.log('no data');
    originsList.insertAdjacentHTML('beforeend',
      `<li>
        <div>No search result found</div>
      </li>
    `)
  }
}

function createDestination(data) {
  destinationsList.innerHTML = '';
  if (data.length !== 0) {
    for (const value in data) {
      let coords = data[value].center;
      destinationsList.insertAdjacentHTML('beforeend',
        `<li data-long="${coords[0]}" data-lat="${coords[1]}" class="">
          <div class="name">${data[value].text}</div>
          <div>${data[value].properties.address}</div>
        </li>
      `)
    }
  } else {
    destinationsList.insertAdjacentHTML('beforeend',
      `<li>
        <div>No search result found</div>
      </li>
    `)
  }
}

async function getDataType() {
  const res1 = await fetch(`https://api.winnipegtransit.com/v3/locations.json?api-key=daPa_bqWLDUioW-C3Jr6&lat=${originsDataLat}&lon=${originsDataLong}&max-results=1`)
  const data1 = await res1.json();
  const originData = data1.locations[0];

  const res2 = await fetch(`https://api.winnipegtransit.com/v3/locations.json?api-key=daPa_bqWLDUioW-C3Jr6&lat=${destinationDataLat}&lon=${destinationDataLong}&max-results=1`)
  const data2 = await res2.json();
  const destinationData = data2.locations[0];

  getPlannedTrip(originData.type, originData.key, destinationData.type, destinationData.key)
}

function getPlannedTrip(originType, originKey, destinationType, destinationKey) {

  originType = originType == 'address' ? originType + 'es' : originType + 's';
  destinationType = destinationType == 'address' ? destinationType + 'es' : destinationType + 's';

  if (originType !== destinationType && originKey !== destinationKey) {
    fetch(`https://api.winnipegtransit.com/v3/trip-planner.json?api-key=daPa_bqWLDUioW-C3Jr6&origin=${originType}/${originKey}&destination=${destinationType}/${destinationKey}`)
      .then(response => {
        response.json().then(data => {
          // console.log(data);
          data.plans[0].segments.map(segment => {
            createPlannedTrip(segment)
          })
        })
      })
  } else {
    createNoResultTrip()
  }
}

function createNoResultTrip() {
  if (originsDataLong == undefined) {
    myTrip.insertAdjacentHTML('beforeend',
      `<li>
      You did not selected a start place.
      </li>
      `)
  } else if (destinationDataLong == undefined) {
    myTrip.insertAdjacentHTML('beforeend',
      `<li>
      You did not select a destination.
      </li>
      `)
  } else if (originsDataLong == destinationDataLong) {
    myTrip.insertAdjacentHTML('beforeend',
      `<li>
        There are same place !
      </li>
      `)
  }
}

function createPlannedTrip(data) {
  if (data.type == 'walk') {
    myTrip.insertAdjacentHTML('beforeend',
      `<li>
        <i class="fas fa-walking" aria-hidden="true"></i>Walk for ${data.times.durations.total} ${data.times.durations.total !== 1 ? 'minutes' : 'minute'}
        to ${data.to.destination !== undefined ? 'your destination' : `stop #${data.to.stop.key} - ${data.to.stop.name}`}
      </li>
      `)
  } else if (data.type == 'ride') {
    myTrip.insertAdjacentHTML('beforeend',
      `<li>
        <i class="fas fa-bus" aria-hidden="true"></i>Ride the ${data.route.name} for ${data.times.durations.total} ${data.times.durations.total !== 1 ? 'minutes' : 'minute'}.
      </li>
      `)
  } else if (data.type == 'transfer') {
    myTrip.insertAdjacentHTML('beforeend',
      `<li>
        <i class="fas fa-ticket-alt" aria-hidden="true"></i>Transfer from stop
        #${data.from.stop.key} - ${data.from.stop.name} to stop #${data.to.stop.key} - ${data.to.stop.name}
      </li>
      `)
  }
}

originForm.addEventListener('submit', function (e) {
  e.preventDefault();
  getStartLocation(input.value);
});

destinationForm.addEventListener('submit', function (e) {
  e.preventDefault();
  getDestination(desInput.value);
});

originsList.addEventListener('click', e => {
  if (e.target.tagName === 'LI' || e.target.tagName === 'DIV') {
    const selected = document.querySelector('.origins .selected');
    if (selected) {
      selected.classList.remove('selected')
    }
    e.target.closest('li').classList.add('selected');

    originsDataLat = e.target.closest('li').getAttribute('data-lat');
    originsDataLong = e.target.closest('li').getAttribute('data-long');
  }
});

destinationsList.addEventListener('click', e => {
  if (e.target.tagName === 'LI' || e.target.tagName === 'DIV') {
    const selected = document.querySelector('.destinations .selected');
    if (selected) {
      selected.classList.remove('selected')
    }
    e.target.closest('li').classList.add('selected');

    destinationDataLat = e.target.closest('li').getAttribute('data-lat');
    destinationDataLong = e.target.closest('li').getAttribute('data-long');
  }
});

planTrip.addEventListener('click', e => {
  myTrip.innerHTML = '';
  if (originsDataLong !== undefined && destinationDataLong !== undefined) {
    e.preventDefault();
    getDataType();
  } else {
    createNoResultTrip();
  }
})
