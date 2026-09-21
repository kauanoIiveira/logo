import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {expressions} from './mascot.mjs';

const require=createRequire(import.meta.url),sharp=require('sharp');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=path.join(root,'output/identidade-raposa'),out=path.join(base,'08-variantes');
await fs.mkdir(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const baselineFile=path.join(out,'originais.sha256.json');
if(!await fs.access(baselineFile).then(()=>true,()=>false)){
  const baseline={};
  async function walk(dir){
    for(const e of await fs.readdir(dir,{withFileTypes:true})){
      const p=path.join(dir,e.name),relative=path.relative(base,p).replaceAll('\\','/');
      if(relative==='08-variantes'||relative==='index.html')continue;
      if(e.isDirectory())await walk(p);else baseline[relative]=hash(await fs.readFile(p));
    }
  }
  await walk(base);
  await fs.writeFile(baselineFile,JSON.stringify(baseline,null,2));
}

// Only paint values change. Original SVGs, path data, transforms and stop offsets stay intact.
const sourceStops={
  head:['#FF4146','#FF7403','#FF9507','#FFAB11'],
  body:['#FF990B','#FF960A','#FF7815'],
  tail:['#FFB00C','#FF9905','#FF8611','#FF6720'],
  tip:['#FFB311','#FFB920'],gold:['#FFCB26','#FFBA20']
};
const variants=[
  {id:'branca',label:'Branca',surface:'#343434',background:'#343434',flat:'#E3E3E3',mark:'#FFFFFF',nose:'#171717',
    gradients:{head:['#CACACA','#E6E6E6','#F1F1F1','#F6F6F6'],body:['#E8E8E8','#E3E3E3','#CFCFCF'],tail:['#E5E5E5','#DFDFDF','#D5D5D5','#C4C4C4'],tip:['#FFFFFF','#F8F8F8'],gold:['#FFFFFF','#ECECEC']}},
  {id:'preta',label:'Preta',surface:'#F1F1F1',background:'#F1F1F1',flat:'#575757',mark:'#8A8A8A',nose:'#080808',
    gradients:{head:['#262626','#404040','#575757','#626262'],body:['#3B3B3B','#333333','#1F1F1F'],tail:['#505050','#3B3B3B','#2B2B2B','#1B1B1B'],tip:['#919191','#7D7D7D'],gold:['#8B8B8B','#6B6B6B']}}
];
const specs=[
  ['full-character','04-sistema/full-character',2200,'Personagem completo'],
  ['head-mark','04-sistema/head-mark',1400,'Rosto'],
  ['brand-symbol','04-sistema/brand-symbol',1024,'Símbolo'],
  ['full-character-solid','03-mestre/raposa-solid',2200,'Personagem em cores sólidas'],
  ['cauda','03-mestre/cauda',1200,'Cauda'],
  ['avatar','04-sistema/avatar',1024,'Avatar'],
  ['app-icon','04-sistema/app-icon',1024,'Ícone de aplicativo'],
  ...expressions.map(([k,l])=>['expressoes/'+k,'06-expressoes/'+k,900,l]),
  ...[16,24,32,48,64,128,256].map(n=>['icones/simbolo-'+n,'04-sistema/icones/simbolo-'+n,n,'Símbolo '+n+' px'])
];
function recolor(input,v){
  const colors={'#FF8B08':v.flat,'#FFC326':v.mark,'#2B0B49':v.nose,'#FFF8EE':v.background,'#000000':'#000000','#FFFFFF':'#FFFFFF'};
  for(const [kind,stops] of Object.entries(sourceStops))stops.forEach((hex,i)=>colors[hex]=v.gradients[kind][i]);
  return input.replace(/<title([^>]*)>([\s\S]*?)<\/title>/,(_,attrs,t)=>`<title${attrs}>${t} — ${v.label.toLowerCase()}</title>`)
    .replace(/#[\da-fA-F]{6}\b/g,hex=>colors[hex.toUpperCase()]||hex)
    .replace(/(<rect\b[^>]*\bfill=")[^"]+("[^>]*\/?>)/,(_,a,b)=>a+v.background+b);
}
const manifest={date:'2026-09-13',scope:'Duas versões cromáticas da matriz existente; somente valores de cor alterados.',variants:[]};
for(const v of variants){
  const assets=[];
  for(const [name,source,width,label] of specs){
    const input=await fs.readFile(path.join(base,source+'.svg'),'utf8'),art=recolor(input,v);
    const prefix=v.id+'/'+name,svg=prefix+'.svg',png=prefix+'.png';
    await fs.mkdir(path.dirname(path.join(out,svg)),{recursive:true});
    await fs.writeFile(path.join(out,svg),art);
    const rendered=await sharp(Buffer.from(art)).resize({width}).png().toBuffer();
    await fs.writeFile(path.join(out,png),rendered);
    const meta=await sharp(rendered).metadata();
    assets.push({name,label,source:source+'.svg',svg,png,width:meta.width,height:meta.height});
  }
  const sizes=[16,32,48],buffers=await Promise.all(sizes.map(n=>fs.readFile(path.join(out,v.id,`icones/simbolo-${n}.png`))));
  const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
  buffers.forEach((b,i)=>{const p=6+16*i;header[p]=sizes[i];header[p+1]=sizes[i];header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(b.length,p+8);header.writeUInt32LE(offset,p+12);offset+=b.length;});
  await fs.writeFile(path.join(out,v.id,'favicon.ico'),Buffer.concat([header,...buffers]));
  await fs.writeFile(path.join(out,v.id,'paleta.json'),JSON.stringify({name:v.label,gradients:v.gradients,flat:v.flat,mark:v.mark,eyes:'#000000',eyeHighlight:'#FFFFFF',nose:v.nose,applicationBackground:v.background},null,2));
  manifest.variants.push({id:v.id,label:v.label,assets});
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));

const embedded=async(source,prefix,x,y,w,h)=>{
  const svg=(await fs.readFile(source,'utf8')).replaceAll('m-',prefix+'-');
  return svg.replace('<svg ',`<svg x="${x}" y="${y}" `).replace(/width="[^"]+" height="[^"]+"/,`width="${w}" height="${h}"`);
};
let comparison='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1560 980" width="1560" height="980"><rect width="1560" height="980" fill="#FFF8EE"/><text x="50" y="66" font-family="Segoe UI, sans-serif" font-size="32" font-weight="700" fill="#2B0B49">A mesma raposa. Três paletas.</text><text x="50" y="103" font-family="Segoe UI, sans-serif" font-size="18" fill="#705E7B">Contornos, proporções e expressão preservados.</text>';
for(const [i,[id,label,bg,ink]] of [['original','Laranja · original','#F9F0E3','#2B0B49'],['branca','Branca','#343434','#FFFFFF'],['preta','Preta','#F1F1F1','#171717']].entries()){
  const x=40+i*510,dir=id==='original'?path.join(base,'04-sistema'):path.join(out,id);
  comparison+=`<rect x="${x}" y="142" width="490" height="790" rx="22" fill="${bg}"/><text x="${x+25}" y="185" fill="${ink}" font-family="Segoe UI,sans-serif" font-size="22" font-weight="600">${label}</text>`;
  comparison+=await embedded(path.join(dir,'full-character.svg'),id+'-full',x+24,210,440,465);
  comparison+=await embedded(path.join(dir,'head-mark.svg'),id+'-head',x+40,720,200,180);
  comparison+=await embedded(path.join(dir,'brand-symbol.svg'),id+'-symbol',x+320,752,105,105);
}
comparison+='</svg>';
await fs.writeFile(path.join(out,'comparacao.svg'),comparison);
await sharp(Buffer.from(comparison)).png().toFile(path.join(out,'comparacao.png'));

const previewNames=[['full-character','Personagem'],['head-mark','Rosto'],['brand-symbol','Símbolo'],['full-character-solid','Cores sólidas'],['cauda','Cauda'],['avatar','Avatar'],['app-icon','App icon']];
const downloadCard=(v,name,label)=>`<article class="asset"><div class="art ${v.id}"><img loading="lazy" src="${v.id}/${name}.svg" alt="Raposa ${v.id}: ${label}"></div><div class="caption"><h3>${label}</h3><span><a download href="${v.id}/${name}.svg">SVG</a> <a download href="${v.id}/${name}.png">PNG</a></span></div></article>`;
const originalFiles={full:'../04-sistema/full-character',head:'../04-sistema/head-mark',symbol:'../04-sistema/brand-symbol'};
const compareCards=[{id:'laranja',label:'Laranja · original',file:originalFiles.full},...variants.map(v=>({...v,file:v.id+'/full-character'}))].map(v=>`<article class="compare-card"><div class="art ${v.id}"><img id="preview-${v.id}" src="${v.file}.svg" alt="Raposa ${v.id}"></div><div class="caption"><h2>${v.label}</h2><span><a id="svg-${v.id}" download href="${v.file}.svg">SVG</a> <a id="png-${v.id}" download href="${v.file}.png">PNG</a></span></div></article>`).join('');
const css=`:root{color-scheme:light;--paper:#fff8ee;--ink:#2b0b49;--muted:#705e7b;--line:#e7dcd8}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:'Segoe UI',sans-serif}a{color:inherit;text-underline-offset:4px}button,a{touch-action:manipulation}a:focus-visible,button:focus-visible{outline:3px solid #9755c3;outline-offset:4px}header,main,footer{width:min(1400px,90%);margin:auto}header{padding:30px 0 35px}.back{font-size:14px}.eyebrow{margin:38px 0 12px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}h1{font-size:clamp(36px,4vw,58px);letter-spacing:-1.8px;margin:0 0 15px}p{color:var(--muted);line-height:1.6;max-width:800px}h2{font-size:25px;letter-spacing:-.5px;margin:0 0 10px}h3{font-size:14px;margin:0}.controls{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;margin-bottom:24px}.button-row{display:flex;gap:8px;flex-wrap:wrap}button,.button{font:inherit;font-size:13px;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:22px;padding:10px 16px;cursor:pointer;text-decoration:none;display:inline-block}button[aria-pressed=true],.primary{background:var(--ink);color:var(--paper);border-color:var(--ink)}.compare,.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}.art{display:flex;align-items:center;justify-content:center;height:350px;border-radius:18px;padding:20px;background:#f9f0e3}.art.branca{background:#343434}.art.preta{background:#f1f1f1}.art img{width:100%;height:100%;object-fit:contain}.caption{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:16px 0}.caption h2{font-size:18px;margin:0}.caption span{display:flex;gap:10px;font-size:13px;white-space:nowrap}.note{font-size:14px;margin-top:22px}.downloads{display:flex;flex-wrap:wrap;gap:12px;margin:25px 0 12px}.collection{border-top:1px solid var(--line);margin-top:55px;padding-top:42px}.grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}.grid .art{height:235px}.subheading{font-size:20px;margin:38px 0 20px}.native-icons{display:flex;gap:24px;flex-wrap:wrap}.native{font-size:12px;text-align:center}.native div{width:92px;height:92px;display:grid;place-items:center;border-radius:14px;background:#f1f1f1}.branca-icons .native div{background:#343434}.native p{margin:8px 0}.swatches{display:flex;flex-wrap:wrap;gap:10px;margin:25px 0}.swatch{font-size:12px;color:var(--muted)}.swatch i{display:block;width:85px;height:42px;background:var(--swatch);border-radius:8px;border:1px solid #aaa;margin-bottom:8px}.usage{padding:28px;background:#f5e9d9;border-radius:18px;margin-top:50px}.usage p{margin:8px 0}.usage ul{padding-left:22px;line-height:1.8;font-size:14px}footer{padding:40px 0;font-size:12px;color:var(--muted)}[data-surface=dark] .compare .art{background:#343434}[data-surface=light] .compare .art{background:#f1f1f1}[data-surface=alpha] .compare .art{background-color:#ddd;background-image:conic-gradient(#f5f5f5 25%,#ddd 0 50%,#f5f5f5 0 75%,#ddd 0);background-size:20px 20px}@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.compare .art{height:270px}.caption{align-items:flex-start}.compare{gap:16px}}@media(max-width:620px){header,main,footer{width:90%}.compare{grid-template-columns:1fr}.compare .art{height:330px}.grid{gap:18px 14px}.grid .art{height:185px;padding:12px}.grid .caption{flex-direction:column;gap:8px}.controls{margin-top:8px}h1{letter-spacing:-1px}}`;
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Raposa — branca e preta</title><link rel="icon" href="preta/favicon.ico"><style>${css}</style></head><body data-surface="recommended"><header><a class="back" href="../index.html#cores">← Voltar ao guia da identidade</a><div class="eyebrow">Variações de cor · 13/09/2026</div><h1>A mesma raposa.<br>Branca e preta.</h1><p>O desenho original em duas novas paletas. A forma do rosto, os olhos, a cauda e as proporções permanecem iguais.</p></header><main><div class="controls"><div class="button-row" aria-label="Representação">${[['full','Personagem'],['head','Rosto'],['symbol','Símbolo']].map(([id,label])=>`<button data-view="${id}" aria-pressed="${id==='full'}">${label}</button>`).join('')}</div><div class="button-row" aria-label="Fundo de visualização">${[['recommended','Fundos sugeridos'],['light','Claro'],['dark','Escuro'],['alpha','Transparência']].map(([id,label])=>`<button data-surface="${id}" aria-pressed="${id==='recommended'}">${label}</button>`).join('')}</div></div><div class="compare">${compareCards}</div><p class="note">Os fundos pertencem à visualização. Personagem, rosto e símbolo são entregues com transparência.</p><div class="downloads"><a class="button primary" download href="../../raposa-branca-e-preta.zip">Baixar as duas versões · ZIP</a><a class="button" download href="comparacao.png">Baixar comparação</a><a class="button" href="LEIA-ME.md">Orientações de uso</a></div>${variants.map(v=>`<section class="collection" id="${v.id}"><h2>Raposa ${v.id}</h2><p>${v.id==='branca'?'Brancos e cinzas suaves, com marcações claras e olhos pretos. Use preferencialmente sobre fundos médios ou escuros.':'Preto, carvão e grafite, com marcações em cinza para preservar a leitura. Use preferencialmente sobre fundos claros.'}</p><div class="swatches">${[...new Set([v.gradients.head[0],v.gradients.body[1],v.gradients.gold[0],v.gradients.tip[0],v.nose])].map(c=>`<span class="swatch"><i style="--swatch:${c}"></i>${c}</span>`).join('')}</div><div class="grid">${previewNames.map(([name,l])=>downloadCard(v,name,l)).join('')}</div><h3 class="subheading">As mesmas oito expressões</h3><div class="grid">${expressions.map(([name,l])=>downloadCard(v,'expressoes/'+name,l)).join('')}</div><h3 class="subheading">Ícones em tamanho real</h3><div class="native-icons ${v.id}-icons">${[16,24,32,48,64].map(n=>`<div class="native"><div><img src="${v.id}/icones/simbolo-${n}.png" width="${n}" height="${n}" alt="Raposa ${v.id}, ${n} pixels"></div><p>${n} × ${n}</p><a download href="${v.id}/icones/simbolo-${n}.png">PNG</a></div>`).join('')}</div><div class="downloads"><a class="button" download href="${v.id}/favicon.ico">Favicon ICO</a><a class="button" download href="${v.id}/paleta.json">Paleta</a></div></section>`).join('')}<aside class="usage"><h2>Prontas para usar</h2><ul><li>SVG: vetor editável, para ampliar e aplicar em layouts.</li><li>PNG: personagem com 2.200 px de largura, rosto com 1.400 px e símbolo com 1.024 px.</li><li>Use o símbolo em aplicações pequenas. O pacote inclui 16, 24, 32, 48, 64, 128 e 256 px.</li><li>Avatar e app icon incluem uma base de contraste; os demais desenhos têm fundo transparente.</li><li>A branca conserva suas sombras; a preta conserva tons de grafite. Preserve essas diferenças ao aplicar.</li></ul><p>As matrizes laranja e os estudos anteriores permanecem disponíveis no guia original.</p></aside></main><footer>Mesma matriz vetorial. Variações exclusivamente cromáticas.</footer><script>const paths={laranja:${JSON.stringify(originalFiles)},branca:{full:'branca/full-character',head:'branca/head-mark',symbol:'branca/brand-symbol'},preta:{full:'preta/full-character',head:'preta/head-mark',symbol:'preta/brand-symbol'}};document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{for(const [id,options] of Object.entries(paths)){const p=options[b.dataset.view];document.getElementById('preview-'+id).src=p+'.svg';document.getElementById('svg-'+id).href=p+'.svg';document.getElementById('png-'+id).href=p+'.png'}document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));document.querySelectorAll('button[data-surface]').forEach(b=>b.addEventListener('click',()=>{document.body.dataset.surface=b.dataset.surface;document.querySelectorAll('button[data-surface]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));</script></body></html>`;
await fs.writeFile(path.join(out,'index.html'),html);
await fs.writeFile(path.join(out,'LEIA-ME.md'),`# Raposa branca e preta\n\n13/09/2026. Duas versões cromáticas do full character atual.\n\nA matriz laranja permanece intacta. Foram substituídas apenas as cores: os caminhos, elipses, transformações, enquadramentos, camadas e posições dos gradientes permanecem iguais aos arquivos de origem. A correção do corpo não faz parte desta entrega.\n\n## Arquivos\n\nCada pasta (branca e preta) inclui 22 SVGs e 22 PNGs: personagem completo, rosto, símbolo, personagem em cores sólidas, cauda, avatar, app icon, oito expressões existentes e sete tamanhos de ícone. Há também um favicon ICO (16/32/48 px) e uma paleta JSON por cor.\n\n- Personagem: PNG de 2200 px de largura.\n- Rosto: PNG de 1400 px de largura.\n- Símbolo: PNG de 1024 px, mais ícones nativos de 16 a 256 px.\n- SVGs: editáveis e escaláveis, sem imagens embutidas.\n- PNGs: fundo transparente; avatar e app icon possuem uma base de contraste que faz parte dessas aplicações.\n\n## Uso\n\nA branca funciona melhor sobre fundos médios ou escuros. A preta funciona melhor sobre fundos claros. A máscara, o peito e a ponta da cauda usam tons distintos para conservar os detalhes; não substitua todas as áreas por uma única tinta se quiser essa versão completa. Use o símbolo nos tamanhos pequenos; rosto a partir de 64 px e personagem preferencialmente a partir de 120 px.\n\nAbra index.html para comparar personagem, rosto e símbolo, trocar o fundo e baixar cada arquivo. comparacao.png e comparacao.svg são pranchas de apresentação com fundo. As artes individuais estão nas pastas branca e preta.\n\n## Preservação\n\nmanifest.json relaciona cada derivação ao SVG de origem. originais.sha256.json registra os arquivos preexistentes antes desta adição. verificacao.json registra a comparação de geometria, transparência e integridade. Nenhuma nova pose foi criada e nenhum plugin foi instalado.\n`);
console.log(JSON.stringify({out,variants:manifest.variants.map(v=>({id:v.id,assets:v.assets.length})),originalFilesUntouched:true}));
