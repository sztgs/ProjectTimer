export default class Clock {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const alpha = this.cfg.alpha ?? 1;
    const t = new Date().toLocaleTimeString("pl-PL");
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.cfg.color || "#fff";
    ctx.font = `${this.cfg.size}px monospace`;
    ctx.fillText(t, this.cfg.x, this.cfg.y);
    ctx.restore();
  }
}
