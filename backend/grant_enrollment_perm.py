import frappe
from frappe.permissions import setup_custom_perms
# Enrollment requires a signed-in account. Never grant public Guest writes.
doctype = "LMS Enrollment"
setup_custom_perms(doctype)
for name in frappe.get_all("Custom DocPerm", filters={"parent": doctype, "role": "Guest"}, pluck="name"):
    doc = frappe.get_doc("Custom DocPerm", name)
    for field in ("read", "write", "create", "delete", "submit", "export", "share"):
        setattr(doc, field, 0)
    doc.save(ignore_permissions=True)
frappe.db.commit()
frappe.clear_cache(doctype=doctype)
print("Public Guest enrollment permissions revoked.")
