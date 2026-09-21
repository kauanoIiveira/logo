import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {geometry,expressions,poses,seated,svg} from './mascot.mjs';
const require=createRequire(import.meta.url),sharp=require('sharp');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'output/identidade-raposa');
const manifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
const failures=[],checks=[];
for(const a of manifest){
 const xml=await fs.readFile(path.join(out,a.svg),'utf8');
 if(/<image[\s>]|data:image|https?:\/\/(?!www\.w3\.org)/.test(xml))failures.push(a.svg+': raster or remote dependency');
 const {data,info}=await sharp(path.join(out,a.png)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let occupied=0,edge=0,transparent=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const alpha=data[(y*info.width+x)*4+3];if(alpha>0)occupied++;else transparent++;if((x===0||y===0||x===info.width-1||y===info.height-1)&&alpha>64)edge++;}
 const needsMargin=/^(03-mestre|05-construcao|06-expressoes|07-poses)\//.test(a.name)&&!a.name.includes('fundo-');
 if(needsMargin&&edge)failures.push(a.png+': content touches export edge');
 checks.push({file:a.png,width:info.width,height:info.height,hasAlpha:info.channels===4,transparentPixels:transparent,opaqueEdgePixels:edge});
}
for(const n of[16,24,32]){const m=await sharp(path.join(out,`04-sistema/icones/simbolo-${n}.png`)).metadata();if(m.width!==n||m.height!==n)failures.push('Wrong icon dimensions '+n);}
for(const[k]of expressions){const xml=await fs.readFile(path.join(out,`06-expressoes/${k}.svg`),'utf8');if(!xml.includes(geometry.head)||!xml.includes(geometry.mask))failures.push('Head geometry changed '+k);}
for(const[k]of poses){const xml=await fs.readFile(path.join(out,`07-poses/${k}.svg`),'utf8');if(!xml.includes(geometry.head)||!xml.includes(geometry.mask))failures.push('Head geometry changed '+k);}
const ico=await fs.readFile(path.join(out,'04-sistema/favicon.ico'));
if(ico.readUInt16LE(2)!==1||ico.readUInt16LE(4)!==3)failures.push('ICO directory malformed');
const source=path.join(root,'output/mascote-raposa-v1/prancha-mascote.png');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sourceHash=hash(await fs.readFile(source));
if(sourceHash.toUpperCase()!=='D898DF1ED55F31AB80C3EDB34E5678785AAB3B466FB9A3C3FA03748D3B4DF86C')failures.push('Approved original was modified');
// Quantify silhouette overlap in the original coordinate space; no images are edited.
const src=await sharp(source).ensureAlpha().raw().toBuffer();
const rendered=await sharp(Buffer.from(svg(seated(),{viewBox:'0 0 1536 1024',width:1536,height:1024}))).ensureAlpha().raw().toBuffer();
let union=0,intersection=0,sourceArea=0,vectorArea=0,error=0,colorPixels=0;
for(let y=55;y<965;y++)for(let x=75;x<965;x++){
 const j=(y*1536+x)*4;
 const s=(src[j]>180&&src[j+1]<225&&src[j+2]<150)||(src[j]<150&&src[j+1]<100&&src[j+2]>35);
 const v=rendered[j+3]>128;
 if(s)sourceArea++;if(v)vectorArea++;if(s||v)union++;if(s&&v){intersection++;for(let c=0;c<3;c++)error+=Math.abs(src[j+c]-rendered[j+c]);colorPixels++;}
}
const result={date:'2026-09-07',vectorFiles:manifest.length,pngFiles:manifest.length,expressions:expressions.length,poses:poses.length,icons:[16,24,32],icoFrames:3,sourceSha256:sourceHash,sharedHeadGeometry:true,silhouetteComparison:{method:'Thresholded foreground of approved left character versus SVG alpha, same source coordinates',intersectionOverUnion:intersection/union,sourceArea,vectorArea,meanRgbAbsoluteDifference:error/(colorPixels*3)},checks,failures};
await fs.mkdir(path.join(out,'validacao'),{recursive:true});await fs.writeFile(path.join(out,'validacao/verificacao-tecnica.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({assets:manifest.length,expressions:8,poses:10,failures,silhouetteIoU:result.silhouetteComparison.intersectionOverUnion},null,2));
if(failures.length)process.exitCode=1;
