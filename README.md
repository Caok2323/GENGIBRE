# GENGIBRE

Vitrine estática em português para a primeira coleção de camisetas femininas, com páginas de coleção, produto, marca, dúvidas e inspiração em vídeo.

## Prévia local

Abra `index.html` no navegador. Catálogo, filtros, busca, páginas de produto, seleção de cor/tamanho e sacola funcionam sem instalar dependências. A sacola fica salva neste navegador.

## Antes de receber pedidos

O catálogo de `catalog.js` é demonstrativo. Atualize os nomes, fotos, descrições, cores e valores do array `window.GENGIBRE_PRODUCTS` com os dados reais da coleção. As fotos de campanha em `assets/` são imagens conceituais geradas para a prévia, não fotos dos produtos reais. Os arquivos `assets/gengibre-wordmark.jpeg` e `assets/gengibre-flower.jpeg` contêm as versões do logo fornecidas pela marca.

A página `videos.html` usa vídeos verticais demonstrativos do Pexels, com crédito e link para cada criador. Eles não são UGC, clientes ou depoimentos; substituir por conteúdo de clientes somente com autorização de uso.

A finalização está intencionalmente bloqueada. Quando a loja conectar à Nuvemshop, substitua a ação `.checkout-button` em `store.js` pela integração de carrinho/checkout e atualize os avisos de prévia em todas as páginas. Defina também frete, políticas de troca, atendimento, medidas reais das peças e formulário de novidades antes de abrir as vendas.

## Publicação

O projeto é composto por arquivos estáticos na raiz e não requer etapa de build. Com o repositório conectado à Vercel, um push na branch de produção deve iniciar o deploy automático. `index.html` é a página de entrada; `styles.css` contém o layout responsivo; `catalog.js` define os produtos demonstrativos; `store.js` controla a sacola e navegação; `script.js` desenha a coleção; `product.js` exibe o produto selecionado.
