// URL della tua Web App (dallo script Google)
const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbwk5tc3NSg1kk8IEksoaTBOEraRitZstF7pjM4bWf5koCl-tvGy5scSwiHqTHWcy1vDjw/exec";

// Lista dei 64 video Cloudinary
const videos = [
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762869539/video_22_croppato_e_resized_2_alfqf0.mp4",
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762869532/21_qgoo7n.mp4",
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762868674/video_1-2-3-4_jwsh0a.mp4",
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762868649/definitvo_20_fjlxte.mp4",
  // ... aggiungi tutti i 64 link
];

// Crea ID giocatore unico
const userId = localStorage.getItem("userId") || crypto.randomUUID();
localStorage.setItem("userId", userId);

let currentRound = 1;
let currentMatches = [];
let winners = [];

// Inizializza i match
function initTournament() {
  currentMatches = [];
  for (let i = 0; i < videos.length; i += 2) {
    currentMatches.push([videos[i], videos[i + 1]]);
  }
  renderMatch(0);
}

function renderMatch(index) {
  const container = document.getElementById("match-container");
  const roundLabel = document.getElementById("round-label");

  if (index >= currentMatches.length) {
    if (currentMatches.length === 1) {
      container.innerHTML = `<h2>🏆 Vincitore finale selezionato! 🏆</h2>`;
      return;
    }

    // Passa al turno successivo
    videos.length = 0;
    videos.push(...winners);
    winners = [];
    currentRound++;
    initTournament();
    return;
  }

  const [videoA, videoB] = currentMatches[index];
  roundLabel.textContent = `Round ${currentRound} — Match ${index + 1} di ${currentMatches.length}`;

  container.innerHTML = `
    <div class="match">
      <div>
        <video controls src="${videoA}"></video><br>
        <button onclick="vote(${index}, '${videoA}')">Vota A</button>
      </div>
      <div>
        <video controls src="${videoB}"></video><br>
        <button onclick="vote(${index}, '${videoB}')">Vota B</button>
      </div>
    </div>
  `;
}

async function vote(index, choice) {
  const matchId = index + 1;
  winners.push(choice);

  const payload = {
    userId: userId,
    round: currentRound,
    match: matchId,
    winner: choice
  };

  // Registra il voto
  fetch(VOTE_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // Vai al match successivo
  renderMatch(index + 1);
}

initTournament();



