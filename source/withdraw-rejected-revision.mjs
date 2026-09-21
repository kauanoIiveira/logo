import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'output/identidade-raposa');
const archive=path.join(root,'archive/2026-09-09-edicao-02-rejeitada');
const generated='C:/Users/Kauan/.codex/generated_images/01a079e0-10a5-7de0-91e7-b7719b99da56';
const studies=[
 {key:'em-pe',label:'Base do corpo em pé',original:'exec-cf809dcb-8d5f-4f2f-86a6-718c25c261f9.png'},
 {key:'caminhando',label:'Caminhando',original:'exec-aee55232-6ad7-46fa-8499-672a3c6fed75.png'},
 {key:'farejando',label:'Farejando o chão',original:'exec-1742ce54-d758-4eaf-a75f-073ddb1b7e87.png'}
];
await fs.mkdir(path.join(out,'estudos-corpo'),{recursive:true});
for(const study of studies){await fs.copyFile(path.join(generated,study.original),path.join(out,'estudos-corpo',study.key+'.png'));}
await fs.writeFile(path.join(out,'estudos-corpo/manifest.json'),JSON.stringify(studies.map(s=>({name:s.key,label:s.label,png:s.key+'.png',format:'PNG',background:'ivory',status:'anatomy-study',generatedSource:s.original})),null,2));

const manifest=JSON.parse(await fs.readFile(path.join(out,'manifest.json'),'utf8'));
const withdrawn=manifest.filter(a=>a.name.startsWith('07-poses/')||['05-construcao/vista-frontal','05-construcao/vista-lateral','05-construcao/vista-traseira','pranchas/05-vistas','pranchas/07-poses'].includes(a.name));
async function withdraw(relative){
 const from=path.resolve(out,relative),to=path.resolve(archive,'retirados',relative);
 if(!from.startsWith(out+path.sep)||!to.startsWith(archive+path.sep))throw new Error('Unexpected withdrawal path');
 if(!await fs.access(from).then(()=>true,()=>false))return;
 await fs.mkdir(path.dirname(to),{recursive:true});await fs.rename(from,to);
}
for(const item of withdrawn)for(const key of ['svg','png'])await withdraw(item[key]);
// Evidence and documents containing the withdrawn art are also removed from the active package.
for(const file of await fs.readdir(path.join(out,'validacao')))await withdraw('validacao/'+file);
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest.filter(a=>!withdrawn.includes(a)),null,2));

let source=await fs.readFile(path.join(root,'source/mascot.mjs'),'utf8');
source=source.replace(/export const poses = \[[\s\S]*?\n\];/,'export const poses = []; // Rejected anatomy was withdrawn; new body studies are PNGs.');
source=source.replace(/^export \{.*natural-poses\.mjs';\r?\n/gm,'');
await fs.writeFile(path.join(root,'source/mascot.mjs'),source);
let builder=await fs.readFile(path.join(root,'source/build-package.mjs'),'utf8');
builder=builder.replace('expressions, poses, defs','expressions, defs').replace('tail, front, profile, pose, symbol','tail, symbol');
builder=builder.replace(/^import \{poseViewBoxes\}[^\n]+\n/m,'');
builder=builder.replace(/^await save\('05-construcao\/vista-(frontal|lateral|traseira)'[^\n]+\n/gm,'');
builder=builder.replace(/^for\(const \[key,label\] of poses\)[^\n]+\n/m,'');
const vStart=builder.indexOf("await save('pranchas/05-vistas'");
const vEnd=builder.indexOf("await save('pranchas/06-expressoes'",vStart);
if(vStart>=0&&vEnd>vStart)builder=builder.slice(0,vStart)+builder.slice(vEnd);
builder=builder.replace(/^await save\('pranchas\/07-poses'[^\n]+\n/m,'');
await fs.writeFile(path.join(root,'source/build-package.mjs'),builder);
for(const name of ['natural-poses.mjs','frame-poses.mjs','document-revision.mjs','finish-edition.py']){
 const from=path.resolve(root,'source',name),to=path.resolve(archive,'fonte-retirada',name);
 if(!from.startsWith(path.join(root,'source')+path.sep)||!to.startsWith(archive+path.sep))throw new Error('Unexpected source path');
 await fs.mkdir(path.dirname(to),{recursive:true});await fs.rename(from,to);
}

let guide=await fs.readFile(path.join(root,'source/build-guide.mjs'),'utf8');
guide=guide.replace('palette,expressions,poses','palette,expressions');
guide=guide.replace("const nativeIcons=",`const studies=${JSON.stringify(studies.map(s=>[s.key,s.label]))};\nconst nativeIcons=`);
guide=guide.replaceAll('edição 02','edição 03');
guide=guide.replace('A identidade escolhida, com olhos pretos e uma biblioteca de posturas naturais para acompanhar diferentes projetos.','A matriz preservada e novos estudos do corpo, seguindo as referências de anatomia fornecidas.');
guide=guide.replace('<b>10</b>poses naturais','<b>3</b>estudos do corpo');
guide=guide.replace(/<section id="construcao">[\s\S]*?<img class="sheet" src="pranchas\/05-geometria.svg"/,`<section id="construcao">\${intro('05','Elementos da matriz','Rosto, máscara, olhos, peito e cauda do personagem principal. As vistas complementares da revisão rejeitada foram retiradas.')}<img class="sheet" src="pranchas/05-geometria.svg"`);
const poseSection=`<section id="poses">\${intro('07','Correção do corpo','Nova base em pé, caminhada e farejo, desenvolvidos a partir das referências enviadas.')}<div class="grid">\${studies.map(([k,l])=>\`<article class="asset study"><div class="art"><img loading="lazy" src="estudos-corpo/\${k}.png" alt="\${l}"></div><div class="caption"><h3>\${l}</h3><div><a download href="estudos-corpo/\${k}.png">PNG</a></div></div></article>\`).join('')}</div><p class="note">Estudos de correção em PNG, com fundo claro. Ainda não são novas matrizes vetoriais aprovadas. A identidade principal permanece no personagem sentado; as poses e vistas rejeitadas foram retiradas desta biblioteca.</p><a href="estudos-corpo/PROMPTS.md">Referências e instruções da correção</a></section>`;
guide=guide.replace(/<section id="poses">[\s\S]*?<\/section>/,poseSection);
guide=guide.replace(/<section id="validacao">[\s\S]*?<\/section>/,`<section id="validacao">\${intro('QA','Estado da revisão','O corpo está em correção. A matriz principal, os símbolos e as expressões foram preservados.')}<p class="note">As verificações de arquivos não validam a anatomia. Os três novos desenhos são estudos visuais gerados com as referências e precisam de avaliação estética antes de orientar a vetorização das próximas poses.</p><div class="actions"><a href="validacao/RELATORIO.md">Ler registro da revisão</a><a href="validacao/verificacao-tecnica.json">Ver verificações dos arquivos</a></div></section>`);
guide=guide.replace('.art img{','.study .art{padding:0;aspect-ratio:3/2;height:auto;background:#fffdf8}.art img{');
guide=guide.replace('Arquivos editáveis, imagens transparentes, manual e regras de uso.','Matriz editável, estudos do corpo, manual e regras de uso.');
guide=guide.replaceAll('Baixar pacote completo','Baixar conjunto atual');
guide=guide.replace("['05-vistas','05 · Character sheet — vistas'],",'').replace(",['07-poses','07 · Posturas naturais']",'');
guide=guide.replaceAll('${i+1} / 8','${i+1} / 7').replace('8 / 8','7 / 7');
const studyPage=`<section class="page"><p class="kicker">07 · Correção do corpo</p><h1>Uma base corporal mais contínua.</h1><p>Estudos em PNG a partir das referências. O personagem mestre permanece preservado.</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5mm;margin-top:16mm">\${studies.map(([k,l])=>\`<div><img src="estudos-corpo/\${k}.png" alt="\${l}" style="width:100%;height:80mm;object-fit:contain"><p style="text-align:center;font-size:10pt">\${l}</p></div>\`).join('')}</div><p>As poses e vistas da edição rejeitada foram retiradas. Estes estudos ainda não substituem a matriz SVG e não foram aprovados como identidade final.</p><footer><span>Raposa · correção corporal · edição 03</span><span>6 / 7</span></footer></section>`;
guide=guide.replace('<section class="page"><p class="kicker">Uso e validação',studyPage+'<section class="page"><p class="kicker">Uso e validação');
guide=guide.replace('O rosto principal foi preservado nas oito expressões. As poses usam esse rosto ou o perfil revisado, conforme a direção da cabeça. Foram verificadas as dimensões, transparência, margens e ausência de imagens raster embutidas nos SVGs.','O rosto principal permanece nas oito expressões. Os três novos estudos corporais são PNGs com fundo claro. Os arquivos SVG da matriz continuam editáveis e não contêm imagens embutidas.');
guide=guide.replace('As novas vistas são construções complementares. A proximidade estética do rosto com as referências continua registrada no relatório.','As vistas e poses rejeitadas foram retiradas. A revisão visual do corpo precede a próxima etapa de vetorização.');
guide=guide.replace("page.locator('#construcao .grid')","page.locator('#construcao .sheet')");
guide=guide.replace(".count()!==10)throw new Error('Expected ten natural postures')",".count()!==3)throw new Error('Expected three body studies')");
await fs.writeFile(path.join(root,'source/build-guide.mjs'),guide);
console.log(JSON.stringify({withdrawnAssets:withdrawn.length,retainedVectorAssets:manifest.length-withdrawn.length,newPngStudies:studies.length}));
