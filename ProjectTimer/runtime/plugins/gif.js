export default class GifPlayer {
  constructor(cfg) {
    this.cfg = cfg;
    this.img = new Image();
    this.loaded = false;
    this.failed = false;

    this.img.onload = () => {
      this.loaded = true;
    };

    this.img.onerror = () => {
      this.failed = true;
    };

    this.img.src = `${cfg._themePath}/${cfg.src}`;
  }

  draw(ctx) {
    if (!this.loaded || this.failed) return;

    const {
      x,
      y,
      width,
      height,
      rotation = 0,
      alpha = 1
    } = this.cfg;

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radians = (rotation * Math.PI) / 180;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);
    ctx.drawImage(this.img, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
}
