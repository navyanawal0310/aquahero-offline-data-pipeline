// ---------- STORAGE ----------
function getReports() {
  return JSON.parse(localStorage.getItem("reports") || "[]");
}

// ---------- ALERT RULE ----------
function generateAlerts(reports) {
  const alerts = [];
  const now = new Date();
  const grouped = {};

  reports.forEach(r => {
    const key = r.village + "_" + r.symptom;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  Object.keys(grouped).forEach(key => {
    const recent = grouped[key].filter(r => {
      const diff = (now - new Date(r.time)) / (1000 * 60 * 60);
      return diff <= 24;
    });

    if (recent.length >= 3) {
      const [village, symptom] = key.split("_");

      alerts.push({
        village,
        symptom,
        count: recent.length
      });
    }
  });

  return alerts;
}

// ---------- NOTIFICATION ----------
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}

function sendNotification(alert) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("🚨 Aquahero Outbreak Alert", {
      body: `${alert.symptom} rising in ${alert.village} (${alert.count} cases)`,
      icon: "https://cdn-icons-png.flaticon.com/512/564/564619.png"
    });
  }
}

// ---------- SHOW ALERTS ----------
function showAlerts() {
  const container = document.getElementById("alerts");
  const reports = getReports();
  const alerts = generateAlerts(reports);

  if (alerts.length === 0) {
    container.innerHTML = "<p>No active alerts.</p>";
    return;
  }

  container.innerHTML = alerts.map(a => `
    <div style="border:2px solid red;padding:12px;margin:10px 0;background:#ffe5e5;">
      🚨 <b>Outbreak Alert</b><br>
      Village: ${a.village}<br>
      Symptom: ${a.symptom}<br>
      Cases in 24 hrs: <b>${a.count}</b>
    </div>
  `).join("");

  sendNotification(alerts[0]);
}

// ---------- CHART DATA ----------
function getCasesPerVillage(reports) {
  const counts = {};

  reports.forEach(r => {
    counts[r.village] = (counts[r.village] || 0) + 1;
  });

  return counts;
}

// ---------- DRAW CHART ----------
function drawChart() {
  const reports = getReports();
  const data = getCasesPerVillage(reports);

  const villages = Object.keys(data);
  const counts = Object.values(data);

  const ctx = document.getElementById("casesChart");

  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: villages,
      datasets: [{
        label: "Reported Cases",
        data: counts
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ---------- INIT ----------
requestNotificationPermission();
showAlerts();
drawChart();
// ---------- CSV EXPORT ----------
function exportCSV() {
  const reports = getReports();

  if (reports.length === 0) {
    alert("No data to export.");
    return;
  }

  const header = ["Village", "Symptom", "Water Quality", "Time"];
  const rows = reports.map(r => [
    r.village,
    r.symptom,
    r.water,
    new Date(r.time).toLocaleString()
  ]);

  let csvContent =
    "data:text/csv;charset=utf-8," +
    [header, ...rows].map(e => e.join(",")).join("\n");

  const link = document.createElement("a");
  link.setAttribute("href", encodeURI(csvContent));
  link.setAttribute("download", "aquahero_reports.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
}

