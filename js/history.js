function getReports() {
  return JSON.parse(localStorage.getItem("reports") || "[]");
}

function showHistory() {
  const container = document.getElementById("history");
  const reports = getReports();

  if (reports.length === 0) {
    container.innerHTML = "<p>No reports submitted yet.</p>";
    return;
  }

  container.innerHTML = reports.map(r => `
    <div style="border:1px solid #ccc;padding:8px;margin:8px 0;">
      📍 Village: ${r.village}<br>
      🤒 Symptom: ${r.symptom}<br>
      💧 Water: ${r.water}<br>
      ⏱ Time: ${new Date(r.time).toLocaleString()}
    </div>
  `).join("");
}

showHistory();
