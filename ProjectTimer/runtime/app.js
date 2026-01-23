const themeSelect = document.getElementById("themeSelect");
const applyThemeButton = document.getElementById("applyTheme");
const openRuntimeButton = document.getElementById("openRuntime");
const openEditorButton = document.getElementById("openEditor");
const preview = document.getElementById("preview");

async function loadThemes() {
  const response = await fetch("/api/themes");
  const data = await response.json();
  themeSelect.innerHTML = "";
  data.themes.forEach(theme => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    if (theme === data.active) {
      option.selected = true;
    }
    themeSelect.appendChild(option);
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

applyThemeButton.addEventListener("click", applyTheme);

loadThemes();
