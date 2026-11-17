"""Safely initialize an isolated Frappe core schema, never the legacy app DB."""
import json
import os
import re
from pathlib import Path
import pymysql

BOOTSTRAP_TABLES = {"tabDocType", "tabDocField", "tabDocPerm", "tabDefaultValue", "tabSingles", "__Auth"}
CORE_TABLES = {"tabUser", "tabDefaultValue", "tabDocType", "tabDocField", "tabDocPerm", "tabSingles", "tabModule Def"}

def database_names(env):
    legacy = env["DB_NAME"]
    core = env.get("FRAPPE_DB_NAME") or legacy + "_frappe_core"
    if not re.fullmatch(r"[A-Za-z0-9_]{1,64}", core) or core == legacy:
        raise RuntimeError("Frappe core must use a separate valid database name; legacy data will not be reset.")
    return legacy, core

def classify(tables):
    if not tables:
        return "empty"
    return "ready" if CORE_TABLES.issubset(tables) else "bootstrap" if BOOTSTRAP_TABLES.issubset(tables) else "incomplete"

def write_config(core):
    sites = Path("sites")
    Path("logs").mkdir(parents=True, exist_ok=True)
    (sites / "lms.render" / "logs").mkdir(parents=True, exist_ok=True)
    origins = [v.strip() for v in os.environ.get("FRONTEND_URL", "").split(",") if v.strip()]
    config = {"db_host": os.environ["DB_HOST"], "db_port": int(os.environ.get("DB_PORT", "4000")),
              "db_name": core, "db_user": os.environ["DB_USER"], "db_password": os.environ["DB_PASSWORD"],
              "db_type": "mariadb", "db_ssl_ca": "/etc/ssl/certs/ca-certificates.crt",
              "encryption_key": os.environ["ENCRYPTION_KEY"], "allow_cors": origins,
              "session_cookie_samesite": "Lax"}
    (sites / "lms.render" / "site_config.json").write_text(json.dumps(config))
    common_path = sites / "common_site_config.json"
    common = json.loads(common_path.read_text()) if common_path.exists() else {}
    common.update({"redis_cache": "redis://127.0.0.1:6379", "redis_queue": "redis://127.0.0.1:6379",
                   "redis_socketio": "redis://127.0.0.1:6379", "serve_default_site": True,
                   "default_site": "lms.render", "db_ssl_ca": config["db_ssl_ca"]})
    common_path.write_text(json.dumps(common))
    return config

def prepare():
    _, core = database_names(os.environ)
    config = write_config(core)
    connection = pymysql.connect(host=config["db_host"], port=config["db_port"], user=config["db_user"],
                                 password=config["db_password"], ssl={"ca": config["db_ssl_ca"]}, connect_timeout=10)
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{core}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            cursor.execute("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=%s", (core,))
            state = classify({row[0] for row in cursor.fetchall()})
        if state == "incomplete":
            raise RuntimeError("Isolated core schema is incomplete. Restore/recover it explicitly; automatic table deletion is forbidden.")
    finally:
        connection.close()
    if state == "empty":
        print("Initializing Frappe in the empty isolated core database; legacy tables are preserved.", flush=True)
        import frappe
        from frappe.installer import _new_site
        password = os.environ.get("ADMIN_PASSWORD") or os.environ.get("SUPER_ADMIN_PASSWORD")
        if not password or len(password) < 12:
            raise RuntimeError("Set an administrator password of at least 12 characters before initialization.")
        # Match Bench's new-site command: avoid loading installed-app metadata
        # from a database whose bootstrap tables do not exist yet.
        bench_root = Path.cwd()
        sites_path = (bench_root / "sites").resolve()
        # Bench executes framework commands from sites/. Frappe's logger and
        # several installer operations use paths relative to this directory.
        os.chdir(sites_path)
        try:
            frappe.init("lms.render", sites_path=str(sites_path), new_site=True)
            _new_site(db_name=core, site="lms.render", db_user=config["db_user"], db_password=config["db_password"],
                      db_host=config["db_host"], db_port=config["db_port"], db_type="mariadb", admin_password=password,
                      install_apps=["payments", "lms"], setup_db=False, force=True)
        finally:
            frappe.destroy()
            os.chdir(bench_root)
        write_config(core)
    else:
        # Standard app installation is idempotent and imports missing DocTypes.
        # Resume after a replaced container without re-running bootstrap SQL.
        import frappe
        from frappe.installer import install_app
        bench_root = Path.cwd()
        sites_path = (bench_root / "sites").resolve()
        os.chdir(sites_path)
        try:
            frappe.init("lms.render", sites_path=str(sites_path), new_site=True)
            frappe.connect()
            installed = set(frappe.get_installed_apps())
            if "frappe" not in installed and hasattr(frappe.db, "exists") and (frappe.db.exists("DocType", "User") or frappe.db.exists("Module Def", "Core")):
                installed.add("frappe")
                try:
                    frappe.db.set_global("installed_apps", json.dumps(list(installed)))
                    frappe.db.commit()
                except Exception:
                    pass
            if "frappe" not in installed:
                password = os.environ.get("ADMIN_PASSWORD") or os.environ.get("SUPER_ADMIN_PASSWORD")
                if not password or len(password) < 12:
                    raise RuntimeError("An explicit administrator password is required to resume core installation.")
                frappe.conf.admin_password = password
            for app in ("frappe", "payments", "lms"):
                if app not in installed:
                    print(f"Resuming standard installation for {app}; existing tables are preserved.", flush=True)
                    install_app(app, set_as_patched=True, force=False)
                    frappe.db.commit()
            print("Frappe application installation verified.", flush=True)
        finally:
            frappe.destroy()
            os.chdir(bench_root)
        write_config(core)

if __name__ == "__main__":
    prepare()
