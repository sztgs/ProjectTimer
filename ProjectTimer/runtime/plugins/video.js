export default class VideoPlayer {
  constructor(cfg) {
    this.cfg = cfg;
    this.video = document.createElement("video");
    this.ready = false;

    this.video.muted = cfg.muted ?? true;
    this.video.loop = cfg.loop ?? true;
    this.video.autoplay = cfg.autoplay ?? true;
    this.video.playsInline = true;

    this.video.addEventListener("canplay", () => {
      this.ready = true;
      if (this.video.autoplay) {
        this.video.play().catch(() => undefined);
      }
    });

    this.video.addEventListener("error", () => {
      this.ready = false;
    });

    const src = cfg.src ? `${cfg._themePath}/${cfg.src}` : "";
    if (src) {
      this.video.src = src;
    }
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 320,
      height = 180,
      rotation = 0,
      background = "rgba(0,0,0,0.4)"
    } = this.cfg;

    if (!this.ready) {
      ctx.fillStyle = background;
      ctx.fillRect(x, y, width, height);
      ctx.strokeStyle = "#00ff66";
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "#00ff66";
      ctx.font = "14px monospace";
      ctx.fillText("Video", x + 12, y + height / 2);
      return;
    }

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radians = (rotation * Math.PI) / 180;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);
    ctx.drawImage(this.video, -width / 2, -height / 2, width, height);
    ctx.restore();
  }
}
