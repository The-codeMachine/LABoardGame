const players = [];
const playerColors = ['#7c3aed', '#22d3ee', '#f97316', '#14b8a6'];

const boardSize = 30;
const winningLaps = 2;

const events = [
  {
    id: 1,
    text: "The captain orders you to play your fiddle while the ship carries stolen lives below deck. Do you obey, resist, or try to send a signal through the music?",
    choices: [
      { text: "Obey to stay alive", survival: +2, humanity: -2, endurance: +1, resolve: -1 },
      { text: "Play a hidden signal", survival: -1, humanity: +2, endurance: 0, resolve: +2 },
      { text: "Refuse to play", survival: -2, humanity: +1, endurance: +1, resolve: +1 }
    ]
  },
  {
    id: 2,
    text: "You hear suffering from the hold and know the crew expects silence. Do you look away or try to help?",
    choices: [
      { text: "Keep silent", survival: +1, humanity: -2, endurance: 0, resolve: -1 },
      { text: "Slip down water", survival: -1, humanity: +3, endurance: 0, resolve: +1 },
      { text: "Warn a captive of danger", survival: -1, humanity: +2, endurance: 0, resolve: +2 }
    ]
  },
  {
    id: 3,
    text: "A sailor offers extra food if you report what you hear aboard the ship. Do you take the deal?",
    choices: [
      { text: "Take the deal", survival: +2, humanity: -2, endurance: +1, resolve: -1 },
      { text: "Refuse the offer", survival: 0, humanity: +1, endurance: 0, resolve: +2 }
    ]
  },
  {
    id: 4,
    text: "The sea turns rough, and the ship pitches hard. Do you help the crew secure the rigging or stay below?",
    choices: [
      { text: "Help with the rigging", survival: +1, humanity: +1, endurance: +2, resolve: +1 },
      { text: "Stay below deck", survival: +2, humanity: -1, endurance: 0, resolve: -1 }
    ]
  },
  {
    id: 5,
    text: "A captive quietly asks whether freedom is still possible. Do you answer honestly?",
    choices: [
      { text: "Offer hope", survival: -1, humanity: +3, endurance: 0, resolve: +2 },
      { text: "Give a hard truth", survival: 0, humanity: +1, endurance: 0, resolve: +1 },
      { text: "Say nothing", survival: +1, humanity: -1, endurance: 0, resolve: -1 }
    ]
  },
  {
    id: 6,
    text: "The crew is distracted and you see a chance to help someone escape their chains. Do you risk it?",
    choices: [
      { text: "Try to help", survival: -2, humanity: +3, endurance: 0, resolve: +2 },
      { text: "Stay out of it", survival: +1, humanity: -1, endurance: 0, resolve: -1 }
    ]
  },
  {
    id: 7,
    text: "You are forced to perform again, but this time your hands are shaking from hunger and fear. Do you push through?",
    choices: [
      { text: "Force the performance", survival: +1, humanity: -1, endurance: +2, resolve: +1 },
      { text: "Make the song falter on purpose", survival: -1, humanity: +1, endurance: 0, resolve: +2 }
    ]
  },
  {
    id: 8,
    text: "Disease spreads through the ship. The easiest move is to protect yourself first. Do you share scarce supplies?",
    choices: [
      { text: "Share supplies", survival: -1, humanity: +3, endurance: 0, resolve: +1 },
      { text: "Keep them", survival: +2, humanity: -2, endurance: +1, resolve: -1 }
    ]
  },
  {
    id: 9,
    text: "You catch a crew member showing weakness. Do you exploit it, ignore it, or use it to protect someone else?",
    choices: [
      { text: "Exploit it", survival: +2, humanity: -2, endurance: 0, resolve: -1 },
      { text: "Ignore it", survival: 0, humanity: +1, endurance: 0, resolve: 0 },
      { text: "Protect someone else", survival: -1, humanity: +2, endurance: 0, resolve: +2 }
    ]
  },
  {
    id: 10,
    text: "A chance to flee appears when the ship nears port. Do you run, wait, or help others first?",
    choices: [
      { text: "Run immediately", survival: +2, humanity: -1, endurance: +1, resolve: +1 },
      { text: "Wait for a safer opening", survival: +1, humanity: +1, endurance: 0, resolve: +1 },
      { text: "Help others first", survival: -2, humanity: +3, endurance: 0, resolve: +2 }
    ]
  }
];

let currentPlayerIndex = 0;
let diceValue = 0;
let gameActive = false;

const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const resultScreen = document.getElementById('resultScreen');
const playerForm = document.getElementById('playerForm');
const playerInputs = document.getElementById('playerInputs');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const currentPlayerBadge = document.getElementById('currentPlayerBadge');
const currentPlayerName = document.getElementById('currentPlayerName');
const currentSurvival = document.getElementById('currentSurvival');
const currentHumanity = document.getElementById('currentHumanity');
const currentEndurance = document.getElementById('currentEndurance');
const currentResolve = document.getElementById('currentResolve');
const track = document.getElementById('track');
const playerRoster = document.getElementById('playerRoster');
const eventText = document.getElementById('eventText');
const choicesContainer = document.getElementById('choices');
const rollBtn = document.getElementById('rollBtn');
const diceResult = document.getElementById('diceResult');
const diceCube = document.getElementById('diceCube');
const resultSummary = document.getElementById('resultSummary');
const restartBtn = document.getElementById('restartBtn');
const playerImageModal = document.getElementById('playerImageModal');
const playerImageInputs = document.getElementById('playerImageInputs');
const confirmImagesBtn = document.getElementById('confirmImagesBtn');
const winnerBanner = document.getElementById('winnerBanner');

// Ensure the result panel is hidden initially
resultScreen.classList.add('hidden');
gameScreen.classList.add('hidden');
startScreen.classList.remove('hidden');

function initGame() {
  players.length = 0;
  currentPlayerIndex = 0;
  diceValue = 0;
  gameActive = true;

  const formData = new FormData(playerForm);
  const names = Array.from(formData.getAll('playerName'))
    .map(name => name.trim())
    .filter(Boolean);

  names.forEach((name, index) => {
    players.push({
      name: name || `Player ${index + 1}`,
      position: 0,
      laps: 0,
      survival: 10,
      humanity: 10,
      endurance: 10,
      resolve: 10,
      color: playerColors[index % playerColors.length],
      imageUrl: ''
    });
  });

  if (players.length < 2) {
    alert('Please add at least two players.');
    gameActive = false;
    return;
  }

  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  showImageModal();
}

function showImageModal() {
  playerImageInputs.innerHTML = '';

  players.forEach((player, index) => {
    const group = document.createElement('div');
    group.className = 'image-input-group';
    group.innerHTML = `
      <label>${player.name}</label>
      <input type="url" placeholder="Enter image URL (optional)" data-player-index="${index}">
    `;
    playerImageInputs.appendChild(group);
  });

  playerImageModal.showModal();
}

function startGameWithImages() {
  const inputs = playerImageInputs.querySelectorAll('input[type="url"]');
  inputs.forEach(input => {
    const index = parseInt(input.dataset.playerIndex);
    players[index].imageUrl = input.value.trim();
  });

  playerImageModal.close();

  renderTrack();
  updateUI();
  renderRoster();
  eventText.textContent = 'The voyage begins. Roll the dice.';
  choicesContainer.innerHTML = '';
}

function rollDice() {
  if (!gameActive) return;

  diceResult.textContent = '-';
  diceCube.classList.add('rolling');
  rollBtn.disabled = true;

  let ticks = 0;
  const roller = setInterval(() => {
    const face = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = face;

    if (++ticks >= 10) {
      clearInterval(roller);
      diceCube.classList.remove('rolling');
      diceValue = face;
      movePlayer(face);
    }
  }, 75);
}

function movePlayer(steps) {
  const player = players[currentPlayerIndex];

  // Endurance affects movement
  const bonus = Math.floor(player.endurance / 5);
  const totalMove = steps + bonus;

  const nextPosition = player.position + totalMove;

  player.laps += Math.floor(nextPosition / boardSize);
  player.position = nextPosition % boardSize;

  renderTrack();

  const eventData = getEvent(player.position);
  renderEvent(eventData);
}

function getEvent(position) {
  return events[position % events.length];
}

function renderEvent(eventData) {
  eventText.textContent = eventData.text;
  choicesContainer.innerHTML = '';

  eventData.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-btn';

    const deltas = [];
    if (choice.survival) deltas.push(`${choice.survival > 0 ? '+' : ''}${choice.survival} S`);
    if (choice.humanity) deltas.push(`${choice.humanity > 0 ? '+' : ''}${choice.humanity} H`);
    if (choice.endurance) deltas.push(`${choice.endurance > 0 ? '+' : ''}${choice.endurance} E`);
    if (choice.resolve) deltas.push(`${choice.resolve > 0 ? '+' : ''}${choice.resolve} R`);

    button.textContent = `${choice.text}${deltas.length ? ` (${deltas.join(', ')})` : ''}`;
    button.addEventListener('click', () => applyChoice(eventData, choiceIndex));
    choicesContainer.appendChild(button);
  });
}

function applyChoice(eventData, choiceIndex) {
  const player = players[currentPlayerIndex];
  const choice = eventData.choices[choiceIndex];

  player.survival = Math.max(0, player.survival + (choice.survival || 0));
  player.humanity = Math.max(0, player.humanity + (choice.humanity || 0));
  player.endurance = Math.max(0, player.endurance + (choice.endurance || 0));
  player.resolve = Math.max(0, player.resolve + (choice.resolve || 0));

  // Real gameplay impact:

  // Low humanity penalty
  if (player.humanity <= 3) {
    player.resolve = Math.max(0, player.resolve - 1);
  }

  // High resolve bonus
  if (player.resolve >= 15) {
    player.survival += 1;
  }

  // Low endurance penalty
  if (player.endurance <= 3) {
    player.survival -= 1;
  }

  updateUI();

  if (checkGameEnd()) {
    gameActive = false;
    showResults();
    return;
  }

  nextTurn();
}

function updateUI() {
  const player = players[currentPlayerIndex];
  currentPlayerName.textContent = player.name;
  currentSurvival.textContent = player.survival;
  currentHumanity.textContent = player.humanity;
  currentEndurance.textContent = player.endurance;
  currentResolve.textContent = player.resolve;

  currentPlayerBadge.style.background = player.color;
  currentPlayerBadge.style.boxShadow = `0 0 14px ${player.color}`;

  renderRoster();
  rollBtn.disabled = !gameActive;
}

function renderRoster() {
  playerRoster.innerHTML = '';

  players.forEach((player, index) => {
    const card = document.createElement('div');
    card.className = `player-card ${index === currentPlayerIndex ? 'current' : ''}`;

    let imageHtml = '';
    if (player.imageUrl) {
      imageHtml = `<img src="${player.imageUrl}" alt="${player.name}" class="player-image" onerror="this.style.display='none'">`;
    }

    card.innerHTML = `
      ${imageHtml}
      <div class="player-card-header">
        <span class="player-dot" style="background:${player.color}"></span>
        <strong>${player.name}</strong>
      </div>
      <div class="player-chip">Position: ${player.position}</div>
      <div class="player-chip">Laps: ${player.laps}</div>
      <div class="player-chip">Survival: ${player.survival}</div>
      <div class="player-chip">Humanity: ${player.humanity}</div>
      <div class="player-chip">Endurance: ${player.endurance}</div>
      <div class="player-chip">Resolve: ${player.resolve}</div>
    `;

    playerRoster.appendChild(card);
  });
}

function nextTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateUI();
  eventText.textContent = `Ready for ${players[currentPlayerIndex].name}. Roll the dice.`;
  choicesContainer.innerHTML = '';
}

function checkGameEnd() {
  return players.some(player => player.laps >= winningLaps);
}

function getTrackPath() {
  const path = [];
  const width = 10;
  const height = 7;

  for (let x = 0; x < width; x++) path.push([0, x]);
  for (let y = 1; y < height - 1; y++) path.push([y, width - 1]);
  for (let x = width - 1; x >= 0; x--) path.push([height - 1, x]);
  for (let y = height - 2; y > 0; y--) path.push([y, 0]);

  return path;
}

function renderTrack() {
  track.innerHTML = '';

  const path = getTrackPath();
  const grid = Array.from({ length: 7 }, () => Array(10).fill(null));

  path.forEach((pos, index) => {
    const [row, col] = pos;
    grid[row][col] = index;
  });

  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement('div');
      const index = grid[r][c];

      if (index === null) {
        cell.className = 'track-cell empty';
      } else {
        cell.className = 'track-cell spot';
        if (players.some(p => p.position === index)) {
          cell.classList.add('current');
        }

        const number = document.createElement('div');
        number.className = 'track-number';
        number.textContent = index + 1;
        cell.appendChild(number);

        if (index === 0 || index === boardSize - 1) {
          const label = document.createElement('div');
          label.className = 'track-label-text';
          label.textContent = index === 0 ? 'Start' : 'Finish';
          cell.appendChild(label);
        }

        const playersHere = players.filter(p => p.position === index);
        if (playersHere.length) {
          const inner = document.createElement('div');
          inner.className = 'track-dot-inner';

          playersHere.forEach(player => {
            const marker = document.createElement('span');
            marker.className = 'track-dot-player';
            marker.style.background = player.color;
            inner.appendChild(marker);
          });

          cell.appendChild(inner);
        }
      }

      track.appendChild(cell);
    }
  }
}

function showResults() {
  gameActive = false;
  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const totalScore = p => p.survival + p.humanity + p.endurance + p.resolve;
  const bestTotal = Math.max(...players.map(totalScore));
  const winnerPlayers = players.filter(p => totalScore(p) === bestTotal);
  const winners = winnerPlayers.map(p => p.name).join(', ');

  winnerBanner.innerHTML = `🏆 ${winners} ${winnerPlayers.length > 1 ? 'tie' : 'wins'}! 🏆`;

  resultSummary.innerHTML = `
    <div><strong>Best Overall Score:</strong> ${bestTotal}</div>
    <div><strong>Final Positions:</strong> ${players.map(p => `${p.name} at spot ${p.position + 1} (${p.laps} laps)`).join(' · ')}</div>
    <div><strong>Final Stats:</strong> ${players.map(p => `${p.name}: S:${p.survival} H:${p.humanity} E:${p.endurance} R:${p.resolve}`).join(' · ')}</div>
  `;
}

function addPlayerInput() {
  const currentCount = playerInputs.querySelectorAll('input[name="playerName"]').length;
  if (currentCount >= 4) return;

  const label = document.createElement('label');
  label.innerHTML = `Player ${currentCount + 1}<input type="text" name="playerName" placeholder="Name">`;
  playerInputs.appendChild(label);
}

playerForm.addEventListener('submit', event => {
  event.preventDefault();
  initGame();
});

addPlayerBtn.addEventListener('click', addPlayerInput);
rollBtn.addEventListener('click', rollDice);
confirmImagesBtn.addEventListener('click', startGameWithImages);

restartBtn.addEventListener('click', () => {
  playerImageModal.close();
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  rollBtn.disabled = false;
  playerForm.reset();
});
