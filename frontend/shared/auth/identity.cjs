const {createHash}=require('node:crypto');
const {backend}=require('../../lib/backend.cjs');
function scopedSession(tenant,user,session,variant=backend()){return createHash('sha256').update(JSON.stringify([variant,tenant,user,session])).digest('hex');}
function scopedUser(tenant,user,variant=backend()){return createHash('sha256').update(JSON.stringify([variant,tenant,user])).digest('hex');}
module.exports={scopedSession,scopedUser};
