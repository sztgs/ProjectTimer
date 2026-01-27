const themeList = document.getElementById("themeList");
const preview = document.getElementById("preview");
const updateNotice = document.getElementById("updateNotice");
const shell = document.querySelector(".pi-shell");
let themes = [];
let activeIndex = 0;
let uiHidden = false;

async function loadThemes() {
  const response = await fetch("/api/themes");
  const data = await response.json();
  themes = data.themes;
  activeIndex = Math.max(0, themes.indexOf(data.active));
  renderList();
}

function renderList() {
  themeList.innerHTML = "";
  themes.forEach((theme, index) => {
    const item = document.createElement("li");
    item.textContent = theme;
    if (index === activeIndex) {
      item.classList.add("active");
    }
    themeList.appendChild(item);
  });
}

async function applyTheme() {
  const theme = themes[activeIndex];
  if (!theme) return;
  const response = await fetch("/api/theme", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme })
  });
  if (response.ok) {
    preview.src = "./index.html";
  }
}

function moveSelection(direction) {
  if (!themes.length) return;
  activeIndex = (activeIndex + direction + themes.length) % themes.length;
  renderList();
}

function toggleUi() {
  uiHidden = !uiHidden;
  shell.classList.toggle("hide-ui", uiHidden);
  localStorage.setItem("piHideUi", uiHidden ? "1" : "0");
}

async function checkForUpdates() {
  try {
    const response = await fetch("/api/update-check");
    if (!response.ok) return;
    const data = await response.json();
    if (data.updateAvailable) {
      updateNotice.hidden = false;
      updateNotice.textContent = `Update available (${data.remote?.slice(0, 7) ?? "new"})`;
    }
  } catch (err) {
    console.warn("Update check failed", err);
  }
}

document.addEventListener("keydown", event => {
  if (event.key === "ArrowDown") {
    moveSelection(1);
  } else if (event.key === "ArrowUp") {
    moveSelection(-1);
  } else if (event.key === "Enter") {
    applyTheme();
  } else if (event.key.toLowerCase() === "e") {
    preview.src = "./editor.html";
  } else if (event.key.toLowerCase() === "t") {
    preview.src = "./index.html";
  } else if (event.key.toLowerCase() === "h") {
    toggleUi();
  }
});

uiHidden = localStorage.getItem("piHideUi") === "1";
shell.classList.toggle("hide-ui", uiHidden);
loadThemes();
checkForUpdates();
