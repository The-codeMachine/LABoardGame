# The Slave Dancer - Board Game Rules

## Overview
Players journey across a 28-space board representing a voyage aboard a ship. The game focuses on moral and personal consequences—there are no "correct" answers, only difficult choices that shape who you become. When a player reaches the final space the game enters endgame mode and final scoring determines the winner.

---

## Setup
1. **2–4 players** each choose a color.
2. Each player begins at **Space 1** with:
   - **Survival: 10**
   - **Humanity: 10**
   - **Resolve: 10**
   - **riskLevel: 0** (tracks how often risky choices are taken)
3. Place player markers on the starting space.

**Note:** The game enforces a `maxStat` of 15; stats are clamped between 0 and 15.

---

## Turn Structure (One Complete Turn Per Player)

### Step 1: Roll the Die
- Roll a standard 6-sided die and move your marker forward that many spaces (the track uses 28 spaces).

### Step 2: Land on a Space & Trigger Event
- Read the event text for that space aloud.
- You will be presented with 2–3 choices (some may be marked **⚠ Risky**).

### Step 3: Make Your Choice
- Pick one option; each shows explicit stat changes (e.g., "+2 Survival, -1 Humanity").

### Step 4: Resolve Your Choice
- If the choice is risky, the game computes a failure chance. The implemented formula is:

  `failureChance = clamp(55 - (relevantStat * 4) + (player.riskLevel * 5), 5, 65)`

  - `relevantStat` is Survival for physical events, Resolve for mental events, or Humanity for moral events.
  - `player.riskLevel` increases when the player takes risky actions and raises the failure chance.
  - The result is clamped between 5% and 65%.

- If a risky action fails:
  - The player's `riskLevel` increments.
  - The failure penalty subtracts **2 points** from the most relevant stat and **1 point** from Resolve, and the intended gains do not apply.

- If the risky action succeeds, the listed stat changes are applied.

- After applying choice effects, the game enforces stat bounds (0..15) and applies state-driven consequences:
  - If Humanity ≤ 3: Lose 1 Resolve.
  - If Resolve ≤ 2: Lose 1 Survival.
  - If Resolve ≥ 12 and Humanity ≥ 8: Gain 1 Survival.

### Step 5: End Your Turn
- The next player takes their turn. When a player reaches the final board space the game enters endgame mode (see below).

---

## The Three Stats

| Stat | Meaning | Impact |
|------|---------|--------|
| **Survival** | Physical endurance | Helps resist physical penalties and survive harsh events |
| **Humanity** | Compassion and moral integrity | Reflects the player's empathy and moral choices |
| **Resolve** | Mental strength | Reduces failure chances for mental/risky actions and influences Survival |

---

## Endgame & Winning
- When a player reaches the final space (space 28) the game records that player as the `shore` player and enters endgame mode: every other player receives one final turn.
- After those final turns, the game compares total scores.

**Final Scoring:**

```
Total Score = Survival + Humanity + Resolve
```

- The `shore` player (the first to reach the final space) receives a +2 shore bonus to their score during the final comparison.
- The player with the highest adjusted total wins. If tied, players share the victory.

---

## Important Rules & Notes

- Stats are clamped to a floor of 0 and a ceiling of 15.
- The `riskLevel` influences failure chances and increases when risky choices are attempted.
- Events and choices are deterministic text-driven outcomes; the randomness comes from die rolls and risk checks.
- The game is intended to prompt discussion and reflection rather than competitive optimization.

---

## Game Length
- Typical game: 10–30 minutes (depends on die rolls and player discussion).
- Shorter variant: First player to finish 2 full circuits wins (implement by adjusting rules, not enforced in code).

---

## Print Version Notes
- Events are tied to specific board spaces (1–28).
- Each event has 2–3 choice options with stat changes printed for quick reference.

