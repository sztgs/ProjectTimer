export default class RadarSweep {
  constructor(cfg) {
    this.cfg = cfg;
    this.angle = 0;
  }

  update() {
    const speed = this.cfg.speed ?? 0.02;
    this.angle += speed;
  }

  draw(ctx) {
    const {
      x,
      y,
      radius = 60,
      color = "#00ff66",
      lineWidth = 2,
      background = "rgba(0,0,0,0.3)",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(this.angle) * radius, y + Math.sin(this.angle) * radius);
    ctx.stroke();
    ctx.restore();
  }
}
