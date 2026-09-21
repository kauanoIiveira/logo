import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url),{chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'output/identidade-raposa/08-variantes/validacao-galeria');
await fs.mkdir(out,{recursive:true});
const base='http://127.0.0.1:8768/identidade-raposa/';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
const errors=[],result={desktop:null,mobile:null,controls:[],httpErrors:[],consoleErrors:errors};
page.on('pageerror',e=>errors.push(e.message));
const ready=()=>page.evaluate(()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');return Promise.all(Array.from(document.images).map(i=>i.decode()));});
try{
  await page.goto(base+'08-variantes/index.html',{waitUntil:'networkidle'});await ready();
  result.desktop={brokenImages:await page.locator('img').evaluateAll(xs=>xs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
  await page.screenshot({path:path.join(out,'desktop.png')});
  for(const [view,file] of [['head','head-mark'],['symbol','brand-symbol'],['full','full-character']]){
    await page.locator(`button[data-view="${view}"]`).click();await ready();
    for(const id of ['laranja','branca','preta']){
      const actual=await page.locator('#preview-'+id).getAttribute('src');
      if(!actual.endsWith(file+'.svg'))throw new Error('Wrong preview: '+actual);
      for(const ext of ['svg','png'])if(!(await page.locator('#'+ext+'-'+id).getAttribute('href')).endsWith(file+'.'+ext))throw new Error('Download did not follow view');
    }
    if(await page.locator(`button[data-view="${view}"]`).getAttribute('aria-pressed')!=='true')throw new Error('View selection state failed');
    result.controls.push(view);
  }
  for(const surface of ['light','dark','alpha','recommended']){
    await page.locator(`button[data-surface="${surface}"]`).click();
    if(await page.locator('body').getAttribute('data-surface')!==surface)throw new Error('Surface failed: '+surface);
    result.controls.push(surface);
  }
  const refs=await page.locator('[href],img[src]').evaluateAll(xs=>[...new Set(xs.map(x=>x.href||x.src))]);
  for(let i=0;i<refs.length;i+=10){
    await Promise.all(refs.slice(i,i+10).filter(u=>u.startsWith('http')&&!u.includes('#')).map(async u=>{const response=await page.request.head(u);if(!response.ok())result.httpErrors.push({url:u,status:response.status()});}));
  }
  await page.locator('#branca .native-icons').screenshot({path:path.join(out,'icones-branca.png')});
  await page.locator('#preta .native-icons').screenshot({path:path.join(out,'icones-preta.png')});
  await page.setViewportSize({width:390,height:844});await page.goto(base+'08-variantes/index.html',{waitUntil:'networkidle'});await ready();
  result.mobile={brokenImages:await page.locator('img').evaluateAll(xs=>xs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
  await page.screenshot({path:path.join(out,'mobile.png')});
  await page.goto(base+'?edicao=04#cores',{waitUntil:'networkidle'});await ready();
  if(await page.locator('#cores article').count()!==3)throw new Error('Missing gallery additions');
  result.originalGalleryMobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await page.setViewportSize({width:1440,height:1100});await page.goto(base+'?edicao=04#cores',{waitUntil:'networkidle'});await ready();
  await page.locator('#cores').screenshot({path:path.join(out,'guia-cores.png')});
  if(await page.locator('#poses article').count()!==3)throw new Error('Existing body studies changed');
  result.originalStudiesPreserved=true;
  await fs.writeFile(path.join(out,'resultado.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
  if(errors.length||result.httpErrors.length||result.desktop.overflow||result.mobile.overflow||result.originalGalleryMobileOverflow||result.desktop.brokenImages.length||result.mobile.brokenImages.length)process.exitCode=1;
}finally{await browser.close();}
