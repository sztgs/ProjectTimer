import { getMediaSession, getMediaState } from "./mediaSession.js";

export default class MediaControls {
  constructor(cfg) {
    this.cfg = cfg;
  }

  update() {
    getMediaState(this.cfg);
  }

  getButtons() {
    const {
      x,
      y,
      buttonSize = 32,
      gap = 12
    } = this.cfg;

    const prev = { x, y, size: buttonSize, command: "previous", label: "<<" };
    const play = { x: x + buttonSize + gap, y, size: buttonSize, command: "playPause", label: ">" };
    const next = { x: x + (buttonSize + gap) * 2, y, size: buttonSize, command: "next", label: ">>" };

    return [prev, play, next];
  }

  async handleClick(px, py) {
    const buttons = this.getButtons();
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

  draw(ctx) {
    const {
      buttonSize = 32,
      borderColor = "#00ff66",
      fillColor = "rgba(0, 0, 0, 0.4)",
      textColor = "#00ff66",
      fontSize = 16,
      alpha = 1
    } = this.cfg;

    const state = getMediaState(this.cfg);
    const isPlaying = state.trackState === 1;
    const buttons = this.getButtons().map(button => ({
      ...button,
      label: button.command === "playPause" ? (isPlaying ? "||" : ">") : button.label
    }));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${fontSize}px monospace`;
    buttons.forEach(button => {
      ctx.fillStyle = fillColor;
      ctx.fillRect(button.x, button.y, button.size, button.size);
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(button.x, button.y, button.size, button.size);
      ctx.fillStyle = textColor;
      const textX = button.x + button.size / 2 - fontSize / 2 + 2;
      const textY = button.y + button.size / 2 + fontSize / 2 - 4;
      ctx.fillText(button.label, textX, textY);
    });
    ctx.restore();
  }
}
