const SEGMENTS = {
  0: [true, true, true, true, true, true, false],
  1: [false, true, true, false, false, false, false],
  2: [true, true, false, true, true, false, true],
  3: [true, true, true, true, false, false, true],
  4: [false, true, true, false, false, true, true],
  5: [true, false, true, true, false, true, true],
  6: [true, false, true, true, true, true, true],
  7: [true, true, true, false, false, false, false],
  8: [true, true, true, true, true, true, true],
  9: [true, true, true, true, false, true, true]
};

function drawDigit(ctx, value, x, y, size, color, offColor, lineWidth) {
  const segments = SEGMENTS[value] || SEGMENTS[0];
  const length = size * 2.2;
  const thickness = lineWidth;

  const segs = [
    { x: x + thickness, y: y, w: length, h: thickness },
    { x: x + length + thickness, y: y + thickness, w: thickness, h: length },
    { x: x + length + thickness, y: y + length + thickness * 2, w: thickness, h: length },
    { x: x + thickness, y: y + length * 2 + thickness * 2, w: length, h: thickness },
    { x: x, y: y + length + thickness * 2, w: thickness, h: length },
    { x: x, y: y + thickness, w: thickness, h: length },
    { x: x + thickness, y: y + length + thickness, w: length, h: thickness }
  ];

  segs.forEach((seg, index) => {
    ctx.fillStyle = segments[index] ? color : offColor;
    ctx.fillRect(seg.x, seg.y, seg.w, seg.h);
  });
}

export default class SegmentClock {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const {
      x,
      y,
      size = 12,
      gap = 12,
      color = "#00ff66",
      offColor = "rgba(0, 255, 102, 0.2)",
      background = "rgba(0,0,0,0.4)",
      alpha = 1,
      lineWidth = 4
    } = this.cfg;

    const now = new Date();
    const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const digits = time.split("").map(n => Number(n));

    const digitWidth = size * 2.2 + lineWidth;
    const digitHeight = size * 4 + lineWidth * 2;
    const totalWidth = digits.length * (digitWidth + gap) + gap;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = background;
    ctx.fillRect(x, y, totalWidth, digitHeight + gap);

    digits.forEach((digit, index) => {
      const dx = x + gap + index * (digitWidth + gap);
      const dy = y + gap / 2;
      drawDigit(ctx, digit, dx, dy, size, color, offColor, lineWidth);
    });

    ctx.restore();
  }
}
