const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const files=new Set(cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean));
const problems=[];
for(const file of files){
 const leaf=path.basename(file);
 if((/^\.env($|\.)/.test(leaf)&&!leaf.endsWith('.example')&&leaf!=='.env.example')||/\.(pem|key)$/.test(leaf)){problems.push(file+': secret file is tracked or trackable');continue;}
 if(!/\.(js|jsx|cjs|mjs|py|json|ya?ml|md|html|txt)$/.test(file)||file.endsWith('package-lock.json'))continue;
 const target=path.join(root,file);if(!fs.existsSync(target))continue;
 const source=fs.readFileSync(target,'utf8');
 if(/AIza[0-9A-Za-z_-]{30,}|GOCSPX-[0-9A-Za-z_-]{15,}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|ACTIVE_SECRET_CODES\s*=/.test(source))problems.push(file+': possible embedded credential');
 if(/(?:https:\/\/github\.com\/)?LMSWEBAPP\/Vedika-v2\.0/.test(source))problems.push(file+': obsolete repository association');
}
for(const env of ['.env','.env.local','.env.production','.env.production.local']){
 const file=path.join(root,'frontend',env);if(fs.existsSync(file)){
  try{cp.execFileSync('git',['check-ignore','--quiet',file],{cwd:root});}catch{problems.push('frontend/'+env+': environment file is not ignored');}
 }
}
if(problems.length){console.error(problems.join('\n'));process.exitCode=1;}else console.log('Secret-file, credential-pattern and obsolete-repository checks passed.');
