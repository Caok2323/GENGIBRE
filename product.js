(() => {
  const store = window.GengibreStore;
  const detail = document.querySelector("#product-detail");
  if (!store || !detail) return;
  const id = new URLSearchParams(location.search).get("item");
  const product = store.products.find((item) => item.id === id) || store.products[0];
  document.title = `${product.name} — GENGIBRE`;
  detail.dataset.product = product.id;
  detail.innerHTML = `
    <div class="detail-gallery"><div class="detail-main-image"><img src="${product.image}" alt="${product.alt}" fetchpriority="high" /></div><p class="preview-note">Imagem conceitual da prévia. A foto final e as características da peça serão confirmadas antes da abertura da loja.</p></div>
    <div class="detail-copy">
      <nav class="breadcrumbs" aria-label="Você está aqui"><a href="index.html">Início</a><span>/</span><a href="colecao.html">Camisetas</a><span>/</span><span>${product.name}</span></nav>
      <p class="eyebrow">${product.label.toUpperCase()} / GENGIBRE</p>
      <div class="detail-title-row"><h1>${product.name}</h1><span>${store.money(product.price)}</span></div>
      <p class="detail-subtitle">${product.subtitle}</p>
      <p class="detail-description">${product.description}</p>
      <div class="detail-option"><div class="option-heading"><span>Cor</span><span class="color-name">${product.colors[0].name}</span></div><div class="detail-swatches">${product.colors.map((color, index) => `<button type="button" class="color-swatch ${index === 0 ? "is-selected" : ""}" style="background:${color.hex}" data-color="${color.name}" aria-label="Cor ${color.name}" aria-pressed="${index === 0}"></button>`).join("")}</div></div>
      <div class="detail-option"><div class="option-heading"><span>Tamanho</span><button class="size-guide-link" type="button" data-size-guide>Guia de tamanhos</button></div><div class="detail-sizes" role="group" aria-label="Escolha um tamanho">${["PP", "P", "M", "G", "GG"].map((size) => `<button type="button" class="size-button ${size === "M" ? "is-selected" : ""}" aria-pressed="${size === "M"}" data-size="${size}">${size}</button>`).join("")}</div></div>
      <button class="button button-dark add-detail-button" type="button" data-add="${product.id}">Adicionar à sacola <span aria-hidden="true">↗</span></button>
      <p class="detail-buy-note">Prévia sem cobrança: a sacola é demonstrativa e o checkout será ativado com a Nuvemshop.</p>
      <div class="detail-accordions"><details><summary>Caimento</summary><p>${product.fit}. Referência geral; a tabela com medidas reais será publicada antes da abertura da loja.</p></details><details><summary>Entrega e pagamento</summary><p>Frete, meios de pagamento e prazos serão definidos na Nuvemshop antes da abertura dos pedidos.</p></details><details><summary>Trocas e devoluções</summary><p>As condições serão publicadas junto com as informações finais da loja, antes de receber pedidos.</p></details></div>
    </div>
  `;
  document.querySelector("[data-size-guide]")?.addEventListener("click", () => document.querySelector("#size-guide")?.showModal());
})();
