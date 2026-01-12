// Initialize map (India view)
var map = L.map('map').setView([22.9734, 78.6569], 5);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Load reports
let reports = JSON.parse(localStorage.getItem("reports")) || [];

// Temporary village coordinates (mock data)
let villageCoords = {
  "Village A": [28.61, 77.20],
  "Village B": [25.59, 85.13],
  "Village C": [19.07, 72.87]
};

// Plot reports
reports.forEach(r => {
  if (villageCoords[r.village]) {
    let color = (r.symptom === "Diarrhea") ? "red" : "green";

    L.circleMarker(villageCoords[r.village], {
      color: color,
      radius: 8
    })
    .addTo(map)
    .bindPopup(
      `<b>${r.village}</b><br>
       Symptom: ${r.symptom}<br>
       Water: ${r.water}`
    );
  }
});
