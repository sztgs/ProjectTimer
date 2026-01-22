import { getMediaState, getMediaSession } from "./mediaSession.js";

export default class MediaPlayer {
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

  getControlButtons(bounds) {
    const size = this.cfg.buttonSize ?? 28;
    const gap = this.cfg.buttonGap ?? 10;
    const baseY = bounds.y + bounds.height - size - 12;
    const startX = bounds.x + bounds.width - (size * 3 + gap * 2) - 12;
    return [
      { x: startX, y: baseY, size, command: "previous", label: "<<" },
      { x: startX + size + gap, y: baseY, size, command: "playPause", label: ">" },
      { x: startX + (size + gap) * 2, y: baseY, size, command: "next", label: ">>" }
    ];
  }

  async handleClick(px, py) {
    const bounds = this.getBounds();
    const buttons = this.getControlButtons(bounds);
    const session = getMediaSession(this.cfg);
    for (const button of buttons) {
      if (
        px >= button.x &&
        px <= button.x + button.size &&
        py >= button.y &&
        py <= button.y + button.size
      ) {
        await session.sendCommand(button.command);
        return true;
      }
    }
    return false;
  }

  getBounds() {
    const { x, y, width = 520, height = 160 } = this.cfg;
    return { x, y, width, height };
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 520,
      height = 160,
      background = "rgba(0, 0, 0, 0.5)",
      color = "#ffffff",
      accentColor = "#00ff66",
      fontSize = 18,
      titleSize = 22,
      padding = 14,
      coverSize = 96,
      gap = 16,
      progressHeight = 8,
      progressBackground = "rgba(255, 255, 255, 0.2)",
      progressFill = "#00ff66",
      buttonSize = 28,
      buttonGap = 10,
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

    const coverX = x + padding;
    const coverY = y + padding;

    if (this.coverLoaded && !this.coverFailed) {
      ctx.drawImage(this.coverImage, coverX, coverY, coverSize, coverSize);
    } else {
      ctx.strokeStyle = accentColor;
      ctx.strokeRect(coverX, coverY, coverSize, coverSize);
      ctx.font = `${fontSize - 4}px monospace`;
      ctx.fillStyle = accentColor;
      ctx.fillText("No Art", coverX + 10, coverY + coverSize / 2);
    }

    const textX = coverX + coverSize + gap;
    const textY = y + padding + titleSize;

    ctx.fillStyle = accentColor;
    ctx.font = `${titleSize}px monospace`;
    ctx.fillText(state.title || "Wait for connection", textX, textY);

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;
    if (state.artist) {
      ctx.fillText(state.artist, textX, textY + fontSize + 8);
    }
    if (state.album) {
      ctx.fillText(state.album, textX, textY + (fontSize + 8) * 2);
    }

    const progressX = textX;
    const progressY = y + height - progressHeight - padding;
    const progressWidth = width - (textX - x) - padding;

    ctx.fillStyle = progressBackground;
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
    ctx.fillStyle = progressFill;
    ctx.fillRect(progressX, progressY, progressWidth * ratio, progressHeight);

    const controlsY = progressY - buttonSize - 8;
    const controlsX = x + width - (buttonSize * 3 + buttonGap * 2) - padding;
    const isPlaying = state.trackState === 1;
    const labels = ["<<", isPlaying ? "||" : ">", ">>"];

    ctx.font = `${fontSize}px monospace`;
    [0, 1, 2].forEach(index => {
      const btnX = controlsX + index * (buttonSize + buttonGap);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(btnX, controlsY, buttonSize, buttonSize);
      ctx.strokeStyle = accentColor;
      ctx.strokeRect(btnX, controlsY, buttonSize, buttonSize);
      ctx.fillStyle = accentColor;
      ctx.fillText(labels[index], btnX + buttonSize / 2 - fontSize / 2 + 2, controlsY + buttonSize / 2 + fontSize / 2 - 4);
    });
    ctx.restore();
  }
}
