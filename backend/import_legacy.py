"""One-way additive import into a complete Frappe site. Existing users remain unchanged."""
import os
import frappe
import pymysql
from pymysql.cursors import DictCursor

source = pymysql.connect(host=os.environ["DB_HOST"], port=int(os.environ.get("DB_PORT", "4000")),
                         user=os.environ["DB_USER"], password=os.environ["DB_PASSWORD"], database=os.environ["DB_NAME"],
                         ssl={"ca": "/etc/ssl/certs/ca-certificates.crt"}, cursorclass=DictCursor)
try:
    with source.cursor() as cursor:
        cursor.execute("SELECT * FROM `tabUser`")
        users = cursor.fetchall()
        cursor.execute("SELECT parent,role FROM `tabHas Role`")
        roles = cursor.fetchall()
        cursor.execute("SELECT * FROM `__Auth` WHERE doctype='User' AND fieldname='password' AND encrypted=0")
        passwords = {row["name"]: row for row in cursor.fetchall()}
        cursor.execute("SELECT * FROM `tabLMS Course`")
        courses = cursor.fetchall()
    for row in users:
        email = row.get("email") or row["name"]
        if email in ("Administrator", "Guest") or frappe.db.exists("User", email):
            continue
        user_roles = [{"role": r["role"]} for r in roles if r["parent"] == row["name"] and frappe.db.exists("Role", r["role"])]
        doc = frappe.get_doc({"doctype": "User", "email": email, "first_name": row.get("first_name") or "Learner",
                              "last_name": row.get("last_name") or "", "enabled": int(row.get("enabled", 1)),
                              "user_type": row.get("user_type") or "Website User", "send_welcome_email": 0, "roles": user_roles})
        doc.flags.no_welcome_mail = True
        doc.insert(ignore_permissions=True)
        password = passwords.get(row["name"])
        if password:
            frappe.db.sql("INSERT INTO `__Auth` (doctype,name,fieldname,password,encrypted) VALUES ('User',%s,'password',%s,0) ON DUPLICATE KEY UPDATE password=VALUES(password),encrypted=0", (doc.name,password["password"]))
    for row in courses:
        if frappe.db.exists("LMS Course", row["name"]):
            continue
        doc = frappe.get_doc({"doctype": "LMS Course", "title": row.get("title") or row["name"],
                              "short_introduction": row.get("short_introduction") or row.get("title") or row["name"],
                              "description": row.get("short_introduction") or row.get("title") or row["name"],
                              "published": int(row.get("published",0)), "image": row.get("image") or "",
                              "instructors": [{"instructor": "Administrator"}]})
        if frappe.get_meta("LMS Course").has_field("category"):
            doc.category = row.get("category") or "General"
            if not frappe.db.exists("LMS Category", doc.category):
                frappe.get_doc({"doctype":"LMS Category", "category":doc.category}).insert(ignore_permissions=True)
        doc.insert(ignore_permissions=True, set_name=row["name"])
    frappe.db.commit()
    print("Additive legacy account/course import completed; source records and existing destination accounts preserved.")
finally:
    source.close()
