const API_URL =
  "https://script.google.com/macros/s/AKfycbzAbPL1C-vvuLQPPiLfV_6QJGu8uOH8e_fRLugrvdpvL0CsMyxHlYklBkOsmS_8H15n/exec";

const JUDGE_KEY =
  new URLSearchParams(
    window.location.search
  ).get("judgeKey");

if (!JUDGE_KEY) {

  document.body.innerHTML =
    "<h1 style='font-family:Arial;text-align:center;margin-top:50px;'>Unauthorised</h1>";

  throw new Error(
    "Missing judge key."
  );

}

let currentSport = "";
let currentLevel = "";
let currentRun = "";

async function loadWaitingCompetitors() {

  currentSport =
    document.getElementById("discipline").value;

  currentLevel =
    document.getElementById("level").value;

  currentRun =
    document.getElementById("run").value;

  if (!currentSport || !currentLevel) {

    alert(
      "Select sport and level first."
    );

    return;

  }

  await refreshList();

}

async function refreshList() {

  document.getElementById(
    "loadingOverlay"
  ).style.display = "flex";

  try {

    const response =
      await fetch(
        API_URL +
        "?action=competitors" +
        "&judgeKey=" +
        encodeURIComponent(JUDGE_KEY) +
        "&discipline=" +
        encodeURIComponent(currentSport) +
        "&level=" +
        encodeURIComponent(currentLevel) +
        "&run=" +
        encodeURIComponent(currentRun)
      );

    const competitors =
      await response.json();

    document.getElementById(
      "waitingTitle"
    ).textContent =
      `Still To Run (${competitors.length})`;

    const container =
      document.getElementById(
        "competitorList"
      );

    if (
      !competitors ||
      competitors.length === 0
    ) {

      container.innerHTML =
        '<div class="empty">No competitors remaining.</div>';

      return;

    }

    container.innerHTML = "";

    competitors.forEach(function(c, index) {

      container.innerHTML += `
        <div class="competitor-row">

          <span>
            ${index + 1}. ${c.name}
          </span>

          <span>
            #${c.no}
          </span>

        </div>
      `;

    });

  } catch (error) {

    console.log(error);

  } finally {

    document.getElementById(
      "loadingOverlay"
    ).style.display = "none";

  }

}



/* Auto refresh every 30 seconds */

setInterval(function() {

  if (
    currentSport &&
    currentLevel &&
    currentRun
  ) {

    refreshList();

  }

}, 5000);
