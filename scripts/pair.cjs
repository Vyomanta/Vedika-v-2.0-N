#!/usr/bin/env node
// Paired-release coordinator. Environment files and runtime state are NEVER synchronized.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const identity=JSON.parse(fs.readFileSync(path.join(root,'frontend/deployment.json'),'utf8'));
const peers={frappe:{folder:'neon',repository:'Vyomanta/Vedika-v-2.0-N'},neon:{folder:'frappe',repository:'Vyomanta/Vedika-v-2.0'}};
const peerArg=process.argv.indexOf('--peer');
const peer=path.resolve(peerArg>=0?process.argv[peerArg+1]:path.join(root,'..',peers[identity.backend].folder));
const command=process.argv[2]||'check';
const managed=new Set(['frontend','backend','scripts','.github','.githooks','vedika-desktop-pet']);
const topFiles=new Set(['.gitignore','.gitattributes','AGENTS.md','README.md','DEPLOYMENT.md','PROJECT_MAP.md','NATIVE_BACKEND_SETUP.md','VEDIKA_PLATFORM_FEATURES.md']);
const skippedDirs=new Set(['.git','node_modules','.next','.vercel','__pycache__','test-results','playwright-report']);
function allowed(relative){
 const parts=relative.split('/'),name=parts.at(-1);
 if(parts.some(p=>skippedDirs.has(p)))return false;
 if(/^\.env(?:\.|$)/.test(name)&&!name.endsWith('.example'))return false;
 if(/\.(log|pyc|pem|key)$/.test(name)||['user_profile.json','organizations_data.json','lint-results.json','audit-results.json','.release-validation.json'].includes(name))return false;
 if(relative==='frontend/deployment.json')return false;
 return managed.has(parts[0])||topFiles.has(relative);
}
function inventory(directory){
 const result=new Map();
 const files=cp.execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:directory,encoding:'utf8'}).split('\0').filter(Boolean);
 for(const relative of new Set(files)){
  if(!allowed(relative))continue;
  const file=path.join(directory,relative);
  if(!fs.existsSync(file))continue;
  const info=fs.lstatSync(file);
  if(info.isSymbolicLink())throw new Error('Refusing to synchronize a symbolic link: '+relative);
  if(info.isFile())result.set(relative,crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
 }
 return result;
}

function run(executable,args,cwd=root,extraEnv={}){const value=cp.spawnSync(executable,args,{cwd,stdio:'inherit',env:{...process.env,...extraEnv},shell:process.platform==='win32'&&executable==='npm'});if(value.status!==0)throw new Error(`${executable} ${args.join(' ')} failed.`);}
function git(args,cwd=root){return cp.execFileSync('git',args,{cwd,encoding:'utf8'}).trim();}
function verifyPeer(){
 if(!fs.existsSync(path.join(peer,'.git')))throw new Error('Peer repository missing. Supply --peer <path>.');
 const peerIdentity=JSON.parse(fs.readFileSync(path.join(peer,'frontend/deployment.json'),'utf8'));
 if(peerIdentity.backend===identity.backend)throw new Error('Peer must use the other backend.');
 for(const [folder,expected]of [[root,identity.repository],[peer,peers[identity.backend].repository]]){
  const remote=git(['remote','get-url','origin'],folder).replace(/\.git$/,'');
  if(remote!=='https://github.com/'+expected)throw new Error('Unexpected Git remote; no push was attempted.');
 }
}
function check(){
 verifyPeer();const ours=inventory(root),theirs=inventory(peer),differences=[];
 for(const file of new Set([...ours.keys(),...theirs.keys()]))if(ours.get(file)!==theirs.get(file))differences.push(file);
 if(differences.length)throw new Error('Shared source differs:\n'+differences.join('\n'));
 console.log(`${ours.size} shared source/assets match across Frappe and Neon. Deployment identities and secrets are independent.`);
}
function sync(){
 verifyPeer();
 const ours=inventory(root),theirs=inventory(peer);
 const dirty=git(['status','--porcelain'],peer);
 if(dirty&&process.argv.indexOf('--initialize')<0){
  const checkpoint=path.join(peer,'.git','vedika-pair-sync.json');
  const previous=fs.existsSync(checkpoint)?new Map(JSON.parse(fs.readFileSync(checkpoint,'utf8'))):null;
  const different=[...theirs].filter(([name,hash])=>ours.get(name)!==hash&&(!previous||previous.get(name)!==hash));
  if(different.length)throw new Error('Peer has uncommitted differences. Commit or reconcile them before synchronization.');
 }
 for(const [file,hash]of ours)if(theirs.get(file)!==hash){const target=path.join(peer,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target);}
 for(const file of theirs.keys())if(!ours.has(file))fs.unlinkSync(path.join(peer,file));
 for(const folder of [root,peer])fs.writeFileSync(path.join(folder,'.git','vedika-pair-sync.json'),JSON.stringify([...ours]));
 check();
}
try{
 if(command==='guard'){
  if(process.env.VEDIKA_PAIR_RELEASE!=='1')throw new Error('Use node scripts/pair.cjs release to validate and push BOTH repositories.');
  check();
 }else if(command==='check')check();
 else if(command==='sync')sync();
 else if(command==='install-hooks'){
  verifyPeer();for(const folder of [root,peer])git(['config','core.hooksPath','.githooks'],folder);
  console.log('Installed paired-release pre-push hooks in both repositories.');
 }else if(command==='release'){
  check();
  for(const folder of [root,peer]){
   run('npm',['run','check'],path.join(folder,'frontend'));
   run('npm',['audit','--audit-level=high'],path.join(folder,'frontend'));
  }
  const messageIndex=process.argv.indexOf('--message');
  const message=messageIndex>=0?process.argv[messageIndex+1]:'feat: synchronize validated Vedika feature release';
  for(const folder of [root,peer]){
   run('git',['add','--all'],folder);
   if(git(['status','--porcelain'],folder))run('git',['commit','-m',message],folder);
   run('git',['fetch','origin','main'],folder);
   run('git',['merge-base','--is-ancestor','origin/main','HEAD'],folder);
  }
  // Separate GitHub repositories cannot be updated atomically. Always verify both destinations.
  const results=[];
  for(const folder of [root,peer]){
   try{run('git',['push','origin','HEAD:main'],folder,{VEDIKA_PAIR_RELEASE:'1'});const head=git(['rev-parse','HEAD'],folder);const remote=git(['ls-remote','origin','refs/heads/main'],folder).split(/\s+/)[0];results.push({folder,success:head===remote,head});}
   catch(error){results.push({folder,success:false,error:error.message});}
  }
  console.log(JSON.stringify(results,null,2));if(results.some(r=>!r.success))throw new Error('Paired release is incomplete. Fix the failed destination and rerun; do not force-push.');
 }else throw new Error('Commands: check, sync, install-hooks, release.');
}catch(error){console.error(error.message);process.exitCode=1;}
