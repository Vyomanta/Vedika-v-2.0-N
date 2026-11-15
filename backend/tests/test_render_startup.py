import importlib.util
import json
import os
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch

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

    def test_placeholder_never_claims_readiness(self):
        source=(Path(__file__).parents[1]/"dummy_server.py").read_text()
        self.assertNotIn("self.send_response(200)",source)
        self.assertIn("self.send_response(503)",source)

if __name__ == "__main__":
    unittest.main()
