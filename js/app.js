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
    time: new Date().toISOString()
  };

  const reports = getReports();
  reports.push(report);
  saveReports(reports);

  status.innerText = "✅ Report saved locally";

  form.reset();
});
