export default class Shape {
  constructor(cfg) {
    this.cfg = cfg;
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 120,
      height = 120,
      shape = "rect",
      color = "#00ff66",
      fill = false,
      lineWidth = 2,
      rotation = 0,
      radius = 12
    } = this.cfg;

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radians = (rotation * Math.PI) / 180;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);

    if (shape === "circle") {
      const circleRadius = Math.min(width, height) / 2;
      ctx.beginPath();
      ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(width / 2, height / 2);
      ctx.lineTo(-width / 2, height / 2);
      ctx.closePath();
      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (shape === "roundedRect") {
      const w = width;
      const h = height;
      const r = Math.min(radius, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(-w / 2 + r, -h / 2);
      ctx.lineTo(w / 2 - r, -h / 2);
      ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      ctx.lineTo(w / 2, h / 2 - r);
      ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      ctx.lineTo(-w / 2 + r, h / 2);
      ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      ctx.lineTo(-w / 2, -h / 2 + r);
      ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      ctx.closePath();
      if (fill) {
        ctx.fill();
      } else {
        ctx.stroke();
      }
      ctx.restore();
      return;
    }

    if (fill) {
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
      return;
    }

    ctx.strokeRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  }
}
