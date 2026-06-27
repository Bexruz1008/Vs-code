# 🪨📄✂️ Rock Paper Scissors — Telegram Mini App

A production-quality Telegram Mini App game with a cyber gaming aesthetic, full Telegram SDK integration, sound effects, confetti, and LocalStorage persistence.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Gameplay** | Classic Rock / Paper / Scissors with instant feedback |
| **Telegram SDK** | Username, first name, profile photo, theme colors, haptic feedback |
| **Animations** | CSS-only: choice reveal, bounce on win, shake on lose, score pop, confetti |
| **Sound** | Web Audio API synthesised sounds (click, win, lose, draw) — no files needed |
| **Persistence** | Scores and streaks saved to LocalStorage across sessions |
| **Streak Tracking** | Current win streak + personal best |
| **Responsive** | Mobile-first, works on Android, iPhone, and Telegram Desktop |
| **Dark Theme** | Cyber gaming palette (#0F172A) with glassmorphism cards |
| **Light Mode** | Automatically adapts to Telegram light theme |

---

## 📁 Folder Structure

```
rock-paper-scissors/
├── index.html      ← App shell and semantic markup
├── style.css       ← Design tokens, layout, animations
├── app.js          ← All game logic, Telegram SDK, audio, confetti
├── assets/         ← Reserved for future icons or images
└── README.md       ← This file
```

---

## 🚀 How to Run

### Option 1 — Open directly (quickest)

```bash
# Clone or download the project, then simply open:
open index.html
```

The game runs in any modern browser without a build step or dependencies.

### Option 2 — Local HTTP server (recommended for Telegram testing)

```bash
# Using Node.js
npx serve .

# Using Python 3
python3 -m http.server 8080

# Using PHP
php -S localhost:8080
```

Then visit `http://localhost:8080` in your browser.

---

## 📲 Telegram Mini App Setup

### 1. Create a Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` and follow the prompts
3. Copy the bot token you receive

### 2. Create the Mini App

```
/newapp
```

Follow the prompts and supply:
- **Title:** Rock Paper Scissors
- **Short name:** rps (e.g. `rps_battle`)
- **URL:** Your hosted URL (see Hosting below)

### 3. Host the App

The Mini App URL must be HTTPS. Options:

| Platform | Notes |
|---|---|
| **GitHub Pages** | Free, push to `gh-pages` branch |
| **Vercel / Netlify** | Free tier, drag-and-drop deploy |
| **Cloudflare Pages** | Free, connects to your Git repo |
| **Ngrok** (dev only) | `ngrok http 8080` for local HTTPS tunnel |

```bash
# Example — GitHub Pages
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/rps-mini-app.git
git push -u origin main
# Enable GitHub Pages in repo Settings → Pages → main branch / root
```

### 4. Link the Mini App to Your Bot

In BotFather:
```
/setmenubutton
```
Select your bot → set URL → the mini app will open from the menu button in your bot chat.

Or create a deep link:
```
https://t.me/YOUR_BOT_USERNAME/YOUR_APP_SHORT_NAME
```

---

## 🎮 How to Play

1. Open the Mini App inside Telegram (or in a browser)
2. Tap **🪨 Rock**, **📄 Paper**, or **✂️ Scissors**
3. The CPU picks randomly after a short thinking animation
4. Results are shown instantly with animations and sound
5. Win streaks are tracked — beat your personal best!
6. Tap **↺ Reset Game** to start over (confirmation required)
7. Tap **🔊** to toggle sound on/off

### Game Rules
- 🪨 Rock beats ✂️ Scissors
- ✂️ Scissors beats 📄 Paper
- 📄 Paper beats 🪨 Rock

---

## 🎨 Customization Guide

### Colors

Edit the CSS custom properties at the top of `style.css`:

```css
:root {
  --bg:        #0F172A;   /* Page background */
  --primary:   #3B82F6;   /* Blue accent */
  --secondary: #8B5CF6;   /* Purple accent */
  --win:       #22C55E;   /* Win green */
  --lose:      #EF4444;   /* Lose red */
  --draw:      #F59E0B;   /* Draw amber */
}
```

### Fonts

Two fonts are loaded from Google Fonts:
- **Orbitron** (display, title, scores) — swap for any bold display font
- **Inter** (body, labels) — swap for any legible sans-serif

Update the `<link>` in `index.html` and the `--font-display` / `--font-body` variables.

### Motivational Messages

In `app.js`, edit these arrays:

```js
const WIN_MESSAGES  = ['Your custom win message', ...];
const LOSE_MESSAGES = ['Your custom lose message', ...];
const DRAW_MESSAGES = ['Your custom draw message', ...];
```

### Round Delay

The CPU "thinking" animation duration (default 800 ms):

```js
await delay(800);  // in playRound() — change to any ms value
```

### Adding New Choices

The game is structured to extend. To add a 4th choice (e.g. 🦎 Lizard):

1. Add `'lizard'` to the `CHOICES` array in `app.js`
2. Add `lizard: '🦎'` to `CHOICE_EMOJI`
3. Update `BEATS` to encode which choices lizard beats:
   ```js
   const BEATS = {
     rock:     'scissors',
     scissors: 'paper',
     paper:    'rock',
     lizard:   'rock',   // lizard beats rock (example)
   };
   ```
4. Add a `<button>` to `.choices` in `index.html`

### Sound Effects

Sounds are synthesised via the Web Audio API. To customise, edit the `playSound()` function in `app.js`. Each case controls oscillator type, frequency, and gain envelope.

---

## 📱 Browser / Device Support

| Platform | Status |
|---|---|
| Telegram Android | ✅ Full support + haptics |
| Telegram iOS | ✅ Full support + haptics |
| Telegram Desktop | ✅ Full support |
| Chrome / Safari | ✅ Works in browser |
| Firefox | ✅ Works in browser |

---

## 🛠 Technical Notes

- **No build step** — vanilla HTML/CSS/JS, runs from `file://` or any static host
- **Web Audio API** — synthesises all sounds on-the-fly, no audio file downloads
- **CSS animations only** — no JS animation libraries
- **LocalStorage** — persists `rps_game_state` key with scores, streak, and sound preference
- **Telegram SDK** loaded from Telegram's official CDN: `https://telegram.org/js/telegram-web-app.js`
- **Graceful degradation** — all Telegram-specific features check for SDK presence before use

---

## 📄 License

MIT — free to use, modify, and distribute.