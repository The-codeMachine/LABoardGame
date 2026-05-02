const players = [];
const playerColors = ['#7c3aed', '#22d3ee', '#f97316', '#14b8a6'];

const boardSize = 30;
const winningLaps = 2;

const events = [
  {
    id: 1,
    text: "The captain orders you to play your fiddle while the ship carries stolen lives below deck. Do you obey, resist, or try to send a signal through the music?",
    type: 'moral',
    choices: [
      { text: "Obey to stay alive", survival: +2, humanity: -2, endurance: +1, resolve: -1 },
      { text: "Play a hidden signal", risky: true, survival: -1, humanity: +2, resolve: +2 },
      { text: "Refuse to play", risky: true, survival: -2, humanity: +1, endurance: +1, resolve: +1 }
    ]
  },
  {
    id: 2,
    text: "You hear suffering from the hold and know the crew expects silence. Do you look away or try to help?",
    type: 'mental',
    choices: [
      { text: "Keep silent", survival: +1, humanity: -2, resolve: -1 },
      { text: "Slip down water", risky: true, survival: -1, humanity: +3, resolve: +1 },
      { text: "Warn a captive of danger", risky: true, survival: -1, humanity: +2, resolve: +2 }
    ]
  },
  {
    id: 3,
    text: "A sailor offers extra food if you report what you hear aboard the ship. Do you take the deal?",
    type: 'moral',
    choices: [
      { text: "Take the deal", survival: +2, humanity: -2, endurance: +1, resolve: -1 },
      { text: "Refuse the offer", survival: 0, humanity: +1, resolve: +2 }
    ]
  },
  {
    id: 4,
    text: "The sea turns rough, and the ship pitches hard. Do you help the crew secure the rigging or stay below?",
    type: 'physical',
    choices: [
      { text: "Help with the rigging", risky: true, survival: +1, humanity: +1, endurance: +2, resolve: +1 },
      { text: "Stay below deck", survival: +2, humanity: -1, resolve: -1 }
    ]
  },
  {
    id: 5,
    text: "A captive quietly asks whether freedom is still possible. Do you answer honestly?",
    type: 'moral',
    choices: [
      { text: "Offer hope", survival: -1, humanity: +3, resolve: +2 },
      { text: "Give a hard truth", survival: 0, humanity: +1, resolve: +1 },
      { text: "Say nothing", survival: +1, humanity: -1, resolve: -1 }
    ]
  },
  {
    id: 6,
    text: "The crew is distracted and you see a chance to help someone escape their chains. Do you risk it?",
    type: 'physical',
    choices: [
      { text: "Try to help", risky: true, survival: -2, humanity: +3, resolve: +2 },
      { text: "Stay out of it", survival: +1, humanity: -1, resolve: -1 }
    ]
  },
  {
    id: 7,
    text: "You are forced to perform again, but this time your hands are shaking from hunger and fear. Do you push through?",
    type: 'physical',
    choices: [
      { text: "Force the performance", risky: true, survival: +1, humanity: -1, endurance: +2, resolve: +1 },
      { text: "Make the song falter on purpose", survival: -1, humanity: +1, resolve: +2 }
    ]
  },
  {
    id: 8,
    text: "Disease spreads through the ship. The easiest move is to protect yourself first. Do you share scarce supplies?",
    type: 'moral',
    choices: [
      { text: "Share supplies", risky: true, survival: -1, humanity: +3, resolve: +1 },
      { text: "Keep them", survival: +2, humanity: -2, endurance: +1, resolve: -1 }
    ]
  },
  {
    id: 9,
    text: "You catch a crew member showing weakness. Do you exploit it, ignore it, or use it to protect someone else?",
    type: 'mental',
    choices: [
      { text: "Exploit it", survival: +2, humanity: -2, resolve: -1 },
      { text: "Ignore it", survival: 0, humanity: +1 },
      { text: "Protect someone else", risky: true, survival: -1, humanity: +2, resolve: +2 }
    ]
  },
  {
    id: 10,
    text: "A chance to flee appears when the ship nears port. Do you run, wait, or help others first?",
    type: 'physical',
    choices: [
      { text: "Run immediately", risky: true, survival: +2, humanity: -1, endurance: +1, resolve: +1 },
      { text: "Wait for a safer opening", survival: +1, humanity: +1, resolve: +1 },
      { text: "Help others first", survival: -2, humanity: +3, resolve: +2 }
    ]
  }
];

const forcedNegativeEvents = [
  { text: "The crew punishes you without mercy. You lose 2 Survival.", survival: -2, humanity: 0, endurance: 0, resolve: 0, forced: true },
  { text: "You collapse from exhaustion during the voyage. Lose 2 Endurance.", survival: 0, humanity: 0, endurance: -2, resolve: 0, forced: true },
  { text: "A guard steals your supplies and taunts you. Lose 1 Survival and 1 Resolve.", survival: -1, humanity: 0, endurance: 0, resolve: -1, forced: true }
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
      riskLevel: 0,
      skipNextTurn: false,
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
      const player = players[currentPlayerIndex];
      let finalFace = face;
      if (player.survival <= 2 && finalFace > 4) {
        finalFace = 4;
      }
      diceValue = finalFace;
      diceResult.textContent = finalFace;
      movePlayer(finalFace);
    }
  }, 75);
}

function movePlayer(steps) {
  const player = players[currentPlayerIndex];
  const totalMove = steps;

  const nextPosition = player.position + totalMove;

  player.laps += Math.floor(nextPosition / boardSize);
  player.position = nextPosition % boardSize;

  renderTrack();

  const eventData = getEvent(player.position);
  renderEvent(eventData);
}

function getEvent(position) {
  if (Math.random() < 0.25) {
    return forcedNegativeEvents[Math.floor(Math.random() * forcedNegativeEvents.length)];
  }

  return events[position % events.length];
}

function getHighestChoiceIndex(choices) {
  let bestIndex = 0;
  let bestScore = -Infinity;

  choices.forEach((choice, index) => {
    const score = (choice.survival || 0) + (choice.humanity || 0) + (choice.endurance || 0) + (choice.resolve || 0);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function renderEvent(eventData) {
  eventText.textContent = eventData.text;
  choicesContainer.innerHTML = '';

  if (eventData.forced || !Array.isArray(eventData.choices) || eventData.choices.length === 0) {
    applyForcedEvent(eventData);
    return;
  }

  const player = players[currentPlayerIndex];
  const disableBest = player.resolve <= 3 && eventData.choices.length > 1;
  const bestIndex = disableBest ? getHighestChoiceIndex(eventData.choices) : -1;

  eventData.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-btn';

    const deltas = [];
    if (choice.survival) deltas.push(`${choice.survival > 0 ? '+' : ''}${choice.survival} S`);
    if (choice.humanity) deltas.push(`${choice.humanity > 0 ? '+' : ''}${choice.humanity} H`);
    if (choice.endurance) deltas.push(`${choice.endurance > 0 ? '+' : ''}${choice.endurance} E`);
    if (choice.resolve) deltas.push(`${choice.resolve > 0 ? '+' : ''}${choice.resolve} R`);

    button.textContent = `${choice.text}${deltas.length ? ` (${deltas.join(', ')})` : ''}${choice.risky ? ' (Risky)' : ''}`;
    if (choice.risky) {
      button.title = 'This choice may fail if your related stat is low.';
    }
    if (choiceIndex === bestIndex) {
      button.disabled = true;
      button.title = 'Low resolve prevents this best option.';
    }

    button.addEventListener('click', () => applyChoice(eventData, choiceIndex));
    choicesContainer.appendChild(button);
  });
}

function getFailureStat(eventData) {
  if (eventData.type === 'physical') return 'endurance';
  if (eventData.type === 'mental') return 'resolve';
  return 'humanity';
}

function getFailureChance(statValue) {
  if (statValue <= 3) return 50;
  if (statValue <= 5) return 40;
  if (statValue <= 7) return 25;
  return 10;
}

function applyStatusDelta(player, stat, delta, failed) {
  if (!delta) return;
  if (!failed) {
    player[stat] = Math.max(0, player[stat] + delta);
    return;
  }

  if (delta > 0) {
    player[stat] = Math.max(0, player[stat] - Math.max(1, delta));
  } else {
    player[stat] = Math.max(0, player[stat] + delta - 1);
  }
}

function applyChoice(eventData, choiceIndex) {
  const player = players[currentPlayerIndex];
  const choice = eventData.choices[choiceIndex];
  const failureStat = getFailureStat(eventData);

  let failed = false;
  if (choice.risky) {
    const chance = getFailureChance(player[failureStat]);
    failed = Math.random() * 100 < chance;
    player.riskLevel = Math.min(10, player.riskLevel + 1);
    if (failed) {
      player.riskLevel = Math.min(10, player.riskLevel + 1);
    }
  }

  applyStatusDelta(player, 'survival', choice.survival || 0, failed);
  applyStatusDelta(player, 'humanity', choice.humanity || 0, failed);
  applyStatusDelta(player, 'endurance', choice.endurance || 0, failed);
  applyStatusDelta(player, 'resolve', choice.resolve || 0, failed);

  if (failed) {
    player.survival = Math.max(0, player.survival - 1 - player.riskLevel);
    player[failureStat] = Math.max(0, player[failureStat] - 1);
    player.resolve = Math.max(0, player.resolve - Math.floor(player.riskLevel / 2));
  }

  if (eventData.type === 'physical') {
    player.endurance = Math.max(0, player.endurance - 1);
  } else if (eventData.type === 'mental') {
    player.resolve = Math.max(0, player.resolve - 1);
  } else {
    if (Math.random() < 0.5) {
      player.endurance = Math.max(0, player.endurance - 1);
    } else {
      player.resolve = Math.max(0, player.resolve - 1);
    }
  }

  if (player.humanity <= 3) {
    player.resolve = Math.max(0, player.resolve - 1);
  }

  if (player.resolve >= 15) {
    player.survival += 1;
  }

  if (player.endurance <= 3) {
    player.survival = Math.max(0, player.survival - 1);
    if (Math.random() < 0.25) {
      player.skipNextTurn = true;
    }
  }

  updateUI();

  if (checkGameEnd()) {
    gameActive = false;
    showResults();
    return;
  }

  let message = failed
    ? 'The risky choice backfires and drains you.'
    : 'You move on, but the voyage is wearing you down.';

  if (player.skipNextTurn) {
    message = `${player.name} is too exhausted and will lose their next turn.`;
  }

  nextTurn(message);
}

function applyForcedEvent(eventData) {
  const player = players[currentPlayerIndex];

  player.survival = Math.max(0, player.survival + (eventData.survival || 0));
  player.humanity = Math.max(0, player.humanity + (eventData.humanity || 0));
  player.endurance = Math.max(0, player.endurance + (eventData.endurance || 0));
  player.resolve = Math.max(0, player.resolve + (eventData.resolve || 0));

  updateUI();

  if (checkGameEnd()) {
    gameActive = false;
    showResults();
    return;
  }

  advanceToNextPlayer(`${eventData.text} Your turn ends and the next player moves on.`);
}

function advanceToNextPlayer(message) {
  let nextIndex = currentPlayerIndex;
  let skipMessage = '';

  for (let i = 0; i < players.length; i++) {
    nextIndex = (nextIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];

    if (nextPlayer.skipNextTurn) {
      nextPlayer.skipNextTurn = false;
      skipMessage = `${nextPlayer.name} is too drained and misses a turn.`;
      continue;
    }

    currentPlayerIndex = nextIndex;
    updateUI();
    eventText.textContent = message || skipMessage || `Ready for ${players[currentPlayerIndex].name}. Roll the dice.`;
    choicesContainer.innerHTML = '';
    return;
  }

  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateUI();
  eventText.textContent = message || `Ready for ${players[currentPlayerIndex].name}. Roll the dice.`;
  choicesContainer.innerHTML = '';
}

function nextTurn(message) {
  advanceToNextPlayer(message);
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

restartBtn.addEventListener('click', () => {
  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  rollBtn.disabled = false;
  playerForm.reset();
});
