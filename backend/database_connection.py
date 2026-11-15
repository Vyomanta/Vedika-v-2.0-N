"""Provider adapter for the existing ingestion worker. Secrets come from environment only."""
import json
import os
import re
from pathlib import Path


def selected_backend():
    configured = os.environ.get("LMS_BACKEND")
    if configured:
        if configured not in ("frappe", "neon"):
            raise ValueError("LMS_BACKEND must be frappe or neon")
        return configured
    identity = Path(__file__).parent.parent / "frontend/deployment.json"
    return json.loads(identity.read_text())["backend"] if identity.exists() else "frappe"


def postgres_sql(sql):
    return re.sub(r"INTERVAL (\d+) MINUTE", r"INTERVAL '\1 minutes'", re.sub(r"`([^`]+)`", r'"\1"', sql))


class PostgresCursor:
    def __init__(self, cursor):
        self.cursor = cursor

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.cursor.close()

    def execute(self, sql, params=None):
        return self.cursor.execute(postgres_sql(sql), params)

    def executemany(self, sql, params):
        return self.cursor.executemany(postgres_sql(sql), params)

    def fetchone(self):
        return self.cursor.fetchone()

    def fetchall(self):
        return self.cursor.fetchall()


class PostgresConnection:
    def __init__(self):
        import psycopg
        from psycopg.rows import dict_row
        import certifi
        from urllib.parse import urlparse
        local = urlparse(os.environ["DATABASE_URL"]).hostname in ("localhost", "127.0.0.1", "::1")
        self.connection = psycopg.connect(os.environ["DATABASE_URL"], row_factory=dict_row, autocommit=True, sslmode="disable" if local else "verify-full", sslrootcert=certifi.where())

    def cursor(self, *_):
        return PostgresCursor(self.connection.cursor())

    def begin(self):
        self.connection.execute("BEGIN")

    def commit(self):
        self.connection.execute("COMMIT")

    def rollback(self):
        self.connection.execute("ROLLBACK")

    def close(self):
        self.connection.close()

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.close()


def connect():
    if selected_backend() == "neon":
        return PostgresConnection()
    import pymysql
    return pymysql.connect(
        host=os.environ["DB_HOST"], port=int(os.environ.get("DB_PORT", "4000")),
        user=os.environ["DB_USER"], password=os.environ.get("DB_PASSWORD"), database=os.environ["DB_NAME"],
        ssl=None if os.environ.get("DB_SSL") == "false" else {"check_hostname": True, "verify_mode": 2}, autocommit=True,
    )
