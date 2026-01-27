const stage = document.getElementById("stage");

document.querySelector("[data-action='editor']").addEventListener("click", () => {
  stage.src = "./editor.html";
});

document.querySelector("[data-action='theme']").addEventListener("click", () => {
  stage.src = "./app.html";
});

document.querySelector("[data-action='save']").addEventListener("click", () => {
  stage.contentWindow?.postMessage({ type: "saveLayout" }, "*");
});
