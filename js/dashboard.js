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

// ---------- LIVE OUTBREAKS FROM FLASK ----------
async function loadLiveOutbreaks() {
  const container = document.getElementById("alerts");

  if (!container) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/outbreaks");
    const data = await res.json();

    if (!data || data.length === 0) {
      container.innerHTML = "<p>No outbreak data available.</p>";
      return;
    }

    container.innerHTML = data.map(o => `
      <div style="
        border:2px solid ${o.status === "outbreak" ? "red" : "green"};
        padding:12px;
        margin:12px 0;
        background:${o.status === "outbreak" ? "#ffe5e5" : "#e5ffe5"};
        border-radius:8px;
      ">
        <b>${o.village}</b> — ${o.symptom}<br>
        Cases (last 24h): ${o.recent_cases}<br>
        Status: <b>${o.status.toUpperCase()}</b>
      </div>
    `).join("");

  } catch (err) {
    container.innerHTML = "<p>⚠ Unable to connect to live analytics API.</p>";
    console.error("Live dashboard error:", err);
  }
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

function clearData() {
  if (!confirm("Are you sure you want to delete all reports?")) return;

  localStorage.removeItem("reports");
  alert("All data cleared. Start fresh logging.");
  location.reload();
}
function showRecentActivity() {
  const container = document.getElementById("recentActivity");
  const reports = getReports();

  if (!container) return;

  const recent = reports
    .slice()
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = "<p>No recent activity.</p>";
    return;
  }

  container.innerHTML = recent.map(r => `
    <div style="border-left:4px solid #007bff;padding:6px;margin:6px 0;">
      📍 ${r.village} — ${r.symptom}  
      <br>
      ⏱ ${new Date(r.time).toLocaleTimeString()}
    </div>
  `).join("");
}

// ---------- INIT ----------
requestNotificationPermission();
loadLiveOutbreaks();
drawChart();
showRecentActivity();
setInterval(loadLiveOutbreaks, 10000);

