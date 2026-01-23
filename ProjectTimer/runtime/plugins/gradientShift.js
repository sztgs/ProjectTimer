export default class GradientShift {
  constructor(cfg) {
    this.cfg = cfg;
    this.phase = 0;
  }

  update() {
    const speed = this.cfg.speed ?? 0.01;
    this.phase += speed;
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 300,
      height = 160,
      colors = ["#0ea5e9", "#8b5cf6", "#f43f5e"],
      alpha = 1
    } = this.cfg;

    const offset = (Math.sin(this.phase) + 1) / 2;
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    const steps = colors.length - 1;
    colors.forEach((color, index) => {
      const position = Math.min(1, Math.max(0, index / steps + offset * 0.2));
      gradient.addColorStop(position, color);
    });

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
  }
}
