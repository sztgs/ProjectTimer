const DEFAULT_STATE = {
  status: "waiting",
  title: "Wait for connection",
  artist: "",
  album: "",
  cover: "",
  duration: 0,
  progress: 0,
  trackState: -1,
  adPlaying: false
};

function pickCover(video) {
  const thumbnails = video?.thumbnails || [];
  if (!Array.isArray(thumbnails) || thumbnails.length === 0) return "";
  const sorted = [...thumbnails].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url || "";
}

function buildState(payload) {
  if (!payload?.video) {
    return {
      ...DEFAULT_STATE,
      status: payload ? "no-track" : "waiting"
    };
  }

  const { video, player } = payload;
  return {
    status: "ready",
    title: video.title || "Unknown title",
    artist: video.author || "Unknown artist",
    album: video.album || "",
    cover: pickCover(video),
    duration: video.durationSeconds || 0,
    progress: player?.videoProgress || 0,
    trackState: player?.trackState ?? -1,
    adPlaying: Boolean(player?.adPlaying)
  };
}

class MediaSession {
  constructor(cfg) {
    this.baseUrl = cfg.baseUrl || "http://localhost:9863/api/v1";
    this.appId = cfg.appId || "projecttimer";
    this.appName = cfg.appName || "Project Timer";
    this.appVersion = cfg.appVersion || "1.0.0";
    this.pollInterval = cfg.pollInterval ?? 3000;
    this.authRetry = cfg.authRetry ?? 5000;
    this.tokenKey = `ytmdesktop_token_${this.appId}`;
    this.token = localStorage.getItem(this.tokenKey) || "";
    this.state = { ...DEFAULT_STATE };
    this.lastFetch = 0;
    this.lastAuthAttempt = 0;
    this.isFetching = false;
    this.isAuthenticating = false;
  }

  updateConfig(cfg) {
    if (cfg.baseUrl) this.baseUrl = cfg.baseUrl;
    if (cfg.appId) this.appId = cfg.appId;
    if (cfg.appName) this.appName = cfg.appName;
    if (cfg.appVersion) this.appVersion = cfg.appVersion;
    if (cfg.pollInterval !== undefined) this.pollInterval = cfg.pollInterval;
    if (cfg.authRetry !== undefined) this.authRetry = cfg.authRetry;
  }

  async ensureToken() {
    if (this.token) return true;
    if (this.isAuthenticating) return false;
    const now = Date.now();
    if (now - this.lastAuthAttempt < this.authRetry) return false;

    this.isAuthenticating = true;
    this.lastAuthAttempt = now;

    try {
      const codeResponse = await fetch(`${this.baseUrl}/auth/requestcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          appId: this.appId,
          appName: this.appName,
          appVersion: this.appVersion
        })
      });

      if (!codeResponse.ok) {
        throw new Error(`Code request failed (${codeResponse.status})`);
      }

      const { code } = await codeResponse.json();
      if (!code) throw new Error("Missing auth code");

      const tokenResponse = await fetch(`${this.baseUrl}/auth/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          appId: this.appId,
          code
        })
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token request failed (${tokenResponse.status})`);
      }

      const { token } = await tokenResponse.json();
      if (!token) throw new Error("Missing token");
      this.token = token;
      localStorage.setItem(this.tokenKey, token);
      return true;
    } catch (error) {
      this.token = "";
      localStorage.removeItem(this.tokenKey);
      return false;
    } finally {
      this.isAuthenticating = false;
    }
  }

  async fetchState() {
    if (this.isFetching) return;
    this.isFetching = true;

    try {
      const authed = await this.ensureToken();
      if (!authed) {
        this.state = { ...DEFAULT_STATE };
        return;
      }

      const response = await fetch(`${this.baseUrl}/state`, {
        headers: {
          Authorization: this.token
        }
      });

      if (response.status === 401) {
        this.token = "";
        localStorage.removeItem(this.tokenKey);
        this.state = { ...DEFAULT_STATE };
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.state = buildState(data);
    } catch (error) {
      this.state = { ...DEFAULT_STATE };
    } finally {
      this.lastFetch = Date.now();
      this.isFetching = false;
    }
  }

  update(cfg) {
    this.updateConfig(cfg);
    const now = Date.now();
    if (now - this.lastFetch < this.pollInterval) return;
    this.fetchState();
  }

  getState() {
    return this.state;
  }

  async sendCommand(command, data) {
    const authed = await this.ensureToken();
    if (!authed) return false;

    const response = await fetch(`${this.baseUrl}/command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token
      },
      body: JSON.stringify({
        command,
        data
      })
    });

    return response.ok;
  }
}

const sessionCache = new Map();

export function getMediaSession(cfg) {
  const baseUrl = cfg.baseUrl || "http://localhost:9863/api/v1";
  const appId = cfg.appId || "projecttimer";
  const key = `${baseUrl}-${appId}`;
  if (!sessionCache.has(key)) {
    sessionCache.set(key, new MediaSession(cfg));
  }
  return sessionCache.get(key);
}

export function getMediaState(cfg) {
  const session = getMediaSession(cfg);
  session.update(cfg);
  return session.getState();
}
