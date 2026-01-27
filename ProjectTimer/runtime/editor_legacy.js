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
import GifPlayer from "./plugins/gif.js";
import PixelArt from "./plugins/pixelArt.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const stage = document.querySelector(".stage");
const viewBox = document.getElementById("viewBox");
const themeNameInput = document.getElementById("themeName");
const themeDisplayNameInput = document.getElementById("themeDisplayName");
const themeWidthInput = document.getElementById("themeWidth");
const themeHeightInput = document.getElementById("themeHeight");
const themeBackgroundInput = document.getElementById("themeBackground");
const loadThemeButton = document.getElementById("loadTheme");
const saveLayoutButton = document.getElementById("saveLayout");
const createThemeButton = document.getElementById("createTheme");
const pluginTypeSelect = document.getElementById("pluginType");
const addPluginButton = document.getElementById("addPlugin");
const pluginList = document.getElementById("pluginList");
const pluginJson = document.getElementById("pluginJson");
const applyPluginButton = document.getElementById("applyPlugin");
const deletePluginButton = document.getElementById("deletePlugin");
const duplicatePluginButton = document.getElementById("duplicatePlugin");
const toggleVisibilityButton = document.getElementById("toggleVisibility");
const shapeTypeSelect = document.getElementById("shapeType");
const shapeSidesInput = document.getElementById("shapeSides");
const rotationInput = document.getElementById("rotation");
const colorPickerInput = document.getElementById("colorPicker");
const alphaRangeInput = document.getElementById("alphaRange");
const textEditor = document.getElementById("textEditor");
const pixelEditor = document.getElementById("pixelEditor");
const pixelGridWidthInput = document.getElementById("pixelGridWidth");
const pixelGridHeightInput = document.getElementById("pixelGridHeight");
const pixelSizeInput = document.getElementById("pixelSize");
const pixelColorInput = document.getElementById("pixelColor");
const pixelClearButton = document.getElementById("pixelClear");
const pixelCanvas = document.getElementById("pixelCanvas");
const pixelCtx = pixelCanvas.getContext("2d");
const layerUpButton = document.getElementById("layerUp");
const layerDownButton = document.getElementById("layerDown");
const showGridCheckbox = document.getElementById("showGrid");
const snapGridCheckbox = document.getElementById("snapGrid");
const gridSizeInput = document.getElementById("gridSize");
const styleEditor = document.getElementById("styleEditor");
const downloadStyleButton = document.getElementById("downloadStyle");
const stylePresetSelect = document.getElementById("stylePreset");
const applyStylePresetButton = document.getElementById("applyStylePreset");
const animationPresetSelect = document.getElementById("animationPreset");
const addAnimationPresetButton = document.getElementById("addAnimationPreset");
const overlay = document.getElementById("overlay");
const resizeHandle = overlay.querySelector(".resize-handle");

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
  gridWave: GridWave,
  gif: GifPlayer,
  pixelArt: PixelArt
};

const DEFAULT_CONFIGS = {
  clock: { type: "clock", x: 60, y: 120, size: 48, color: "#00ff66" },
  binaryClock: {
    type: "binaryClock",
    x: 60,
    y: 200,
    dotSize: 10,
    gap: 6,
    onColor: "#00ff66",
    offColor: "rgba(0, 255, 102, 0.2)",
    background: "rgba(0,0,0,0.4)",
    alpha: 1
  },
  segmentClock: {
    type: "segmentClock",
    x: 60,
    y: 260,
    size: 10,
    gap: 10,
    color: "#00ff66",
    offColor: "rgba(0, 255, 102, 0.2)",
    background: "rgba(0,0,0,0.4)",
    lineWidth: 4,
    alpha: 1
  },
  image: {
    type: "image",
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    src: "assets/bg.png",
    rotation: 0
  },
  calendar: {
    type: "calendar",
    x: 600,
    y: 80,
    width: 600,
    height: 320,
    locale: "en-GB",
    weekStart: 1
  },
  asciiClock: {
    type: "asciiClock",
    x: 80,
    y: 160,
    fontSize: 20,
    lineHeight: 26,
    color: "#00ff66",
    style: "block",
    alpha: 1
  },
  asciiText: {
    type: "asciiText",
    x: 80,
    y: 60,
    fontSize: 16,
    lineHeight: 22,
    color: "#00ff66",
    text: ["ASCII TITLE", "---------------"],
    alpha: 1
  },
  shape: {
    type: "shape",
    x: 300,
    y: 200,
    width: 140,
    height: 140,
    shape: "circle",
    color: "#00ff66",
    fill: false,
    lineWidth: 2,
    rotation: 0,
    sides: 6,
    alpha: 1
  },
  label: {
    type: "label",
    x: 120,
    y: 120,
    text: "Label",
    fontSize: 24,
    fontFamily: "monospace",
    color: "#00ff66",
    align: "left",
    alpha: 1
  },
  mediaPlayer: {
    type: "mediaPlayer",
    x: 60,
    y: 260,
    width: 540,
    height: 160,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0",
    pollInterval: 3000,
    background: "rgba(0, 0, 0, 0.5)",
    color: "#ffffff",
    accentColor: "#00ff66",
    fontSize: 18,
    titleSize: 22,
    coverSize: 96,
    alpha: 1
  },
  mediaCover: {
    type: "mediaCover",
    x: 60,
    y: 60,
    width: 120,
    height: 120,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0",
    alpha: 1
  },
  mediaText: {
    type: "mediaText",
    x: 200,
    y: 60,
    width: 320,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0",
    alpha: 1
  },
  mediaProgress: {
    type: "mediaProgress",
    x: 200,
    y: 140,
    width: 320,
    height: 10,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0",
    alpha: 1
  },
  mediaControls: {
    type: "mediaControls",
    x: 200,
    y: 160,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0",
    alpha: 1
  },
  video: {
    type: "video",
    x: 60,
    y: 60,
    width: 320,
    height: 180,
    src: "assets/sample.mp4",
    muted: true,
    loop: true,
    autoplay: true,
    rotation: 0,
    alpha: 1
  },
  asciiWave: {
    type: "asciiWave",
    x: 60,
    y: 260,
    width: 420,
    height: 120,
    amplitude: 18,
    density: 0.2,
    speed: 0.08,
    char: "~",
    fontSize: 16,
    color: "#00ff66",
    background: "rgba(0,0,0,0.2)",
    alpha: 1
  },
  asciiSpinner: {
    type: "asciiSpinner",
    x: 60,
    y: 420,
    fontSize: 24,
    color: "#00ff66",
    speed: 120,
    alpha: 1
  },
  pulseRing: {
    type: "pulseRing",
    x: 180,
    y: 420,
    radius: 26,
    color: "#00ff66",
    lineWidth: 3,
    speed: 0.03,
    alpha: 1
  },
  starfield: {
    type: "starfield",
    x: 60,
    y: 460,
    width: 220,
    height: 120,
    color: "#ffffff",
    count: 60,
    alpha: 0.9
  },
  particleField: {
    type: "particleField",
    x: 300,
    y: 460,
    width: 220,
    height: 120,
    color: "#00ff66",
    count: 30,
    alpha: 0.9
  },
  gradientShift: {
    type: "gradientShift",
    x: 540,
    y: 460,
    width: 220,
    height: 120,
    colors: ["#0ea5e9", "#8b5cf6", "#f97316"],
    speed: 0.01,
    alpha: 0.9
  },
  orbitDots: {
    type: "orbitDots",
    x: 800,
    y: 520,
    radius: 32,
    count: 6,
    color: "#00ff66",
    speed: 0.02,
    alpha: 1
  },
  equalizerBars: {
    type: "equalizerBars",
    x: 900,
    y: 460,
    width: 220,
    height: 120,
    barCount: 10,
    color: "#00ff66",
    speed: 0.08,
    alpha: 1
  },
  radarSweep: {
    type: "radarSweep",
    x: 1200,
    y: 520,
    radius: 60,
    color: "#00ff66",
    speed: 0.03,
    alpha: 0.9
  },
  matrixRain: {
    type: "matrixRain",
    x: 60,
    y: 600,
    width: 220,
    height: 140,
    fontSize: 14,
    color: "#00ff66",
    alpha: 0.9
  },
  gridWave: {
    type: "gridWave",
    x: 300,
    y: 600,
    width: 220,
    height: 140,
    spacing: 20,
    amplitude: 6,
    color: "#00ff66",
    alpha: 0.9
  },
  gif: {
    type: "gif",
    x: 540,
    y: 600,
    width: 220,
    height: 140,
    src: "assets/sample.gif",
    rotation: 0,
    alpha: 1
  },
  pixelArt: {
    type: "pixelArt",
    x: 120,
    y: 120,
    gridWidth: 16,
    gridHeight: 8,
    pixelSize: 16,
    pixels: new Array(16 * 8).fill(null),
    background: "transparent"
  }
};

let themePath = "./themes/bios";
let plugins = [];
let selectedIndex = -1;
let dragging = null;
let themeCss = "";
let showGrid = true;
let snapToGrid = true;
let gridSize = 20;
let isPaintingPixels = false;
let themeResolution = { width: 1920, height: 480 };
let viewOffset = { x: 0, y: 0 };
let pixelEditorState = { gridWidth: null, gridHeight: null };
const styleTag = document.createElement("style");
document.head.appendChild(styleTag);
const STYLE_PRESETS = {
  retro: `body {\n  margin: 0;\n  background: #000;\n  color: #00ff66;\n  font-family: \"Courier New\", monospace;\n}\n\n#screen {\n  filter: contrast(1.1) saturate(1.2);\n}\n`,
  modern: `body {\n  margin: 0;\n  background: #0b0f1a;\n  color: #e5e7eb;\n  font-family: \"Inter\", \"Segoe UI\", sans-serif;\n}\n\n#screen {\n  border-radius: 18px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.4);\n}\n`
};

const ANIMATION_PRESETS = {
  glow: `\n@keyframes glowPulse {\n  0%, 100% { box-shadow: 0 0 12px rgba(0, 255, 102, 0.35); }\n  50% { box-shadow: 0 0 24px rgba(0, 255, 102, 0.7); }\n}\n\n#screen {\n  animation: glowPulse 4s ease-in-out infinite;\n}\n`,
  float: `\n@keyframes floaty {\n  0%, 100% { transform: translateY(0px); }\n  50% { transform: translateY(-6px); }\n}\n\n#screen {\n  animation: floaty 6s ease-in-out infinite;\n}\n`,
  scanlines: `\n@keyframes scanMove {\n  0% { background-position-y: 0px; }\n  100% { background-position-y: 4px; }\n}\n\nbody {\n  background-image: repeating-linear-gradient(\n    to bottom,\n    rgba(0,0,0,0.12),\n    rgba(0,0,0,0.12) 1px,\n    transparent 1px,\n    transparent 3px\n  );\n  animation: scanMove 0.6s linear infinite;\n}\n`
};

function updateCanvasBackground() {
  const background = themeBackgroundInput.value || "#000000";
  canvas.style.backgroundColor = background;
}

function updateThemePath() {
  const name = themeNameInput.value.trim() || "bios";
  themePath = `./themes/${name}`;
  pluginInstances = instantiatePlugins();
}

function setCanvasSize(width, height) {
  themeResolution = { width, height };
  resizeStageCanvas();
}

function resizeStageCanvas() {
  const rect = stage.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(rect.width));
  canvas.height = Math.max(1, Math.round(rect.height));
  viewOffset = {
    x: Math.round((canvas.width - themeResolution.width) / 2),
    y: Math.round((canvas.height - themeResolution.height) / 2)
  };
  viewBox.style.width = `${themeResolution.width}px`;
  viewBox.style.height = `${themeResolution.height}px`;
  viewBox.style.left = `${viewOffset.x}px`;
  viewBox.style.top = `${viewOffset.y}px`;
  updateOverlay();
  drawPixelEditor();
}

function rebuildPluginList() {
  pluginList.innerHTML = "";
  plugins.forEach((cfg, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const hiddenSuffix = cfg.hidden ? " (hidden)" : "";
    button.textContent = `${index + 1}. ${cfg.type}${hiddenSuffix}`;
    button.className = index === selectedIndex ? "active" : "";
    button.addEventListener("click", () => {
      selectPlugin(index);
    });
    item.appendChild(button);
    pluginList.appendChild(item);
  });
}

function updatePluginJson() {
  if (selectedIndex < 0) {
    pluginJson.value = "";
    textEditor.value = "";
    textEditor.disabled = true;
    shapeTypeSelect.disabled = true;
    shapeSidesInput.disabled = true;
    rotationInput.disabled = true;
    colorPickerInput.disabled = true;
    alphaRangeInput.disabled = true;
    overlay.style.display = "none";
    pixelEditor.style.display = "none";
    return;
  }

  const cfg = plugins[selectedIndex];
  pluginJson.value = JSON.stringify(cfg, null, 2);
  if (cfg.type === "asciiText") {
    textEditor.disabled = false;
    textEditor.value = Array.isArray(cfg.text) ? cfg.text.join("\n") : String(cfg.text ?? "");
  } else {
    textEditor.value = "";
    textEditor.disabled = true;
  }

  shapeTypeSelect.disabled = cfg.type !== "shape";
  if (cfg.type === "shape") {
    shapeTypeSelect.value = cfg.shape || "rect";
    shapeSidesInput.disabled = cfg.shape !== "polygon";
    shapeSidesInput.value = cfg.sides ?? 6;
  } else {
    shapeSidesInput.disabled = true;
  }

  rotationInput.disabled = !("rotation" in cfg);
  rotationInput.value = cfg.rotation ?? 0;

  colorPickerInput.disabled = !("color" in cfg);
  colorPickerInput.value = cfg.color || "#00ff66";
  alphaRangeInput.disabled = false;
  alphaRangeInput.value = cfg.alpha ?? 1;
  updatePixelEditor(cfg);
}

function normalizePixelConfig(cfg) {
  const gridWidth = Math.max(1, Number(cfg.gridWidth) || 8);
  const gridHeight = Math.max(1, Number(cfg.gridHeight) || 8);
  const pixelSize = Math.max(2, Number(cfg.pixelSize) || 12);
  cfg.gridWidth = gridWidth;
  cfg.gridHeight = gridHeight;
  cfg.pixelSize = pixelSize;
  if (!Array.isArray(cfg.pixels)) {
    cfg.pixels = new Array(gridWidth * gridHeight).fill(null);
  }
  if (cfg.pixels.length !== gridWidth * gridHeight) {
    const next = new Array(gridWidth * gridHeight).fill(null);
    const prev = cfg.pixels;
    const copyWidth = Math.min(gridWidth, pixelEditorState.gridWidth || gridWidth);
    const copyHeight = Math.min(gridHeight, pixelEditorState.gridHeight || gridHeight);
    for (let y = 0; y < copyHeight; y += 1) {
      for (let x = 0; x < copyWidth; x += 1) {
        const prevIndex = y * (pixelEditorState.gridWidth || gridWidth) + x;
        const nextIndex = y * gridWidth + x;
        next[nextIndex] = prev[prevIndex] ?? null;
      }
    }
    cfg.pixels = next;
  }
  pixelEditorState.gridWidth = gridWidth;
  pixelEditorState.gridHeight = gridHeight;
  return cfg;
}

function updatePixelEditor(cfg) {
  if (!cfg || cfg.type !== "pixelArt") {
    pixelEditor.style.display = "none";
    return;
  }
  pixelEditor.style.display = "block";
  normalizePixelConfig(cfg);
  pixelGridWidthInput.value = cfg.gridWidth;
  pixelGridHeightInput.value = cfg.gridHeight;
  pixelSizeInput.value = cfg.pixelSize;
  pixelColorInput.value = cfg.paintColor || "#00ff66";
  drawPixelEditor();
}

function drawPixelEditor() {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (!cfg || cfg.type !== "pixelArt") return;
  normalizePixelConfig(cfg);
  const width = cfg.gridWidth * cfg.pixelSize;
  const height = cfg.gridHeight * cfg.pixelSize;
  pixelCanvas.width = width;
  pixelCanvas.height = height;
  pixelCtx.clearRect(0, 0, width, height);
  if (cfg.background && cfg.background !== "transparent") {
    pixelCtx.fillStyle = cfg.background;
    pixelCtx.fillRect(0, 0, width, height);
  }
  cfg.pixels.forEach((color, index) => {
    if (!color) return;
    const x = (index % cfg.gridWidth) * cfg.pixelSize;
    const y = Math.floor(index / cfg.gridWidth) * cfg.pixelSize;
    pixelCtx.fillStyle = color;
    pixelCtx.fillRect(x, y, cfg.pixelSize, cfg.pixelSize);
  });
  pixelCtx.strokeStyle = "rgba(0, 255, 102, 0.2)";
  for (let x = 0; x <= width; x += cfg.pixelSize) {
    pixelCtx.beginPath();
    pixelCtx.moveTo(x, 0);
    pixelCtx.lineTo(x, height);
    pixelCtx.stroke();
  }
  for (let y = 0; y <= height; y += cfg.pixelSize) {
    pixelCtx.beginPath();
    pixelCtx.moveTo(0, y);
    pixelCtx.lineTo(width, y);
    pixelCtx.stroke();
  }
}

function paintPixel(event, cfg) {
  const rect = pixelCanvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cfg.pixelSize);
  const y = Math.floor((event.clientY - rect.top) / cfg.pixelSize);
  if (x < 0 || y < 0 || x >= cfg.gridWidth || y >= cfg.gridHeight) return;
  const index = y * cfg.gridWidth + x;
  const paint = cfg.paintColor || pixelColorInput.value || "#00ff66";
  cfg.pixels[index] = paint;
  pluginInstances = instantiatePlugins();
  updatePluginJson();
}

function selectPlugin(index) {
  selectedIndex = index;
  rebuildPluginList();
  updatePluginJson();
  updateOverlay();
}

function updateOverlay() {
  if (selectedIndex < 0) {
    overlay.style.display = "none";
    return;
  }

  const bounds = getPluginBounds(plugins[selectedIndex]);
  if (!bounds) {
    overlay.style.display = "none";
    return;
  }

  overlay.style.display = "block";
  overlay.style.left = `${bounds.x + viewOffset.x}px`;
  overlay.style.top = `${bounds.y + viewOffset.y}px`;
  overlay.style.width = `${bounds.width}px`;
  overlay.style.height = `${bounds.height}px`;
  resizeHandle.style.display = canResize(plugins[selectedIndex]) ? "block" : "none";
}

function canResize(cfg) {
  if (!cfg) return false;
  return [
    "image",
    "calendar",
    "shape",
    "mediaPlayer",
    "mediaCover",
    "mediaProgress",
    "video",
    "asciiWave",
    "starfield",
    "particleField",
    "gradientShift",
    "equalizerBars"
  ].includes(cfg.type);
}

function getPluginBounds(cfg) {
  if (!cfg) return null;

  if (typeof cfg.width === "number" && typeof cfg.height === "number") {
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: cfg.width, height: cfg.height };
  }

  if (cfg.type === "clock") {
    const size = cfg.size || 32;
    return { x: cfg.x ?? 0, y: (cfg.y ?? 0) - size, width: size * 6, height: size + 10 };
  }

  if (cfg.type === "asciiClock") {
    const fontSize = cfg.fontSize || 20;
    const lineHeight = cfg.lineHeight || fontSize + 6;
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: fontSize * 24, height: lineHeight * 5 };
  }

  if (cfg.type === "asciiText") {
    const lines = Array.isArray(cfg.text) ? cfg.text : String(cfg.text || "").split("\n");
    const fontSize = cfg.fontSize || 16;
    const lineHeight = cfg.lineHeight || fontSize + 6;
    const maxWidth = Math.max(1, ...lines.map(line => line.length));
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: maxWidth * (fontSize * 0.6), height: lineHeight * lines.length };
  }

  if (cfg.type === "label") {
    const fontSize = cfg.fontSize || 24;
    const textLength = String(cfg.text || "Label").length;
    return { x: cfg.x ?? 0, y: (cfg.y ?? 0) - fontSize, width: textLength * (fontSize * 0.6), height: fontSize + 10 };
  }

  if (cfg.type === "mediaText") {
    const titleSize = cfg.titleSize || 24;
    const lineHeight = cfg.lineHeight || 26;
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: cfg.width ?? 300, height: titleSize + lineHeight * 2 };
  }

  if (cfg.type === "mediaControls") {
    const size = cfg.buttonSize || 32;
    const gap = cfg.gap || 12;
    const width = size * 3 + gap * 2;
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width, height: size };
  }

  if (cfg.type === "video") {
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: cfg.width ?? 320, height: cfg.height ?? 180 };
  }

  if (cfg.type === "gif") {
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: cfg.width ?? 220, height: cfg.height ?? 140 };
  }

  if (cfg.type === "asciiWave") {
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: cfg.width ?? 400, height: cfg.height ?? 120 };
  }

  if (cfg.type === "pixelArt") {
    const gridWidth = cfg.gridWidth || 8;
    const gridHeight = cfg.gridHeight || 8;
    const pixelSize = cfg.pixelSize || 12;
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: gridWidth * pixelSize, height: gridHeight * pixelSize };
  }

  if (cfg.type === "starfield" || cfg.type === "particleField" || cfg.type === "gradientShift" || cfg.type === "equalizerBars") {
    return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: cfg.width ?? 220, height: cfg.height ?? 120 };
  }

  if (cfg.type === "asciiSpinner" || cfg.type === "pulseRing" || cfg.type === "orbitDots") {
    const size = cfg.radius ? cfg.radius * 2 : (cfg.fontSize || 24);
    return { x: (cfg.x ?? 0) - size / 2, y: (cfg.y ?? 0) - size / 2, width: size, height: size };
  }

  if (cfg.type === "radarSweep") {
    const size = (cfg.radius || 60) * 2;
    return { x: (cfg.x ?? 0) - size / 2, y: (cfg.y ?? 0) - size / 2, width: size, height: size };
  }

  return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: 200, height: 120 };
}

function instantiatePlugins() {
  return plugins.map(cfg => {
    const Plugin = pluginMap[cfg.type];
    if (!Plugin || cfg.hidden) return null;
    cfg._themePath = themePath;
    return new Plugin(cfg);
  }).filter(Boolean);
}

let pluginInstances = [];

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (showGrid && gridSize > 0) {
    ctx.save();
    ctx.strokeStyle = "rgba(0, 255, 102, 0.12)";
    ctx.lineWidth = 1;
    const startX = ((viewOffset.x % gridSize) + gridSize) % gridSize;
    const startY = ((viewOffset.y % gridSize) + gridSize) % gridSize;
    for (let x = startX; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = startY; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.save();
  ctx.translate(viewOffset.x, viewOffset.y);
  pluginInstances.forEach(instance => {
    instance.update?.();
    instance.draw(ctx);
  });
  ctx.restore();

  updateOverlay();
  requestAnimationFrame(render);
}

async function loadTheme() {
  const name = themeNameInput.value.trim();
  if (!name) return;

  themePath = `./themes/${name}`;
  const meta = await fetch(`${themePath}/theme.json`).then(r => r.json());
  const layout = await fetch(`${themePath}/layout.json`).then(r => r.json());
  const styleResponse = await fetch(`${themePath}/style.css`);
  themeCss = styleResponse.ok ? await styleResponse.text() : "";
  styleEditor.value = themeCss;
  styleTag.textContent = themeCss;
  themeDisplayNameInput.value = meta.name || name;
  themeWidthInput.value = meta.resolution?.[0] ?? 1920;
  themeHeightInput.value = meta.resolution?.[1] ?? 480;
  themeBackgroundInput.value = meta.background || "#000000";
  updateCanvasBackground();
  updateThemePath();

  setCanvasSize(meta.resolution[0], meta.resolution[1]);
  plugins = layout.plugins || [];
  pluginInstances = instantiatePlugins();
  selectedIndex = -1;
  rebuildPluginList();
  updatePluginJson();
}

function addPlugin() {
  const type = pluginTypeSelect.value;
  const template = DEFAULT_CONFIGS[type];
  if (!template) return;
  plugins.push(JSON.parse(JSON.stringify(template)));
  pluginInstances = instantiatePlugins();
  selectPlugin(plugins.length - 1);
}

function applyPluginConfig() {
  if (selectedIndex < 0) return;

  try {
    const cfg = JSON.parse(pluginJson.value);
    cfg.type = cfg.type || plugins[selectedIndex].type;
    plugins[selectedIndex] = cfg;
    pluginInstances = instantiatePlugins();
    rebuildPluginList();
    updatePluginJson();
  } catch (err) {
    alert(`Invalid JSON: ${err.message}`);
  }
}

function deletePlugin() {
  if (selectedIndex < 0) return;
  plugins.splice(selectedIndex, 1);
  pluginInstances = instantiatePlugins();
  selectedIndex = -1;
  rebuildPluginList();
  updatePluginJson();
}

function duplicatePlugin() {
  if (selectedIndex < 0) return;
  const copy = JSON.parse(JSON.stringify(plugins[selectedIndex]));
  copy.x = (copy.x ?? 0) + 20;
  copy.y = (copy.y ?? 0) + 20;
  plugins.splice(selectedIndex + 1, 0, copy);
  pluginInstances = instantiatePlugins();
  selectPlugin(selectedIndex + 1);
}

function toggleVisibility() {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  cfg.hidden = !cfg.hidden;
  pluginInstances = instantiatePlugins();
  rebuildPluginList();
  updatePluginJson();
}

function moveLayer(direction) {
  if (selectedIndex < 0) return;
  const nextIndex = selectedIndex + direction;
  if (nextIndex < 0 || nextIndex >= plugins.length) return;
  const [item] = plugins.splice(selectedIndex, 1);
  plugins.splice(nextIndex, 0, item);
  selectedIndex = nextIndex;
  pluginInstances = instantiatePlugins();
  rebuildPluginList();
  updatePluginJson();
}

function downloadLayout() {
  const data = JSON.stringify({ plugins }, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "layout.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadThemePack() {
  const name = themeNameInput.value.trim() || "custom";
  const displayName = themeDisplayNameInput.value.trim() || name;
  const width = Number(themeWidthInput.value) || 1920;
  const height = Number(themeHeightInput.value) || 480;
  const background = themeBackgroundInput.value || "#000000";
  const themeJson = JSON.stringify(
    {
      name: displayName,
      resolution: [width, height],
      background
    },
    null,
    2
  );

  const layoutJson = JSON.stringify({ plugins }, null, 2);
  const styleContent = styleEditor.value || "";

  downloadFile(themeJson, `${name}-theme.json`, "application/json");
  downloadFile(layoutJson, `${name}-layout.json`, "application/json");
  downloadFile(styleContent, `${name}-style.css`, "text/css");
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadStyle() {
  const data = styleEditor.value;
  downloadFile(data, "style.css", "text/css");
}

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function getThemePosition(event) {
  const pos = getMousePosition(event);
  return {
    x: pos.x - viewOffset.x,
    y: pos.y - viewOffset.y
  };
}

canvas.addEventListener("mousedown", event => {
  const pos = getThemePosition(event);
  for (let i = plugins.length - 1; i >= 0; i -= 1) {
    const bounds = getPluginBounds(plugins[i]);
    if (!bounds) continue;
    const onResizeHandle =
      canResize(plugins[i]) &&
      pos.x >= bounds.x + bounds.width - 12 &&
      pos.x <= bounds.x + bounds.width + 12 &&
      pos.y >= bounds.y + bounds.height - 12 &&
      pos.y <= bounds.y + bounds.height + 12;
    if (
      pos.x >= bounds.x &&
      pos.x <= bounds.x + bounds.width &&
      pos.y >= bounds.y &&
      pos.y <= bounds.y + bounds.height
    ) {
      selectPlugin(i);
      dragging = {
        index: i,
        offsetX: pos.x - bounds.x,
        offsetY: pos.y - bounds.y,
        mode: onResizeHandle ? "resize" : "move",
        startWidth: bounds.width,
        startHeight: bounds.height
      };
      return;
    }
  }

  selectPlugin(-1);
});

window.addEventListener("mousemove", event => {
  if (!dragging) return;
  const pos = getThemePosition(event);
  const cfg = plugins[dragging.index];
  if (dragging.mode === "resize" && canResize(cfg)) {
    const rawWidth = Math.max(20, pos.x - (cfg.x ?? 0));
    const rawHeight = Math.max(20, pos.y - (cfg.y ?? 0));
    const snappedWidth = snapToGrid ? Math.round(rawWidth / gridSize) * gridSize : rawWidth;
    const snappedHeight = snapToGrid ? Math.round(rawHeight / gridSize) * gridSize : rawHeight;
    cfg.width = Math.round(snappedWidth);
    cfg.height = Math.round(snappedHeight);
  } else {
    const newX = pos.x - dragging.offsetX;
    const newY = pos.y - dragging.offsetY;
    cfg.x = Math.round(snapToGrid ? Math.round(newX / gridSize) * gridSize : newX);
    cfg.y = Math.round(snapToGrid ? Math.round(newY / gridSize) * gridSize : newY);
  }
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});

window.addEventListener("mouseup", () => {
  dragging = null;
});

Object.keys(pluginMap).forEach(type => {
  const option = document.createElement("option");
  option.value = type;
  option.textContent = type;
  pluginTypeSelect.appendChild(option);
});

Object.entries(STYLE_PRESETS).forEach(([key, value]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = key;
  stylePresetSelect.appendChild(option);
});

Object.entries(ANIMATION_PRESETS).forEach(([key, value]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = key;
  animationPresetSelect.appendChild(option);
});

loadThemeButton.addEventListener("click", () => {
  loadTheme().catch(err => alert(err.message));
});

addPluginButton.addEventListener("click", addPlugin);
applyPluginButton.addEventListener("click", applyPluginConfig);
deletePluginButton.addEventListener("click", deletePlugin);
duplicatePluginButton.addEventListener("click", duplicatePlugin);
toggleVisibilityButton.addEventListener("click", toggleVisibility);
saveLayoutButton.addEventListener("click", downloadLayout);
createThemeButton.addEventListener("click", downloadThemePack);
downloadStyleButton.addEventListener("click", downloadStyle);
layerUpButton.addEventListener("click", () => moveLayer(1));
layerDownButton.addEventListener("click", () => moveLayer(-1));
applyStylePresetButton.addEventListener("click", () => {
  const preset = STYLE_PRESETS[stylePresetSelect.value];
  if (!preset) return;
  styleEditor.value = preset;
  styleTag.textContent = preset;
});
addAnimationPresetButton.addEventListener("click", () => {
  const snippet = ANIMATION_PRESETS[animationPresetSelect.value];
  if (!snippet) return;
  styleEditor.value = `${styleEditor.value}\n${snippet}`.trim();
  styleTag.textContent = styleEditor.value;
});
showGridCheckbox.addEventListener("change", () => {
  showGrid = showGridCheckbox.checked;
});
snapGridCheckbox.addEventListener("change", () => {
  snapToGrid = snapGridCheckbox.checked;
});
gridSizeInput.addEventListener("change", () => {
  gridSize = Math.max(4, Number(gridSizeInput.value) || 20);
});
window.addEventListener("resize", resizeStageCanvas);
themeBackgroundInput.addEventListener("input", () => {
  updateCanvasBackground();
});
themeWidthInput.addEventListener("change", () => {
  setCanvasSize(Number(themeWidthInput.value) || 1920, Number(themeHeightInput.value) || 480);
});
themeHeightInput.addEventListener("change", () => {
  setCanvasSize(Number(themeWidthInput.value) || 1920, Number(themeHeightInput.value) || 480);
});
themeNameInput.addEventListener("input", () => {
  updateThemePath();
});
styleEditor.addEventListener("input", () => {
  styleTag.textContent = styleEditor.value;
});
textEditor.addEventListener("input", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "asciiText") return;
  cfg.text = textEditor.value.split("\n");
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
pixelCanvas.addEventListener("mousedown", event => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  isPaintingPixels = true;
  paintPixel(event, cfg);
});
pixelCanvas.addEventListener("mousemove", event => {
  if (!isPaintingPixels) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  paintPixel(event, cfg);
});
window.addEventListener("mouseup", () => {
  isPaintingPixels = false;
});
pixelGridWidthInput.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  cfg.gridWidth = Math.max(1, Number(pixelGridWidthInput.value) || 8);
  normalizePixelConfig(cfg);
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
pixelGridHeightInput.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  cfg.gridHeight = Math.max(1, Number(pixelGridHeightInput.value) || 8);
  normalizePixelConfig(cfg);
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
pixelSizeInput.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  cfg.pixelSize = Math.max(2, Number(pixelSizeInput.value) || 12);
  normalizePixelConfig(cfg);
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
pixelColorInput.addEventListener("input", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  cfg.paintColor = pixelColorInput.value;
});
pixelClearButton.addEventListener("click", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "pixelArt") return;
  normalizePixelConfig(cfg);
  cfg.pixels = new Array(cfg.gridWidth * cfg.gridHeight).fill(null);
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
shapeTypeSelect.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "shape") return;
  cfg.shape = shapeTypeSelect.value;
  shapeSidesInput.disabled = cfg.shape !== "polygon";
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
rotationInput.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (!("rotation" in cfg)) return;
  cfg.rotation = Number(rotationInput.value) || 0;
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
shapeSidesInput.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "shape") return;
  cfg.sides = Math.max(3, Math.min(12, Number(shapeSidesInput.value) || 6));
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
colorPickerInput.addEventListener("input", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (!("color" in cfg)) return;
  cfg.color = colorPickerInput.value;
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});
alphaRangeInput.addEventListener("input", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  cfg.alpha = Number(alphaRangeInput.value);
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});

setCanvasSize(1920, 480);
pluginInstances = instantiatePlugins();
textEditor.disabled = true;
pixelEditor.style.display = "none";
updateThemePath();
render();
