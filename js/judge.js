
<script>
const API_URL =
  "https://script.google.com/macros/s/AKfycbzAbPL1C-vvuLQPPiLfV_6QJGu8uOH8e_fRLugrvdpvL0CsMyxHlYklBkOsmS_8H15n/exec";
let competitors = [];

function loadCompetitors() {

  const discipline =
    document.getElementById("discipline").value;

  const level =
    document.getElementById("level").value;

  if (!discipline || !level) {
    alert("Select sport and level first.");
    return;
  }

  document.getElementById("loadingOverlay").style.display = "flex";

  google.script.run

    .withSuccessHandler(function(data) {

      document.getElementById("loadingOverlay").style.display = "none";

      competitors = data;

      const dropdown =
        document.getElementById("competitor");

      dropdown.innerHTML =
        '<option value="">Select Competitor</option>';

      if (data.length === 0) {

        dropdown.innerHTML =
          '<option value="">No competitors found</option>';

        return;
      }

      data.forEach(c => {

        dropdown.innerHTML +=
          `<option value="${c.no}">
            ${c.no} - ${c.name}
          </option>`;

      });

    })

    .withFailureHandler(function(error) {

      document.getElementById("loadingOverlay").style.display = "none";

      alert("Error loading competitors.");

      console.log(error);

    })

    .getCompetitors(discipline, level);
}

function saveScore() {

  const competitorNo =
    document.getElementById("competitor").value;

  if (!competitorNo) {
    alert("Please select a competitor.");
    return;
  }

  const r1 =
    document.getElementById("r1").value;

  const r2 =
    document.getElementById("r2").value;

  const r3 =
    document.getElementById("r3").value;

  if (!r1 || !r2 || !r3) {
    alert("Please enter all three scores.");
    return;
  }

  const competitor =
    competitors.find(x => x.no === competitorNo);

  document.getElementById("loadingOverlay").style.display = "flex";

  google.script.run

    .withSuccessHandler(function() {

      document.getElementById("loadingOverlay").style.display = "none";

      const result =
        document.getElementById("result");

      result.innerHTML =
        "✅ " + competitor.name + " scored successfully";

      result.style.color = "green";

      setTimeout(function() {

        result.innerHTML = "";

      }, 3000);

      document.getElementById("r1").value = "";
      document.getElementById("r2").value = "";
      document.getElementById("r3").value = "";

      document.getElementById("competitor").selectedIndex = 0;

      loadCompetitors();

    })

    .withFailureHandler(function(error) {

      document.getElementById("loadingOverlay").style.display = "none";

      alert("Error saving score.");

      console.log(error);

    })

    .saveScore({

      competitorNo: competitor.no,

      competitorName: competitor.name,

      discipline:
        document.getElementById("discipline").value,

      level:
        document.getElementById("level").value,

      r1: r1,
      r2: r2,
      r3: r3

    });
}

</script>
