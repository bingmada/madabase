import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const output=process.argv.find(x=>x.startsWith('--output='))?.slice(9)??'release-identity-checks.json';
assert.ok(/^(?:(?:(?:summary|source)\d{2}|p0-costume(?:-related)?|completed-scope)-)?release-identity-checks\.json$/.test(output),'Unexpected report filename');
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'madabase-release-id-'));
const loader=new URL('./lib/load-affiliate-typescript.mjs',import.meta.url).href;
const scenarios=[
 {name:'Configured release takes precedence',env:'configured-22',release:'file-22',next:'fallback-22',expected:'configured-22'},
 {name:'Invalid environment falls back to release file',env:'../invalid',release:'release-22',expected:'release-22'},
 {name:'Normal release file',release:'release-22\n',expected:'release-22'},
 {name:'Normal next-start fallback',next:'next-22',expected:'next-22'},
 {name:'Invalid release file uses next fallback',release:'../invalid',next:'next-22',expected:'next-22'},
 {name:'No build metadata during development',expected:'development'},
 {name:'Resolved release remains stable in the running process',release:'release-22',replace:'changed-22',expected:'release-22'},
];
const rows=[];
try{
 for(const [i,test]of scenarios.entries()){
  const cwd=path.join(fixture,String(i));fs.mkdirSync(cwd);
  for(const [dir,value]of [['.next-release',test.release],['.next',test.next]])if(value!==undefined){fs.mkdirSync(path.join(cwd,dir));fs.writeFileSync(path.join(cwd,dir,'BUILD_ID'),value);}
  const code=`import fs from 'node:fs';import{loadAffiliateTypescript as load}from ${JSON.stringify(loader)};process.chdir(process.argv[1]);const{commerceReleaseId}=load('../../lib/release-identity.ts');const first=commerceReleaseId();if(process.argv[2])fs.writeFileSync('.next-release/BUILD_ID',process.argv[2]);process.stdout.write(JSON.stringify([first,commerceReleaseId()]));`;
  const env={...process.env};delete env.MADABASE_RELEASE_ID;if(test.env!==undefined)env.MADABASE_RELEASE_ID=test.env;
  const actual=JSON.parse(execFileSync(process.execPath,['--input-type=module','-e',code,cwd,test.replace??''],{env,encoding:'utf8'}));
  assert.deepEqual(actual,[test.expected,test.expected],test.name);rows.push({name:test.name,passed:true});
 }
}finally{fs.rmSync(fixture,{recursive:true,force:true});}
const traceFiles=[];
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())scan(file);else if(entry.name.endsWith('.nft.json'))traceFiles.push(file);}}
scan(path.join(root,'.next-release/server'));
const recursiveTraces=traceFiles.flatMap(file=>JSON.parse(fs.readFileSync(file)).files.filter(name=>name.includes('/.release/')).map(name=>({manifest:path.relative(root,file),path:name})));
assert.equal(recursiveTraces.length,0,'No previous packaged runtime may be traced into a new build');
const releaseId=fs.readFileSync(path.join(root,'.next-release/BUILD_ID'),'utf8').trim();
const packagedId=fs.readFileSync(path.join(root,'.release/runtime/apps/affiliate/.next-release/BUILD_ID'),'utf8').trim();
assert.equal(packagedId,releaseId,'Packaged release identity must match this build');
assert.ok(!fs.existsSync(path.join(root,'.release/runtime/apps/affiliate/.release')),'Runtime must not nest an old release');
const report={checkedAt:new Date().toISOString(),releaseId,passed:true,scenarios:rows,traceManifests:traceFiles.length,recursiveTraces,packagedIdentityMatches:true,nestedRuntimeAbsent:true};
fs.writeFileSync(path.join(root,'reports/quality-remediation-2026-10-22',output),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
