const form = document.getElementById("reportForm");
const status = document.getElementById("status");

function getReports() {
  return JSON.parse(localStorage.getItem("reports") || "[]");
}

function saveReports(reports) {
  localStorage.setItem("reports", JSON.stringify(reports));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const report = {
    village: document.getElementById("village").value,
    symptom: document.getElementById("symptom").value,
    water: document.getElementById("water").value,
    severity: document.getElementById("severity").value,
    time: new Date().toISOString()
    
  };

// Save locally (offline-first)
const reports = getReports();
reports.push(report);
saveReports(reports);

// 🔥 Save to Firebase cloud
db.collection("reports").add(report)
  .then(() => {
    console.log("Saved to Firebase");
    status.innerText = "✅ Report saved locally & to cloud";
  })
  .catch(err => {
    console.error("Firebase error:", err);
    status.innerText = "⚠ Saved locally, cloud sync failed";
  });

// Reset form
form.reset();

});
