export default class BinaryClock {
  constructor(cfg) {
    this.cfg = cfg;
  }

  getBits(value) {
    return value
      .toString(2)
      .padStart(6, "0")
      .split("")
      .map(bit => bit === "1");
  }

  draw(ctx) {
    const {
      x,
      y,
      dotSize = 10,
      gap = 6,
      onColor = "#00ff66",
      offColor = "rgba(0, 255, 102, 0.2)",
      background = "rgba(0,0,0,0.4)",
      alpha = 1
    } = this.cfg;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const columns = [this.getBits(hours), this.getBits(minutes), this.getBits(seconds)];
    const width = columns.length * (dotSize + gap) + gap;
    const height = columns[0].length * (dotSize + gap) + gap;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    columns.forEach((bits, colIndex) => {
      bits.forEach((bit, rowIndex) => {
        ctx.fillStyle = bit ? onColor : offColor;
        const dotX = x + gap + colIndex * (dotSize + gap);
        const dotY = y + gap + rowIndex * (dotSize + gap);
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    ctx.restore();
  }
}
