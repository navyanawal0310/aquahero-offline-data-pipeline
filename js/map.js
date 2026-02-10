// Initialize map
const map = L.map('map').setView([20.5937, 78.9629], 5); // India center

// Load map tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Get reports from localStorage
function getReports() {
  return JSON.parse(localStorage.getItem("reports") || "[]");
}

// Generate outbreak alerts (same logic as dashboard)
function getOutbreakVillages(reports) {
  const now = new Date();
  const grouped = {};

  reports.forEach(r => {
    const key = r.village + "_" + r.symptom;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  const outbreakVillages = new Set();

  Object.keys(grouped).forEach(key => {
    const recent = grouped[key].filter(r => {
      const diff = (now - new Date(r.time)) / (1000 * 60 * 60);
      return diff <= 24;
    });

    if (recent.length >= 3) {
      const [village] = key.split("_");
      outbreakVillages.add(village);
    }
  });

  return outbreakVillages;
}

// Dummy coordinates for villages (prototype only)
const villageCoords = {
  "VillageA": [28.6, 77.2],
  "VillageB": [19.0, 72.8],
  "VillageC": [13.0, 80.2]
};

// Show markers
function showMarkers() {
  const reports = getReports();
  const outbreakVillages = getOutbreakVillages(reports);

  Object.keys(villageCoords).forEach(village => {
    const coords = villageCoords[village];

    const isAlert = outbreakVillages.has(village);

    const marker = L.circleMarker(coords, {
      radius: 10,
      color: isAlert ? "red" : "green",
      fillOpacity: 0.7
    }).addTo(map);

    marker.bindPopup(`
      <b>${village}</b><br>
      Status: ${isAlert ? "🚨 Outbreak detected" : "Normal"}
    `);
  });
}

showMarkers();
