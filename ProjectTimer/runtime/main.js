import Clock from "./plugins/clock.js";
import ImageWidget from "./plugins/image.js";
import Calendar from "./plugins/calendar.js";
import AsciiClock from "./plugins/asciiClock.js";
import AsciiText from "./plugins/asciiText.js";
import Shape from "./plugins/shape.js";
import Label from "./plugins/label.js";
import MediaPlayer from "./plugins/mediaPlayer.js";
import MediaCover from "./plugins/mediaCover.js";
import MediaText from "./plugins/mediaText.js";
import MediaProgress from "./plugins/mediaProgress.js";
import MediaControls from "./plugins/mediaControls.js";
import VideoPlayer from "./plugins/video.js";
import AsciiWave from "./plugins/asciiWave.js";
import AsciiSpinner from "./plugins/asciiSpinner.js";
import PulseRing from "./plugins/pulseRing.js";
import Starfield from "./plugins/starfield.js";
import ParticleField from "./plugins/particleField.js";
import GradientShift from "./plugins/gradientShift.js";
import OrbitDots from "./plugins/orbitDots.js";
import EqualizerBars from "./plugins/equalizerBars.js";
import BinaryClock from "./plugins/binaryClock.js";
import SegmentClock from "./plugins/segmentClock.js";
import RadarSweep from "./plugins/radarSweep.js";
import MatrixRain from "./plugins/matrixRain.js";
import GridWave from "./plugins/gridWave.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const debug = document.getElementById("debug");

const DEFAULT_THEME = "bios";
let themeName = DEFAULT_THEME;
let themePath = `./themes/${themeName}`;

let plugins = [];
let showDebug = false;
let maxFps = 60;
let lastFrameTime = 0;
let fps = 0;
let frames = 0;
let lastFpsUpdate = performance.now();

const pluginMap = {
  clock: Clock,
  image: ImageWidget,
  calendar: Calendar,
  asciiClock: AsciiClock,
  asciiText: AsciiText,
  shape: Shape,
  label: Label,
  mediaPlayer: MediaPlayer,
  mediaCover: MediaCover,
  mediaText: MediaText,
  mediaProgress: MediaProgress,
  mediaControls: MediaControls,
  video: VideoPlayer,
  asciiWave: AsciiWave,
  asciiSpinner: AsciiSpinner,
  pulseRing: PulseRing,
  starfield: Starfield,
  particleField: ParticleField,
  gradientShift: GradientShift,
  orbitDots: OrbitDots,
  equalizerBars: EqualizerBars,
  binaryClock: BinaryClock,
  segmentClock: SegmentClock,
  radarSweep: RadarSweep,
  matrixRain: MatrixRain,
  gridWave: GridWave
};

// ---------- THEME CSS ----------
function loadThemeCSS() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${themePath}/style.css`;
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
    const config = await fetch("./config.json").then(r => r.json()).catch(() => ({}));
    themeName = config.theme || DEFAULT_THEME;
    maxFps = config.maxFps || 60;
    themePath = `./themes/${themeName}`;
    loadThemeCSS();

    const meta = await fetch(`${themePath}/theme.json`).then(r => r.json());
    const layout = await fetch(`${themePath}/layout.json`).then(r => r.json());

    canvas.width = meta.resolution[0];
    canvas.height = meta.resolution[1];

    plugins = [];
    layout.plugins.forEach(cfg => {
      const P = pluginMap[cfg.type];
      if (!P) return;
      cfg._themePath = themePath;
      plugins.push(new P(cfg));
    });

    requestAnimationFrame(loop);
  } catch (e) {
    showError("THEME LOAD ERROR", e);
  }
}

// ---------- MAIN LOOP ----------
function loop(timestamp) {
  if (maxFps > 0) {
    const minFrameTime = 1000 / maxFps;
    if (timestamp - lastFrameTime < minFrameTime) {
      requestAnimationFrame(loop);
      return;
    }
    lastFrameTime = timestamp;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  plugins.forEach(p => {
    p.update?.();
    p.draw(ctx);
  });

  if (showDebug) {
    frames += 1;
    const now = performance.now();
    if (now - lastFpsUpdate >= 1000) {
      fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
      frames = 0;
      lastFpsUpdate = now;
    }
    debug.textContent = `Plugins: ${plugins.length}\nRes: ${canvas.width}x${canvas.height}\nFPS: ${fps}\nMax FPS: ${maxFps}`;
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

canvas.addEventListener("click", async event => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  for (let i = plugins.length - 1; i >= 0; i -= 1) {
    const handled = await plugins[i].handleClick?.(x, y);
    if (handled) {
      break;
    }
  }
});

loadTheme();
