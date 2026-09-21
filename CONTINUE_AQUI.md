# Raposa - estado vigente

Atualização de 13/09/2026: foco atual nas variantes branca e preta, por recoloração exata da matriz em `04-sistema/full-character.svg`. O usuário pediu manter tudo e deixar a correção do corpo de lado por agora. A análise anterior também rejeitou os estudos corporais da edição 03; eles continuam guardados, sem nova intervenção ou aprovação. Não usá-los como base de novas artes.

Novas entregas em `output/identidade-raposa/08-variantes`: 22 SVGs e 22 PNGs por cor, ICOs, paletas, comparação e galeria. A geometria dos SVGs e a transparência dos PNGs foram comparadas com suas fontes; arquivos originais são protegidos por hashes. A matriz laranja permanece intacta. O nariz foi recolorido em preto/grafite apenas nas novas variantes; olhos continuam pretos.

Para reproduzir as variantes: `source/build-color-variants.mjs`, `source/color-variant-gallery.mjs` (adição à galeria), `source/verify-color-variants.mjs`, `source/check-color-gallery.mjs` (galeria servida na porta 8768) e `source/pack-color-variants.py` (ZIP próprio, autocontido). Os scripts Node usam sharp/Playwright do runtime via NODE_PATH. O pacote antigo e seu manual foram preservados; o novo ZIP é `output/raposa-branca-e-preta.zip`.

## Histórico preservado da edição 03

Edição 03, correção corporal de 09/09/2026. Ler output/identidade-raposa/LEIA-ME.md e validacao/RELATORIO.md.

O usuário rejeitou a edição 02: corpo retangular, pernas rígidas e pés inadequados. Pediu desfazer e corrigir com os exemplos enviados. As dez poses e três vistas foram retiradas, com suas duas pranchas. Não restaurar as poses de apontar/segurar símbolos da edição 01.

Mantidos: matriz sentada, olhos pretos, símbolos, expressões e PNG aprovado. Três novos PNGs em output/identidade-raposa/estudos-corpo: em-pe, caminhando e farejando. São estudos com fundo claro produzidos por ImageGen, ainda não aprovados como matrizes vetoriais. A coleção e as vistas estão em reconstrução; não afirmar que todas as fases estão concluídas.

Fonte ativa: source/mascot.mjs, build-package.mjs (37 vetores), build-guide.mjs (galeria/manual), verify-package.mjs e final_check.py. A construção rejeitada saiu da fonte ativa e está em archive/2026-09-09-edicao-02-rejeitada. Prompts e referências estão no pacote atual.

O PNG original não foi alterado. O refinamento 02 nunca foi escolhido explicitamente. A geração detalhada permanece rejeitada. Para logo e animação, consolidar primeiro uma construção visual satisfatória, depois derivar e vetorizar.
