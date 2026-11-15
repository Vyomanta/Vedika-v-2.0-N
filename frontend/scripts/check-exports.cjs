const fs=require('node:fs'),path=require('node:path');
const espree=require('espree');
const root=path.resolve(__dirname,'..');
const contracts=JSON.parse(fs.readFileSync(path.join(root,'architecture/export-contract.json'),'utf8'));
const cache=new Map();
function resolve(base,spec){const name=spec.startsWith('@/')?path.join(root,spec.slice(2)):path.resolve(path.dirname(base),spec);return [name,name+'.js',name+'.jsx',name+'.cjs',path.join(name,'index.js')].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());}
function declared(p){if(p.type==='Identifier')return[p.name];if(p.type==='ObjectPattern')return p.properties.map(x=>x.key.name);if(p.type==='ArrayPattern')return p.elements.filter(Boolean).map(x=>x.name);return[];}
function exportsOf(file,seen=new Set()){
 if(!file||seen.has(file))return new Set();if(cache.has(file))return cache.get(file);seen.add(file);
 const ast=espree.parse(fs.readFileSync(file,'utf8'),{ecmaVersion:'latest',sourceType:'module',ecmaFeatures:{jsx:true}}),result=new Set();
 for(const node of ast.body){
  if(node.type==='ExportDefaultDeclaration')result.add('default');
  if(node.type==='ExportAllDeclaration')for(const name of exportsOf(resolve(file,node.source.value),new Set(seen)))if(name!=='default')result.add(name);
  if(node.type==='ExportNamedDeclaration'){
   const d=node.declaration;
   if(d)for(const name of d.id?[d.id.name]:d.declarations?.flatMap(v=>declared(v.id))||[])result.add(name);
   else for(const spec of node.specifiers)if(!node.source||exportsOf(resolve(file,node.source.value),new Set(seen)).has(spec.local.name))result.add(spec.exported.name);
  }
 }
 cache.set(file,result);return result;
}
let failed=false;
for(const [file,names]of Object.entries(contracts)){
 const actual=exportsOf(path.join(root,file));for(const name of names)if(!actual.has(name)){console.error(`Missing compatibility export: ${file} :: ${name}`);failed=true;}
}
if(failed)process.exitCode=1;else console.log(`${Object.keys(contracts).length} existing public module interfaces retained.`);
