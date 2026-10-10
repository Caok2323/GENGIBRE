# GENGIBRE

Vitrine estática em português para a primeira coleção de camisetas femininas.

## Prévia local

Abra `index.html` no navegador. O catálogo, os filtros, a busca, a seleção de cor/tamanho e a sacola funcionam sem instalar dependências. A sacola fica salva neste navegador.

## Antes de receber pedidos

O catálogo de `script.js` é demonstrativo. Atualize os nomes, fotos, descrições, cores e valores do array `products` com os dados reais da coleção. As imagens atuais são referências editoriais remotas do Unsplash.

A finalização está intencionalmente bloqueada. Quando a loja conectar à Nuvemshop, troque a ação `.checkout-button` em `script.js` pela integração de carrinho/checkout e remova o aviso de prévia em `index.html`. Defina também frete, políticas de troca, atendimento e formulário de novidades antes de abrir as vendas.

## Publicação

O projeto é composto por arquivos estáticos na raiz e não requer etapa de build. Com o repositório conectado à Vercel, um push na branch de produção deve iniciar o deploy automático. `index.html` é a página de entrada; `styles.css` contém o layout responsivo e `script.js` os dados e interações do catálogo.
