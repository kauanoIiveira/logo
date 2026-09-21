import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'output/identidade-raposa');
const documents={
'LEIA-ME.md':`# Identidade da raposa - correção corporal

Edição 03, 09/09/2026. Abra index.html para consultar o conjunto atual.

O usuário rejeitou a revisão anterior, especialmente as pernas. Dez poses, três vistas complementares e duas pranchas foram retiradas da biblioteca, do manual e do pacote. Não foram restauradas as antigas poses com gestos humanos ou símbolos.

A matriz principal sentada, seus símbolos e expressões permanecem. Os olhos pretos foram mantidos. O PNG originalmente aprovado não foi alterado.

## Novos estudos

Três PNGs em estudos-corpo: em pé, caminhando e farejando. Produzidos com ImageGen integrado usando a raposa aprovada como identidade e os exemplos do usuário como referência corporal. O foco é integrar peito e pescoço, curvar dorso e ventre e ligar coxa e patas com transições suaves. Os novos desenhos ainda não foram aprovados como matrizes finais.

## Formatos

- 37 SVGs da matriz e do sistema retidos, com 37 PNGs correspondentes.
- Três estudos corporais em PNG de 1536 x 1024, com fundo claro. Não são transparentes nem vetoriais.
- Favicon ICO, galeria, manual, referências e instruções da correção.

O conjunto não corresponde mais à entrega completa das fases 3-7 declarada anteriormente. A biblioteca de poses e as vistas complementares precisam ser reconstruídas a partir de uma base corporal satisfatória. Não há animação pronta.

A revisão rejeitada está em archive/2026-09-09-edicao-02-rejeitada no projeto, fora da biblioteca ativa. Não reutilizar seus desenhos. Use 03-mestre/raposa-mestre.svg como matriz sentada e estudos-corpo/*.png para avaliar a correção. PROMPTS.md registra as instruções. Nenhum plugin novo foi instalado.
`,
'REGRAS-DA-IDENTIDADE.md':`# Regras preservadas e correção corporal

A referência de identidade é a raposa simplificada grande à esquerda da prancha original. A primeira versão detalhada permanece rejeitada. Os novos estudos corporais não foram declarados aprovados.

## Matriz

Cabeça larga; orelhas altas de ponta suave, sem interior. Olhos ovais pequenos e pretos, com brilho branco mínimo. Nariz oval roxo. Máscara dourada contínua, mancha em gota no peito e cauda grande de ponta dourada. Não acrescentar boca, cílios, sobrancelhas, bigodes, roupa ou fios de pelo.

Laranja #FF8B08; dourado #FFC326; coral #FF5936; roxo #2B0B49; olhos #000000; fundo claro #FFF8EE. As versões de uma tinta usam os preenchimentos e vazados próprios da aplicação.

## Corpo em correção

Seguir a fluidez das referências: peito subindo para o pescoço, dorso e ventre contínuos, coxa integrada à pata traseira, patas dianteiras sob os ombros e terminações compactas. Não encaixar pernas em um tronco retangular. Não desenhar mãos ou gestos humanos. A cauda nasce na garupa.

Transformar o mesmo contorno da cabeça não basta para preservar a identidade quando o corpo está mal resolvido. Conferir o desenho inteiro antes de ampliar a coleção.

Os estudos PNG têm pequenas diferenças de contorno e expressão em relação à matriz; ainda não são vetores finais. Testes de transparência, conexão e dimensões não comprovam naturalidade ou qualidade estética.
`,
'validacao/RELATORIO.md':`# Registro da correção - edição 03

A edição 02 foi rejeitada. As verificações técnicas estavam corretas quanto a arquivos e conexões, mas não validavam a anatomia. Corpo retangular, pernas rígidas e pés inadequados não atendiam às referências.

## Retirada e correção

Retiradas dez poses, três vistas e duas pranchas. Preservados personagem sentado, símbolos e expressões. Mantidos olhos pretos. A edição rejeitada foi arquivada fora do conjunto ativo.

Gerados três estudos com ImageGen integrado: base em pé, caminhada e farejo. O primeiro estudo precisou de correção específica para olhos pretos; a saída com olhos roxos não foi incluída. As ações foram derivadas da base corrigida.

As imagens usam transições curvas entre peito, dorso, ventre, coxa e patas. A caminhada usa um passo moderado; o farejo abaixa cabeça e pescoço. Há alterações de perspectiva e pequenos detalhes. Os estudos não são identidade final, aprovação do usuário ou reprodução perfeita.

## Formatos e verificações

37 SVGs nativos e seus PNGs; três novos PNGs de estudo com fundo claro. Não foi criado um contêiner SVG para simular vetorização das novas imagens.

verificacao-tecnica.json registra dimensões, margens, preservação do mestre e do original e ausência dos desenhos retirados. Galeria, manual e ZIP refletem esse estado. A biblioteca de poses e as vistas complementares estão em reconstrução.
`
};
for(const[k,v]of Object.entries(documents))await fs.writeFile(path.join(out,k),v);
await fs.writeFile(path.join(root,'CONTINUE_AQUI.md'),`# Raposa - estado vigente

Edição 03, correção corporal de 09/09/2026. Ler output/identidade-raposa/LEIA-ME.md e validacao/RELATORIO.md.

O usuário rejeitou a edição 02: corpo retangular, pernas rígidas e pés inadequados. Pediu desfazer e corrigir com os exemplos enviados. As dez poses e três vistas foram retiradas, com suas duas pranchas. Não restaurar as poses de apontar/segurar símbolos da edição 01.

Mantidos: matriz sentada, olhos pretos, símbolos, expressões e PNG aprovado. Três novos PNGs em output/identidade-raposa/estudos-corpo: em-pe, caminhando e farejando. São estudos com fundo claro produzidos por ImageGen, ainda não aprovados como matrizes vetoriais. A coleção e as vistas estão em reconstrução; não afirmar que todas as fases estão concluídas.

Fonte ativa: source/mascot.mjs, build-package.mjs (37 vetores), build-guide.mjs (galeria/manual), verify-package.mjs e final_check.py. A construção rejeitada saiu da fonte ativa e está em archive/2026-09-09-edicao-02-rejeitada. Prompts e referências estão no pacote atual.

O PNG original não foi alterado. O refinamento 02 nunca foi escolhido explicitamente. A geração detalhada permanece rejeitada. Para logo e animação, consolidar primeiro uma construção visual satisfatória, depois derivar e vetorizar.
`);
console.log('Estado e documentação corrigidos.');
