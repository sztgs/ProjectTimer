export default class AsciiSpinner {
  constructor(cfg) {
    this.cfg = cfg;
    this.index = 0;
    this.lastTick = 0;
    this.frames = cfg.frames || ["|", "/", "-", "\\"];
  }

  update() {
    const speed = this.cfg.speed ?? 120;
    const now = performance.now();
    if (now - this.lastTick < speed) return;
    this.index = (this.index + 1) % this.frames.length;
    this.lastTick = now;
  }

  draw(ctx) {
    const {
      x,
      y,
      color = "#00ff66",
      fontSize = 24,
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;
    ctx.fillText(this.frames[this.index], x, y);
    ctx.restore();
  }
}
