export default class Label {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const {
      x,
      y,
      text = "Label",
      color = "#00ff66",
      fontSize = 24,
      fontFamily = "monospace",
      align = "left",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.textAlign = "left";
    ctx.restore();
  }
}
