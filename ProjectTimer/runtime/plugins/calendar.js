function getWeekdayLabels(locale, weekStart) {
  const labels = [];
  const base = new Date(Date.UTC(2020, 5, 1));
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

  for (let i = 0; i < 7; i += 1) {
    const dayIndex = (weekStart + i) % 7;
    const date = new Date(base);
    date.setUTCDate(base.getUTCDate() + dayIndex);
    labels.push(formatter.format(date));
  }

  return labels;
}

export default class Calendar {
  constructor(cfg) {
    this.cfg = cfg;
  }

  getMonthData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return {
      now,
      year,
      month,
      firstDay,
      daysInMonth
    };
  }

  draw(ctx) {
    const {
      x,
      y,
      width,
      height,
      locale = "en-US",
      color = "#ffffff",
      gridColor = "#4c4c4c",
      headerColor = "#00ffff",
      highlightColor = "#ffcc00",
      background = "rgba(0, 0, 0, 0.4)",
      fontSize = 20,
      headerSize = 28,
      weekStart = 1
    } = this.cfg;

    const monthData = this.getMonthData();
    const { now, year, month, firstDay, daysInMonth } = monthData;

    ctx.fillStyle = background;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = headerColor;
    ctx.font = `${headerSize}px monospace`;
    const monthLabel = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric"
    }).format(now);
    ctx.fillText(monthLabel, x + 16, y + headerSize + 6);

    const headerHeight = headerSize + 24;
    const weekLabelHeight = fontSize + 14;
    const gridTop = y + headerHeight + weekLabelHeight;
    const gridHeight = height - (gridTop - y) - 12;
    const cellWidth = width / 7;
    const cellHeight = gridHeight / 6;

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = color;

    const weekdays = getWeekdayLabels(locale, weekStart);
    weekdays.forEach((label, index) => {
      const labelX = x + index * cellWidth + 8;
      const labelY = y + headerHeight + fontSize;
      ctx.fillText(label, labelX, labelY);
    });

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let col = 0; col <= 7; col += 1) {
      const lineX = x + col * cellWidth;
      ctx.beginPath();
      ctx.moveTo(lineX, gridTop);
      ctx.lineTo(lineX, gridTop + gridHeight);
      ctx.stroke();
    }

    for (let row = 0; row <= 6; row += 1) {
      const lineY = gridTop + row * cellHeight;
      ctx.beginPath();
      ctx.moveTo(x, lineY);
      ctx.lineTo(x + width, lineY);
      ctx.stroke();
    }

    const normalizedWeekStart = ((weekStart % 7) + 7) % 7;
    const firstWeekday = (firstDay.getDay() - normalizedWeekStart + 7) % 7;

    for (let day = 1; day <= daysInMonth; day += 1) {
      const position = firstWeekday + (day - 1);
      const row = Math.floor(position / 7);
      const col = position % 7;
      const cellX = x + col * cellWidth;
      const cellY = gridTop + row * cellHeight;

      if (
        day === now.getDate() &&
        month === now.getMonth() &&
        year === now.getFullYear()
      ) {
        ctx.fillStyle = highlightColor;
        ctx.fillRect(cellX + 2, cellY + 2, cellWidth - 4, cellHeight - 4);
        ctx.fillStyle = "#000000";
      } else {
        ctx.fillStyle = color;
      }

      ctx.fillText(day.toString(), cellX + 8, cellY + fontSize + 8);
    }
  }
}
