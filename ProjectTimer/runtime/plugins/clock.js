export default class Clock {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const t = new Date().toLocaleTimeString("pl-PL");
    ctx.fillStyle = this.cfg.color || "#fff";
    ctx.font = `${this.cfg.size}px monospace`;
    ctx.fillText(t, this.cfg.x, this.cfg.y);
  }
}
