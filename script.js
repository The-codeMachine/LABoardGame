// =========================
// GAME STATE
// =========================

const gameState = {
  players: [],
  currentPlayerIndex: 0,
  gameActive: false,
  winnerIndex: null,
  endgameTriggered: false,
  shorePlayerIndex: null,
  finalTurnsRemaining: new Set(),

  phase: 'idle', // idle | rolling | resolving | gameover

  boardSize: 28,
  maxStat: 15,

  playerColors: ['#7c3aed', '#22d3ee', '#f97316', '#14b8a6']
};

// =========================
// BOARD DATA
// =========================

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

// =========================
// DOM
// =========================

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

// =========================
// HELPERS
// =========================

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createElement(tag, className, text) {
  const el = document.createElement(tag);

  if (className) {
    el.className = className;
  }

  if (text !== undefined) {
    el.textContent = text;
  }

  return el;
}

function totalScore(player) {
  return player.survival + player.humanity + player.resolve;
}

// =========================
// INITIALIZATION
// =========================

function initGame() {
  gameState.players = [];
  gameState.currentPlayerIndex = 0;
  gameState.gameActive = true;
  gameState.winnerIndex = null;
  gameState.phase = 'rolling';

  const formData = new FormData(playerForm);

  const names = Array.from(formData.getAll('playerName'))
    .map(name => name.trim())
    .filter(Boolean);

  if (names.length < 2) {
    alert('Please add at least two players.');
    return;
  }

  names.forEach((name, index) => {
    gameState.players.push({
      name,
      position: 0,

      survival: 10,
      humanity: 10,
      resolve: 10,

      riskLevel: 0,

      color: gameState.playerColors[index % gameState.playerColors.length]
    });
  });

  startScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  renderAll();

  eventText.textContent = 'The voyage begins. Roll the dice.';
  choicesContainer.innerHTML = '';
}

// =========================
// TURN SYSTEM
// =========================

function getCurrentPlayer() {
  return gameState.players[gameState.currentPlayerIndex];
}


function nextTurn(message = '') {

  if (!gameState.gameActive) {
    return;
  }

  // ENDGAME MODE
  if (gameState.endgameTriggered) {

    gameState.finalTurnsRemaining.delete(
      gameState.currentPlayerIndex
    );

    // Everyone finished
    if (gameState.finalTurnsRemaining.size === 0) {
      endGame();
      return;
    }

    // Find next remaining player
    let next =
      (gameState.currentPlayerIndex + 1) %
      gameState.players.length;

    while (
      !gameState.finalTurnsRemaining.has(next)
    ) {
      next =
        (next + 1) %
        gameState.players.length;
    }

    gameState.currentPlayerIndex = next;
  }
  else {

    gameState.currentPlayerIndex =
      (gameState.currentPlayerIndex + 1) %
      gameState.players.length;
  }

  gameState.phase = 'rolling';

  updateUI();

  eventText.textContent =
    message ||
    `Ready for ${getCurrentPlayer().name}. Roll the dice.`;

  choicesContainer.innerHTML = '';

  rollBtn.disabled = false;
}

// =========================
// DICE
// =========================

function rollDice() {
  if (!gameState.gameActive) {
    return;
  }

  if (gameState.phase !== 'rolling') {
    return;
  }

  gameState.phase = 'animating';

  rollBtn.disabled = true;

  let ticks = 0;

  const roller = setInterval(() => {
    const face = Math.floor(Math.random() * 6) + 1;

    diceResult.textContent = face;

    ticks++;

    if (ticks >= 10) {
      clearInterval(roller);

      diceCube.classList.remove('rolling');

      movePlayer(face);
    }
  }, 75);

  diceCube.classList.add('rolling');
}

// =========================
// MOVEMENT
// =========================

function movePlayer(steps) {
  
  const player = getCurrentPlayer();

  const maxPosition = gameState.boardSize - 1;

  player.position = clamp(
    player.position + steps,
    0,
    maxPosition
  );

  renderTrack();

  // Trigger endgame only ONCE
  if (
    player.position >= maxPosition &&
    !gameState.endgameTriggered
  ) {

    gameState.endgameTriggered = true;
    gameState.shorePlayerIndex =
      gameState.currentPlayerIndex;

    // Everyone except shore player
    gameState.finalTurnsRemaining = new Set(
      gameState.players
        .map((_, index) => index)
        .filter(index =>
          index !== gameState.shorePlayerIndex
        )
    );

    eventText.textContent =
      `${player.name} reached the shore first. All other players get one final turn.`;
  }

  const eventData = getEvent(player.position);

  renderEvent(eventData);
}

// =========================
// EVENTS
// =========================

function getEvent(position) {
  return boardSpaces[position];
}

function renderEvent(eventData) {
  gameState.phase = 'resolving';

  eventText.textContent = eventData.text;

  choicesContainer.innerHTML = '';

  eventData.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'choice-btn';

    const deltas = [];

    if (choice.survival !== undefined) {
      deltas.push(
        `${choice.survival >= 0 ? '+' : ''}${choice.survival} S`
      );
    }

    if (choice.humanity !== undefined) {
      deltas.push(
        `${choice.humanity >= 0 ? '+' : ''}${choice.humanity} H`
      );
    }

    if (choice.resolve !== undefined) {
      deltas.push(
        `${choice.resolve >= 0 ? '+' : ''}${choice.resolve} R`
      );
    }

    button.textContent =
      `${choice.text}` +
      `${deltas.length ? ` (${deltas.join(', ')})` : ''}` +
      `${choice.risky ? ' ⚠' : ''}`;

    button.addEventListener('click', () => {
      applyChoice(eventData, choiceIndex);
    });

    choicesContainer.appendChild(button);
  });
}

// =========================
// CHOICE APPLICATION
// =========================

function applyChoice(eventData, choiceIndex) {
  if (gameState.phase !== 'resolving') {
    return;
  }

  const player = getCurrentPlayer();

  const choice = eventData.choices[choiceIndex];

  let failed = false;

  if (choice.risky) {
    const relevantStat =
      eventData.type === 'physical'
        ? player.survival
        : eventData.type === 'mental'
          ? player.resolve
          : player.humanity;

    // Better scaling
    const failureChance = clamp(
      55 - (relevantStat * 4) + (player.riskLevel * 5),
      5,
      65
    );

    failed = Math.random() * 100 < failureChance;

    if (failed) {
      player.riskLevel = clamp(
        player.riskLevel + 1,
        0,
        10
      );
    } else {
      player.riskLevel = clamp(
        player.riskLevel - 1,
        0,
        10
      );
    }
  }

  applyStats(player, choice);

  if (failed) {
    applyFailurePenalty(player, eventData);
  }

  applyStateConsequences(player);

  updateUI();

  const message = failed
    ? 'Your attempt fails and leaves lasting consequences.'
    : 'You continue forward through the voyage.';

  nextTurn(message);
}

function applyStats(player, choice) {
  player.survival = clamp(
    player.survival + (choice.survival ?? 0),
    0,
    gameState.maxStat
  );

  player.humanity = clamp(
    player.humanity + (choice.humanity ?? 0),
    0,
    gameState.maxStat
  );

  player.resolve = clamp(
    player.resolve + (choice.resolve ?? 0),
    0,
    gameState.maxStat
  );
}

function applyFailurePenalty(player, eventData) {
  const affectedStat =
    eventData.type === 'physical'
      ? 'survival'
      : eventData.type === 'mental'
        ? 'resolve'
        : 'humanity';

  player[affectedStat] =
    clamp(player[affectedStat] - 2, 0, gameState.maxStat);

  player.resolve =
    clamp(player.resolve - 1, 0, gameState.maxStat);
}

function applyStateConsequences(player) {

  // Low humanity damages resolve
  if (player.humanity <= 3) {
    player.resolve =
      clamp(player.resolve - 1, 0, gameState.maxStat);
  }

  // Low resolve damages survival
  if (player.resolve <= 2) {
    player.survival =
      clamp(player.survival - 1, 0, gameState.maxStat);
  }

  // High resolve slightly offsets stress
  if (player.resolve >= 12 && player.humanity >= 8) {
    player.survival =
      clamp(player.survival + 1, 0, gameState.maxStat);
  }
}

// =========================
// UI
// =========================

function renderAll() {
  renderTrack();
  renderRoster();
  updateUI();
}

function updateUI() {
  const player = getCurrentPlayer();

  currentPlayerName.textContent = player.name;
  currentSurvival.textContent = player.survival;
  currentHumanity.textContent = player.humanity;
  currentResolve.textContent = player.resolve;

  currentPlayerBadge.style.background = player.color;
  currentPlayerBadge.style.boxShadow =
    `0 0 14px ${player.color}`;

  renderRoster();

  rollBtn.disabled =
    !gameState.gameActive ||
    gameState.phase !== 'rolling';
}

// =========================
// ROSTER
// =========================

function renderRoster() {
  playerRoster.innerHTML = '';

  gameState.players.forEach((player, index) => {

    const card = createElement(
      'div',
      `player-card ${index === gameState.currentPlayerIndex ? 'current' : ''}`
    );

    const header = createElement('div', 'player-card-header');

    const dot = createElement('span', 'player-dot');
    dot.style.background = player.color;

    const strong = createElement('strong', null, player.name);

    header.appendChild(dot);
    header.appendChild(strong);

    card.appendChild(header);

    const stats = [
      `Position: ${player.position + 1} / ${gameState.boardSize}`,
      `Survival: ${player.survival}`,
      `Humanity: ${player.humanity}`,
      `Resolve: ${player.resolve}`,
      `Risk: ${player.riskLevel}`,
      `Score: ${totalScore(player)}`
    ];

    stats.forEach(stat => {
      card.appendChild(
        createElement('div', 'player-chip', stat)
      );
    });

    playerRoster.appendChild(card);
  });
}

// =========================
// TRACK
// =========================

function getTrackPath() {
  const path = [];

  for (let x = 0; x < 10; x++) {
    path.push([0, x]);
  }

  for (let y = 1; y <= 5; y++) {
    path.push([y, 9]);
  }

  for (let x = 8; x >= 0; x--) {
    path.push([5, x]);
  }

  for (let y = 4; y >= 1; y--) {
    path.push([y, 0]);
  }

  return path;
}

function renderTrack() {
  track.innerHTML = '';

  const path = getTrackPath();

  const grid = Array.from(
    { length: 6 },
    () => Array(10).fill(null)
  );

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

        track.appendChild(cell);

        continue;
      }

      cell.className = 'track-cell spot';

      const number = createElement(
        'div',
        'track-number',
        index + 1
      );

      cell.appendChild(number);

      const playersHere =
        gameState.players.filter(
          p => p.position === index
        );

      if (playersHere.length > 0) {

        const inner =
          createElement('div', 'track-dot-inner');

        playersHere.forEach(player => {

          const marker =
            createElement('div', 'track-dot-player');

          marker.style.borderColor = player.color;
          marker.style.background = player.color;

          marker.title = player.name;

          inner.appendChild(marker);
        });

        cell.appendChild(inner);
      }

      track.appendChild(cell);
    }
  }
}

// =========================
// ENDGAME
// =========================

function getWinner() {

  let bestPlayer = gameState.players[0];
  let bestScore = totalScore(bestPlayer);

  for (const player of gameState.players) {

    const score = totalScore(player);

    // Shore bonus
    const adjustedScore =
      player === gameState.players[gameState.shorePlayerIndex]
        ? score + 2
        : score;

    if (adjustedScore > bestScore) {
      bestScore = adjustedScore;
      bestPlayer = player;
    }
  }

  return bestPlayer;
}

function endGame() {
  gameState.gameActive = false;
  gameState.phase = 'gameover';

  gameScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');

  const winner =
    getWinner();

  winnerBanner.textContent =
    `${winner.name} reached the shore first.`;

  resultSummary.innerHTML = '';

  const title =
    createElement('div', null,
      `Winner: ${winner.name}`
    );

  resultSummary.appendChild(title);

  gameState.players.forEach(player => {

    const row = createElement(
      'div',
      'result-row'
    );

    row.textContent =
      `${player.name} — ` +
      `Survival ${player.survival}, ` +
      `Humanity ${player.humanity}, ` +
      `Resolve ${player.resolve}, ` +
      `Risk ${player.riskLevel}, ` +
      `Total ${totalScore(player)}`;

    resultSummary.appendChild(row);
  });
}

// =========================
// PLAYER INPUTS
// =========================

function addPlayerInput() {

  const count =
    playerInputs.querySelectorAll(
      'input[name="playerName"]'
    ).length;

  if (count >= 4) {
    return;
  }

  const label = document.createElement('label');

  label.appendChild(
    document.createTextNode(`Player ${count + 1}`)
  );

  const input = document.createElement('input');

  input.type = 'text';
  input.name = 'playerName';
  input.placeholder = 'Name';

  label.appendChild(input);

  playerInputs.appendChild(label);
}

// =========================
// RESTART
// =========================

function restartGame() {

  playerForm.reset();

  startScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');

  choicesContainer.innerHTML = '';

  gameState.players = [];
  gameState.currentPlayerIndex = 0;
  gameState.gameActive = false;
  gameState.phase = 'idle';
  gameState.winnerIndex = null;
}

// =========================
// EVENTS
// =========================

playerForm.addEventListener('submit', event => {
  event.preventDefault();
  initGame();
});

addPlayerBtn.addEventListener('click', addPlayerInput);

rollBtn.addEventListener('click', rollDice);

restartBtn.addEventListener('click', restartGame);

// =========================
// INITIAL SCREEN STATE
// =========================

startScreen.classList.remove('hidden');
gameScreen.classList.add('hidden');
resultScreen.classList.add('hidden');