import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { palette, geometry, expressions, poses, defs, seated, head, tail, front, profile, pose, symbol, svg } from './mascot.mjs';
import {poseViewBoxes} from './natural-poses.mjs';
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const OUT=path.join(ROOT,'output','identidade-raposa');
await fs.mkdir(OUT,{recursive:true});
const manifest=[];
async function save(name,art,size=1400){
  const target=path.join(OUT,name+'.svg');await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.writeFile(target,art);const png=await sharp(Buffer.from(art)).resize({width:size}).png().toBuffer();await fs.writeFile(path.join(OUT,name+'.png'),png);
  const meta=await sharp(png).metadata();manifest.push({name,svg:name+'.svg',png:name+'.png',width:meta.width,height:meta.height});return art;
}

await save('03-mestre/raposa-mestre',svg(seated(),{title:'Raposa — personagem mestre'}));
if(process.argv.includes('--preview')){console.log(path.join(OUT,'03-mestre/raposa-mestre.png'));process.exit(0);}

for(const style of ['solid','silhouette','black','mono','reverse'])await save('03-mestre/raposa-'+style,svg(seated({style}),{title:'Raposa — '+style}));
for(const [name,bg] of [['fundo-claro',palette.ivory],['fundo-roxo',palette.purple]])await save('03-mestre/'+name,svg(seated(),{title:'Raposa — '+name,bg}));
await save('03-mestre/cabeca',svg(head(),{viewBox:'455 55 510 460',width:510,height:460,title:'Cabeça da raposa'}),1024);
await save('03-mestre/cauda',svg(tail(),{viewBox:'75 145 420 790',width:420,height:790,title:'Cauda da raposa'}),800);

await save('04-sistema/head-mark',svg(head(),{viewBox:'455 55 510 460',width:510,height:460,title:'Head mark'}),1024);
await save('04-sistema/full-character',svg(seated(),{title:'Full character'}));
await save('04-sistema/brand-symbol',svg(symbol(),{viewBox:'0 0 64 64',width:64,height:64,title:'Símbolo da raposa'}),512);
await save('04-sistema/brand-symbol-mono',svg(symbol({style:'mono'}),{viewBox:'0 0 64 64',width:64,height:64,title:'Símbolo monocromático'}),512);
for(const size of [16,24,32,48,64,128,256]){
  const art=svg(symbol({micro:size<=32}),{viewBox:'0 0 64 64',width:64,height:64,title:'Símbolo da raposa'});
  await save('04-sistema/icones/simbolo-'+size,art,size);
}
const icon=svg(`<rect width="512" height="512" rx="112" fill="${palette.purple}"/><g transform="translate(-354 12) scale(.86)">${head()}</g>`,{viewBox:'0 0 512 512',width:512,height:512,title:'Ícone de aplicativo'});
await save('04-sistema/app-icon',icon,1024);
const avatar=svg(`<circle cx="256" cy="256" r="256" fill="${palette.ivory}"/><g transform="translate(-197 20) scale(.64)">${head()}</g>`,{viewBox:'0 0 512 512',width:512,height:512,title:'Avatar da raposa'});
await save('04-sistema/avatar',avatar,1024);
// ICO wraps real PNG encodings at the declared sizes; it is not a renamed PNG.
const icoSizes=[16,32,48];const buffers=await Promise.all(icoSizes.map(n=>fs.readFile(path.join(OUT,`04-sistema/icones/simbolo-${n}.png`))));
const hdr=Buffer.alloc(6+16*buffers.length);hdr.writeUInt16LE(1,2);hdr.writeUInt16LE(buffers.length,4);let offset=hdr.length;
buffers.forEach((b,i)=>{const p=6+16*i;hdr[p]=icoSizes[i];hdr[p+1]=icoSizes[i];hdr.writeUInt16LE(1,p+4);hdr.writeUInt16LE(32,p+6);hdr.writeUInt32LE(b.length,p+8);hdr.writeUInt32LE(offset,p+12);offset+=b.length;});
await fs.writeFile(path.join(OUT,'04-sistema/favicon.ico'),Buffer.concat([hdr,...buffers]));

await save('05-construcao/vista-tres-quartos',svg(seated(),{title:'Vista principal em três quartos'}));
await save('05-construcao/vista-frontal',svg(front(),{title:'Vista frontal'}));
await save('05-construcao/vista-lateral',svg(profile(),{title:'Vista lateral'}));
await save('05-construcao/vista-traseira',svg(profile({rear:true}),{title:'Vista traseira'}));
for(const [key,label] of expressions){
  const rot={curioso:-7,pensando:5,alerta:-3,frustracao:7,comemorando:-6}[key]||0;
  await save('06-expressoes/'+key,svg(head({expression:key,rotate:rot}),{viewBox:'440 25 560 530',width:560,height:530,title:label}),900);
}
for(const [key,label] of poses){const vb=poseViewBoxes[key],v=vb.split(' ').map(Number);await save('07-poses/'+key,svg(pose(key),{viewBox:vb,width:v[2],height:v[3],title:label}),1400);}

function sheet(title,subtitle,items,{cols=3,cellW=540,cellH=570}={}){
  const margin=64,header=180,footer=60,w=margin*2+cols*cellW,h=header+Math.ceil(items.length/cols)*cellH+footer;
  let content=`<rect width="${w}" height="${h}" fill="${palette.ivory}"/><text x="${margin}" y="78" fill="${palette.purple}" font-family="Segoe UI,sans-serif" font-weight="700" font-size="44">${title}</text><text x="${margin}" y="120" fill="#685774" font-family="Segoe UI,sans-serif" font-size="20">${subtitle}</text>`;
  items.forEach(([label,art,vb],i)=>{
    const x=margin+i%cols*cellW,y=header+Math.floor(i/cols)*cellH;
    content+=`<svg x="${x+20}" y="${y}" width="${cellW-40}" height="${cellH-85}" viewBox="${vb||'60 55 940 930'}">${art}</svg><text x="${x+cellW/2}" y="${y+cellH-35}" text-anchor="middle" fill="${palette.purple}" font-size="22" font-family="Segoe UI,sans-serif">${label}</text>`;
  });
  return svg(content,{viewBox:`0 0 ${w} ${h}`,width:w,height:h,title});
}
await save('pranchas/03-personagem-mestre',sheet('Personagem mestre','Uma matriz de formas. Versões de uso.',[
 ['Gradiente',seated()],['Cor sólida',seated({style:'solid'})],['Silhueta',seated({style:'silhouette'})],
 ['Cabeça',head(),'455 55 510 460'],['Monocromático',seated({style:'mono'})],['Fundo roxo',`<rect x="60" y="55" width="940" height="930" rx="40" fill="${palette.purple}"/>${seated()}`]
]),2000);
await save('pranchas/04-sistema',sheet('Três níveis de representação','Símbolo • cabeça • personagem completo',[
 ['Brand symbol',symbol(),'0 0 64 64'],['Head mark',head(),'455 55 510 460'],['Full character',seated()]
]),1800);
await save('pranchas/05-vistas',sheet('Construção do personagem','Vistas complementares do modelo aprovado',[
 ['Principal · 3/4',seated()],['Frontal',front()],['Lateral',profile()],['Traseira',profile({rear:true})]
],{cols:4,cellW:480,cellH:570}),2100);
await save('pranchas/06-expressoes',sheet('Oito expressões','Rosto econômico. Identidade constante.',expressions.map(([k,l])=>[l,head({expression:k,rotate:{curioso:-7,pensando:5,alerta:-3,frustracao:7,comemorando:-6}[k]||0}),'440 25 560 530']),{cols:4,cellW:470,cellH:490}),2100);
await save('pranchas/07-poses',sheet('Movimentos de uma raposa','Dez posturas naturais. Sem objetos ou gestos humanos.',poses.map(([k,l])=>[l,pose(k),poseViewBoxes[k]]),{cols:5,cellW:500,cellH:500}),2500);

// A construction sheet adds measured coordinates and extracted vector parts to the view sheet.
const construction=sheet('Gramática visual','Medidas na matriz vetorial. Sem redesenhar entre aplicações.',[
 ['Cabeça + orelhas',head({style:'silhouette'}),'455 55 510 460'],['Máscara contínua',`<path d="${geometry.mask}" fill="${palette.gold}"/>`,'455 290 510 225'],['Olhos e nariz',head(),'580 275 235 150'],['Peito em gota',`<path d="${geometry.chest}" fill="${palette.gold}"/>`,'655 500 180 320'],['Cauda + ponta',tail(),'75 145 420 790'],['Símbolo reduzido',symbol({micro:true}),'0 0 64 64']
]);
await save('pranchas/05-geometria',construction,2000);
const palSvg=svg(`<rect width="1400" height="440" fill="${palette.ivory}"/><text x="60" y="75" font-family="Segoe UI,sans-serif" font-size="40" font-weight="700" fill="${palette.purple}">Paleta da identidade</text>${Object.entries(palette).filter(([k])=>k!=='white').map(([k,c],i)=>`<g transform="translate(${60+i*215} 130)"><rect width="180" height="180" rx="18" fill="${c}" stroke="#DED2D0"/><text y="218" font-family="Segoe UI,sans-serif" font-size="22" fill="${palette.purple}">${k}</text><text y="248" font-family="Segoe UI,sans-serif" font-size="20" fill="${palette.purple}">${c}</text></g>`).join('')}`,{viewBox:'0 0 1400 440',width:1400,height:440,title:'Paleta'});
await save('pranchas/05-paleta',palSvg,1600);
await fs.writeFile(path.join(OUT,'paleta.json'),JSON.stringify(palette,null,2));
await fs.writeFile(path.join(OUT,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(JSON.stringify({output:OUT,vectorAssets:manifest.length,rasterAssets:manifest.length,favicon:true},null,2));
