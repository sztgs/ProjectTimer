import { getMediaState } from "./mediaSession.js";

export default class MediaCover {
  constructor(cfg) {
    this.cfg = cfg;
    this.coverImage = new Image();
    this.coverLoaded = false;
    this.coverFailed = false;

    this.coverImage.onload = () => {
      this.coverLoaded = true;
      this.coverFailed = false;
    };

    this.coverImage.onerror = () => {
      this.coverFailed = true;
      this.coverLoaded = false;
    };
  }

  update() {
    const state = getMediaState(this.cfg);
    if (state.cover && this.coverImage.src !== state.cover) {
      this.coverLoaded = false;
      this.coverFailed = false;
      this.coverImage.src = state.cover;
    }
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 120,
      height = 120,
      background = "rgba(0, 0, 0, 0.4)",
      borderColor = "#00ff66",
      textColor = "#00ff66",
      fontSize = 14
    } = this.cfg;

    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    if (this.coverLoaded && !this.coverFailed) {
      ctx.drawImage(this.coverImage, x, y, width, height);
    } else {
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = textColor;
      ctx.font = `${fontSize}px monospace`;
      ctx.fillText("No Art", x + 10, y + height / 2);
    }
  }
}
