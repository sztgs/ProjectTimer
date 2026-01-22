from http.server import SimpleHTTPRequestHandler, HTTPServer
import datetime
import json
import os
import subprocess
import threading

REPO_PATH = os.path.dirname(os.path.abspath(__file__))
RUNTIME_PATH = os.path.join(REPO_PATH, "runtime")
CONFIG_PATH = os.path.join(RUNTIME_PATH, "config.json")
REMOTE_URL = "https://github.com/sztgs/ProjectTimer.git"
REMOTE_BRANCH = "codex/create-kalendar-tracking-plugin"

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        t = datetime.datetime.now().strftime("%H:%M:%S")
        print(f"[{t}] {format%args}")

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
