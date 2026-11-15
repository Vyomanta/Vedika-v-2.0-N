
import { FRAPPE_URL, frappeGet, frappeRestGet } from '@/integrations/frappe/transport';

export async function getLMSStudents() {
  if (FRAPPE_URL) {
    try {
      const users = await frappeGet("lms.lms.api.get_lms_students_optimized");
      if (users && Array.isArray(users) && !users.error) {
        return users;
      }
    } catch (e) {
      console.warn("Failed to fetch optimized students, falling back to legacy User REST API.", e);
    }

    try {
      const users = await frappeRestGet("User", {
        fields: JSON.stringify(["name", "email", "full_name", "enabled"]),
        filters: JSON.stringify([
          ["name", "!=", "Administrator"],
          ["name", "!=", "Guest"],
          ["enabled", "=", 1]
        ]),
        limit_page_length: 500
      });
      return users.map(u => ({
        username: u.email || u.name,
        name: u.full_name || u.name
      }));
    } catch (e) {
      console.error("Failed to fetch students from Frappe REST API, falling back.", e);
    }
  }
  return [];
}
