export default class ParticleField {
  constructor(cfg) {
    this.cfg = cfg;
    this.particles = [];
    this.reset();
  }

  reset() {
    const count = this.cfg.count ?? 40;
    this.particles = Array.from({ length: count }, () => this.createParticle());
  }

  createParticle() {
    const width = this.cfg.width ?? 300;
    const height = this.cfg.height ?? 200;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: 2 + Math.random() * 2
    };
  }

  update() {
    const width = this.cfg.width ?? 300;
    const height = this.cfg.height ?? 200;
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
    });
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 300,
      height = 200,
      color = "#00ff66",
      background = "rgba(0,0,0,0.2)",
      alpha = 1
    } = this.cfg;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = color;
    this.particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(x + particle.x, y + particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
