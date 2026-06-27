/**
 * Rock Paper Scissors — Telegram Mini App
 * =========================================
 * Production-quality game with:
 *  - Full Telegram Web App SDK integration
 *  - LocalStorage persistence
 *  - Haptic feedback
 *  - Confetti animation
 *  - Audio via Web Audio API (no external files)
 *  - Win streak tracking
 *  - Motivational messages
 *  - Reset confirmation dialog
 */

/* ════════════════════════════════════════════════
   CONSTANTS & CONFIGURATION
   ════════════════════════════════════════════════ */

const CHOICES = ["rock", "paper", "scissors"];

const CHOICE_EMOJI = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

/** Win rules: key beats value */
const BEATS = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
};

const STORAGE_KEY = "rps_game_state";

const WIN_MESSAGES = [
  "Flawless victory! 🔥",
  "You're on fire!",
  "Keep it up, champ!",
  "Unstoppable! ⚡",
  "GG, you crushed it!",
  "Dominant play! 💪",
  "Too easy for you!",
  "The CPU never stood a chance.",
];

const LOSE_MESSAGES = [
  "The CPU got lucky…",
  "Shake it off. Next round!",
  "Almost had it!",
  "Revenge is coming! 😤",
  "Don't let it get to you.",
  "Reset. Breathe. Go again.",
  "Every loss is a lesson.",
];

const DRAW_MESSAGES = [
  "Great minds think alike.",
  "Mirror match! 🪞",
  "Same brain, different players.",
  "Is the CPU reading your mind?",
  "Break the tie next round!",
];

/* ════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════ */

const state = {
  scores: { player: 0, computer: 0, draws: 0 },
  streak: { current: 0, best: 0 },
  soundEnabled: true,
  isPlaying: false, // lock during animation
  audioCtx: null, // lazy Web Audio context
};

/* ════════════════════════════════════════════════
   DOM REFERENCES
   ════════════════════════════════════════════════ */

const $ = (id) => document.getElementById(id);

const dom = {
  playerName: $("player-name"),
  playerAvatar: $("player-avatar"),
  playerAvatarFallback: $("player-avatar-fallback"),
  playerInitials: $("player-initials"),
  scorePlayer: $("score-player"),
  scoreComputer: $("score-computer"),
  scoreDraws: $("score-draws"),
  streakCurrent: $("streak-current"),
  streakBest: $("streak-best"),
  choicePlayer: $("choice-player"),
  choiceCpu: $("choice-cpu"),
  emojiPlayer: $("choice-emoji-player"),
  emojiCpu: $("choice-emoji-cpu"),
  resultBanner: $("result-banner"),
  resultText: $("result-text"),
  resultMsg: $("result-msg"),
  btnRock: $("btn-rock"),
  btnPaper: $("btn-paper"),
  btnScissors: $("btn-scissors"),
  btnReset: $("btn-reset"),
  btnSound: $("btn-sound"),
  soundIcon: $("sound-icon"),
  resetModal: $("reset-modal"),
  btnCancelReset: $("btn-cancel-reset"),
  btnConfirmReset: $("btn-confirm-reset"),
  confettiCanvas: $("confetti-canvas"),
};

const choiceBtns = [dom.btnRock, dom.btnPaper, dom.btnScissors];

/* ════════════════════════════════════════════════
   TELEGRAM INTEGRATION
   ════════════════════════════════════════════════ */

/**
 * Initialise Telegram Web App SDK.
 * Gracefully falls back when running outside Telegram.
 */
function initTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;

  tg.ready();
  tg.expand();

  // Apply Telegram color scheme to <body>
  document.body.classList.add("tg-theme");

  if (tg.colorScheme === "light") {
    document.body.style.setProperty(
      "--tg-theme-bg-color",
      tg.themeParams.bg_color || "#EFF3FB",
    );
    document.body.style.setProperty(
      "--tg-theme-text-color",
      tg.themeParams.text_color || "#0F172A",
    );
    document.body.style.setProperty(
      "--tg-theme-button-color",
      tg.themeParams.button_color || "#3B82F6",
    );
  }

  // Populate user identity
  const user = tg.initDataUnsafe?.user;
  if (!user) return;

  // Name
  const displayName = user.first_name || user.username || "You";
  dom.playerName.textContent =
    displayName.length > 9 ? displayName.slice(0, 8) + "…" : displayName;

  // Initials for fallback avatar
  dom.playerInitials.textContent = displayName.charAt(0).toUpperCase();

  // Profile photo (only available via Telegram's photo_url in some versions)
  if (user.photo_url) {
    dom.playerAvatar.src = user.photo_url;
    dom.playerAvatar.hidden = false;
    dom.playerAvatarFallback.hidden = true;
    dom.playerAvatar.onerror = () => {
      dom.playerAvatar.hidden = true;
      dom.playerAvatarFallback.hidden = false;
    };
  }
}

/**
 * Trigger haptic feedback via Telegram SDK if available.
 * @param {'light'|'medium'|'heavy'|'error'|'success'|'warning'} type
 */
function triggerHaptic(type) {
  const tg = window.Telegram?.WebApp;
  if (!tg?.HapticFeedback) return;
  if (["light", "medium", "heavy"].includes(type)) {
    tg.HapticFeedback.impactOccurred(type);
  } else {
    tg.HapticFeedback.notificationOccurred(type);
  }
}

/* ════════════════════════════════════════════════
   LOCAL STORAGE
   ════════════════════════════════════════════════ */

/** Persist current state to LocalStorage. */
function saveState() {
  try {
    const data = {
      scores: state.scores,
      streak: state.streak,
      soundEnabled: state.soundEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {
    /* storage unavailable */
  }
}

/** Restore state from LocalStorage. */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.scores) Object.assign(state.scores, data.scores);
    if (data.streak) Object.assign(state.streak, data.streak);
    if (typeof data.soundEnabled === "boolean") {
      state.soundEnabled = data.soundEnabled;
    }
  } catch (_) {
    /* corrupt data */
  }
}

/* ════════════════════════════════════════════════
   AUDIO (Web Audio API — no external files needed)
   ════════════════════════════════════════════════ */

/**
 * Lazily create the AudioContext (must be after user gesture).
 * @returns {AudioContext|null}
 */
function getAudioContext() {
  if (!state.audioCtx) {
    try {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
      return null;
    }
  }
  return state.audioCtx;
}

/**
 * Play a synthesised sound effect.
 * @param {'click'|'win'|'lose'|'draw'} type
 */
function playSound(type) {
  if (!state.soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  switch (type) {
    case "click":
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(520, now);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      oscillator.start(now);
      oscillator.stop(now + 0.08);
      break;

    case "win": {
      // Ascending arpeggio
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.18, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
      return; // early return — we handle cleanup per-oscillator above
    }

    case "lose":
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(220, now);
      oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.35);
      gainNode.gain.setValueAtTime(0.18, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;

    case "draw":
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.setValueAtTime(440, now + 0.12);
      gainNode.gain.setValueAtTime(0.14, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;
  }
}

/* ════════════════════════════════════════════════
   CONFETTI
   ════════════════════════════════════════════════ */

const confettiParticles = [];

/**
 * Launch a confetti burst on the canvas.
 */
function launchConfetti() {
  const canvas = dom.confettiCanvas;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colours = [
    "#3B82F6",
    "#8B5CF6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#06B6D4",
  ];
  const count = 90;

  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4 - canvas.height * 0.2,
      r: Math.random() * 6 + 3,
      d: Math.random() * count,
      color: colours[Math.floor(Math.random() * colours.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: Math.random() * 0.07 + 0.05,
      opacity: 1,
    });
  }

  let frame;
  let elapsed = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elapsed++;

    confettiParticles.forEach((p, i) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 3, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 5);
      ctx.stroke();
      ctx.restore();

      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(p.d + elapsed * 0.02) + 1.5 + p.r / 2) * 1.1;
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 12;
      if (elapsed > 80) p.opacity -= 0.013;
    });

    if (elapsed < 160 && confettiParticles.some((p) => p.opacity > 0)) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParticles.length = 0;
    }
  }

  if (frame) cancelAnimationFrame(frame);
  draw();
}

/* ════════════════════════════════════════════════
   CORE GAME LOGIC
   ════════════════════════════════════════════════ */

/**
 * Randomly pick rock, paper, or scissors.
 * @returns {'rock'|'paper'|'scissors'}
 */
function generateComputerChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

/**
 * Determine the round outcome.
 * @param {'rock'|'paper'|'scissors'} player
 * @param {'rock'|'paper'|'scissors'} computer
 * @returns {'win'|'lose'|'draw'}
 */
function determineWinner(player, computer) {
  if (player === computer) return "draw";
  return BEATS[player] === computer ? "win" : "lose";
}

/**
 * Update scores and streak; persist to LocalStorage.
 * @param {'win'|'lose'|'draw'} outcome
 */
function updateScore(outcome) {
  if (outcome === "win") {
    state.scores.player++;
    state.streak.current++;
    if (state.streak.current > state.streak.best) {
      state.streak.best = state.streak.current;
    }
  } else if (outcome === "lose") {
    state.scores.computer++;
    state.streak.current = 0;
  } else {
    state.scores.draws++;
    // streak persists on draw
  }

  saveState();
}

/**
 * Animate a score element with a pop effect.
 * @param {HTMLElement} el
 */
function animateScore(el) {
  el.classList.remove("pop");
  // Force reflow to restart animation
  void el.offsetWidth;
  el.classList.add("pop");
}

/**
 * Refresh all score + streak DOM elements.
 * @param {'win'|'lose'|'draw'} outcome
 */
function renderScoreboard(outcome) {
  dom.scorePlayer.textContent = state.scores.player;
  dom.scoreComputer.textContent = state.scores.computer;
  dom.scoreDraws.textContent = state.scores.draws;
  dom.streakCurrent.textContent = state.streak.current;
  dom.streakBest.textContent = state.streak.best;

  // Animate the relevant score
  if (outcome === "win") animateScore(dom.scorePlayer);
  if (outcome === "lose") animateScore(dom.scoreComputer);
  if (outcome === "draw") animateScore(dom.scoreDraws);
}

/**
 * Render choice emojis and trigger reveal animation.
 * @param {string} playerChoice
 * @param {string} computerChoice
 */
function renderChoices(playerChoice, computerChoice) {
  dom.emojiPlayer.textContent = CHOICE_EMOJI[playerChoice];
  dom.emojiCpu.textContent = CHOICE_EMOJI[computerChoice];

  // Remove old state classes
  ["win-glow", "lose-glow", "draw-glow", "thinking"].forEach((cls) => {
    dom.choicePlayer.classList.remove(cls);
    dom.choiceCpu.classList.remove(cls);
  });

  // Restart reveal animation
  dom.choicePlayer.classList.remove("reveal");
  dom.choiceCpu.classList.remove("reveal");
  void dom.choicePlayer.offsetWidth;
  void dom.choiceCpu.offsetWidth;
  dom.choicePlayer.classList.add("reveal");
  dom.choiceCpu.classList.add("reveal");
}

/**
 * Apply outcome-specific visual feedback (glows, shake, bounce).
 * @param {'win'|'lose'|'draw'} outcome
 */
function applyOutcomeEffects(outcome) {
  const playerSide =
    dom.choicePlayer.closest(".arena-side") || dom.choicePlayer.parentElement;
  const cpuSide =
    dom.choiceCpu.closest(".arena-side") || dom.choiceCpu.parentElement;

  // Remove old animation classes
  ["shake", "bounce"].forEach((cls) => {
    playerSide?.classList.remove(cls);
    cpuSide?.classList.remove(cls);
  });
  void dom.choicePlayer.offsetWidth; // reflow

  if (outcome === "win") {
    dom.choicePlayer.classList.add("win-glow");
    dom.choiceCpu.classList.add("lose-glow");
    playerSide?.classList.add("bounce");
  } else if (outcome === "lose") {
    dom.choicePlayer.classList.add("lose-glow");
    dom.choiceCpu.classList.add("win-glow");
    playerSide?.classList.add("shake");
  } else {
    dom.choicePlayer.classList.add("draw-glow");
    dom.choiceCpu.classList.add("draw-glow");
  }
}

/**
 * Update the result banner with outcome text and motivational message.
 * @param {'win'|'lose'|'draw'} outcome
 */
function showResult(outcome) {
  const resultMap = {
    win: { label: "You Win! 🎉", pool: WIN_MESSAGES },
    lose: { label: "You Lose 😢", pool: LOSE_MESSAGES },
    draw: { label: "It's a Draw 🤝", pool: DRAW_MESSAGES },
  };

  const { label, pool } = resultMap[outcome];
  const msg = pool[Math.floor(Math.random() * pool.length)];

  dom.resultText.textContent = label;
  dom.resultMsg.textContent = msg;

  // Update banner styles
  dom.resultBanner.className = `result-banner ${outcome} result-fade`;
  // Remove animation class after it plays so it can re-trigger next round
  dom.resultBanner.addEventListener(
    "animationend",
    () => {
      dom.resultBanner.classList.remove("result-fade");
    },
    { once: true },
  );
}

/* ════════════════════════════════════════════════
   LOADING ANIMATION
   ════════════════════════════════════════════════ */

/** Show thinking state before revealing CPU choice. */
function showThinking() {
  dom.emojiCpu.textContent = "🤔";
  dom.choiceCpu.classList.add("thinking");
}

/** Remove thinking state. */
function clearThinking() {
  dom.choiceCpu.classList.remove("thinking");
}

/* ════════════════════════════════════════════════
   BUTTON STATE
   ════════════════════════════════════════════════ */

/**
 * Enable or disable all choice buttons.
 * @param {boolean} enabled
 */
function setButtonsEnabled(enabled) {
  choiceBtns.forEach((btn) => {
    btn.disabled = !enabled;
  });
}

/**
 * Mark the selected button visually.
 * @param {string} choice
 */
function highlightSelected(choice) {
  choiceBtns.forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.choice === choice);
  });
}

/**
 * Clear selection highlight from all buttons.
 */
function clearSelected() {
  choiceBtns.forEach((btn) => btn.classList.remove("selected"));
}

/* ════════════════════════════════════════════════
   RIPPLE EFFECT
   ════════════════════════════════════════════════ */

/**
 * Create a ripple effect on a button at the touch/click position.
 * @param {MouseEvent|TouchEvent} event
 * @param {HTMLElement} button
 */
function addRipple(event, button) {
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x =
    (event.clientX ||
      event.touches?.[0]?.clientX ||
      rect.left + rect.width / 2) -
    rect.left -
    size / 2;
  const y =
    (event.clientY ||
      event.touches?.[0]?.clientY ||
      rect.top + rect.height / 2) -
    rect.top -
    size / 2;
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), {
    once: true,
  });
}

/* ════════════════════════════════════════════════
   MAIN ROUND FLOW
   ════════════════════════════════════════════════ */

/**
 * Execute a full game round.
 * @param {'rock'|'paper'|'scissors'} playerChoice
 */
async function playRound(playerChoice) {
  if (state.isPlaying) return;
  state.isPlaying = true;

  // 1. Disable buttons & show selection
  setButtonsEnabled(false);
  highlightSelected(playerChoice);
  playSound("click");
  triggerHaptic("light");

  // Show player emoji immediately
  dom.emojiPlayer.textContent = CHOICE_EMOJI[playerChoice];
  dom.choicePlayer.classList.remove(
    "win-glow",
    "lose-glow",
    "draw-glow",
    "reveal",
  );
  void dom.choicePlayer.offsetWidth;
  dom.choicePlayer.classList.add("reveal");

  // 2. Show thinking animation for 0.8s
  showThinking();
  dom.resultText.textContent = "CPU is thinking…";
  dom.resultMsg.textContent = "";
  dom.resultBanner.className = "result-banner";

  await delay(800);

  // 3. Generate computer choice & clear thinking
  const computerChoice = generateComputerChoice();
  clearThinking();

  // 4. Reveal both choices
  renderChoices(playerChoice, computerChoice);

  await delay(300); // brief pause for reveal animation to settle

  // 5. Determine winner
  const outcome = determineWinner(playerChoice, computerChoice);

  // 6. Update scores
  updateScore(outcome);

  // 7. Apply visual outcome effects
  applyOutcomeEffects(outcome);

  // 8. Show result banner
  showResult(outcome);

  // 9. Render updated scoreboard
  renderScoreboard(outcome);

  // 10. Sound & haptics per outcome
  if (outcome === "win") {
    playSound("win");
    triggerHaptic("success");
    launchConfetti();
  } else if (outcome === "lose") {
    playSound("lose");
    triggerHaptic("error");
  } else {
    playSound("draw");
    triggerHaptic("medium");
  }

  // 11. Re-enable buttons after a short pause
  await delay(600);
  setButtonsEnabled(true);
  clearSelected();
  state.isPlaying = false;
}

/* ════════════════════════════════════════════════
   RESET
   ════════════════════════════════════════════════ */

/** Show the reset confirmation modal. */
function showResetModal() {
  dom.resetModal.hidden = false;
  dom.btnCancelReset.focus();
}

/** Hide the reset confirmation modal. */
function hideResetModal() {
  dom.resetModal.hidden = true;
}

/**
 * Fully reset the game state, scores, and DOM.
 */
function resetGame() {
  state.scores = { player: 0, computer: 0, draws: 0 };
  state.streak = { current: 0, best: 0 };
  state.isPlaying = false;

  saveState();

  // Reset score DOM
  dom.scorePlayer.textContent = "0";
  dom.scoreComputer.textContent = "0";
  dom.scoreDraws.textContent = "0";
  dom.streakCurrent.textContent = "0";
  dom.streakBest.textContent = "0";

  // Reset arena
  dom.emojiPlayer.textContent = "❓";
  dom.emojiCpu.textContent = "❓";
  ["win-glow", "lose-glow", "draw-glow", "reveal", "thinking"].forEach(
    (cls) => {
      dom.choicePlayer.classList.remove(cls);
      dom.choiceCpu.classList.remove(cls);
    },
  );

  // Reset result banner
  dom.resultBanner.className = "result-banner";
  dom.resultText.textContent = "Choose your weapon!";
  dom.resultMsg.textContent = "Tap a button to begin";

  // Re-enable buttons
  setButtonsEnabled(true);
  clearSelected();

  triggerHaptic("medium");
  playSound("click");
  hideResetModal();
}

/* ════════════════════════════════════════════════
   SOUND TOGGLE
   ════════════════════════════════════════════════ */

/** Toggle mute/unmute and persist preference. */
function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  dom.soundIcon.textContent = state.soundEnabled ? "🔊" : "🔇";
  saveState();
  if (state.soundEnabled) playSound("click");
}

/* ════════════════════════════════════════════════
   UTILITIES
   ════════════════════════════════════════════════ */

/**
 * Promise-based timeout.
 * @param {number} ms
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ════════════════════════════════════════════════
   EVENT LISTENERS
   ════════════════════════════════════════════════ */

function bindEvents() {
  // Choice buttons
  choiceBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      addRipple(e, btn);
      playRound(btn.dataset.choice);
    });
  });

  // Sound toggle
  dom.btnSound.addEventListener("click", toggleSound);

  // Reset button → show modal
  dom.btnReset.addEventListener("click", () => {
    triggerHaptic("light");
    showResetModal();
  });

  // Modal cancel
  dom.btnCancelReset.addEventListener("click", hideResetModal);

  // Modal confirm reset
  dom.btnConfirmReset.addEventListener("click", resetGame);

  // Close modal on overlay click
  dom.resetModal.addEventListener("click", (e) => {
    if (e.target === dom.resetModal) hideResetModal();
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !dom.resetModal.hidden) hideResetModal();
  });

  // Handle canvas resize for confetti
  window.addEventListener("resize", () => {
    dom.confettiCanvas.width = window.innerWidth;
    dom.confettiCanvas.height = window.innerHeight;
  });
}

/* ════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════ */

/**
 * Bootstrap the entire application.
 */
function initGame() {
  // 1. Load persisted state
  loadState();

  // 2. Set up Telegram integration
  initTelegram();

  // 3. Restore UI from persisted state
  dom.scorePlayer.textContent = state.scores.player;
  dom.scoreComputer.textContent = state.scores.computer;
  dom.scoreDraws.textContent = state.scores.draws;
  dom.streakCurrent.textContent = state.streak.current;
  dom.streakBest.textContent = state.streak.best;
  dom.soundIcon.textContent = state.soundEnabled ? "🔊" : "🔇";

  // 4. Bind all event listeners
  bindEvents();

  // 5. Ready!
  console.info("🪨📄✂️ Rock Paper Scissors — ready!");
}

// Start the game when DOM is ready
document.addEventListener("DOMContentLoaded", initGame);
