let agg = aggregateByVillage();
let alertsDiv = document.getElementById("alerts");

alertsDiv.innerHTML = "";

for (let village in agg) {
  let data = agg[village];

  if (data.severe_cases >= 2) {
    alertsDiv.innerHTML += `
      <div class="alert-high">
        🚨 <b>${village}</b><br>
        Severe Cases: ${data.severe_cases}<br>
        Total Cases: ${data.total_cases}
      </div>
    `;
  }
}

if (alertsDiv.innerHTML === "") {
  alertsDiv.innerHTML =
    "<div class='alert-normal'>No alerts currently</div>";
}


let alertsDiv = document.getElementById("alerts");

for (let village in count) {
  if (count[village] >= 3) {
    alertsDiv.innerHTML += `
      <p style="color:red;">
      ⚠ Alert: Possible outbreak in <b>${village}</b>
      </p>`;
  }
}

if (alertsDiv.innerHTML === "") {
  alertsDiv.innerHTML = "No alerts currently";
}
