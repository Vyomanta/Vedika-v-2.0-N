const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const root=path.resolve(__dirname,'..');
const limits=JSON.parse(fs.readFileSync(path.join(root,'architecture/performance-budgets.json'),'utf8'));
let failed=false;
for(const [route,maxKB]of Object.entries(limits)){
 const htmlFile=path.join(root,'.next/server/app',route==='/'?'index.html':route.slice(1)+'.html');
 if(!fs.existsSync(htmlFile)){console.error('Missing prerendered budget target:',route);failed=true;continue;}
 const html=fs.readFileSync(htmlFile,'utf8');
 const files=[...new Set([...html.matchAll(/<script[^>]+src="([^"?]+\.js)(?:\?[^\"]*)?"/g)].map(match=>match[1]))];
 let bytes=0;
 for(const file of files)if(file.startsWith('/_next/'))bytes+=zlib.gzipSync(fs.readFileSync(path.join(root,'.next',file.slice('/_next/'.length)))).length;
 console.log(`${route}: ${(bytes/1024).toFixed(1)} kB gzip; budget ${maxKB} kB`);
 if(bytes>maxKB*1024)failed=true;
}
if(failed)process.exitCode=1;
