"""Expose the port during startup without advertising false readiness."""
import http.server
import os
from functools import partial

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        body = b'{"status":"initializing","ready":false}'
        self.send_response(503)
        self.send_header("Content-Type", "application/json")
        self.send_header("Retry-After", "10")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_HEAD(self):
        self.send_response(503)
        self.end_headers()

if __name__ == "__main__":
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    http.server.ThreadingHTTPServer(("0.0.0.0", int(os.environ.get("PORT", "8000"))), Handler).serve_forever()
