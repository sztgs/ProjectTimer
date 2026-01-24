const themeSelect = document.getElementById("themeSelect");
const applyThemeButton = document.getElementById("applyTheme");
const openRuntimeButton = document.getElementById("openRuntime");
const openEditorButton = document.getElementById("openEditor");
const openStudioButton = document.getElementById("openStudio");
const openAsciiLabButton = document.getElementById("openAsciiLab");
const toggleFullscreenButton = document.getElementById("toggleFullscreen");
const toggleUiButton = document.getElementById("toggleUi");
const preview = document.getElementById("preview");
const themeGrid = document.getElementById("themeGrid");
const appRoot = document.querySelector(".app");

async function loadThemes() {
  const response = await fetch("/api/themes");
  const data = await response.json();
  themeSelect.innerHTML = "";
  themeGrid.innerHTML = "";
  data.themes.forEach(theme => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    if (theme === data.active) {
      option.selected = true;
    }
    themeSelect.appendChild(option);

    const card = document.createElement("div");
    card.className = "theme-card";
    const previewEl = document.createElement("div");
    previewEl.className = "theme-preview";
    const info = document.createElement("div");
    info.className = "theme-info";
    info.innerHTML = `<strong>${theme}</strong><span>Loading preview...</span>`;
    card.appendChild(previewEl);
    card.appendChild(info);
    card.addEventListener("click", () => {
      themeSelect.value = theme;
    });
    themeGrid.appendChild(card);

    fetch(`./themes/${theme}/theme.json`)
      .then(r => r.json())
      .then(meta => {
        const bg = meta.background || "#000";
        if (bg.startsWith("#") || bg.startsWith("rgb")) {
          previewEl.style.background = bg;
        } else {
          previewEl.style.backgroundImage = `url(./themes/${theme}/${bg})`;
        }
        info.innerHTML = `<strong>${meta.name || theme}</strong><span>${meta.resolution?.[0]}x${meta.resolution?.[1]}</span>`;
      })
      .catch(() => {
        info.innerHTML = `<strong>${theme}</strong><span>No preview</span>`;
      });
  });
  preview.src = "./index.html";
}

async function applyTheme() {
  const theme = themeSelect.value;
  const response = await fetch("/api/theme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ theme })
  });
  if (response.ok) {
    preview.src = "./index.html";
  } else {
    const data = await response.json();
    alert(data.error || "Failed to set theme");
  }
}

openRuntimeButton.addEventListener("click", () => {
  preview.src = "./index.html";
});

openEditorButton.addEventListener("click", () => {
  preview.src = "./editor.html";
});

openStudioButton.addEventListener("click", () => {
  preview.src = "./editor-experimental.html";
});

openAsciiLabButton.addEventListener("click", () => {
  preview.src = "./ascii-animator.html";
});

toggleFullscreenButton.addEventListener("click", () => {
  appRoot.classList.toggle("fullscreen");
});

toggleUiButton.addEventListener("click", () => {
  appRoot.classList.toggle("hide-ui");
  toggleUiButton.textContent = appRoot.classList.contains("hide-ui") ? "❮" : "❯";
});

applyThemeButton.addEventListener("click", applyTheme);

loadThemes();
