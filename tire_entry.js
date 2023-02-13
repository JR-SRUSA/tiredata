const timeControl = document.querySelector('#time'),
  selectRider = document.querySelector('#selRider'),
  selectClass = document.querySelector('#selClass'),
  inputRiderNum = document.querySelector('#inptRiderNum')
;
var now = new Date(Date.now()),
  nowHHMM = now.toTimeString().slice(0,5),
  riderList = {};

timeControl.value = nowHHMM;

/**
  Adds the 'raceClass' to the race class select dropdown
*/
function addRaceClassToSelect(raceClass) {
  var opt = document.createElement('option')
  opt.value = raceClass
  opt.innerHTML = raceClass

  selectClass.appendChild(opt);
}

/**
  Adds the 'rider' to the rider select dropdown
*/
function addRiderToSelect(rider) {
  var opt = document.createElement('option')
  opt.value = rider['number']
  opt.innerHTML = rider['number'] + ' ' + rider['name']

  selectRider.appendChild(opt);
}

function clearRiderSelect() {
  while (selectRider.length > 0) {
    selectRider.remove(selectRider.length-1);
  }

  // Add the 'blank' option
  var opt = document.createElement('option')
  selectRider.appendChild(opt);
}

// Get Riders List
fetch('riders.json')
  .then(response => response.json())
  .then(data => {
    riderList = data;

    var raceClasses = Object.keys(riderList)
    for (var raceClass of raceClasses) {
      addRaceClassToSelect(raceClass);
      var classData = riderList[raceClass];
      for (var dtaRow of classData) {
        addRiderToSelect(dtaRow);
      }
    }
  });

// Turn off rider number free entry if rider is selected from dropdown
selectRider.addEventListener('change', e => {
  if (e.target.value !== '') {
    inputRiderNum.disabled = true;
  } else {
    inputRiderNum.disabled = false;
  }
})

function filterRiderListByClass(className) {
  var riders = riderList[className];
  console.log(riders)
  clearRiderSelect();
  for (var rider of riders) {
    addRiderToSelect(rider);
  }
}

// Filter Rider list by selected class
selectClass.addEventListener('change', e => {
  if (e.target.value !== '') {
    filterRiderListByClass(e.target.value)
  } else {

  }
})

class TireData extends HTMLElement {
  constructor() {
    super();
    let template = document.querySelector('#tireData'),
      templateData = template.content;

    const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(templateData.cloneNode(true));

  }

  connectedCallback() {
    let cameraFileInput = this.shadowRoot.querySelector('#cameraFileInput');
    cameraFileInput.addEventListener('change', e => {
      let pictureDisplay = this.shadowRoot.querySelector('#pictureFromCamera'),
        imageInput = this.shadowRoot.querySelector;
      pictureDisplay.setAttribute("src", window.URL.createObjectURL(cameraFileInput.files[0]));
    })
  }
}
customElements.define("tire-data", TireData);

