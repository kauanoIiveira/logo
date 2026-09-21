import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export function withColorVariants(html){
  const begin='<!-- color-variants:start -->',end='<!-- color-variants:end -->';
  const card=(id,label,bg)=>`<article class="asset"><div class="art" style="background:${bg}"><img loading="lazy" src="${id==='original'?'04-sistema':'08-variantes/'+id}/full-character.svg" alt="Raposa ${label}"></div><div class="caption"><h3>${label}</h3><div><a download href="${id==='original'?'04-sistema':'08-variantes/'+id}/full-character.svg">SVG</a><a download href="${id==='original'?'04-sistema':'08-variantes/'+id}/full-character.png">PNG</a></div></div></article>`;
  const section=`${begin}<section id="cores"><div class="section-heading"><span>08</span><div><h2>Branca e preta</h2><p>A mesma raposa em duas novas paletas. Rosto, contornos, proporções e expressão preservados.</p></div></div><div class="grid">${card('original','Laranja · original','#f9f0e3')}${card('branca','Branca','#343434')}${card('preta','Preta','#f1f1f1')}</div><p class="note">As novas versões mantêm os detalhes do rosto, do peito e da cauda. Os desenhos individuais têm transparência; os fundos acima servem para visualização.</p><div class="actions"><a class="button primary" href="08-variantes/index.html">Explorar versões, rostos e símbolos</a><a class="button" download href="../raposa-branca-e-preta.zip">Baixar versões branca e preta · ZIP</a></div></section>${end}`;
  if(html.includes(begin))html=html.slice(0,html.indexOf(begin))+section+html.slice(html.indexOf(end)+end.length);
  else html=html.replace('<section id="mestre">',section+'\n<section id="mestre">');
  if(!html.includes('href="#cores"'))html=html.replace('<div class="navlinks">','<div class="navlinks"><a href="#cores">Cores</a>');
  return html;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const target=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../output/identidade-raposa/index.html');
  await fs.writeFile(target,withColorVariants(await fs.readFile(target,'utf8')));
  console.log('Seção de cores adicionada ao guia; seções existentes preservadas.');
}
