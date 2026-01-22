export default class Starfield {
  constructor(cfg) {
    this.cfg = cfg;
    this.stars = [];
    this.reset();
  }

  reset() {
    const count = this.cfg.count ?? 80;
    this.stars = Array.from({ length: count }, () => this.createStar());
  }

  createStar() {
    const width = this.cfg.width ?? 400;
    const height = this.cfg.height ?? 200;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      speed: 0.5 + Math.random() * 1.5,
      size: 1 + Math.random() * 2
    };
  }

  update() {
    const width = this.cfg.width ?? 400;
    const height = this.cfg.height ?? 200;
    this.stars.forEach(star => {
      star.x += star.speed;
      if (star.x > width) {
        star.x = 0;
        star.y = Math.random() * height;
      }
    });
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 400,
      height = 200,
      color = "#ffffff",
      background = "rgba(0,0,0,0.4)",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = color;
    this.stars.forEach(star => {
      ctx.fillRect(x + star.x, y + star.y, star.size, star.size);
    });
    ctx.restore();
  }
}
