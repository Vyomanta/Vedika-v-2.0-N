"""Bind this single-site Render service independently of its public hostname."""
import frappe.app

frappe.app._site = "lms.render"
frappe.app._sites_path = "/home/frappe/frappe-bench/sites"
application = frappe.app.application
