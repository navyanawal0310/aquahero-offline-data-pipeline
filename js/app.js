document.getElementById("reportForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let report = {
    village: document.getElementById("village").value,
    symptom: document.getElementById("symptom").value,
    water: document.getElementById("water").value,
    time: new Date().toISOString()
  };

  let rawEvents =
  JSON.parse(localStorage.getItem("raw_events")) || [];

  rawEvents.push({
    event_id: Date.now(),          // unique event
    source: "citizen",             // future-proofing
    payload: report,               // raw payload
    ingested_at: new Date().toISOString()
  });

  localStorage.setItem("raw_events", JSON.stringify(rawEvents));


  document.getElementById("status").innerText =
    "Saved locally. Will sync when online.";

  this.reset();
});
