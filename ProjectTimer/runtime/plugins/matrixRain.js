const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default class MatrixRain {
  constructor(cfg) {
    this.cfg = cfg;
    this.columns = [];
    this.reset();
  }

  reset() {
    const width = this.cfg.width ?? 300;
    const fontSize = this.cfg.fontSize ?? 14;
    const count = Math.floor(width / fontSize);
    this.columns = Array.from({ length: count }, () => ({
      y: Math.random() * -200,
      speed: 1 + Math.random() * 2
    }));
  }

  update() {
    const height = this.cfg.height ?? 200;
    this.columns.forEach(col => {
      col.y += col.speed;
      if (col.y > height + 200) {
        col.y = Math.random() * -200;
      }
    });
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 300,
      height = 200,
      fontSize = 14,
      color = "#00ff66",
      background = "rgba(0,0,0,0.4)",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;
    this.columns.forEach((col, index) => {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, x + index * fontSize, y + col.y);
    });
    ctx.restore();
  }
}
