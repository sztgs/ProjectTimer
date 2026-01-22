import { getMediaState } from "./mediaSession.js";

export default class MediaProgress {
  constructor(cfg) {
    this.cfg = cfg;
  }

  update() {
    getMediaState(this.cfg);
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 400,
      height = 10,
      background = "rgba(255, 255, 255, 0.2)",
      fillColor = "#00ff66",
      borderColor = "#00ff66",
      alpha = 1
    } = this.cfg;

    const state = getMediaState(this.cfg);
    const duration = state.duration || 0;
    const progress = state.progress || 0;
    const ratio = duration > 0 ? Math.min(1, progress / duration) : 0;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width * ratio, height);

    ctx.strokeStyle = borderColor;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }
}
