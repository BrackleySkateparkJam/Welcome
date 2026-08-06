const API_URL =
  "https://script.google.com/macros/s/AKfycbzAbPL1C-vvuLQPPiLfV_6QJGu8uOH8e_fRLugrvdpvL0CsMyxHlYklBkOsmS_8H15n/exec";

window.onload = loadLeaderboard;

async function loadLeaderboard() {

  try {

    const response =
      await fetch(
        API_URL +
        "?action=leaderboard"
      );

    const data =
      await response.json();

    renderLeaderboard(data);

  } catch (error) {

    console.log(error);

    document.getElementById(
      "leaderboard"
    ).innerHTML =
      '<div class="loading">Unable to load leaderboard.</div>';

  }

}

function renderLeaderboard(data) {

  const container =
    document.getElementById(
      "leaderboard"
    );

  container.innerHTML = "";

  const sports = [
    "Skateboard",
    "Scooter",
    "BMX"
  ];

  const levels = [
    "Beginner",
    "Intermediate",
    "Advanced"
  ];

  sports.forEach(function(sport) {

    let html = `
      <details class="sport-section" open>

        <summary class="sport-title">
          🏆 ${sport}
        </summary>

        <div class="level-grid">
    `;

    levels.forEach(function(level) {

      const competitors =
        data.filter(function(row) {

          return row[2] === sport &&
                 row[3] === level;

        });

      competitors.forEach(function(c) {

        const run1 =
          Number(c[10]) || 0;

        const run2 =
          Number(c[18]) || 0;

        c.bestScore =
          Math.max(
            run1,
            run2
          );

      });

      const scoredCompetitors =
        competitors.filter(function(c) {

          return c.bestScore > 0;

        });

      scoredCompetitors.sort(function(a, b) {

        return b.bestScore -
               a.bestScore;

      });

      const top3 =
        scoredCompetitors.slice(0, 3);

      html += `
        <div class="level-box">

          <h3>${level}</h3>
      `;

      if (top3.length === 0) {

        html += `
          <div class="no-scores">
            No scores yet
          </div>
        `;

      } else {

        top3.forEach(function(c, index) {

          let medal = "";

          if (index === 0) {
            medal = "🥇";
          }

          if (index === 1) {
            medal = "🥈";
          }

          if (index === 2) {
            medal = "🥉";
          }

          html += `
            <div class="row">

              <span class="name">
                ${medal} ${c[1]}
              </span>

              <span class="score">
                ${c.bestScore}
              </span>

            </div>
          `;

        });

      }

      html += `
        </div>
      `;

    });

    html += `
        </div>

      </details>
    `;

    container.innerHTML += html;

  });

}

/* Refresh leaderboard every 30 seconds */

setInterval(
  loadLeaderboard,
  30000
);
