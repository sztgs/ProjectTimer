export default class PulseRing {
  constructor(cfg) {
    this.cfg = cfg;
    this.phase = 0;
  }

  update() {
    const speed = this.cfg.speed ?? 0.03;
    this.phase += speed;
  }

  draw(ctx) {
    const {
      x,
      y,
      radius = 30,
      color = "#00ff66",
      lineWidth = 3,
      alpha = 1
    } = this.cfg;

    const pulse = (Math.sin(this.phase) + 1) / 2;
    const currentRadius = radius + pulse * radius * 0.6;
    const currentAlpha = alpha * (0.3 + pulse * 0.7);

    ctx.save();
    ctx.globalAlpha = currentAlpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
