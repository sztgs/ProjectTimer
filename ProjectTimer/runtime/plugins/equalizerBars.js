export default class EqualizerBars {
  constructor(cfg) {
    this.cfg = cfg;
    this.phase = 0;
  }

  update() {
    const speed = this.cfg.speed ?? 0.08;
    this.phase += speed;
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 200,
      height = 80,
      barCount = 8,
      color = "#00ff66",
      background = "rgba(0,0,0,0.3)",
      alpha = 1
    } = this.cfg;

    const barWidth = width / barCount;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = color;
    for (let i = 0; i < barCount; i += 1) {
      const wave = Math.abs(Math.sin(this.phase + i * 0.6));
      const barHeight = height * (0.2 + wave * 0.8);
      ctx.fillRect(x + i * barWidth + 2, y + height - barHeight, barWidth - 4, barHeight);
    }
    ctx.restore();
  }
}
