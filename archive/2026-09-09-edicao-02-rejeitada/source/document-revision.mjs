import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'output/identidade-raposa');
const qa=JSON.parse(await fs.readFile(path.join(out,'validacao/verificacao-tecnica.json'),'utf8'));
if(qa.failures.length)throw new Error('Corrigir a verificação antes de documentar a revisão.');
const files={
'LEIA-ME.md':`# Identidade da raposa - edição 02

Revisão de 09/09/2026. Abra index.html para consultar e baixar os arquivos. O manual PDF acompanha esta edição.

## O que mudou

- Olhos pretos (#000000), com o mesmo formato e brilho branco. O nariz permanece no roxo original.
- Os gestos humanos e os símbolos das antigas poses de produto foram retirados do conjunto ativo.
- Dez posturas: sentada, em pé, caminhando, farejando o chão, espreguiçando-se, agachada, deitada, dormindo enroscada, saltando e olhando para trás.
- Frontal, lateral e traseira refeitas. A traseira representa efetivamente a nuca e a garupa; o perfil é reutilizado ao farejar e olhar para trás.
- Ligação da cauda reforçada sob a coxa do mestre. Nas novas posturas, a raiz da cauda se sobrepõe ao corpo e acompanha sua orientação.
- Sono com corpo arredondado, cabeça baixa, olhos fechados visíveis e cauda envolvendo o conjunto.

## Arquivos

São 52 SVGs e 52 PNGs, incluindo variantes, vistas, expressões, poses, ícones em sete tamanhos e pranchas. Há também favicon ICO com 16/32/48 pixels, galeria, manual e regras de uso. O total não significa 52 personagens diferentes.

03-mestre contém a matriz, cabeça, cauda, variantes e fundos. 04-sistema contém símbolos, avatar, ícone de aplicativo e favicons. 05-construcao contém quatro vistas. 06-expressoes contém oito expressões. 07-poses contém dez posturas naturais.

Use SVG para ampliar e editar. Use PNG para inserção direta; os personagens isolados têm transparência. Em 16-32 pixels, use o símbolo reduzido. A cabeça completa é recomendada a partir de 64 pixels, e o corpo a partir de 120 pixels.

## Preservação

O PNG aprovado permanece inalterado em referencias/modelo-aprovado.png. O contorno da cabeça e a máscara da matriz vetorial permanecem exatamente iguais aos da edição anterior. A mudança de cor dos olhos e os ajustes anatômicos atendem ao pedido de 09/09.

O perfil é uma construção complementar coerente com a matriz; não é uma vista original previamente aprovada. As poses reutilizam o rosto principal ou esse perfil. A vetorização continua contendo pequenas diferenças em relação ao PNG original. Nenhuma medida técnica comprova identidade visual perfeita.

O pedido atual substitui as antigas poses com ações de interface do briefing histórico. A edição anterior está guardada fora do pacote ativo, em archive/2026-09-07-edicao-01 no projeto, para permitir comparação ou reversão. Não use essa cópia como biblioteca vigente.

As imagens de caminhada e salto são estáticas. Não foi produzida uma animação ou articulação para animar nesta revisão. A fonte vetorial editável permanece no diretório source do projeto.

Nenhum plugin novo foi instalado. REGRAS-DA-IDENTIDADE.md e validacao/RELATORIO.md detalham decisões e verificações.
`,
'REGRAS-DA-IDENTIDADE.md':`# Regras da identidade - edição 02

## Reconhecimento

1. Cabeça larga, orelhas altas com pontas suaves, sem desenho interno. Manter a assimetria da vista principal.
2. Olhos ovais pequenos, pretos (#000000), com um brilho branco mínimo. Nariz oval roxo (#2B0B49). Sem boca, sobrancelhas, cílios, bigodes, dentes, roupas ou mãos.
3. Máscara dourada contínua conectando focinho e bochechas, com poucos recortes suaves nas laterais.
4. Cauda ampla, curva, com ponta dourada e raiz integrada à garupa. A posição acompanha a postura; não flutua ao lado do corpo.
5. Patas lisas e coxas arredondadas. Mancha dourada em gota no peito, encurtada ou oculta pela perspectiva quando necessário.

## Matriz principal

Espaço de construção herdado da prancha de 1536 x 1024. Exportação do mestre: 60 55 940 930.

- Olho esquerdo: centro (627,347), raios (20,31).
- Olho direito: centro (774,325), raios (19,31).
- Nariz: centro (701,393), raios (20,13).
- Inclinação dos olhos: -9 graus.
- Os caminhos da cabeça e da máscara são os mesmos da edição 01.
- A raiz da cauda foi alargada na área encoberta pelo corpo para evitar uma ligação frágil.

## Postura e comportamento

A biblioteca usa ações corporais de uma raposa: apoio sobre quatro patas, passos, farejo, alongamento, repouso e salto. Não usar patas como braços que apontam, seguram objetos, apresentam gráficos ou celebram como mãos humanas. Não criar uma nova pose apenas trocando um símbolo ao lado.

O alongamento abaixa o peito e estende as patas dianteiras mantendo a garupa elevada. O farejo aproxima o focinho do chão. Dormir reúne corpo, cabeça e cauda numa massa compacta. As patas mais distantes usam laranja mais escuro para indicar profundidade; nunca transformar patas em mãos.

Cauda e cabeça se conectam ao corpo também na silhueta. A análise de conexão verifica lacunas geométricas, mas não substitui o julgamento visual da anatomia.

## Vistas e expressões

Frontal: olhos e nariz alinhados, duas coxas e patas dianteiras apoiadas. Lateral: focinho projetado e apenas um olho visível. Traseira: nuca e garupa, sem olho, nariz ou mancha do peito.

As oito expressões mantêm o rosto principal. As poses de farejar e olhar para trás reutilizam o perfil. Não esticar horizontalmente a cabeça para simular perspectiva. Inclinar ou espelhar a vista apropriada como um conjunto.

## Cor e redução

| Função | Cor |
| --- | --- |
| Laranja principal | #FF8B08 |
| Dourado | #FFC326 |
| Coral de apoio | #FF5936 |
| Roxo de apoio e nariz | #2B0B49 |
| Olhos | #000000 |
| Fundo claro | #FFF8EE |
| Brilho dos olhos | #FFFFFF |

Os gradientes quentes permanecem nos SVGs. As patas distantes usam #E77C10 como sombra do laranja. Na versão deliberadamente monocromática, todos os elementos usam a tinta escolhida ou vazados; isso não altera a regra de olhos pretos nas versões coloridas.

Em 16-32 pixels, usar o símbolo sem gradientes e sem brilho. Preservar proporção e uma margem mínima equivalente à largura de um olho. A reversa branca é destinada a fundos escuros. A cauda isolada é um elemento de apoio; nas poses completas ela nunca deve ficar desconectada.
`,
'validacao/RELATORIO.md':`# Revisão da entrega - 09/09/2026

## Correção da edição anterior

A avaliação de 07/09 foi insuficiente para a anatomia das novas vistas e para a variedade das poses. O usuário identificou repetição da pose sentada com objetos diferentes, patas usadas como braços, cauda aparentemente separada e problemas nas vistas e no repouso. A edição 02 substitui esse conjunto conforme o pedido atual.

## Mudanças verificadas

Olhos pretos em todas as versões coloridas, sem mudança dos contornos do rosto principal. Dez poses corporais sem objetos auxiliares. Frontal, lateral e traseira reconstruídas; perfil reutilizado nas ações que exigem olhar lateral. Cauda com conexão sobreposta ao corpo. Sono com a cabeça acomodada dentro do conjunto e dois olhos fechados legíveis.

## Evidência técnica

- ${qa.vectorFiles} SVGs sem raster embutido ou dependências remotas e ${qa.pngFiles} PNGs.
- Oito expressões, dez posturas e quatro vistas.
- Dimensões reais de 16/24/32 pixels e ICO com três resoluções.
- Margens verificadas: nenhum personagem isolado toca a borda da exportação.
- Quatorze silhuetas verificadas, incluindo mestre, vistas e poses: todas formam um único componente conectado relevante. Isso detecta partes soltas, não certifica naturalidade por si só.
- Contorno da cabeça e máscara do mestre comparados com a edição arquivada: idênticos.
- Poses antigas ausentes do diretório ativo; novas poses usam a cabeça principal ou o perfil revisado.
- PNG aprovado preservado; SHA-256: ${qa.sourceSha256}.

verificacao-tecnica.json registra os resultados por arquivo. A galeria e o manual devem ser conferidos visualmente após cada nova geração.

## Sete critérios do briefing

| Critério | Avaliação |
| --- | --- |
| 16 pixels | Símbolo reduzido sem gradientes e brilhos; olhos pretos nas cores sólidas. |
| Preto e branco | Variantes preta, reversa branca e uma cor com vazados preservadas. |
| Silhueta | Contorno da matriz e conexão das partes conferidos. |
| Cabeça isolada | Mesma matriz no head mark, avatar e ícone de aplicativo. |
| Cauda isolada | Curva e ponta características preservadas; a raiz foi reforçada. |
| Referências | A linguagem facial continua próxima das referências fornecidas. Não foi demonstrada exclusividade visual. |
| Qualidade | Poses revistas com mudança do corpo e seus apoios. A apreciação estética continua sujeita à revisão do usuário. |

## Limites

A sobreposição entre a silhueta do PNG aprovado e a matriz atual é ${qa.silhouetteComparison.intersectionOverUnion.toFixed(4)} no método registrado. Esse número não é uma porcentagem de identidade preservada. A identidade é estilizada: proporções de mascote e cauda grande permanecem intencionalmente, com comportamento corporal inspirado no animal.

Não há animação pronta. Caminhada e salto representam um instante. Os desenhos novos desta edição não devem ser descritos como aprovados pelo usuário antes de sua avaliação.
`
};
for(const[k,v]of Object.entries(files))await fs.writeFile(path.join(out,k),v);
await fs.writeFile(path.join(root,'CONTINUE_AQUI.md'),`# Identidade da raposa - continuar aqui

Estado vigente: edição 02, revisão de 09/09/2026. Abra output/identidade-raposa/index.html. Leia o LEIA-ME e validacao/RELATORIO antes de alterar ou afirmar aprovação final.

O usuário manteve a raposa simplificada aprovada e pediu olhos pretos, retirada completa de gestos humanos/objetos, poses naturais distintas, conexão da cauda e correção de sono e vistas. Essa orientação substitui as antigas ações de interface do briefing.

## Resultado atual

52 SVGs e 52 PNGs, oito expressões, dez poses corporais. Mestre com cabeça/máscara idênticas à edição 01, olhos pretos e raiz da cauda ampliada na sobreposição com o corpo. Novas vistas frontal, perfil e traseira. Sono enroscado, alongamento, farejo, caminhada, salto e outras posturas. Sem animação pronta; as novas formas aguardam avaliação estética do usuário.

## Fonte

- source/mascot.mjs: matriz principal, paleta, expressões e símbolos.
- source/natural-poses.mjs: vistas e posturas naturais, pontos de ligação e quadros de exportação.
- source/build-package.mjs: gerar os arquivos.
- source/build-guide.mjs: galeria, manual e conferência do navegador; --pdf exporta e verifica.
- source/verify-package.mjs: dimensões, margens, fonte preservada, conexões e retirada das poses antigas.
- source/final_check.py: integridade do ZIP e links.

Preservar os caminhos da cabeça principal. O perfil é um segundo modelo compartilhado para direções laterais. O PNG original em output/mascote-raposa-v1/prancha-mascote.png não foi alterado. O refinamento 02 da fase 2 nunca foi escolhido explicitamente. A geração detalhada permanece rejeitada.

A edição anterior foi arquivada fora da biblioteca ativa em archive/2026-09-07-edicao-01. Não restaurar suas poses com braços e símbolos.
`);
console.log('Documentação da edição 02 atualizada.');
