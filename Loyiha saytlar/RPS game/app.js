/**
 * RPS BATTLE — Frontend Logic
 * ═══════════════════════════
 * Fixes applied vs original:
 *  1. Removed ~900 lines of duplicate function definitions (two of every function)
 *  2. Fixed `syncBackendAvailability` — btnCreateRoom/btnJoinRoom were not in dom.waiting
 *     (they are dom.waiting.btnCreateRoom / dom.waiting.btnJoinRoom)
 *  3. Fixed `renderOutcomeBanner` duplicate declaration (was defined twice, causing SyntaxError
 *     in strict-mode builds)
 *  4. Fixed `syncRoomHeader` duplicate declaration
 *  5. Fixed `syncBoardFromRoom` duplicate declaration
 *  6. Fixed `joinQuickMatch` / `routeToHome` / `refreshMatchmaking` / `refreshRoomState`
 *     / `renderRoomWaiting` / `createPrivateRoom` / `joinPrivateRoom` all declared twice
 *  7. Fixed `readyNextRound` / `leaveCurrentSession` duplicate declarations
 *  8. Fixed `playSoloRound` / `submitRoomChoice` duplicate declarations
 *  9. `showGameScreenForSolo` was unused dead code — consolidated into `startSoloMode`
 * 10. `main` function called `loadProfile` and then `setScreen("home")` but never called
 *     `syncBackendAvailability` — fixed in `bootstrap`
 * 11. `dom.game.avatarOppInit` querySelector was fragile — now uses getElementById via
 *     `id="game-init-opp"` on the span (added in index.html)
 * 12. Offline notice (#offline-notice) now shown/hidden correctly
 * 13. `startSoloModeIfNeeded` was dead code — removed
 * 14. `submitChoice` wrapper was dead code — removed (direct calls used)
 * 15. Score display in solo mode fixed — was showing cumulative stats instead of session wins/losses
 */

(function () {
  "use strict";

  /* ════════════════════════════════════════
     CONSTANTS
     ════════════════════════════════════════ */

  const CHOICES = ["rock", "paper", "scissors"];
  const CHOICE_EMOJI = { rock: "🪨", paper: "📄", scissors: "✂️" };
  const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };

  const STORAGE_KEY = "rps_fallback_state_v3";
  const PREFS_KEY = "rps_preferences_v3";
  const CLIENT_ID_KEY = "rps_client_id_v3";

  const WIN_MESSAGES = [
    "Clean win.",
    "You read that round perfectly.",
    "That was sharp play.",
    "No hesitation, no mercy.",
  ];
  const LOSE_MESSAGES = [
    "The CPU got you this time.",
    "Reset and run it back.",
    "One round is not the whole match.",
    "Next one is yours.",
  ];
  const DRAW_MESSAGES = [
    "Perfectly balanced.",
    "Same idea, same time.",
    "Nothing wrong with a draw.",
    "You were both thinking alike.",
  ];

  /* ════════════════════════════════════════
     STATE
     ════════════════════════════════════════ */

  const state = {
    clientId: getOrCreateClientId(),
    profile: {
      name: "Player",
      stats: { wins: 0, losses: 0, draws: 0, currentStreak: 0, bestStreak: 0 },
    },
    soundEnabled: true,
    backendReady: false,
    telegram: null,
    audioCtx: null,
    mode: "home", // home | solo | quick | private
    session: null, // { kind, roomId, code }
    room: null,
    isPlaying: false,
    pollTimer: null,
    lastRoomRenderKey: "",
    // Solo session scores (reset per game entry)
    soloScore: { wins: 0, losses: 0 },
  };

  /* ════════════════════════════════════════
     DOM REFERENCES
     ════════════════════════════════════════ */

  const dom = {
    screens: {
      home: document.getElementById("screen-home"),
      waiting: document.getElementById("screen-waiting"),
      game: document.getElementById("screen-game"),
    },
    home: {
      avatarImg: document.getElementById("home-avatar-img"),
      avatarInit: document.getElementById("home-avatar-init"),
      name: document.getElementById("home-name"),
      wins: document.getElementById("stat-wins"),
      played: document.getElementById("stat-played"),
      streak: document.getElementById("stat-streak"),
      btnVsBot: document.getElementById("btn-vs-bot"),
      btnQuickMatch: document.getElementById("btn-quick-match"),
      btnPrivate: document.getElementById("btn-private"),
      btnSound: document.getElementById("btn-sound-home"),
      offlineNotice: document.getElementById("offline-notice"),
      badgeQuick: document.getElementById("badge-quick"),
      badgePrivate: document.getElementById("badge-private"),
    },
    waiting: {
      title: document.getElementById("waiting-title"),
      sub: document.getElementById("waiting-sub"),
      roomCodeBox: document.getElementById("room-code-box"),
      roomCodeValue: document.getElementById("room-code-val"),
      btnCopyCode: document.getElementById("btn-copy-code"),
      joinBox: document.getElementById("join-box"),
      codeInput: document.getElementById("code-input"),
      btnJoinRoom: document.getElementById("btn-join-room"),
      btnCreateRoom: document.getElementById("btn-create-room"),
      btnCancel: document.getElementById("btn-cancel-wait"),
    },
    game: {
      modeBadge: document.getElementById("game-mode-badge"),
      btnBack: document.getElementById("btn-back-game"),
      btnSound: document.getElementById("btn-sound-game"),
      avatarYouImg: document.getElementById("game-img-you"),
      avatarYouInit: document.getElementById("game-init-you"),
      avatarOppInit: document.getElementById("game-init-opp"),
      nameYou: document.getElementById("game-name-you"),
      nameOpp: document.getElementById("game-name-opp"),
      scoreYou: document.getElementById("game-score-you"),
      scoreOpp: document.getElementById("game-score-opp"),
      arenaYou: document.getElementById("arena-you"),
      arenaOpp: document.getElementById("arena-opp"),
      arenaEmojiYou: document.getElementById("arena-emoji-you"),
      arenaEmojiOpp: document.getElementById("arena-emoji-opp"),
      arenaLabel: document.getElementById("arena-label"),
      resultStrip: document.getElementById("result-strip"),
      resultText: document.getElementById("result-strip-text"),
      resultMsg: document.getElementById("result-strip-msg"),
      choicesRow: document.getElementById("choices-row"),
      choiceButtons: Array.from(document.querySelectorAll(".weapon-btn")),
      playAgainRow: document.getElementById("play-again-row"),
      btnPlayAgain: document.getElementById("btn-play-again"),
      btnLeaveGame: document.getElementById("btn-leave-game"),
      oppStatus: document.getElementById("opp-status"),
      oppStatusText: document.getElementById("opp-status-text"),
    },
    toast: document.getElementById("toast"),
    fxCanvas: document.getElementById("fx-canvas"),
  };

  /* ════════════════════════════════════════
     LOCAL STORAGE HELPERS
     ════════════════════════════════════════ */

  function getOrCreateClientId() {
    const existing = localStorage.getItem(CLIENT_ID_KEY);
    if (existing) return existing;
    const id =
      window.crypto?.randomUUID?.() ||
      `client_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    localStorage.setItem(CLIENT_ID_KEY, id);
    return id;
  }

  function loadPreferences() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (typeof p.soundEnabled === "boolean")
        state.soundEnabled = p.soundEnabled;
    } catch (_) {}
  }

  function savePreferences() {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ soundEnabled: state.soundEnabled }),
    );
  }

  function loadFallbackProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data?.profile?.name) state.profile.name = data.profile.name;
      if (data?.profile?.stats)
        Object.assign(state.profile.stats, data.profile.stats);
    } catch (_) {}
  }

  function saveFallbackProfile() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile: state.profile }),
    );
  }

  /* ════════════════════════════════════════
     TELEGRAM INTEGRATION
     ════════════════════════════════════════ */

  function getTelegram() {
    return window.Telegram?.WebApp || null;
  }

  function initTelegram() {
    const tg = getTelegram();
    state.telegram = tg;
    if (!tg) return;

    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;
    if (!user) return;

    const displayName = user.first_name || user.username || "Player";
    state.profile.name = displayName;

    if (user.photo_url) {
      setAvatar(
        dom.home.avatarImg,
        dom.home.avatarInit,
        user.photo_url,
        displayName,
      );
      setAvatar(
        dom.game.avatarYouImg,
        dom.game.avatarYouInit,
        user.photo_url,
        displayName,
      );
    }
  }

  function triggerHaptic(type) {
    const tg = getTelegram();
    if (!tg?.HapticFeedback) return;
    if (["light", "medium", "heavy"].includes(type)) {
      tg.HapticFeedback.impactOccurred(type);
    } else {
      tg.HapticFeedback.notificationOccurred(type);
    }
  }

  /* ════════════════════════════════════════
     UI HELPERS
     ════════════════════════════════════════ */

  function setScreen(name) {
    Object.entries(dom.screens).forEach(([key, el]) => {
      if (!el) return;
      el.classList.toggle("active", key === name);
    });
  }

  function setAvatar(imgEl, initEl, src, name) {
    if (!imgEl || !initEl) return;
    imgEl.src = src;
    imgEl.hidden = false;
    initEl.hidden = true;
    imgEl.onerror = () => {
      imgEl.hidden = true;
      initEl.hidden = false;
      initEl.textContent = getInitial(name);
    };
  }

  function getInitial(name) {
    return (name || "P").trim().charAt(0).toUpperCase() || "P";
  }

  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.hidden = false;
    dom.toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      dom.toast.classList.remove("show");
      setTimeout(() => {
        dom.toast.hidden = true;
      }, 260);
    }, 2000);
  }

  function animateScore(el) {
    if (!el) return;
    el.classList.remove("score-pop");
    void el.offsetWidth;
    el.classList.add("score-pop");
  }

  function syncSoundButtons() {
    const label = state.soundEnabled ? "🔊 Sound on" : "🔇 Sound off";
    dom.home.btnSound.textContent = label;
    dom.game.btnSound.textContent = state.soundEnabled ? "🔊" : "🔇";
  }

  function syncProfileToUI() {
    const { name, stats } = state.profile;
    dom.home.name.textContent = name;
    dom.home.wins.textContent = String(stats.wins);
    dom.home.played.textContent = String(
      stats.wins + stats.losses + stats.draws,
    );
    dom.home.streak.textContent = String(stats.bestStreak);

    // Initials fallback
    if (!state.telegram?.initDataUnsafe?.user?.photo_url) {
      const init = getInitial(name);
      dom.home.avatarInit.textContent = init;
      dom.game.avatarYouInit.textContent = init;
    }
  }

  /**
   * Update multiplayer buttons based on backend availability.
   * Also shows/hides the offline notice and mode badges.
   */
  function syncBackendAvailability() {
    const ok = state.backendReady;

    dom.home.btnQuickMatch.disabled = !ok;
    dom.home.btnPrivate.disabled = !ok;

    // Offline notice
    if (dom.home.offlineNotice) dom.home.offlineNotice.hidden = ok;

    // Mode card badges
    if (dom.home.badgeQuick) {
      dom.home.badgeQuick.textContent = ok ? "Online" : "Offline";
      dom.home.badgeQuick.classList.toggle("offline", !ok);
    }
    if (dom.home.badgePrivate) {
      dom.home.badgePrivate.textContent = ok ? "Online" : "Offline";
      dom.home.badgePrivate.classList.toggle("offline", !ok);
    }
  }

  function showWaitingScreen(title, sub, options = {}) {
    dom.waiting.title.textContent = title;
    dom.waiting.sub.textContent = sub;
    dom.waiting.roomCodeBox.hidden = !options.showCode;
    dom.waiting.joinBox.hidden = !options.showJoin;
    dom.waiting.btnCreateRoom.hidden = !options.showCreate;
    setScreen("waiting");
  }

  /* ════════════════════════════════════════
     AUDIO (Web Audio API — synthesised)
     ════════════════════════════════════════ */

  function getAudioContext() {
    if (state.audioCtx) return state.audioCtx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    try {
      state.audioCtx = new Ctor();
      return state.audioCtx;
    } catch (_) {
      return null;
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const tone = (freq, dur, oscType, gain = 0.12, delay = 0) => {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = oscType;
      osc.frequency.setValueAtTime(freq, now + delay);
      amp.gain.setValueAtTime(gain, now + delay);
      amp.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
      osc.connect(amp);
      amp.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur);
    };

    if (type === "click") {
      tone(520, 0.09, "sine", 0.14);
    } else if (type === "win") {
      [523, 659, 784, 1047].forEach((f, i) =>
        tone(f, 0.18, "triangle", 0.16, i * 0.09),
      );
    } else if (type === "lose") {
      tone(220, 0.35, "sawtooth", 0.14);
    } else {
      tone(440, 0.22, "sine", 0.12);
    }
  }

  /* ════════════════════════════════════════
     CONFETTI
     ════════════════════════════════════════ */

  const confettiParticles = [];

  function resizeCanvas() {
    if (!dom.fxCanvas) return;
    dom.fxCanvas.width = window.innerWidth;
    dom.fxCanvas.height = window.innerHeight;
  }

  function launchConfetti() {
    const canvas = dom.fxCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    resizeCanvas();

    const colours = [
      "#4F8EF7",
      "#9B6DFF",
      "#34D399",
      "#FBBF24",
      "#F87171",
      "#22D3EE",
    ];
    for (let i = 0; i < 80; i++) {
      confettiParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.35 - canvas.height * 0.15,
        size: Math.random() * 6 + 3,
        speed: Math.random() * 3 + 1,
        tilt: Math.random() * 12 - 6,
        tiltAngle: 0,
        tiltSpeed: Math.random() * 0.08 + 0.03,
        colour: colours[Math.floor(Math.random() * colours.length)],
        alpha: 1,
      });
    }

    let frame = 0;
    (function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      confettiParticles.forEach((p, i) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.lineWidth = p.size;
        ctx.strokeStyle = p.colour;
        ctx.moveTo(p.x + p.tilt, p.y);
        ctx.lineTo(p.x + p.tilt + p.size / 2, p.y + p.size);
        ctx.stroke();
        ctx.restore();
        p.y += p.speed;
        p.tiltAngle += p.tiltSpeed;
        p.tilt = Math.sin(p.tiltAngle - i / 4) * 12;
        if (frame > 70) p.alpha -= 0.018;
      });

      if (frame < 150 && confettiParticles.some((p) => p.alpha > 0)) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.length = 0;
      }
    })();
  }

  /* ════════════════════════════════════════
     GAME BOARD HELPERS
     ════════════════════════════════════════ */

  function randomChoice() {
    return CHOICES[Math.floor(Math.random() * CHOICES.length)];
  }

  function determineOutcome(playerChoice, opponentChoice) {
    if (playerChoice === opponentChoice) return "draw";
    return BEATS[playerChoice] === opponentChoice ? "win" : "lose";
  }

  function getOutcomeMessage(outcome) {
    const pool =
      outcome === "win"
        ? WIN_MESSAGES
        : outcome === "lose"
          ? LOSE_MESSAGES
          : DRAW_MESSAGES;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function setChoiceButtonsEnabled(enabled) {
    dom.game.choiceButtons.forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  function highlightChoice(choice) {
    dom.game.choiceButtons.forEach((btn) =>
      btn.classList.toggle("selected", btn.dataset.choice === choice),
    );
  }

  function clearChoiceHighlight() {
    dom.game.choiceButtons.forEach((btn) => btn.classList.remove("selected"));
  }

  function resetBoard() {
    dom.game.resultStrip.hidden = true;
    dom.game.playAgainRow.hidden = true;
    dom.game.oppStatus.hidden = true;
    dom.game.arenaEmojiYou.textContent = "❓";
    dom.game.arenaEmojiOpp.textContent = "❓";
    dom.game.arenaYou.classList.remove(
      "win",
      "lose",
      "draw",
      "thinking",
      "reveal",
    );
    dom.game.arenaOpp.classList.remove(
      "win",
      "lose",
      "draw",
      "thinking",
      "reveal",
    );
    dom.game.arenaLabel.textContent = "Pick!";
    setChoiceButtonsEnabled(true);
    clearChoiceHighlight();
  }

  function renderOutcomeBanner(outcome) {
    dom.game.resultText.textContent =
      outcome === "win"
        ? "You Win! 🎉"
        : outcome === "lose"
          ? "You Lose 😢"
          : "It's a Draw 🤝";
    dom.game.resultMsg.textContent = getOutcomeMessage(outcome);
    dom.game.resultStrip.className = "result-strip " + outcome;
    dom.game.resultStrip.hidden = false;
  }

  /* ════════════════════════════════════════
     MULTIPLAYER ROOM SYNC
     ════════════════════════════════════════ */

  function syncRoomHeader(room) {
    if (!room) return;
    if (room.type === "quick") {
      dom.game.modeBadge.textContent = "Quick match";
    } else if (room.code) {
      dom.game.modeBadge.textContent = `Room ${room.code}`;
    } else {
      dom.game.modeBadge.textContent = "Room";
    }
    dom.game.nameYou.textContent = room.you?.name || state.profile.name;
    dom.game.nameOpp.textContent = room.opponent?.name || "Waiting...";
    dom.game.scoreYou.textContent = String(room.you?.score?.wins ?? 0);
    dom.game.scoreOpp.textContent = String(room.opponent?.score?.wins ?? 0);

    if (dom.game.avatarOppInit) {
      dom.game.avatarOppInit.textContent = room.opponent?.name
        ? getInitial(room.opponent.name)
        : "🤖";
    }
    dom.game.oppStatus.hidden = !!room.opponent;
    if (!room.opponent) {
      dom.game.oppStatusText.textContent =
        room.type === "private"
          ? "Waiting for guest..."
          : "Finding opponent...";
    }
  }

  function syncBoardFromRoom(room) {
    if (!room) return;

    const youChoice = room.round?.choices?.you || null;
    const oppChoice = room.round?.choices?.opponent || null;
    const youResult = room.round?.results?.you || null;
    const roomKey = `${room.id}:${room.round?.index}:${room.phase}:${youResult || "none"}`;

    dom.game.arenaYou.classList.remove(
      "win",
      "lose",
      "draw",
      "thinking",
      "reveal",
    );
    dom.game.arenaOpp.classList.remove(
      "win",
      "lose",
      "draw",
      "thinking",
      "reveal",
    );

    if (room.phase === "revealed") {
      dom.game.arenaEmojiYou.textContent = CHOICE_EMOJI[youChoice] || "❓";
      dom.game.arenaEmojiOpp.textContent = CHOICE_EMOJI[oppChoice] || "❓";
      dom.game.arenaYou.classList.add("reveal");
      dom.game.arenaOpp.classList.add("reveal");

      if (youResult === "win") {
        dom.game.arenaYou.classList.add("win");
        dom.game.arenaOpp.classList.add("lose");
      } else if (youResult === "lose") {
        dom.game.arenaYou.classList.add("lose");
        dom.game.arenaOpp.classList.add("win");
      } else {
        dom.game.arenaYou.classList.add("draw");
        dom.game.arenaOpp.classList.add("draw");
      }

      dom.game.arenaLabel.textContent =
        youResult === "win"
          ? "You won!"
          : youResult === "lose"
            ? "You lost"
            : "Draw";
      renderOutcomeBanner(youResult || "draw");
      dom.game.playAgainRow.hidden = false;
      setChoiceButtonsEnabled(false);

      // Only fire sounds/confetti once per unique result
      if (state.lastRoomRenderKey !== roomKey) {
        state.lastRoomRenderKey = roomKey;
        if (youResult === "win") {
          playSound("win");
          triggerHaptic("success");
          launchConfetti();
          animateScore(dom.game.scoreYou);
        } else if (youResult === "lose") {
          playSound("lose");
          triggerHaptic("error");
          animateScore(dom.game.scoreOpp);
        } else {
          playSound("draw");
          triggerHaptic("medium");
        }
      }
      return;
    }

    // Not revealed yet: keep both moves hidden until the round result is shown
    dom.game.arenaEmojiYou.textContent = "❓";
    dom.game.arenaEmojiOpp.textContent = "❓";
    dom.game.arenaLabel.textContent =
      room.phase === "waiting"
        ? room.type === "private"
          ? "Waiting for opponent"
          : "Finding opponent"
        : room.you?.choice && !room.opponent?.choice
          ? "Waiting for opponent..."
          : "Pick!";
    dom.game.resultStrip.hidden = true;
    dom.game.playAgainRow.hidden = true;
    setChoiceButtonsEnabled(!!room.canPlay);
  }

  function applyProfileFromServer(profile) {
    if (!profile) return;
    state.profile.name = profile.name || state.profile.name;
    Object.assign(state.profile.stats, profile.stats || {});
    state.backendReady = true;
    saveFallbackProfile();
    syncProfileToUI();
  }

  /* ════════════════════════════════════════
     API
     ════════════════════════════════════════ */

  async function apiRequest(path, options = {}) {
    const res = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json()
      : await res.text();
    if (!res.ok)
      throw new Error(payload?.error || `Request failed: ${res.status}`);
    return payload;
  }

  async function loadProfile() {
    try {
      const health = await apiRequest("/api/health");
      state.backendReady = !!health?.ok;
    } catch (_) {
      state.backendReady = false;
    }

    if (state.backendReady) {
      try {
        const data = await apiRequest(
          `/api/profile?playerId=${encodeURIComponent(state.clientId)}&name=${encodeURIComponent(state.profile.name)}`,
        );
        applyProfileFromServer(data.profile);
      } catch (_) {
        state.backendReady = false;
      }
    }

    syncBackendAvailability();
    syncProfileToUI();
    syncSoundButtons();
  }

  /* ════════════════════════════════════════
     POLLING
     ════════════════════════════════════════ */

  function stopPolling() {
    if (state.pollTimer) {
      clearInterval(state.pollTimer);
      state.pollTimer = null;
    }
  }

  function startPolling(fn, interval = 1200) {
    stopPolling();
    state.pollTimer = setInterval(fn, interval);
  }

  /* ════════════════════════════════════════
     ROUTING
     ════════════════════════════════════════ */

  function routeToHome() {
    stopPolling();
    state.mode = "home";
    state.session = null;
    state.room = null;
    state.isPlaying = false;
    state.lastRoomRenderKey = "";
    state.soloScore = { wins: 0, losses: 0 };
    setScreen("home");
    syncProfileToUI();
  }

  /* ════════════════════════════════════════
     SOLO (vs CPU) MODE
     ════════════════════════════════════════ */

  function startSoloMode() {
    stopPolling();
    state.mode = "solo";
    state.session = { kind: "solo" };
    state.room = null;
    state.soloScore = { wins: 0, losses: 0 };
    setScreen("game");
    dom.game.modeBadge.textContent = "vs CPU";
    dom.game.nameYou.textContent = state.profile.name;
    dom.game.nameOpp.textContent = "CPU";
    dom.game.scoreYou.textContent = "0";
    dom.game.scoreOpp.textContent = "0";
    if (dom.game.avatarOppInit) dom.game.avatarOppInit.textContent = "🤖";
    dom.game.oppStatus.hidden = true;
    resetBoard();
  }

  async function playSoloRound(choice) {
    if (state.isPlaying) return;
    state.isPlaying = true;
    setChoiceButtonsEnabled(false);
    highlightChoice(choice);
    playSound("click");
    triggerHaptic("light");

    dom.game.resultStrip.hidden = true;
    dom.game.playAgainRow.hidden = true;
    dom.game.arenaLabel.textContent = "Thinking...";
    dom.game.arenaEmojiYou.textContent = CHOICE_EMOJI[choice];
    dom.game.arenaEmojiOpp.textContent = "🤖";
    dom.game.arenaYou.classList.remove("win", "lose", "draw", "reveal");
    dom.game.arenaOpp.classList.remove("win", "lose", "draw", "reveal");
    dom.game.arenaYou.classList.add("thinking");
    dom.game.arenaOpp.classList.add("thinking");

    await delay(650);

    let round;
    try {
      if (state.backendReady) {
        const result = await apiRequest("/api/solo/play", {
          method: "POST",
          body: JSON.stringify({
            playerId: state.clientId,
            name: state.profile.name,
            choice,
          }),
        });
        if (result.profile) applyProfileFromServer(result.profile);
        round = result.round;
      } else {
        // Offline fallback
        const cpuChoice = randomChoice();
        const outcome = determineOutcome(choice, cpuChoice);
        if (outcome === "win") {
          state.profile.stats.wins++;
          state.profile.stats.currentStreak++;
          state.profile.stats.bestStreak = Math.max(
            state.profile.stats.bestStreak,
            state.profile.stats.currentStreak,
          );
        } else if (outcome === "lose") {
          state.profile.stats.losses++;
          state.profile.stats.currentStreak = 0;
        } else {
          state.profile.stats.draws++;
        }
        saveFallbackProfile();
        syncProfileToUI();
        round = { playerChoice: choice, computerChoice: cpuChoice, outcome };
      }
    } catch (err) {
      showToast(String(err.message || "Round failed"));
      state.backendReady = false;
      state.isPlaying = false;
      dom.game.arenaYou.classList.remove("thinking");
      dom.game.arenaOpp.classList.remove("thinking");
      setChoiceButtonsEnabled(true);
      return;
    }

    // Reveal
    dom.game.arenaYou.classList.remove("thinking");
    dom.game.arenaOpp.classList.remove("thinking");
    dom.game.arenaYou.classList.add("reveal");
    dom.game.arenaOpp.classList.add("reveal");
    dom.game.arenaEmojiYou.textContent = CHOICE_EMOJI[round.playerChoice];
    dom.game.arenaEmojiOpp.textContent = CHOICE_EMOJI[round.computerChoice];

    const outcome = round.outcome;
    if (outcome === "win") {
      dom.game.arenaYou.classList.add("win");
      dom.game.arenaOpp.classList.add("lose");
      state.soloScore.wins++;
    } else if (outcome === "lose") {
      dom.game.arenaYou.classList.add("lose");
      dom.game.arenaOpp.classList.add("win");
      state.soloScore.losses++;
    } else {
      dom.game.arenaYou.classList.add("draw");
      dom.game.arenaOpp.classList.add("draw");
    }

    // Update session scoreboard
    dom.game.scoreYou.textContent = String(state.soloScore.wins);
    dom.game.scoreOpp.textContent = String(state.soloScore.losses);

    dom.game.arenaLabel.textContent =
      outcome === "win"
        ? "You won! 🎉"
        : outcome === "lose"
          ? "You lost 😢"
          : "Draw 🤝";
    renderOutcomeBanner(outcome);

    if (outcome === "win") {
      animateScore(dom.game.scoreYou);
      playSound("win");
      triggerHaptic("success");
      launchConfetti();
    } else if (outcome === "lose") {
      animateScore(dom.game.scoreOpp);
      playSound("lose");
      triggerHaptic("error");
    } else {
      playSound("draw");
      triggerHaptic("medium");
    }

    dom.game.playAgainRow.hidden = false;
    state.isPlaying = false;
  }

  /* ════════════════════════════════════════
     MULTIPLAYER FLOWS
     ════════════════════════════════════════ */

  async function joinQuickMatch() {
    if (!state.backendReady) {
      showToast("Start the server: npm start");
      return;
    }
    state.mode = "quick";
    state.session = { kind: "quick", roomId: null };
    showWaitingScreen("Finding opponent…", "Matching you now.", {
      showJoin: false,
      showCreate: false,
      showCode: false,
    });

    try {
      const result = await apiRequest("/api/matchmaking/join", {
        method: "POST",
        body: JSON.stringify({
          playerId: state.clientId,
          name: state.profile.name,
        }),
      });
      if (result.profile) applyProfileFromServer(result.profile);
      if (result.room) {
        state.session.roomId = result.room.id;
        setScreen("game");
        syncRoomHeader(result.room);
        syncBoardFromRoom(result.room);
        startPolling(refreshRoomState);
      } else {
        startPolling(refreshMatchmaking);
      }
    } catch (err) {
      showToast(String(err.message || "Unable to find match"));
      routeToHome();
    }
  }

  async function refreshMatchmaking() {
    if (!state.session) return;
    try {
      const data = await apiRequest(
        `/api/matchmaking/status?playerId=${encodeURIComponent(state.clientId)}`,
      );
      if (data.profile) applyProfileFromServer(data.profile);
      if (data.room) {
        state.session.roomId = data.room.id;
        if (data.room.phase !== "waiting") {
          setScreen("game");
          syncRoomHeader(data.room);
          syncBoardFromRoom(data.room);
          startPolling(refreshRoomState);
        } else {
          renderRoomWaiting(data.room);
        }
      }
    } catch (err) {
      showToast(String(err.message || "Matchmaking failed"));
      routeToHome();
    }
  }

  async function refreshRoomState() {
    if (!state.session?.roomId) return;
    try {
      const data = await apiRequest(
        `/api/rooms/state?roomId=${encodeURIComponent(state.session.roomId)}&playerId=${encodeURIComponent(state.clientId)}`,
      );
      if (data.profile) applyProfileFromServer(data.profile);
      state.room = data.room;
      if (data.room.phase === "waiting") {
        renderRoomWaiting(data.room);
      } else {
        setScreen("game");
        syncRoomHeader(data.room);
        syncBoardFromRoom(data.room);
      }
    } catch (err) {
      showToast(String(err.message || "Room unavailable"));
      routeToHome();
    }
  }

  function renderRoomWaiting(room) {
    state.room = room;
    state.mode = room.type === "quick" ? "quick" : "private";

    if (room.type === "private") {
      if (room.phase === "waiting" && room.you?.role === "host") {
        showWaitingScreen(
          "Share this code",
          "Send the room code to your opponent.",
          {
            showCode: true,
            showCreate: false,
            showJoin: false,
          },
        );
        dom.waiting.roomCodeValue.textContent = room.code;
      } else if (room.phase === "waiting") {
        showWaitingScreen("Joining private room", "Waiting for the host...", {
          showJoin: true,
          showCreate: true,
          showCode: false,
        });
      } else {
        setScreen("game");
        syncRoomHeader(room);
        syncBoardFromRoom(room);
      }
      return;
    }

    // Quick match waiting
    if (room.phase === "waiting") {
      showWaitingScreen("Finding opponent…", "Waiting for a match.", {
        showJoin: false,
        showCreate: false,
        showCode: false,
      });
    } else {
      setScreen("game");
      syncRoomHeader(room);
      syncBoardFromRoom(room);
    }
  }

  function openPrivateLobby() {
    if (!state.backendReady) {
      showToast("Start the server: npm start");
      return;
    }
    stopPolling();
    state.mode = "private";
    state.session = { kind: "private", roomId: null };
    state.room = null;
    showWaitingScreen("Private room", "Create a room or join with a code.", {
      showJoin: true,
      showCreate: true,
      showCode: false,
    });
  }

  async function createPrivateRoom() {
    if (!state.backendReady) {
      showToast("Start the server: npm start");
      return;
    }
    try {
      const result = await apiRequest("/api/rooms/create", {
        method: "POST",
        body: JSON.stringify({
          playerId: state.clientId,
          name: state.profile.name,
        }),
      });
      if (result.profile) applyProfileFromServer(result.profile);
      state.session = {
        kind: "private",
        roomId: result.room.id,
        code: result.room.code,
      };
      renderRoomWaiting(result.room);
      startPolling(refreshRoomState);
    } catch (err) {
      showToast(String(err.message || "Unable to create room"));
    }
  }

  async function joinPrivateRoom() {
    if (!state.backendReady) {
      showToast("Start the server: npm start");
      return;
    }
    const code = dom.waiting.codeInput.value.trim().toUpperCase();
    if (!code) {
      showToast("Enter a room code first");
      return;
    }

    try {
      const result = await apiRequest("/api/rooms/join", {
        method: "POST",
        body: JSON.stringify({
          playerId: state.clientId,
          name: state.profile.name,
          code,
        }),
      });
      if (result.profile) applyProfileFromServer(result.profile);
      state.session = {
        kind: "private",
        roomId: result.room.id,
        code: result.room.code,
      };
      setScreen("game");
      syncRoomHeader(result.room);
      syncBoardFromRoom(result.room);
      startPolling(refreshRoomState);
    } catch (err) {
      showToast(String(err.message || "Room not found"));
    }
  }

  async function submitRoomChoice(choice) {
    if (!state.session?.roomId || state.isPlaying) return;
    state.isPlaying = true;
    setChoiceButtonsEnabled(false);
    highlightChoice(choice);
    playSound("click");
    triggerHaptic("light");
    dom.game.arenaLabel.textContent = "Waiting for opponent…";
    dom.game.arenaEmojiYou.textContent = "❓";
    dom.game.arenaEmojiOpp.textContent = "❓";
    dom.game.arenaYou.classList.add("thinking");
    dom.game.arenaOpp.classList.add("thinking");

    try {
      const result = await apiRequest("/api/rooms/play", {
        method: "POST",
        body: JSON.stringify({
          roomId: state.session.roomId,
          playerId: state.clientId,
          choice,
        }),
      });
      if (result.profile) applyProfileFromServer(result.profile);
      state.room = result.room;
      syncRoomHeader(result.room);
      syncBoardFromRoom(result.room);
    } catch (err) {
      showToast(String(err.message || "Could not play round"));
      dom.game.arenaYou.classList.remove("thinking");
      dom.game.arenaOpp.classList.remove("thinking");
      setChoiceButtonsEnabled(true);
    }
    state.isPlaying = false;
  }

  async function readyNextRound() {
    if (state.mode === "solo") {
      resetBoard();
      return;
    }
    if (!state.session?.roomId) return;

    try {
      const result = await apiRequest("/api/rooms/ready", {
        method: "POST",
        body: JSON.stringify({
          roomId: state.session.roomId,
          playerId: state.clientId,
        }),
      });
      if (result.profile) applyProfileFromServer(result.profile);
      state.room = result.room;
      if (result.room.phase === "choosing") {
        state.lastRoomRenderKey = "";
        resetBoard();
        syncRoomHeader(result.room);
        syncBoardFromRoom(result.room);
      } else {
        syncRoomHeader(result.room);
        syncBoardFromRoom(result.room);
      }
    } catch (err) {
      showToast(String(err.message || "Could not start next round"));
    }
  }

  async function leaveCurrentSession() {
    try {
      if (state.mode === "quick") {
        await apiRequest("/api/matchmaking/leave", {
          method: "POST",
          body: JSON.stringify({ playerId: state.clientId }),
        });
      } else if (state.mode === "private" && state.session?.roomId) {
        await apiRequest("/api/rooms/leave", {
          method: "POST",
          body: JSON.stringify({
            roomId: state.session.roomId,
            playerId: state.clientId,
          }),
        });
      }
    } catch (_) {}
    routeToHome();
  }

  /* ════════════════════════════════════════
     UTILITY
     ════════════════════════════════════════ */

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* ════════════════════════════════════════
     EVENT BINDING
     ════════════════════════════════════════ */

  function bindEvents() {
    // Home
    dom.home.btnVsBot.addEventListener("click", () => {
      triggerHaptic("light");
      startSoloMode();
    });
    dom.home.btnQuickMatch.addEventListener("click", () => {
      triggerHaptic("light");
      joinQuickMatch();
    });
    dom.home.btnPrivate.addEventListener("click", () => {
      triggerHaptic("light");
      openPrivateLobby();
    });
    dom.home.btnSound.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      syncSoundButtons();
      savePreferences();
      if (state.soundEnabled) playSound("click");
    });

    // Waiting
    dom.waiting.btnCancel.addEventListener("click", leaveCurrentSession);
    dom.waiting.btnCreateRoom.addEventListener("click", createPrivateRoom);
    dom.waiting.btnJoinRoom.addEventListener("click", joinPrivateRoom);
    dom.waiting.codeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") joinPrivateRoom();
    });
    dom.waiting.btnCopyCode.addEventListener("click", () => {
      const code = dom.waiting.roomCodeValue.textContent.trim();
      if (!code || code === "——") return;
      navigator.clipboard
        .writeText(code)
        .then(() => showToast("Code copied!"))
        .catch(() => showToast("Could not copy"));
    });

    // Game
    dom.game.btnBack.addEventListener("click", leaveCurrentSession);
    dom.game.btnLeaveGame.addEventListener("click", leaveCurrentSession);
    dom.game.btnPlayAgain.addEventListener("click", readyNextRound);
    dom.game.btnSound.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      syncSoundButtons();
      savePreferences();
      if (state.soundEnabled) playSound("click");
    });

    dom.game.choiceButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (state.mode === "solo") {
          playSoloRound(btn.dataset.choice);
        } else {
          submitRoomChoice(btn.dataset.choice);
        }
      });
    });

    // Global
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.mode !== "home") leaveCurrentSession();
    });
  }

  /* ════════════════════════════════════════
     BOOTSTRAP
     ════════════════════════════════════════ */

  async function bootstrap() {
    loadPreferences();
    initTelegram();
    loadFallbackProfile();
    bindEvents();
    resizeCanvas();
    syncSoundButtons();
    syncProfileToUI();
    syncBackendAvailability(); // show offline notice immediately
    setScreen("home"); // show home right away (no blank wait)

    // Load profile in background — updates UI when ready
    await loadProfile();
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
