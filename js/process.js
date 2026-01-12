function getCleanEvents() {
  let raw =
    JSON.parse(localStorage.getItem("raw_events")) || [];

  let seen = new Set();
  let clean = [];

  raw.forEach(e => {
    let key =
      e.payload.village +
      e.payload.symptom +
      e.payload.time;

    // Deduplication logic
    if (!seen.has(key)) {
      seen.add(key);

      clean.push({
        village: e.payload.village,
        symptom: e.payload.symptom,
        severity: e.payload.severity,
        water: e.payload.water,
        event_time: e.payload.time,
        processed_at: new Date().toISOString()
      });
    }
  });

  return clean;
}
function aggregateByVillage() {
  let events = getCleanEvents();
  let agg = {};

  events.forEach(e => {
    if (!agg[e.village]) {
      agg[e.village] = {
        total_cases: 0,
        severe_cases: 0
      };
    }

    agg[e.village].total_cases++;

    if (e.severity === "Severe") {
      agg[e.village].severe_cases++;
    }
  });

  return agg;
}
