export default class AsciiWave {
  constructor(cfg) {
    this.cfg = cfg;
    this.phase = 0;
  }

  update() {
    const speed = this.cfg.speed ?? 0.05;
    this.phase += speed;
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 400,
      height = 120,
      amplitude = 20,
      density = 0.15,
      color = "#00ff66",
      background = "rgba(0,0,0,0.2)",
      char = "~",
      fontSize = 16,
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;

    const columns = Math.floor(width / (fontSize * 0.6));
    for (let i = 0; i < columns; i += 1) {
      const px = x + i * (fontSize * 0.6);
      const wave = Math.sin(this.phase + i * density) * amplitude;
      const py = y + height / 2 + wave;
      ctx.fillText(char, px, py);
    }
    ctx.restore();
  }
}
