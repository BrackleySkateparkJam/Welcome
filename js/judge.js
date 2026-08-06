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
let competitors = [];

async function loadCompetitors() {

  const discipline =
    document.getElementById("discipline").value;

  const level =
    document.getElementById("level").value;

  const run =
    document.getElementById("run").value;

  if (!discipline || !level) {

    alert("Select sport and level first.");
    return;

  }

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
encodeURIComponent(discipline) +
"&level=" +
encodeURIComponent(level) +
"&run=" +
encodeURIComponent(run)
      );

    const data =
      await response.json();

    competitors = data;

    const dropdown =
      document.getElementById(
        "competitor"
      );

    dropdown.innerHTML =
      '<option value="">Select Competitor</option>';

    if (data.length === 0) {

      dropdown.innerHTML =
        '<option value="">No competitors found</option>';

      document.getElementById(
        "loadingOverlay"
      ).style.display = "none";

      alert(
        "No competitors found for this Sport, Level and Run."
      );

      return;

    }

    data.forEach(function(c) {

      dropdown.innerHTML +=
        `<option value="${c.no}">
          ${c.no} - ${c.name}
        </option>`;

    });

  } catch(error) {

    console.log(error);

    alert(
      "Error loading competitors."
    );

  }

  document.getElementById(
    "loadingOverlay"
  ).style.display = "none";

}

function updateTotal() {

  let total = 0;

  for (let i = 1; i <= 5; i++) {

    const score =
      parseFloat(
        document.getElementById(
          "j" + i
        ).value
      );

    if (!isNaN(score)) {

      total += score;

    }

  }

  document.getElementById(
    "totalScore"
  ).value =
    total.toFixed(1);

}

async function saveScore() {

  const competitorNo =
    document.getElementById(
      "competitor"
    ).value;

  if (!competitorNo) {

    alert(
      "Please select a competitor."
    );

    return;

  }

  const competitor =
    competitors.find(
      x => x.no === competitorNo
    );

  if (!competitor) {

    alert(
      "Competitor not found."
    );

    return;

  }

  const run =
    document.getElementById(
      "run"
    ).value;

  const comment =
    document.getElementById(
      "comment"
    ).value;

  const scores = [];

  for (let i = 1; i <= 5; i++) {

    scores.push(
      document.getElementById(
        "j" + i
      ).value || 0
    );

  }

  const totalScore =
    document.getElementById(
      "totalScore"
    ).value;

  if (!totalScore) {

    alert(
      "Please enter scores."
    );

    return;

  }

  document.getElementById(
    "loadingOverlay"
  ).style.display = "flex";

  try {

   const params =
  new URLSearchParams({

    action: "saveScore",

    judgeKey:
      JUDGE_KEY,

    competitorNo:
      competitor.no,

    competitorName:
      competitor.name,

    discipline:
      document.getElementById(
        "discipline"
      ).value,

    level:
      document.getElementById(
        "level"
      ).value,

    run:
      run,

    judge1: scores[0],
    judge2: scores[1],
    judge3: scores[2],
    judge4: scores[3],
    judge5: scores[4],

    comment:
      comment,

    totalScore:
      totalScore

  });

    const response =
      await fetch(
        API_URL +
        "?" +
        params.toString()
      );

    const result =
      await response.json();

    if (!result.success) {

      throw new Error(
        result.message ||
        "Unknown error"
      );

    }

    const resultBox =
      document.getElementById(
        "result"
      );

    resultBox.innerHTML =
      "✅ " +
      competitor.name +
      " scored successfully";

    resultBox.style.color =
      "green";

    setTimeout(function() {

      resultBox.innerHTML = "";

    }, 3000);

    for (let i = 1; i <= 5; i++) {

      document.getElementById(
        "j" + i
      ).value = "";

    }

    document.getElementById(
      "comment"
    ).value = "";

    document.getElementById(
      "totalScore"
    ).value = "";

    document.getElementById(
      "competitor"
    ).selectedIndex = 0;

    competitors = [];

    await loadCompetitors();

  } catch(error) {

    console.log(error);

    alert(
      "Error saving score."
    );

  }

  document.getElementById(
    "loadingOverlay"
  ).style.display = "none";

}
