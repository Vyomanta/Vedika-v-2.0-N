import frappe

def grant_permissions(doctype, role, perm_dict):
    has_perm = frappe.db.exists("Custom DocPerm", {"parent": doctype, "role": role})
    if has_perm:
        print(f"Custom DocPerm already exists for {role} on {doctype}. Updating...")
        doc = frappe.get_doc("Custom DocPerm", has_perm)
        for key, val in perm_dict.items():
            setattr(doc, key, val)
        doc.save(ignore_permissions=True)
    else:
        print(f"Creating Custom DocPerm for {role} on {doctype}...")
        doc_data = {
            "doctype": "Custom DocPerm",
            "parent": doctype,
            "parenttype": "DocType",
            "parentfield": "permissions",
            "role": role,
            "permlevel": 0
        }
        doc_data.update(perm_dict)
        doc = frappe.get_doc(doc_data)
        doc.insert(ignore_permissions=True)
    
    frappe.db.commit()
    frappe.clear_cache(doctype=doctype)

# Shared Vedika assessment routes own student access and grading. Direct Frappe
# question/submission endpoints must not bypass those policies.
from frappe.permissions import setup_custom_perms
for doctype in ("LMS Quiz", "LMS Question", "LMS Quiz Submission", "LMS Assignment", "LMS Assignment Submission"):
    if not frappe.db.exists("DocType", doctype):
        continue
    setup_custom_perms(doctype)
    for role in ("Guest", "All", "Student", "LMS Student"):
        if not frappe.db.exists("Role", role):
            continue
        for name in frappe.get_all("Custom DocPerm", filters={"parent": doctype, "role": role}, pluck="name"):
            doc = frappe.get_doc("Custom DocPerm", name)
            for field in ("read", "write", "create", "delete", "submit", "cancel", "amend", "report", "export", "import", "share", "print", "email"):
                setattr(doc, field, 0)
            doc.save(ignore_permissions=True)
    frappe.clear_cache(doctype=doctype)
frappe.db.commit()
print("Direct student assessment permissions revoked; use Vedika assessment APIs.")
