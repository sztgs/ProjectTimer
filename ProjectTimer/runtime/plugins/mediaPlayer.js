const DEFAULT_STATE = {
  status: "waiting",
  title: "Wait for connection",
  artist: "",
  album: "",
  cover: ""
};

function pickCover(track) {
  if (!track) return "";
  return (
    track.cover ||
    track.coverUrl ||
    track.thumbnail ||
    track.image ||
    track.artwork ||
    track.albumArt ||
    ""
  );
}

function normalizeState(data) {
  const track =
    data?.track ||
    data?.song ||
    data?.currentTrack ||
    data?.playing ||
    data?.player?.track ||
    data?.data?.track ||
    null;

  if (!track) {
    return {
      ...DEFAULT_STATE,
      status: data ? "no-track" : "waiting"
    };
  }

  return {
    status: data?.status || data?.state || "playing",
    title: track.title || track.name || "Unknown title",
    artist: track.artist || track.author || track.artistName || "Unknown artist",
    album: track.album || track.albumName || "",
    cover: pickCover(track)
  };
}

export default class MediaPlayer {
  constructor(cfg) {
    this.cfg = cfg;
    this.state = DEFAULT_STATE;
    this.lastFetch = 0;
    this.isFetching = false;
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

  async fetchState() {
    if (this.isFetching) return;
    this.isFetching = true;

    const baseUrl = this.cfg.baseUrl || "http://localhost:9863/api/v1";
    const endpoint = this.cfg.endpoint || "/state";

    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      this.state = normalizeState(data);
      if (this.state.cover && this.coverImage.src !== this.state.cover) {
        this.coverLoaded = false;
        this.coverFailed = false;
        this.coverImage.src = this.state.cover;
      }
    } catch (error) {
      this.state = {
        ...DEFAULT_STATE,
        status: "waiting",
        title: "Wait for connection"
      };
      this.coverLoaded = false;
      this.coverFailed = false;
    } finally {
      this.isFetching = false;
      this.lastFetch = Date.now();
    }
  }

  update() {
    const interval = this.cfg.pollInterval ?? 3000;
    const now = Date.now();
    if (now - this.lastFetch < interval) return;
    this.fetchState();
  }

  draw(ctx) {
    const {
      x,
      y,
      width = 520,
      height = 140,
      background = "rgba(0, 0, 0, 0.5)",
      color = "#ffffff",
      accentColor = "#00ff66",
      fontSize = 20,
      titleSize = 24,
      padding = 14,
      coverSize = 96,
      gap = 16
    } = this.cfg;

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
    ctx.fillText(this.state.title || "Wait for connection", textX, textY);

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px monospace`;
    if (this.state.artist) {
      ctx.fillText(this.state.artist, textX, textY + fontSize + 8);
    }
    if (this.state.album) {
      ctx.fillText(this.state.album, textX, textY + (fontSize + 8) * 2);
    }
  }
}
