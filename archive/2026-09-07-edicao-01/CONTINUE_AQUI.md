# Identidade da raposa — ponto de entrada

Abra `output/identidade-raposa/index.html` para a galeria completa.

## Estado

O usuário escolheu a raposa simplificada da prancha inicial, rejeitou a primeira versão detalhada e depois autorizou concluir as fases do briefing. A fase 2 gerou quatro refinamentos; 02 foi recomendada, mas não escolhida explicitamente. A continuidade preservou o modelo anteriormente aprovado.

As entregas das fases 3–7 estão em `output/identidade-raposa/`: matriz vetorial, variantes, sistema de símbolos/ícones, quatro vistas, oito expressões, dez poses, pranchas e manual. Leia `LEIA-ME.md` e `validacao/RELATORIO.md` antes de afirmar finalização, perfeição geométrica ou exclusividade.

O briefing original completo está copiado em `output/identidade-raposa/referencias/briefing-original.txt`. A fonte aprovada permanece em `output/mascote-raposa-v1/prancha-mascote.png`.

## Fonte editável

`source/mascot.mjs` contém os caminhos vetoriais e funções de composição. `source/build-package.mjs` exporta os arquivos; `source/build-guide.mjs` cria galeria e manual; `source/verify-package.mjs` verifica dimensões, transparência, margens e invariantes.

As curvas da cabeça e da máscara são compartilhadas nas expressões/poses. Não redesenhar a identidade em cada arquivo. As vistas lateral/traseira são construções complementares. O PNG original nunca deve ser substituído silenciosamente.
