const DIGITS = {
  "0": [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  "1": ["  █  ", " ██  ", "  █  ", "  █  ", " ███ "],
  "2": [" ███ ", "█   █", "  ██ ", " █   ", "█████"],
  "3": ["████ ", "    █", " ███ ", "    █", "████ "],
  "4": ["█  █ ", "█  █ ", "█████", "   █ ", "   █ "],
  "5": ["█████", "█    ", "████ ", "    █", "████ "],
  "6": [" ███ ", "█    ", "████ ", "█   █", " ███ "],
  "7": ["█████", "   █ ", "  █  ", " █   ", "█    "],
  "8": [" ███ ", "█   █", " ███ ", "█   █", " ███ "],
  "9": [" ███ ", "█   █", " ████", "    █", " ███ "],
  ":": ["     ", "  █  ", "     ", "  █  ", "     "]
};

function buildAsciiLines(text) {
  const lines = ["", "", "", "", ""];
  const chars = text.split("");

  chars.forEach(char => {
    const glyph = DIGITS[char] || ["     ", "     ", "     ", "     ", "     "];
    glyph.forEach((row, index) => {
      lines[index] += row + "  ";
    });
  });

  return lines;
}

export default class AsciiClock {
  constructor(cfg) {
    this.cfg = cfg;
  }

  getTimeString() {
    const {
      locale = "en-GB",
      hour12 = false,
      showSeconds = true
    } = this.cfg;

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12
    };

    if (showSeconds) {
      options.second = "2-digit";
    }

    return new Intl.DateTimeFormat(locale, options).format(new Date());
  }

  draw(ctx) {
    const {
      x,
      y,
      color = "#00ff66",
      fontSize = 20,
      lineHeight = fontSize + 6
    } = this.cfg;

    const timeString = this.getTimeString();
    const lines = buildAsciiLines(timeString);

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;

    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
  }
}
