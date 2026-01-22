import Clock from "./plugins/clock.js";
import ImageWidget from "./plugins/image.js";
import Calendar from "./plugins/calendar.js";
import AsciiClock from "./plugins/asciiClock.js";
import AsciiText from "./plugins/asciiText.js";
import Shape from "./plugins/shape.js";

const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");
const themeNameInput = document.getElementById("themeName");
const loadThemeButton = document.getElementById("loadTheme");
const saveLayoutButton = document.getElementById("saveLayout");
const pluginTypeSelect = document.getElementById("pluginType");
const addPluginButton = document.getElementById("addPlugin");
const pluginList = document.getElementById("pluginList");
const pluginJson = document.getElementById("pluginJson");
const applyPluginButton = document.getElementById("applyPlugin");
const deletePluginButton = document.getElementById("deletePlugin");
const textEditor = document.getElementById("textEditor");
const layerUpButton = document.getElementById("layerUp");
const layerDownButton = document.getElementById("layerDown");
const styleEditor = document.getElementById("styleEditor");
const downloadStyleButton = document.getElementById("downloadStyle");
const overlay = document.getElementById("overlay");
const resizeHandle = overlay.querySelector(".resize-handle");

const pluginMap = {
  clock: Clock,
  image: ImageWidget,
  calendar: Calendar,
  asciiClock: AsciiClock,
  asciiText: AsciiText,
  shape: Shape
};

const DEFAULT_CONFIGS = {
  clock: { type: "clock", x: 60, y: 120, size: 48, color: "#00ff66" },
  image: {
    type: "image",
    x: 0,
    y: 0,
    width: 300,
    height: 200,
    src: "assets/bg.png"
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
    lineWidth: 2
  }
};

let themePath = "./themes/bios";
let plugins = [];
let selectedIndex = -1;
let dragging = null;
let themeCss = "";

function setCanvasSize(width, height) {
  canvas.width = width;
  canvas.height = height;
}

function rebuildPluginList() {
  pluginList.innerHTML = "";
  plugins.forEach((cfg, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `${index + 1}. ${cfg.type}`;
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
  return ["image", "calendar", "shape"].includes(cfg.type);
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

  return { x: cfg.x ?? 0, y: cfg.y ?? 0, width: 200, height: 120 };
}

function instantiatePlugins() {
  return plugins.map(cfg => {
    const Plugin = pluginMap[cfg.type];
    if (!Plugin) return null;
    cfg._themePath = themePath;
    return new Plugin(cfg);
  }).filter(Boolean);
}

let pluginInstances = [];

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

function downloadStyle() {
  const data = styleEditor.value;
  const blob = new Blob([data], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "style.css";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
    const newWidth = Math.max(20, pos.x - (cfg.x ?? 0));
    const newHeight = Math.max(20, pos.y - (cfg.y ?? 0));
    cfg.width = Math.round(newWidth);
    cfg.height = Math.round(newHeight);
  } else {
    cfg.x = Math.round(pos.x - dragging.offsetX);
    cfg.y = Math.round(pos.y - dragging.offsetY);
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

loadThemeButton.addEventListener("click", () => {
  loadTheme().catch(err => alert(err.message));
});

addPluginButton.addEventListener("click", addPlugin);
applyPluginButton.addEventListener("click", applyPluginConfig);
deletePluginButton.addEventListener("click", deletePlugin);
saveLayoutButton.addEventListener("click", downloadLayout);
downloadStyleButton.addEventListener("click", downloadStyle);
layerUpButton.addEventListener("click", () => moveLayer(1));
layerDownButton.addEventListener("click", () => moveLayer(-1));
textEditor.addEventListener("input", () => {
  if (selectedIndex < 0) return;
  const cfg = plugins[selectedIndex];
  if (cfg.type !== "asciiText") return;
  cfg.text = textEditor.value.split("\n");
  pluginInstances = instantiatePlugins();
  updatePluginJson();
});

setCanvasSize(1920, 480);
pluginInstances = instantiatePlugins();
textEditor.disabled = true;
render();
