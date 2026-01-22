export default class ImageWidget {
  constructor(cfg) {
    this.cfg = cfg;
    this.img = new Image();
    this.loaded = false;
    this.failed = false;

    this.img.onload = () => {
      this.loaded = true;
    };

    this.img.onerror = () => {
      console.warn("Image load failed:", this.img.src);
      this.failed = true;
    };

    this.img.src = `${cfg._themePath}/${cfg.src}`;
  }

  draw(ctx) {
    if (!this.loaded || this.failed) return;

    ctx.drawImage(
      this.img,
      this.cfg.x,
      this.cfg.y,
      this.cfg.width,
      this.cfg.height
    );
  }
}
