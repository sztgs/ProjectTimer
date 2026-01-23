import os
import subprocess
import sys
import time
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
SERVER = os.path.join(ROOT, "server.py")
URL = "http://localhost:8000/runtime/app.html"


def main():
    server = subprocess.Popen([sys.executable, SERVER], cwd=ROOT)
    time.sleep(1.5)
    webbrowser.open(URL)
    try:
        server.wait()
    except KeyboardInterrupt:
        server.terminate()


if __name__ == "__main__":
    main()
