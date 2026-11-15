import importlib.util
import json
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch, MagicMock

sys.modules.setdefault("pymysql", types.ModuleType("pymysql"))
spec = importlib.util.spec_from_file_location("prepare_site", Path(__file__).parents[1] / "prepare_site.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class StartupSafetyTests(unittest.TestCase):
    def test_legacy_user_table_is_not_a_complete_site(self):
        self.assertEqual(module.classify({"tabUser", "tabLMS Course"}), "incomplete")
        self.assertEqual(module.classify(set()), "empty")
        self.assertEqual(module.classify(module.CORE_TABLES), "ready")

    def test_legacy_database_cannot_be_used_as_bootstrap_target(self):
        with self.assertRaises(RuntimeError):
            module.database_names({"DB_NAME":"test", "FRAPPE_DB_NAME":"test"})
        with self.assertRaises(RuntimeError):
            module.database_names({"DB_NAME":"test", "FRAPPE_DB_NAME":"bad`name"})
        self.assertEqual(module.database_names({"DB_NAME":"test"}), ("test","test_frappe_core"))

    def test_config_escapes_credentials_and_limits_origins(self):
        env={"DB_HOST":"db.invalid", "DB_NAME":"test", "DB_USER":"fixture", "DB_PASSWORD":'quotes"and\\slashes',
             "ENCRYPTION_KEY":"fixture-only", "FRONTEND_URL":"https://example.invalid, https://second.invalid"}
        old=os.getcwd()
        with tempfile.TemporaryDirectory() as folder, patch.dict(os.environ,env):
            try:
                os.chdir(folder)
                module.write_config("test_frappe_core")
                config=json.loads(Path("sites/lms.render/site_config.json").read_text())
                self.assertEqual(config["db_password"],env["DB_PASSWORD"])
                self.assertEqual(config["db_name"],"test_frappe_core")
                self.assertEqual(len(config["allow_cors"]),2)
            finally:
                os.chdir(old)

    def test_empty_bootstrap_uses_real_sites_directory_and_separate_database(self):
        env={"DB_HOST":"db.invalid", "DB_NAME":"legacy", "DB_USER":"fixture", "DB_PASSWORD":"fixture",
             "ENCRYPTION_KEY":"fixture-only", "SUPER_ADMIN_PASSWORD":"fixture-password-for-tests-only"}
        connection=MagicMock()
        connection.cursor.return_value.__enter__.return_value.fetchall.return_value=[]
        fake_frappe=types.ModuleType("frappe")
        fake_frappe.destroy=MagicMock()
        initialized={}
        def init(site, **kwargs):
            initialized.update(kwargs)
            self.assertTrue((Path(kwargs["sites_path"])/"apps.txt").exists())
            self.assertTrue(kwargs["new_site"])
        fake_frappe.init=init
        installer=types.ModuleType("frappe.installer")
        def new_site(**kwargs):
            self.assertIn("sites_path",initialized)
            self.assertEqual(Path.cwd(), Path(initialized["sites_path"]))
            # Exercise the same relative log destinations as Frappe, rather
            # than mocking away the filesystem behavior that failed on Render.
            for filename in ("../logs/database.log", "lms.render/logs/database.log"):
                handler=RotatingFileHandler(filename)
                handler.close()
            self.assertEqual(kwargs["db_name"],"legacy_frappe_core")
            self.assertFalse(kwargs["setup_db"])
        installer._new_site=MagicMock(side_effect=new_site)
        old=os.getcwd()
        with tempfile.TemporaryDirectory() as folder, patch.dict(os.environ,env), patch.dict(sys.modules,{"frappe":fake_frappe,"frappe.installer":installer}), patch.object(module.pymysql,"connect",return_value=connection,create=True):
            try:
                os.chdir(folder)
                Path("sites").mkdir()
                Path("sites/apps.txt").write_text("frappe\n")
                module.prepare()
                installer._new_site.assert_called_once()
            finally:
                os.chdir(old)

    def test_placeholder_never_claims_readiness(self):
        source=(Path(__file__).parents[1]/"dummy_server.py").read_text()
        self.assertNotIn("self.send_response(200)",source)
        self.assertIn("self.send_response(503)",source)

if __name__ == "__main__":
    unittest.main()
