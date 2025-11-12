// URL della tua Web App (Apps Script) – sostituisci con il tuo
const VOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbwk5tc3NSg1kk8IEksoaTBOEraRitZstF7pjM4bWf5koCl-tvGy5scSwiHqTHWcy1vDjw/exec";

// Lista dei 4 video di test su Cloudinary
const videos = [
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762869539/video_22_croppato_e_resized_2_alfqf0.mp4",
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762869532/21_qgoo7n.mp4",
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762868674/video_1-2-3-4_jwsh0a.mp4",
  "https://res.cloudinary.com/di8xgmagx/video/upload/v1762868649/definitvo_20_fjlxte.mp4"
];

// Genera ID unico per ogni giocatore
const userId = localStorage.getItem("userId") || crypto.randomUUID();
localStorage.setItem("userId", userId);

let currentRound = 1;
let currentMatches = [];
let winners = [];

// Inizializza il torneo
function initTournament() {
  currentMatches = [];
  for (let i = 0; i < videos.length; i += 2) {
    currentMatches.push([videos[i], videos[i + 1]]);
  }
  renderMatch(0);
}

// Mostra il match corrente
function renderMatch(index) {
  const container = document.getElementById("match-container");
  const roundLabel = document.getElementById("round-label");

  if (index >= currentMatches.length) {
    if (currentMatches.length === 1) {
      // Mostra vincitore finale
      const winnerVideo = winners[0];
      container.innerHTML = `<h2>🏆 Vincitore finale 🎉</h2>
                             <video controls autoplay width="400" src="${winnerVideo}"></video>`;
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
        <button onclick="vote(${index}, '${videoA}', '${videoB}', 'A')">Vota A</button>
      </div>
      <div>
        <video controls src="${videoB}"></video><br>
        <button onclick="vote(${index}, '${videoA}', '${videoB}', 'B')">Vota B</button>
      </div>
    </div>
  `;
}

// Funzione per inviare il voto e passare al prossimo match
function vote(index, videoA, videoB, choice) {
  const matchId = index + 1;
  const winnerVideo = choice === 'A' ? videoA : videoB;
  winners.push(winnerVideo);

  const payload = {
    userId: userId,
    round: currentRound,
    match: matchId,
    winner: winnerVideo
  };

  // Invia voto al Web App
  fetch(VOTE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(res => console.log("Voto registrato:", res))
  .catch(err => console.error("Errore invio voto:", err));

  // Mostra match successivo
  renderMatch(index + 1);
}

// Avvia il torneo
initTournament();



