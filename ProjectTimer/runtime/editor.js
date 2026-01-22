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

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
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
const rotationInput = document.getElementById("rotation");
const textEditor = document.getElementById("textEditor");
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
  video: VideoPlayer
};

const DEFAULT_CONFIGS = {
  clock: { type: "clock", x: 60, y: 120, size: 48, color: "#00ff66" },
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
    color: "#00ff66"
  },
  asciiText: {
    type: "asciiText",
    x: 80,
    y: 60,
    fontSize: 16,
    lineHeight: 22,
    color: "#00ff66",
    text: ["ASCII TITLE", "---------------"]
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
    rotation: 0
  },
  label: {
    type: "label",
    x: 120,
    y: 120,
    text: "Label",
    fontSize: 24,
    fontFamily: "monospace",
    color: "#00ff66",
    align: "left"
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
    coverSize: 96
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
    appVersion: "1.0.0"
  },
  mediaText: {
    type: "mediaText",
    x: 200,
    y: 60,
    width: 320,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0"
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
    appVersion: "1.0.0"
  },
  mediaControls: {
    type: "mediaControls",
    x: 200,
    y: 160,
    baseUrl: "http://localhost:9863/api/v1",
    appId: "projecttimer",
    appName: "Project Timer",
    appVersion: "1.0.0"
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
    rotation: 0
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

function setCanvasSize(width, height) {
  canvas.width = width;
  canvas.height = height;
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
    rotationInput.disabled = true;
    overlay.style.display = "none";
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
  }

  rotationInput.disabled = !("rotation" in cfg);
  rotationInput.value = cfg.rotation ?? 0;
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
  overlay.style.left = `${bounds.x + canvas.offsetLeft}px`;
  overlay.style.top = `${bounds.y + canvas.offsetTop}px`;
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
    "video"
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
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  pluginInstances.forEach(instance => {
    instance.update?.();
    instance.draw(ctx);
  });

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

canvas.addEventListener("mousedown", event => {
  const pos = getMousePosition(event);
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
  const pos = getMousePosition(event);
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
themeBackgroundInput.addEventListener("input", () => {
  updateCanvasBackground();
});
themeWidthInput.addEventListener("change", () => {
  setCanvasSize(Number(themeWidthInput.value) || 1920, Number(themeHeightInput.value) || 480);
});
themeHeightInput.addEventListener("change", () => {
  setCanvasSize(Number(themeWidthInput.value) || 1920, Number(themeHeightInput.value) || 480);
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
shapeTypeSelect.addEventListener("change", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "shape") return;
  cfg.shape = shapeTypeSelect.value;
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

setCanvasSize(1920, 480);
pluginInstances = instantiatePlugins();
textEditor.disabled = true;
render();
