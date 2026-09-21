import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {geometry,expressions,seated} from './mascot.mjs';
import {seated as priorSeated} from '../archive/2026-09-09-edicao-02-rejeitada/source/mascot.mjs';
const sharp=createRequire(import.meta.url)('sharp');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'output/identidade-raposa');
const manifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
const studies=JSON.parse(await fs.readFile(path.join(out,'estudos-corpo/manifest.json'),'utf8'));
const failures=[],checks=[];
for(const a of manifest){
 const xml=await fs.readFile(path.join(out,a.svg),'utf8');
 if(/<image[\s>]|data:image|https?:\/\/(?!www\.w3\.org)/.test(xml))failures.push(a.svg+': embedded raster or remote source');
 const {data,info}=await sharp(path.join(out,a.png)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let edge=0,transparent=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const alpha=data[(y*info.width+x)*4+3];if(!alpha)transparent++;if((x===0||y===0||x===info.width-1||y===info.height-1)&&alpha>64)edge++;}
 const margin=/^(03-mestre|05-construcao|06-expressoes)\//.test(a.name)&&!a.name.includes('fundo-');
 if(margin&&edge)failures.push(a.png+': export edge touched');
 for(const m of xml.matchAll(/<(?:ellipse|path)\b[^>]*data-feature="eye"[^>]*>/g))if(!/fill="#000000"|stroke="#000000"/.test(m[0]))failures.push(a.svg+': eye color');
 checks.push({name:a.name,width:info.width,height:info.height,transparentPixels:transparent,edgePixels:edge});
}
for(const[k]of expressions){const s=await fs.readFile(path.join(out,`06-expressoes/${k}.svg`),'utf8');if(!s.includes(geometry.head)||!s.includes(geometry.mask))failures.push('Changed expression face '+k);}
for(const n of[16,24,32]){const m=await sharp(path.join(out,`04-sistema/icones/simbolo-${n}.png`)).metadata();if(m.width!==n||m.height!==n)failures.push('Wrong icon dimensions '+n);}
if(seated()!==priorSeated())failures.push('The retained master changed during withdrawal');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const originalSha=sha(await fs.readFile(path.join(out,'referencias/modelo-aprovado.png')));
if(originalSha.toUpperCase()!=='D898DF1ED55F31AB80C3EDB34E5678785AAB3B466FB9A3C3FA03748D3B4DF86C')failures.push('Approved original modified');
const studyChecks=[];
for(const s of studies){const buf=await fs.readFile(path.join(out,'estudos-corpo',s.png)),m=await sharp(buf).metadata();if(m.width<1000||m.height<1000)failures.push('Study resolution '+s.name);studyChecks.push({name:s.name,format:m.format,width:m.width,height:m.height,hasAlpha:m.hasAlpha,sha256:sha(buf)});}
if((await fs.readdir(path.join(out,'07-poses')).catch(()=>[])).length)failures.push('Withdrawn poses remain');
for(const n of['vista-frontal','vista-lateral','vista-traseira'])for(const ext of['svg','png'])if(await fs.access(path.join(out,'05-construcao',n+'.'+ext)).then(()=>true,()=>false))failures.push('Withdrawn view '+n);
if(manifest.length!==37||studies.length!==3)failures.push('Unexpected collection count');
const result={date:'2026-09-09',edition:3,status:'body-correction-studies',vectorFiles:manifest.length,nativePngFiles:manifest.length,bodyStudyPngFiles:studies.length,masterConstructionUnchanged:true,approvedOriginalSha256:originalSha,checks,bodyStudies:studyChecks,failures};
await fs.mkdir(path.join(out,'validacao'),{recursive:true});await fs.writeFile(path.join(out,'validacao/verificacao-tecnica.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({nativeVectors:manifest.length,newPngStudies:studies.length,failures}));if(failures.length)process.exitCode=1;
