from http.server import SimpleHTTPRequestHandler, HTTPServer
import datetime
import json
import os
import subprocess
import threading
from urllib.parse import urlparse

REPO_PATH = os.path.dirname(os.path.abspath(__file__))
RUNTIME_PATH = os.path.join(REPO_PATH, "runtime")
CONFIG_PATH = os.path.join(RUNTIME_PATH, "config.json")
REMOTE_URL = "https://github.com/sztgs/ProjectTimer.git"
REMOTE_BRANCH = "codex/create-kalendar-tracking-plugin"
REMOTE_DEFAULT_BRANCH = "main"

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        t = datetime.datetime.now().strftime("%H:%M:%S")
        print(f"[{t}] {format%args}")

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/themes":
            self._send_json({"themes": list_themes(), "active": read_config().get("theme")})
            return
        if parsed.path == "/api/theme":
            self._send_json(read_config())
            return
        if parsed.path == "/api/update-check":
            self._send_json(check_for_updates())
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/theme":
            length = int(self.headers.get("Content-Length", "0"))
            data = self.rfile.read(length).decode("utf-8") if length else "{}"
            payload = json.loads(data or "{}")
            theme = payload.get("theme")
            if theme and theme in list_themes():
                config = read_config()
                config["theme"] = theme
                write_config(config)
                self._send_json({"ok": True, "theme": theme})
                return
            self._send_json({"ok": False, "error": "Theme not found"}, status=400)
            return
        super().do_POST()

    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def update_repo():
    try:
        remotes = subprocess.check_output(
            ["git", "remote"],
            cwd=REPO_PATH,
            text=True
        ).split()
        if "origin" not in remotes:
            subprocess.run(
                ["git", "remote", "add", "origin", REMOTE_URL],
                cwd=REPO_PATH,
                check=True
            )
        subprocess.run(
            ["git", "fetch", "origin", REMOTE_BRANCH, "--prune"],
            cwd=REPO_PATH,
            check=True
        )
        subprocess.run(
            ["git", "checkout", REMOTE_BRANCH],
            cwd=REPO_PATH,
            check=True
        )
        subprocess.run(
            ["git", "reset", "--hard", f"origin/{REMOTE_BRANCH}"],
            cwd=REPO_PATH,
            check=True
        )
        print("Repository updated from remote.")
    except subprocess.CalledProcessError as exc:
        print("Repository update failed:", exc)

def read_config():
    if not os.path.exists(CONFIG_PATH):
        return {"theme": "bios"}
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def write_config(config):
    os.makedirs(RUNTIME_PATH, exist_ok=True)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2)

def list_themes():
    if not os.path.isdir(RUNTIME_PATH):
        return []
    themes_path = os.path.join(RUNTIME_PATH, "themes")
    if not os.path.isdir(themes_path):
        return []
    return [d for d in os.listdir(themes_path) if os.path.isdir(os.path.join(themes_path, d))]

def get_local_commit():
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"],
            cwd=REPO_PATH,
            text=True
        ).strip()
    except subprocess.CalledProcessError:
        return None

def get_remote_commit():
    try:
        output = subprocess.check_output(
            ["git", "ls-remote", REMOTE_URL, f"refs/heads/{REMOTE_DEFAULT_BRANCH}"],
            cwd=REPO_PATH,
            text=True
        ).strip()
        return output.split()[0] if output else None
    except subprocess.CalledProcessError:
        return None

def check_for_updates():
    local_commit = get_local_commit()
    remote_commit = get_remote_commit()
    update_available = bool(local_commit and remote_commit and local_commit != remote_commit)
    return {
        "updateAvailable": update_available,
        "local": local_commit,
        "remote": remote_commit
    }

def console_loop():
    while True:
        try:
            command = input("theme> ").strip()
        except EOFError:
            break
        if command in {"exit", "quit"}:
            print("Console closed.")
            break
        if command == "list":
            print("Themes:", ", ".join(list_themes()))
            continue
        if command.startswith("set "):
            theme = command.split(" ", 1)[1].strip()
            if not theme:
                print("Usage: set <theme>")
                continue
            if theme not in list_themes():
                print(f"Theme '{theme}' not found.")
                continue
            config = read_config()
            config["theme"] = theme
            write_config(config)
            print(f"Theme set to {theme}. Reload the page to apply.")
            continue
        print("Commands: list, set <theme>, exit")

update_repo()
print("http://localhost:8000/runtime/index.html")
print("Theme console: list, set <theme>, exit")
threading.Thread(target=console_loop, daemon=True).start()
HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
