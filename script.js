(() => {
  const store = window.GengibreStore;
  const grid = document.querySelector("#product-grid");
  if (!store || !grid) return;

  const money = store.money;
  let activeFilter = "all";
  let searchTerm = new URLSearchParams(location.search).get("busca") || "";
  let sortMode = 0;
  const input = document.querySelector("#search-input");
  if (input) input.value = searchTerm;

  function getVisibleProducts() {
    let visible = store.products.filter((product) => {
      const matchesFilter = activeFilter === "all" || product.category === activeFilter;
      const haystack = `${product.name} ${product.subtitle} ${product.colors.map((color) => color.name).join(" ")}`.toLocaleLowerCase("pt-BR");
      return matchesFilter && haystack.includes(searchTerm.trim().toLocaleLowerCase("pt-BR"));
    });
    if (sortMode === 1) visible = [...visible].sort((a, b) => a.price - b.price);
    if (sortMode === 2) visible = [...visible].sort((a, b) => b.price - a.price);
    return visible;
  }

  function renderProducts() {
    const visible = getVisibleProducts();
    grid.innerHTML = visible.map((product) => `
      <article class="product-card" data-product="${product.id}">
        <div class="product-image">
          <a href="produto.html?item=${product.id}" aria-label="Ver ${product.name}"><img src="${product.image}" alt="${product.alt}" loading="lazy" /></a>
          <span class="product-label">${product.label}</span>
          <button class="favorite-button" type="button" aria-label="Adicionar ${product.name} aos favoritos" aria-pressed="false">♡</button>
        </div>
        <div class="product-info">
          <div class="product-title-row"><h3 class="product-title"><a href="produto.html?item=${product.id}">${product.name}</a></h3><span class="product-price">${money(product.price)}</span></div>
          <p class="product-subtitle">${product.subtitle}</p>
          <div class="product-colors" aria-label="Cores disponíveis para ${product.name}">
            ${product.colors.map((color, index) => `<button type="button" class="color-swatch ${index === 0 ? "is-selected" : ""}" style="background:${color.hex}" data-color="${color.name}" aria-label="Cor ${color.name}" aria-pressed="${index === 0}"></button>`).join("")}
            <span class="color-name">${product.colors[0].name}</span>
          </div>
          <div class="product-bottom">
            <div class="sizes" role="group" aria-label="Tamanho para ${product.name}">
              ${["PP", "P", "M", "G", "GG"].map((size) => `<button type="button" class="size-button ${size === "M" ? "is-selected" : ""}" aria-pressed="${size === "M"}" data-size="${size}">${size}</button>`).join("")}
            </div>
            <button class="quick-add" type="button" data-add="${product.id}">Adicionar <span aria-hidden="true">+</span></button>
          </div>
        </div>
      </article>
    `).join("");
    const noResults = document.querySelector(".no-results");
    if (noResults) noResults.hidden = visible.length !== 0;
  }

  document.querySelectorAll(".filter-tab").forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("is-active", tab === button));
    renderProducts();
  }));
  document.querySelector(".sort-button")?.addEventListener("click", (event) => {
    sortMode = (sortMode + 1) % 3;
    event.currentTarget.innerHTML = ["Em destaque", "Menor preço", "Maior preço"][sortMode] + ' <span aria-hidden="true">⌄</span>';
    renderProducts();
  });
  input?.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    renderProducts();
  });
  document.querySelector(".search-close")?.addEventListener("click", () => {
    if (!input) return;
    input.value = "";
    searchTerm = "";
    renderProducts();
  });

  renderProducts();
})();
