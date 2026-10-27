import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.dirname(new URL(import.meta.url).pathname);
const nodes=new Map();
const documentEvents={},windowEvents={};
let storage={};
const makeNode=(key)=>({innerHTML:'',textContent:'',value:'',dataset:{},inert:false,isConnected:true,classList:{add(){},remove(){},toggle(){}},setAttribute(){},focus(){},addEventListener(k,f){this[k]=f},querySelectorAll(){return []},remove(){nodes.delete(key)}});
const getNode=key=>{if(!nodes.has(key))nodes.set(key,makeNode(key));return nodes.get(key)};
const document={querySelector:getNode,documentElement:{lang:'en'},body:{classList:{add(){},remove(){}},appendChild(node){nodes.set('#'+node.id,node)}},addEventListener(k,f){documentEvents[k]=f},createElement(){return makeNode('new')},activeElement:makeNode('focus')};
const context=vm.createContext({document,console,Set,JSON,setTimeout:()=>1,clearTimeout(){},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},location:{hash:''}});
context.window=context;context.confirm=()=>true;context.print=()=>{};context.scrollTo=()=>{};context.addEventListener=(k,f)=>windowEvents[k]=f;
vm.runInContext(fs.readFileSync(path.join(root,'docs/content.js'),'utf8'),context);
let script=fs.readFileSync(path.join(root,'docs/app.js'),'utf8');
script=script.replace(/\}\)\(\);\s*$/,"globalThis.__qa={render,homePage,tasksPage,formsPage,helpPage,modalContent,taskCard,resourceCard,filteredTasks,filteredResources,toggleTask,printChecklist,set(v){if(v.lang)lang=v.lang;if(v.page)page=v.page;if(v.phase)phase=v.phase;if(v.search!==undefined)search=v.search;if(v.resourceFilter)resourceFilter=v.resourceFilter;},get(){return {lang,page,phase,search,completed:[...completed]};}};})();");
vm.runInContext(script,context);
const api=context.__qa, data=context.GUIDE_DATA;
let assertions=0;
const check=(b,msg)=>{assert(b,msg);assertions++};
check(data.tasks.length===12,'12 tasks');check(data.resources.length===21,'21 resources');
const html=[];
for(const lang of ['en','ko']) {
 api.set({lang});
 for(const page of ['home','tasks','forms','help']){
  api.set({page,phase:page==='home'?'office':'all',search:''});api.render();
  const output=getNode('#page-content').innerHTML;
  check(output.length>100,'render '+lang+'/'+page);check(!output.includes('undefined'),'no undefined '+page);check(!output.includes('javascript:'),'no script URL');
  html.push(output);
 }
 for(const task of data.tasks){
  const output=api.modalContent(task);html.push(output);
  check(output.includes(task.title[lang].replaceAll('&','&amp;')),'detail title '+task.id+'/'+lang);
  check(task.steps[lang].length>0,'steps '+task.id);check(task.documents[lang].length>0,'documents '+task.id);
  for(const id of task.files)check(data.resources.some(r=>r.id===id),'resource '+id);
 }
}
api.set({page:'home',phase:'all'});api.render();
check(api.get().phase==='office','all -> home resets to office');
check(getNode('#page-content').innerHTML.includes('task-residence-copy'),'home office list present');
api.set({page:'tasks',phase:'all',search:'IRIS'});api.render();
check(api.filteredTasks().includes('task-iris'),'IRIS search');
api.set({search:'nonexistent_search_token_xyz'});api.render();check(api.filteredTasks().includes('empty-state'),'empty search state');
api.set({page:'tasks',phase:'office',search:''});api.render();
check((api.filteredTasks().match(/<article /g)||[]).length===4,'office tasks count');
api.toggleTask('residence-copy');
check(api.get().completed.includes('residence-copy'),'toggle completion');
check(JSON.parse(storage['snu-welcome-checklist-v1']).completed.includes('residence-copy'),'completion persisted');
api.toggleTask('residence-copy');check(!api.get().completed.includes('residence-copy'),'undo completion');
api.set({page:'forms',resourceFilter:'departure',search:''});api.render();check((api.filteredResources().match(/<article /g)||[]).length===4,'departure forms filter');
api.set({resourceFilter:'all'});api.render();check((api.filteredResources().match(/<article /g)||[]).length===21,'all forms filter');
api.printChecklist();check((getNode('#print-sheet').innerHTML.match(/class="print-task"/g)||[]).length===12,'all tasks in print sheet');
for(const r of data.resources){check(fs.existsSync(path.join(root,'docs/files',r.file)),'file exists '+r.file);check(fs.statSync(path.join(root,'docs/files',r.file)).size>0,'file nonempty');for(const l of ['en','ko'])check(r.title[l]&&r.note[l],'resource localization');}
for(const out of html){for(const m of out.matchAll(/href="files\/([^"#]+)(?:#[^"]*)?"/g))check(fs.existsSync(path.join(root,'docs/files',m[1])),'rendered download exists '+m[1]);}
check(!/type=["'](?:file|password)["']/.test(script),'no sensitive upload fields');
check(!/fetch\(|XMLHttpRequest|sendBeacon/.test(script),'no data transmission');
console.log(JSON.stringify({result:'passed',assertions,locales:2,tasks:12,resources:21,scope:'Content, rendering, file links, state and storage logic. No browser or visual-layout validation.'},null,2));
