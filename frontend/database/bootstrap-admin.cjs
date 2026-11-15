const path=require('node:path');
require('dotenv').config({path:path.join(__dirname,'../.env.local')});
require('dotenv').config({path:path.join(__dirname,'../.env')});
const db=require('../shared/database/index.cjs');
const bcrypt=require('bcryptjs');
(async()=>{
 if(db.backend()!=='neon')throw new Error('Bootstrap is only for the native deployment. Manage Frappe accounts through Frappe.');
 const email=process.env.SUPER_ADMIN_EMAIL,password=process.env.SUPER_ADMIN_PASSWORD;
 const role=process.env.BOOTSTRAP_ADMIN_ROLE||'admin';
 if(!['admin','super_admin'].includes(role))throw new Error('BOOTSTRAP_ADMIN_ROLE must be admin or super_admin.');
 const tenant=role==='super_admin'?'global':(process.env.DEFAULT_TENANT_ID||'default');
 if(!email||!password||password.length<12)throw new Error('Set SUPER_ADMIN_EMAIL and a SUPER_ADMIN_PASSWORD of at least 12 characters locally.');
 await db.query("INSERT INTO users (email,password_hash,full_name,role,tenant_id) VALUES (?,?,?,?,?) ON CONFLICT (email) DO NOTHING",[email.toLowerCase(),await bcrypt.hash(password,12),'Administrator',role,tenant]);
 const rows=await db.query('SELECT role FROM users WHERE LOWER(email)=?',[email.toLowerCase()]);
 if(rows[0]?.role!==role)throw new Error('An existing account uses this email. Its credentials and role were preserved; review it manually.');
 console.log('Native administrator account is available. No existing credentials were overwritten.');
})().catch(e=>{console.error(e.message);process.exitCode=1;}).finally(db.close);
