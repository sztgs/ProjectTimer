const framesInput = document.getElementById("frames");
const speedInput = document.getElementById("speed");
const colorInput = document.getElementById("color");
const fontSizeInput = document.getElementById("fontSize");
const copyButton = document.getElementById("copyConfig");
const configOut = document.getElementById("configOut");
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

let frameIndex = 0;
let lastTick = 0;

function getFrames() {
  return framesInput.value.split("\n").filter(Boolean);
}

function buildConfig() {
  return {
    type: "asciiSpinner",
    x: 60,
    y: 120,
    frames: getFrames(),
    speed: Number(speedInput.value) || 120,
    color: colorInput.value,
    fontSize: Number(fontSizeInput.value) || 24,
    alpha: 1
  };
}

function renderConfig() {
  const config = buildConfig();
  configOut.textContent = JSON.stringify(config, null, 2);
}

function loop(timestamp) {
  const speed = Number(speedInput.value) || 120;
  const frames = getFrames();
  if (frames.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(loop);
    return;
  }

  if (timestamp - lastTick > speed) {
    frameIndex = (frameIndex + 1) % frames.length;
    lastTick = timestamp;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colorInput.value;
  ctx.font = `${Number(fontSizeInput.value) || 24}px monospace`;
  ctx.fillText(frames[frameIndex], 40, 110);

  requestAnimationFrame(loop);
}

framesInput.addEventListener("input", renderConfig);
speedInput.addEventListener("input", renderConfig);
colorInput.addEventListener("input", renderConfig);
fontSizeInput.addEventListener("input", renderConfig);

copyButton.addEventListener("click", () => {
  navigator.clipboard.writeText(configOut.textContent).catch(() => undefined);
});

renderConfig();
requestAnimationFrame(loop);
