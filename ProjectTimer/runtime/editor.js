const stage = document.getElementById("stage");

const actions = {
  theme: () => {
    stage.src = "./app.html";
  },
  legacy: () => {
    stage.src = "./editor_legacy.html";
  },
  timer: () => {
    stage.src = "./index.html";
  },
  editor: () => {
    stage.src = "./editor_legacy.html";
  },
  save: () => {
    stage.contentWindow?.postMessage({ type: "saveLayout" }, "*");
  }
};

Object.entries(actions).forEach(([key, handler]) => {
  document.querySelectorAll(`[data-action='${key}']`).forEach(button => {
    button.addEventListener("click", handler);
  });
});
