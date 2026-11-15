"""Serialize initialization/migrations across overlapping Render instances."""
import _thread
import hashlib
import json
import os
import secrets
import subprocess
import threading
import time
import requests
from prepare_site import database_names, prepare

class BootstrapLease:
    def __init__(self):
        _, core = database_names(os.environ)
        scope = hashlib.sha256((os.environ["DB_HOST"] + ":" + core).encode()).hexdigest()
        self.key = "vedika:frappe-bootstrap:" + scope
        self.owner = secrets.token_hex(24)
        self.url = os.environ["UPSTASH_REDIS_REST_URL"].rstrip("/")
        self.headers = {"Authorization": "Bearer " + os.environ["UPSTASH_REDIS_REST_TOKEN"]}
        self.stop = threading.Event()
        self.lost = threading.Event()
        self.thread = None

    def command(self, command):
        response = requests.post(self.url, headers=self.headers, json=command, timeout=10)
        response.raise_for_status()
        payload = response.json()
        if payload.get("error"):
            raise RuntimeError("Bootstrap lease store rejected a command.")
        return payload.get("result")

    def __enter__(self):
        deadline = time.monotonic() + 840
        while self.command(["SET", self.key, self.owner, "NX", "EX", 180]) != "OK":
            if time.monotonic() >= deadline:
                raise RuntimeError("Another instance is still initializing; retry after it finishes.")
            print("Waiting for the active Frappe installer/migration lease.", flush=True)
            time.sleep(5)
        self.thread = threading.Thread(target=self.renew, daemon=True)
        self.thread.start()
        print("Acquired shared Frappe initialization lease.", flush=True)
        return self

    def renew(self):
        script = "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('EXPIRE',KEYS[1],180) else return 0 end"
        while not self.stop.wait(25):
            try:
                if self.command(["EVAL", script, 1, self.key, self.owner]) != 1:
                    raise RuntimeError("Initialization lease lost.")
            except Exception:
                self.lost.set()
                _thread.interrupt_main()
                return

    def check(self):
        if self.lost.is_set():
            raise RuntimeError("Initialization lease unavailable; no further migrations will run.")

    def __exit__(self, *args):
        self.stop.set()
        if self.thread:
            self.thread.join(timeout=12)
        script = "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) else return 0 end"
        try:
            self.command(["EVAL", script, 1, self.key, self.owner])
        except Exception:
            pass  # Expiring lease is retained if the store is temporarily unreachable.

if __name__ == "__main__":
    with BootstrapLease() as lease:
        prepare()
        commands = [
            ["bench", "use", "lms.render"],
            ["bench", "--site", "lms.render", "migrate"],
            ["bench", "--site", "lms.render", "execute", "exec(open('/home/frappe/import_legacy.py').read())"],
            ["bench", "--site", "lms.render", "execute", "exec(open('/home/frappe/grant_question_perm.py').read())"],
        ]
        for command in commands:
            lease.check()
            subprocess.run(command, check=True)
        print("Frappe core, migrations, and permissions are ready.", flush=True)
