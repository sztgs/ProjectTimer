function normalizeLines(text) {
  if (Array.isArray(text)) {
    return text;
  }

  if (typeof text === "string") {
    return text.split("\n");
  }

  return [];
}

export default class AsciiText {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const {
      x,
      y,
      text,
      color = "#00ff66",
      fontSize = 18,
      lineHeight = fontSize + 6,
      alpha = 1
    } = this.cfg;

    const lines = normalizeLines(text);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;

    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
    ctx.restore();
  }
}
