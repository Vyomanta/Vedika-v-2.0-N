"""Use portable generated-column metadata for the pinned Frappe SQL driver."""
from pathlib import Path
import sys

OLD = "(is_generated = 'ALWAYS') AS 'is_generated'"
NEW = "(COALESCE(generation_expression, '') <> '') AS 'is_generated'"

def patch_file(path):
    source = path.read_text()
    if NEW in source:
        return
    if source.count(OLD) != 1:
        raise RuntimeError("Pinned Frappe metadata query changed; review TiDB compatibility before deploying.")
    path.write_text(source.replace(OLD, NEW))

if __name__ == "__main__":
    patch_file(Path(sys.argv[1]))
