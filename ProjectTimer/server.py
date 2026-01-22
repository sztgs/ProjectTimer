from http.server import SimpleHTTPRequestHandler, HTTPServer
import datetime

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        t = datetime.datetime.now().strftime("%H:%M:%S")
        print(f"[{t}] {format%args}")

print("http://localhost:8000/runtime/index.html")
HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
