const themeList = document.getElementById("themeList");
const preview = document.getElementById("preview");
let themes = [];
let activeIndex = 0;

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
  }
});

loadThemes();
