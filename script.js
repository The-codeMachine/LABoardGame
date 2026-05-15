const players = [];
const playerColors = ['#7c3aed', '#22d3ee', '#f97316', '#14b8a6'];

const boardSize = 28;
const winningLaps = 1;

// Board spaces: Each position maps directly to a specific event (not recycled)
const boardSpaces = [
  {
    position: 0,
    text: "Captain Cawthorne orders you to play the fife while captives are forced to dance on deck for exercise.",
    type: "moral",
    choices: [
      { text: "Play exactly as ordered", survival: +2, humanity: -2, resolve: -1 },
      { text: "Slow the rhythm to ease their suffering", risky: true, survival: -1, humanity: +2, resolve: +1 },
      { text: "Refuse to play", risky: true, survival: -3, humanity: +1, resolve: +2 }
    ]
  },

  {
    position: 1,
    text: "A sailor asks whether you are getting used to the smell from the hold.",
    type: "mental",
    choices: [
      { text: "Pretend it no longer bothers you", survival: +1, humanity: -2, resolve: -1 },
      { text: "Admit it makes you sick", survival: -1, humanity: +1, resolve: +1 },
      { text: "Stay silent", survival: 0, humanity: 0, resolve: 0 }
    ]
  },

  {
    position: 2,
    text: "A captive collapses during the forced dancing while the crew laughs.",
    type: "moral",
    choices: [
      { text: "Keep playing", survival: +2, humanity: -3, resolve: -2 },
      { text: "Pause your music briefly", risky: true, survival: -1, humanity: +2, resolve: +1 },
      { text: "Rush to help them", risky: true, survival: -3, humanity: +3, resolve: +2 }
    ]
  },

  {
    position: 3,
    text: "Late at night, you hear singing from below deck that reminds you of home.",
    type: "mental",
    choices: [
      { text: "Listen quietly", humanity: +1, resolve: +1, survival: 0 },
      { text: "Join softly with your fife", risky: true, survival: -1, humanity: +2, resolve: +2 },
      { text: "Cover your ears and sleep", survival: +1, humanity: -1, resolve: -1 }
    ]
  },

  {
    position: 4,
    text: "Sharks follow the ship closely. A sailor explains why they never leave.",
    type: "mental",
    choices: [
      { text: "Look overboard anyway", humanity: +1, resolve: +1, survival: -1 },
      { text: "Walk away immediately", survival: +1, humanity: -1, resolve: 0 },
      { text: "Ask questions about the dead", risky: true, survival: -1, humanity: +2, resolve: +1 }
    ]
  },

  {
    position: 5,
    text: "A violent storm floods the lower deck and panic spreads through the hold.",
    type: "physical",
    choices: [
      { text: "Help secure the ship", risky: true, survival: +2, humanity: 0, resolve: +1 },
      { text: "Help trapped captives", risky: true, survival: -2, humanity: +3, resolve: +2 },
      { text: "Hide and protect yourself", survival: +1, humanity: -1, resolve: -1 }
    ]
  },

  {
    position: 6,
    text: "You realize the crew speaks about people below deck as if they are cargo, not human beings.",
    type: "mental",
    choices: [
      { text: "Accept their thinking to survive", survival: +2, humanity: -3, resolve: -2 },
      { text: "Fight against becoming numb", humanity: +2, resolve: +2, survival: -1 },
      { text: "Avoid thinking about it", survival: +1, humanity: -1, resolve: 0 }
    ]
  },

  {
    position: 7,
    text: "A dying captive grabs your wrist and whispers something you cannot understand.",
    type: "mental",
    choices: [
      { text: "Stay beside them", humanity: +3, resolve: +1, survival: -1 },
      { text: "Pull away quickly", survival: +1, humanity: -2, resolve: -1 },
      { text: "Repeat the words back softly", humanity: +2, resolve: +2, survival: 0 }
    ]
  },

  {
    position: 8,
    text: "The crew offers you extra food for reporting which captives seem rebellious.",
    type: "moral",
    choices: [
      { text: "Accept the deal", survival: +2, humanity: -3, resolve: -1 },
      { text: "Refuse outright", humanity: +2, resolve: +2, survival: -1 },
      { text: "Pretend to cooperate but lie", risky: true, survival: 0, humanity: +1, resolve: +1 }
    ]
  },

  {
    position: 9,
    text: "A child cries through the night, and the crew threatens punishment if the noise continues.",
    type: "mental",
    choices: [
      { text: "Comfort the child quietly", risky: true, survival: -1, humanity: +3, resolve: +1 },
      { text: "Ignore the crying", survival: +1, humanity: -2, resolve: -1 },
      { text: "Play a soft tune to calm them", humanity: +2, resolve: +1, survival: 0 }
    ]
  },

  {
    position: 10,
    text: "You are ordered to watch a public whipping as a warning to everyone aboard.",
    type: "moral",
    choices: [
      { text: "Watch silently", survival: +1, humanity: -2, resolve: -1 },
      { text: "Look away", risky: true, survival: -1, humanity: +2, resolve: +1 },
      { text: "Speak against it", risky: true, survival: -3, humanity: +3, resolve: +2 }
    ]
  },

  {
    position: 11,
    text: "Disease spreads rapidly below deck, and the smell of sickness fills the ship.",
    type: "physical",
    choices: [
      { text: "Avoid the sick completely", survival: +2, humanity: -2, resolve: -1 },
      { text: "Bring water to the ill", risky: true, survival: -1, humanity: +3, resolve: +1 },
      { text: "Help clean the hold", risky: true, survival: -2, humanity: +2, resolve: +2 }
    ]
  },

  {
    position: 12,
    text: "One sailor admits he once hated slavers too, but says survival changed him.",
    type: "mental",
    choices: [
      { text: "Agree with him", survival: +1, humanity: -2, resolve: -1 },
      { text: "Challenge his excuse", risky: true, survival: -2, humanity: +2, resolve: +2 },
      { text: "Say nothing and listen", humanity: +1, resolve: +1, survival: 0 }
    ]
  },

  {
    position: 13,
    text: "The ship passes another slave vessel drifting silently in the fog.",
    type: "mental",
    choices: [
      { text: "Stare at it in horror", humanity: +2, resolve: +1, survival: -1 },
      { text: "Pretend not to notice", survival: +1, humanity: -1, resolve: -1 },
      { text: "Ask what happened aboard", risky: true, humanity: +1, resolve: +2, survival: -1 }
    ]
  },

  {
    position: 14,
    text: "A captive secretly asks you whether freedom truly exists beyond the ocean.",
    type: "moral",
    choices: [
      { text: "Promise freedom exists", humanity: +3, resolve: +2, survival: -1 },
      { text: "Tell the harsh truth", humanity: +1, resolve: +1, survival: 0 },
      { text: "Stay silent", survival: +1, humanity: -1, resolve: -1 }
    ]
  },

  {
    position: 15,
    text: "You begin dreaming of chains and drowning every night.",
    type: "mental",
    choices: [
      { text: "Confide in someone", humanity: +1, resolve: +2, survival: -1 },
      { text: "Hide your fear", survival: +1, humanity: -1, resolve: -1 },
      { text: "Force yourself awake and stay alert", resolve: +1, survival: 0, humanity: 0 }
    ]
  },

  {
    position: 16,
    text: "The captain praises you for keeping order through music.",
    type: "moral",
    choices: [
      { text: "Accept the praise", survival: +2, humanity: -2, resolve: -1 },
      { text: "Feel ashamed but say nothing", humanity: +1, resolve: +1, survival: 0 },
      { text: "Reject the compliment", risky: true, survival: -2, humanity: +2, resolve: +2 }
    ]
  },

  {
    position: 17,
    text: "You catch two captives quietly planning resistance.",
    type: "moral",
    choices: [
      { text: "Report them", survival: +2, humanity: -3, resolve: -2 },
      { text: "Keep their secret", risky: true, survival: -1, humanity: +2, resolve: +2 },
      { text: "Warn them they may fail", humanity: +1, resolve: +1, survival: 0 }
    ]
  },

  {
    position: 18,
    text: "Food supplies begin running dangerously low during the voyage.",
    type: "physical",
    choices: [
      { text: "Hide extra food for yourself", survival: +2, humanity: -2, resolve: -1 },
      { text: "Share what little you have", humanity: +3, resolve: +1, survival: -2 },
      { text: "Take only what you need", survival: +1, humanity: +1, resolve: 0 }
    ]
  },

  {
    position: 19,
    text: "You hear chains rattling in the dark and realize someone is attempting escape.",
    type: "physical",
    choices: [
      { text: "Alert the crew", survival: +2, humanity: -3, resolve: -1 },
      { text: "Pretend not to notice", humanity: +1, resolve: +1, survival: 0 },
      { text: "Help cover the noise", risky: true, survival: -2, humanity: +3, resolve: +2 }
    ]
  },

  {
    position: 20,
    text: "The crew jokes about selling families separately once the ship reaches port.",
    type: "mental",
    choices: [
      { text: "Laugh weakly along", survival: +1, humanity: -3, resolve: -2 },
      { text: "Walk away in disgust", humanity: +2, resolve: +1, survival: -1 },
      { text: "Argue with the sailors", risky: true, survival: -2, humanity: +2, resolve: +2 }
    ]
  },

  {
    position: 21,
    text: "A sailor is thrown overboard after dying from fever. The sharks appear instantly.",
    type: "mental",
    choices: [
      { text: "Watch silently", survival: 0, humanity: -1, resolve: -1 },
      { text: "Look away in horror", humanity: +1, resolve: +1, survival: 0 },
      { text: "Pray quietly for the dead", humanity: +2, resolve: +2, survival: -1 }
    ]
  },

  {
    position: 22,
    text: "Land finally appears faintly on the horizon after weeks at sea.",
    type: "physical",
    choices: [
      { text: "Focus only on your own escape", survival: +2, humanity: -2, resolve: 0 },
      { text: "Think about helping others escape", humanity: +2, resolve: +2, survival: -1 },
      { text: "Fear what awaits on shore", humanity: +1, resolve: -1, survival: 0 }
    ]
  },

  {
    position: 23,
    text: "A captive recognizes you as the boy who played music during the dancing.",
    type: "mental",
    choices: [
      { text: "Apologize quietly", humanity: +2, resolve: +2, survival: -1 },
      { text: "Defend yourself angrily", survival: +1, humanity: -2, resolve: -1 },
      { text: "Say nothing", humanity: -1, resolve: 0, survival: 0 }
    ]
  },

  {
    position: 24,
    text: "Chaos erupts as captives attempt to overpower several crew members.",
    type: "physical",
    choices: [
      { text: "Help the crew restore order", survival: +2, humanity: -3, resolve: -2 },
      { text: "Help the captives escape", risky: true, survival: -3, humanity: +3, resolve: +3 },
      { text: "Hide until it ends", survival: +1, humanity: -1, resolve: -1 }
    ]
  },

  {
    position: 25,
    text: "You finally step onto shore, but the memories of the voyage follow you.",
    type: "mental",
    choices: [
      { text: "Try to forget everything", survival: +1, humanity: -2, resolve: -2 },
      { text: "Speak openly about what happened", risky: true, humanity: +3, resolve: +3, survival: -1 },
      { text: "Carry the guilt silently", humanity: +1, resolve: +1, survival: 0 }
    ]
  },

  {
    position: 26,
    text: "People back home ask what life at sea was like.",
    type: "moral",
    choices: [
      { text: "Tell them only pleasant stories", survival: +1, humanity: -2, resolve: -1 },
      { text: "Describe the horrors honestly", risky: true, humanity: +3, resolve: +2, survival: -1 },
      { text: "Refuse to speak about it", humanity: 0, resolve: -1, survival: +1 }
    ]
  },

  {
    position: 27,
    text: "Even years later, the sound of waves reminds you of the ship and the voices below deck.",
    type: "mental",
    choices: [
      { text: "Dedicate your life to justice", humanity: +3, resolve: +3, survival: 0 },
      { text: "Try to live quietly with the memories", humanity: +1, resolve: +1, survival: +1 },
      { text: "Bury the memories completely", survival: +2, humanity: -2, resolve: -2 }
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
  
  // Top row: 10 positions (0-9)
  for (let x = 0; x < 10; x++) path.push([0, x]);
  // Right column: 5 positions (10-14)
  for (let y = 1; y <= 5; y++) path.push([y, 9]);
  // Bottom row: 9 positions (15-23)
  for (let x = 8; x >= 0; x--) path.push([5, x]);
  // Left column: 4 positions (24-27)
  for (let y = 4; y >= 1; y--) path.push([y, 0]);

  return path;
}

function renderTrack() {
  track.innerHTML = '';

  const path = getTrackPath();
  const grid = Array.from({ length: 6 }, () => Array(10).fill(null));

  path.forEach((pos, index) => {
    const [row, col] = pos;
    grid[row][col] = index;
  });

  for (let r = 0; r < 6; r++) {
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