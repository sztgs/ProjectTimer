import Clock from "./plugins/clock.js";
import ImageWidget from "./plugins/image.js";
import Calendar from "./plugins/calendar.js";
import AsciiClock from "./plugins/asciiClock.js";
import AsciiText from "./plugins/asciiText.js";
import Shape from "./plugins/shape.js";
import Label from "./plugins/label.js";
import MediaPlayer from "./plugins/mediaPlayer.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const debug = document.getElementById("debug");

const THEME_NAME = "bios";
const THEME_PATH = `./themes/${THEME_NAME}`;

let plugins = [];
let showDebug = false;

const pluginMap = {
  clock: Clock,
  image: ImageWidget,
  calendar: Calendar,
  asciiClock: AsciiClock,
  asciiText: AsciiText,
  shape: Shape,
  label: Label,
  mediaPlayer: MediaPlayer
};

// ---------- THEME CSS ----------
function loadThemeCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${THEME_PATH}/style.css`;
  link.onerror = () => console.warn("Theme CSS missing");
  document.head.appendChild(link);
}

// ---------- ERROR OVERLAY ----------
function showError(title, err) {
  debug.style.display = "block";
  debug.textContent = `${title}\n${err}`;
  console.error(err);
}

// ---------- LOAD THEME ----------
async function loadTheme() {
  try {
    loadThemeCSS();

    const meta = await fetch(`${THEME_PATH}/theme.json`).then(r => r.json());
    const layout = await fetch(`${THEME_PATH}/layout.json`).then(r => r.json());

    canvas.width = meta.resolution[0];
    canvas.height = meta.resolution[1];

    plugins = [];
    layout.plugins.forEach(cfg => {
      const P = pluginMap[cfg.type];
      if (!P) return;
      cfg._themePath = THEME_PATH;
      plugins.push(new P(cfg));
    });

    requestAnimationFrame(loop);
  } catch (e) {
    showError("THEME LOAD ERROR", e);
  }
}

// ---------- MAIN LOOP ----------
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  plugins.forEach(p => {
    p.update?.();
    p.draw(ctx);
  });

  if (showDebug) {
    debug.textContent = `Plugins: ${plugins.length}\nRes: ${canvas.width}x${canvas.height}`;
  }

  requestAnimationFrame(loop);
}

// ---------- INPUT ----------
window.addEventListener("keydown", e => {
  if (e.key === "F2") {
    showDebug = !showDebug;
    debug.style.display = showDebug ? "block" : "none";
  }
});

loadTheme();
