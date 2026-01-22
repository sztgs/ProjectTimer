export default class Shape {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 120,
      height = 120,
      shape = "rect",
      color = "#00ff66",
      fill = false,
      lineWidth = 2
    } = this.cfg;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    if (shape === "circle") {
      const radius = Math.min(width, height) / 2;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      return;
    }

    if (fill) {
      ctx.fillRect(x, y, width, height);
      return;
    }

    ctx.strokeRect(x, y, width, height);
  }
}
