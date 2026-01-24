export default class GridWave {
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
      width = 300,
      height = 200,
      spacing = 20,
      amplitude = 6,
      color = "#00ff66",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    for (let px = 0; px <= width; px += spacing) {
      ctx.beginPath();
      for (let py = 0; py <= height; py += spacing) {
        const wave = Math.sin(this.phase + (px + py) * 0.02) * amplitude;
        const dx = x + px;
        const dy = y + py + wave;
        if (py === 0) {
          ctx.moveTo(dx, dy);
        } else {
          ctx.lineTo(dx, dy);
        }
      }
      ctx.stroke();
    }
    ctx.restore();
  }
}
