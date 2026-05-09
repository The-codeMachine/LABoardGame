const players = [];
const playerColors = ['#7c3aed', '#22d3ee', '#f97316', '#14b8a6'];

const boardSize = 20;
const winningLaps = 1;

// Board spaces: Each position maps directly to a specific event (not recycled)
const boardSpaces = [
  {
    position: 0,
    text: "The captain orders you to play your fiddle while the ship carries stolen lives below deck. Do you obey, resist, or try to send a signal through the music?",
    type: 'moral',
    choices: [
      { text: "Obey to stay alive", survival: +2, humanity: -2, resolve: -1 },
      { text: "Play a hidden signal", risky: true, survival: -1, humanity: +2, resolve: +2 },
      { text: "Refuse to play", risky: true, survival: -2, humanity: +1, resolve: +1 }
    ]
  },
  {
    position: 1,
    text: "You hear suffering from the hold and know the crew expects silence. Do you look away or try to help?",
    type: 'mental',
    choices: [
      { text: "Keep silent", survival: +1, humanity: -2, resolve: -1 },
      { text: "Slip water to a captive", risky: true, survival: -1, humanity: +3, resolve: +1 },
      { text: "Warn a captive of danger", risky: true, survival: -1, humanity: +2, resolve: +2 }
    ]
  },
  {
    position: 2,
    text: "A sailor offers extra food if you report what you hear aboard the ship. Do you take the deal?",
    type: 'moral',
    choices: [
      { text: "Take the deal", survival: +2, humanity: -2, resolve: -1 },
      { text: "Refuse the offer", survival: 0, humanity: +1, resolve: +2 }
    ]
  },
  {
    position: 3,
    text: "The sea turns rough, and the ship pitches hard. Do you help secure the rigging or stay hidden below?",
    type: 'physical',
    choices: [
      { text: "Help with the rigging", risky: true, survival: +1, humanity: +1, resolve: +1 },
      { text: "Stay hidden below", survival: +2, humanity: -1, resolve: -1 }
    ]
  },
  {
    position: 4,
    text: "A captive quietly asks whether freedom is still possible. Do you answer honestly?",
    type: 'moral',
    choices: [
      { text: "Offer hope", survival: -1, humanity: +3, resolve: +2 },
      { text: "Give a hard truth", survival: 0, humanity: +1, resolve: +1 },
      { text: "Say nothing", survival: +1, humanity: -1, resolve: -1 }
    ]
  },
  {
    position: 5,
    text: "The crew is distracted and you see a chance to help someone escape their chains. Do you risk it?",
    type: 'physical',
    choices: [
      { text: "Try to help", risky: true, survival: -2, humanity: +3, resolve: +2 },
      { text: "Stay out of it", survival: +1, humanity: -1, resolve: -1 }
    ]
  },
  {
    position: 6,
    text: "You are forced to perform again, but your hands shake from hunger and fear. Push through or let it falter?",
    type: 'physical',
    choices: [
      { text: "Force the performance", risky: true, survival: +1, humanity: -1, resolve: +1 },
      { text: "Let the song falter", survival: -1, humanity: +1, resolve: +2 }
    ]
  },
  {
    position: 7,
    text: "Disease spreads through the ship. The crew expects selfishness. Do you share scarce supplies?",
    type: 'moral',
    choices: [
      { text: "Share supplies", risky: true, survival: -1, humanity: +3, resolve: +1 },
      { text: "Keep them for yourself", survival: +2, humanity: -2, resolve: -1 }
    ]
  },
  {
    position: 8,
    text: "You catch a crew member showing weakness. Do you exploit it, ignore it, or protect someone else?",
    type: 'mental',
    choices: [
      { text: "Exploit the weakness", survival: +2, humanity: -2, resolve: -1 },
      { text: "Ignore it", survival: 0, humanity: +1, resolve: 0 },
      { text: "Use it to protect someone", risky: true, survival: -1, humanity: +2, resolve: +2 }
    ]
  },
  {
    position: 9,
    text: "A musician like you among the captives was once free. They beg for a note of real music. Will you risk playing something true?",
    type: 'mental',
    choices: [
      { text: "Play something honest", risky: true, survival: -1, humanity: +2, resolve: +2 },
      { text: "Play safe melodies", survival: +1, humanity: -1, resolve: -1 },
      { text: "Play what brings them peace", risky: true, survival: 0, humanity: +3, resolve: +1 }
    ]
  },
  {
    position: 10,
    text: "Food runs low. A child in the hold cries constantly. You have a hidden portion. Do you give it?",
    type: 'moral',
    choices: [
      { text: "Give everything", survival: -2, humanity: +3, resolve: +2 },
      { text: "Give a small amount", survival: -1, humanity: +1, resolve: +1 },
      { text: "Keep it hidden", survival: +2, humanity: -2, resolve: -1 }
    ]
  },
  {
    position: 11,
    text: "The captain demands you identify which captive spoke out of turn. If you refuse, you face punishment. If you comply, someone dies.",
    type: 'moral',
    choices: [
      { text: "Refuse and face punishment", risky: true, survival: -2, humanity: +2, resolve: +3 },
      { text: "Comply with the order", survival: +2, humanity: -3, resolve: -2 },
      { text: "Name someone already dying", risky: true, survival: 0, humanity: -1, resolve: 0 }
    ]
  },
  {
    position: 12,
    text: "A fever takes you. You could recover quickly if you take medicine meant for the sick captives. No one would know.",
    type: 'moral',
    choices: [
      { text: "Take the medicine", survival: +2, humanity: -2, resolve: -1 },
      { text: "Leave it for others", risky: true, survival: -2, humanity: +2, resolve: +2 },
      { text: "Share it equally", survival: -1, humanity: +1, resolve: +1 }
    ]
  },
  {
    position: 13,
    text: "A crew member plans an escape. They ask you to look away during the attempt. They will likely fail and be executed.",
    type: 'physical',
    choices: [
      { text: "Look away and let them try", risky: true, survival: -1, humanity: +2, resolve: +2 },
      { text: "Report the plan", survival: +2, humanity: -3, resolve: -1 },
      { text: "Warn them it will fail", survival: 0, humanity: 0, resolve: +1 }
    ]
  },
  {
    position: 14,
    text: "Land is visible. You could slip away now, but so could others. Do you stay and help others reach shore, or save yourself?",
    type: 'physical',
    choices: [
      { text: "Save yourself", survival: +2, humanity: -2, resolve: -1 },
      { text: "Help guide others", risky: true, survival: -1, humanity: +3, resolve: +2 },
      { text: "Create a diversion for escape", risky: true, survival: 0, humanity: +1, resolve: +2 }
    ]
  },
  {
    position: 15,
    text: "A captive recognizes you as someone who once showed them kindness. They refuse to leave the ship without you.",
    type: 'mental',
    choices: [
      { text: "Go with them", risky: true, survival: -2, humanity: +3, resolve: +3 },
      { text: "Tell them to go alone", survival: +1, humanity: -1, resolve: -2 },
      { text: "Help them escape but stay", risky: true, survival: 0, humanity: +2, resolve: +1 }
    ]
  },
  {
    position: 16,
    text: "Chaos erupts during the escape attempt. Guards are confused. You could slip away unnoticed. What do you do?",
    type: 'physical',
    choices: [
      { text: "Escape in the chaos", survival: +2, humanity: -1, resolve: -1 },
      { text: "Help confused captives find the way", risky: true, survival: -2, humanity: +3, resolve: +2 },
      { text: "Create more chaos to cover them", risky: true, survival: -1, humanity: +2, resolve: +2 }
    ]
  },
  {
    position: 17,
    text: "You reach the shore with others. The ship disappears behind you. Do you run inland, help the wounded, or return to warn others?",
    type: 'moral',
    choices: [
      { text: "Run inland and disappear", survival: +3, humanity: -2, resolve: 0 },
      { text: "Help the wounded", survival: -1, humanity: +3, resolve: +2 },
      { text: "Find a boat to warn others", risky: true, survival: -2, humanity: +2, resolve: +3 }
    ]
  },
  {
    position: 18,
    text: "Free at last, but the weight of the voyage remains. Do you speak out about what you witnessed, or try to forget?",
    type: 'mental',
    choices: [
      { text: "Speak the truth publicly", risky: true, survival: -1, humanity: +3, resolve: +3 },
      { text: "Share only with those you trust", survival: 0, humanity: +1, resolve: +1 },
      { text: "Keep it buried inside", survival: +2, humanity: -2, resolve: -1 }
    ]
  },
  {
    position: 19,
    text: "You have reached home. Your journey is complete. But can you ever truly return?",
    type: 'moral',
    choices: [
      { text: "Return to your old life changed", survival: +1, humanity: +1, resolve: +1 },
      { text: "Dedicate yourself to justice", survival: 0, humanity: +3, resolve: +3 },
      { text: "Try to forget and move on", survival: +2, humanity: -1, resolve: -2 }
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
      resolve: 10,
      riskLevel: 0,
      color: playerColors[index % playerColors.length],
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
      diceValue = face;
      diceResult.textContent = face;
      movePlayer(face);
    }
  }, 75);
}

function movePlayer(steps) {
  const player = players[currentPlayerIndex];
  const nextPosition = player.position + steps;

  player.laps += Math.floor(nextPosition / boardSize);
  player.position = nextPosition % boardSize;

  renderTrack();

  const eventData = getEvent(player.position);
  renderEvent(eventData);
}

function getEvent(position) {
  // Map position directly to boardSpaces array
  if (position < boardSpaces.length) {
    return boardSpaces[position];
  }
  // Fallback if position exceeds board (shouldn't happen with proper lap logic)
  return boardSpaces[position % boardSpaces.length];
}

function renderEvent(eventData) {
  eventText.textContent = eventData.text;
  choicesContainer.innerHTML = '';

  if (!Array.isArray(eventData.choices) || eventData.choices.length === 0) {
    nextTurn('The voyage continues...');
    return;
  }

  // All choices are always available - no disabling logic
  eventData.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice-btn';

    const deltas = [];
    if (choice.survival) deltas.push(`${choice.survival > 0 ? '+' : ''}${choice.survival} S`);
    if (choice.humanity) deltas.push(`${choice.humanity > 0 ? '+' : ''}${choice.humanity} H`);
    if (choice.resolve) deltas.push(`${choice.resolve > 0 ? '+' : ''}${choice.resolve} R`);

    button.textContent = `${choice.text}${deltas.length ? ` (${deltas.join(', ')})` : ''}${choice.risky ? ' ⚠' : ''}`;
    if (choice.risky) {
      button.title = 'This choice involves risk and may fail.';
    }

    button.addEventListener('click', () => applyChoice(eventData, choiceIndex));
    choicesContainer.appendChild(button);
  });
}

function applyChoice(eventData, choiceIndex) {
  const player = players[currentPlayerIndex];
  const choice = eventData.choices[choiceIndex];

  let failed = false;
  if (choice.risky) {
    // State-driven failure chance based on relevant stat
    const relevantStat = 
      eventData.type === 'physical' ? player.survival :
      eventData.type === 'mental' ? player.resolve :
      player.humanity;
    
    // Higher stat = lower failure chance
    const failureChance = Math.max(10, 60 - (relevantStat * 3));
    failed = Math.random() * 100 < failureChance;
    
    if (failed) {
      // Add 1 to riskLevel for consequence accumulation
      player.riskLevel = Math.min(10, player.riskLevel + 1);
    }
  }

  // Apply choice stat changes
  player.survival = Math.max(0, player.survival + (choice.survival || 0));
  player.humanity = Math.max(0, player.humanity + (choice.humanity || 0));
  player.resolve = Math.max(0, player.resolve + (choice.resolve || 0));

  // If choice failed, reduce gains and add penalty
  if (failed) {
    player.survival = Math.max(0, player.survival - 1);
    const relevantStat = eventData.type === 'physical' ? 'survival' : eventData.type === 'mental' ? 'resolve' : 'humanity';
    player[relevantStat] = Math.max(0, player[relevantStat] - 1);
  }

  // State-driven consequence: Low humanity reduces resolve (moral weight)
  if (player.humanity <= 3) {
    player.resolve = Math.max(0, player.resolve - 1);
  }

  // State-driven consequence: High resolve helps survival slightly
  if (player.resolve >= 8) {
    player.survival = Math.min(15, player.survival + 1);
  }

  updateUI();

  if (checkGameEnd()) {
    gameActive = false;
    showResults();
    return;
  }

  const message = failed
    ? 'Your attempt backfires. The weight of survival grows heavier.'
    : 'You move forward, but nothing feels certain anymore.';

  nextTurn(message);
}

function updateUI() {
  const player = players[currentPlayerIndex];
  currentPlayerName.textContent = player.name;
  currentSurvival.textContent = player.survival;
  currentHumanity.textContent = player.humanity;
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

    card.innerHTML = `
      <div class="player-card-header">
        <span class="player-dot" style="background:${player.color}"></span>
        <strong>${player.name}</strong>
      </div>
      <div class="player-chip">Position: ${player.position + 1}</div>
      <div class="player-chip">Laps: ${player.laps}</div>
      <div class="player-chip">Survival: ${player.survival}</div>
      <div class="player-chip">Humanity: ${player.humanity}</div>
      <div class="player-chip">Resolve: ${player.resolve}</div>
      <div class="player-chip">Score: ${player.survival + player.humanity + player.resolve}</div>
    `;

    playerRoster.appendChild(card);
  });
}

function nextTurn(message) {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateUI();
  eventText.textContent = message || `Ready for ${players[currentPlayerIndex].name}. Roll the dice.`;
  choicesContainer.innerHTML = '';
  rollBtn.disabled = false;
}

function checkGameEnd() {
  return players.some(player => player.laps >= winningLaps);
}

function getTrackPath() {
  const path = [];
  const width = 10;
  const height = 7;

  // Top row: 7 positions (0-6)
  for (let x = 0; x < 7; x++) path.push([0, x]);
  // Right column: 3 positions (7-9)
  for (let y = 1; y <= 3; y++) path.push([y, 6]);
  // Bottom row: 7 positions (10-16)
  for (let x = 6; x >= 0; x--) path.push([4, x]);
  // Left column: 3 positions (17-19)
  for (let y = 3; y >= 1; y--) path.push([y, 0]);

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
          label.textContent = index === 0 ? 'Start' : 'End';
          cell.appendChild(label);
        }

        const playersHere = players.filter(p => p.position === index);
        if (playersHere.length) {
          const inner = document.createElement('div');
          inner.className = 'track-dot-inner';

          playersHere.forEach((player, index) => {
            const marker = document.createElement('video');
            marker.className = 'track-dot-player';
            marker.src = 'resources/player.mp4';
            marker.autoplay = true;
            marker.loop = true;
            marker.muted = true;
            marker.style.borderColor = player.color;
            marker.style.boxShadow = `0 0 8px rgba(0, 0, 0, 0.18), 0 0 12px ${player.color}40`;
            marker.setAttribute('data-player-number', (players.indexOf(player) + 1).toString());
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

  // Final score = Survival + Humanity + Resolve (3 stats only)
  const totalScore = p => p.survival + p.humanity + p.resolve;
  const bestTotal = Math.max(...players.map(totalScore));
  const winnerPlayers = players.filter(p => totalScore(p) === bestTotal);
  const winners = winnerPlayers.map(p => p.name).join(', ');

  winnerBanner.innerHTML = `${winners} ${winnerPlayers.length > 1 ? 'reach the shore together' : 'reaches the shore'}`;

  const finalStats = players.map(p => 
    `${p.name}: Survival ${p.survival}, Humanity ${p.humanity}, Resolve ${p.resolve} (Total: ${totalScore(p)})`
  ).join(' · ');

  resultSummary.innerHTML = `
    <div><strong>Winner's Score:</strong> ${bestTotal}</div>
    <div><strong>Final Stats:</strong> ${finalStats}</div>
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
