export default class PixelArt {
  constructor(config) {
    this.config = config;
  }

  draw(ctx) {
    const cfg = this.config;
    const gridWidth = Math.max(1, Number(cfg.gridWidth) || 8);
    const gridHeight = Math.max(1, Number(cfg.gridHeight) || 8);
    const pixelSize = Math.max(1, Number(cfg.pixelSize) || 8);
    const x = cfg.x ?? 0;
    const y = cfg.y ?? 0;
    const width = gridWidth * pixelSize;
    const height = gridHeight * pixelSize;

    ctx.save();
    if (typeof cfg.alpha === "number") {
      ctx.globalAlpha = cfg.alpha;
    }
    if (cfg.background && cfg.background !== "transparent") {
      ctx.fillStyle = cfg.background;
      ctx.fillRect(x, y, width, height);
    }
    const pixels = Array.isArray(cfg.pixels) ? cfg.pixels : [];
    pixels.forEach((color, index) => {
      if (!color) return;
      const px = x + (index % gridWidth) * pixelSize;
      const py = y + Math.floor(index / gridWidth) * pixelSize;
      ctx.fillStyle = color;
      ctx.fillRect(px, py, pixelSize, pixelSize);
    });
    ctx.restore();
  }
}
