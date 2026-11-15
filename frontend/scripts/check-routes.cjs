const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const expected=JSON.parse(fs.readFileSync(path.join(root,'architecture/route-contract.json'),'utf8'));
let failed=false;
for(const file of expected){if(!fs.existsSync(path.join(root,file))){console.error('Missing public route:',file);failed=true;}}
const manifest=JSON.parse(fs.readFileSync(path.join(root,'.next/prerender-manifest.json'),'utf8'));
if(manifest.routes['/api/voice/token']){console.error('Voice credentials endpoint must not be statically rendered.');failed=true;}
if(failed)process.exitCode=1;else console.log(`${expected.length} public route contracts retained; voice endpoint is dynamic.`);
