let reports = JSON.parse(localStorage.getItem("reports")) || [];
let div = document.getElementById("history");

if (reports.length === 0) {
  div.innerHTML = "No reports submitted yet.";
}

reports.forEach((r, i) => {
  div.innerHTML += `
    <p>
      <b>Report ${i + 1}</b><br>
      Village: ${r.village}<br>
      Symptom: ${r.symptom}<br>
      Water: ${r.water}<br>
      Time: ${new Date(r.time).toLocaleString()}
    </p>
    <hr>
  `;
});
