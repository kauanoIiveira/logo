import fs from 'node:fs/promises';
const u=new URL('./build-guide.mjs',import.meta.url);let s=await fs.readFile(u,'utf8');
for(const [a,b]of[
 ['edição 01','edição 02'],['poses de produto','poses naturais'],
 ['Olhos pequenos e roxos; nariz oval discreto.','Olhos pequenos e pretos; nariz oval discreto.'],
 ["'Presença no produto','Dez situações para ajudar a orientar o usuário, com comportamento animal simplificado. Os elementos de interface são ilustrações secundárias.'","'Posturas naturais','Sentar, caminhar, farejar, alongar e repousar. O corpo muda de postura, com cauda ligada à garupa e patas apoiadas ou recolhidas conforme o movimento.'"],
 ['A geometria da cabeça e da máscara é compartilhada pelas oito expressões e dez poses.','O rosto principal foi preservado nas oito expressões. As poses usam esse rosto ou o perfil revisado, conforme a direção da cabeça.'],
 ['As vistas novas e os gestos foram revisados em conjunto.','As vistas e as posturas foram revisadas em conjunto; as silhuetas foram conferidas para detectar partes desconectadas.'],
 ['Pronta para acompanhar seus projetos.','A identidade segue evoluindo.'],
 ['07/09/2026','09/09/2026'],['07 · Poses de produto','07 · Posturas naturais']
])s=s.replaceAll(a,b);
s=s.replace("${poses.map(([k,l])=>card('07-poses/'+k,l)).join('')}","${poses.map(([k,l])=>card('07-poses/'+k,l)).join('')}");
s=s.replace('<div class="grid four">${poses.map','<div class="grid">${poses.map');
s=s.replace('A identidade escolhida, consolidada em arquivos editáveis e uma biblioteca para acompanhar diferentes projetos.','A identidade escolhida, com olhos pretos e uma biblioteca de posturas naturais para acompanhar diferentes projetos.');
s=s.replace("<div class=\"grid\">${poses.map(([k,l])=>card('07-poses/'+k,l)).join('')}</div></section>","<div class=\"grid\">${poses.map(([k,l])=>card('07-poses/'+k,l)).join('')}</div><p class=\"note\">São desenhos estáticos de posturas diferentes. Caminhar e saltar representam momentos do movimento; a animação em sequência será uma etapa própria.</p></section>");
s=s.replace('A pose principal conserva a matriz aprovada. Frontal, perfil e traseira são vistas complementares construídas a partir dessa linguagem.','A pose principal conserva o rosto aprovado. A frontal tem os dois lados alinhados; o perfil projeta o focinho; a traseira mostra a nuca e a garupa.');
await fs.writeFile(u,s);
