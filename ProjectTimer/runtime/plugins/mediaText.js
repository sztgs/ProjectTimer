import { getMediaState } from "./mediaSession.js";

export default class MediaText {
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
      lineHeight = 26,
      titleSize = 24,
      textSize = 18,
      titleColor = "#00ff66",
      textColor = "#ffffff",
      fallback = "Wait for connection"
    } = this.cfg;

    const state = getMediaState(this.cfg);
    const title = state.title || fallback;

    ctx.fillStyle = titleColor;
    ctx.font = `${titleSize}px monospace`;
    ctx.fillText(title, x, y + titleSize);

    ctx.fillStyle = textColor;
    ctx.font = `${textSize}px monospace`;
    if (state.artist) {
      ctx.fillText(state.artist, x, y + titleSize + lineHeight);
    }
    if (state.album) {
      ctx.fillText(state.album, x, y + titleSize + lineHeight * 2);
    }

    if (state.status !== "ready" && !state.artist) {
      ctx.fillText(fallback, x, y + titleSize + lineHeight);
    }

  }
}
