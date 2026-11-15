const identity = require('../deployment.json');
function backend() { const name = process.env.LMS_BACKEND || identity.backend; if (!['frappe', 'neon'].includes(name)) throw new Error('LMS_BACKEND must be frappe or neon.'); return name; }
module.exports = { backend };
