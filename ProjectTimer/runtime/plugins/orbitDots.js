export default class OrbitDots {
  constructor(cfg) {
    this.cfg = cfg;
    this.phase = 0;
  }

  update() {
    const speed = this.cfg.speed ?? 0.02;
    this.phase += speed;
  }

  draw(ctx) {
    const {
      x,
      y,
      radius = 40,
      count = 6,
      color = "#00ff66",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    for (let i = 0; i < count; i += 1) {
      const angle = this.phase + (Math.PI * 2 * i) / count;
      const dotX = x + Math.cos(angle) * radius;
      const dotY = y + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
