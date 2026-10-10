(() => {
  const products = window.GENGIBRE_PRODUCTS || [];
  const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  const $ = (selector) => document.querySelector(selector);
  let cart = [];
  let toastTimer;

  try {
    const saved = JSON.parse(localStorage.getItem("gengibre-cart") || "[]");
    cart = Array.isArray(saved) ? saved : [];
  } catch { cart = []; }

  function showToast(message) {
    const toast = $(".toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function saveCart() {
    try { localStorage.setItem("gengibre-cart", JSON.stringify(cart)); } catch { /* A sacola continua nesta visita. */ }
  }

  function renderCart() {
    const drawer = $(".cart-drawer");
    if (!drawer) return;
    const count = cart.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
    $(".bag-count").textContent = count;
    $(".drawer-count").textContent = `(${count})`;
    $(".subtotal strong").textContent = money(subtotal);
    const empty = cart.length === 0;
    $(".empty-cart").hidden = !empty;
    $(".drawer-foot").hidden = empty;
    $(".cart-items").innerHTML = cart.map((line, index) => `
      <div class="cart-line">
        <img src="${line.image}" alt="${line.name}" />
        <div class="cart-line-info"><h3>${line.name}</h3><p>Cor: ${line.color}</p><p>Tamanho: ${line.size}</p>
          <div class="quantity-control"><button type="button" data-quantity="${index}" data-change="-1" aria-label="Diminuir quantidade">−</button><span>${line.quantity}</span><button type="button" data-quantity="${index}" data-change="1" aria-label="Aumentar quantidade">+</button></div>
        </div>
        <div class="cart-line-price">${money(line.price * line.quantity)}<button class="remove-line" type="button" data-remove="${index}">Remover</button></div>
      </div>
    `).join("");
  }

  function closeSearch() {
    const panel = $(".search-panel");
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  }

  function closeMobileMenu() {
    const menu = $(".mobile-menu");
    if (!menu) return;
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    $(".menu-toggle")?.setAttribute("aria-expanded", "false");
  }

  function openCart() {
    const drawer = $(".cart-drawer");
    const backdrop = $(".drawer-backdrop");
    if (!drawer || !backdrop) return;
    closeSearch();
    closeMobileMenu();
    renderCart();
    backdrop.hidden = false;
    requestAnimationFrame(() => drawer.classList.add("is-open"));
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $(".drawer-close")?.focus();
  }

  function closeCart() {
    const drawer = $(".cart-drawer");
    const backdrop = $(".drawer-backdrop");
    if (!drawer || !backdrop) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.classList.remove("is-locked");
  }

  function addToCart(productId, size, color) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const key = `${product.id}-${size}-${color}`;
    const existing = cart.find((line) => line.key === key);
    if (existing) existing.quantity += 1;
    else cart.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, color, size, quantity: 1 });
    saveCart();
    renderCart();
    showToast(`${product.name} adicionada à sua sacola.`);
    openCart();
  }

  window.GengibreStore = { products, money, addToCart, showToast, openCart };

  document.addEventListener("click", (event) => {
    const bag = event.target.closest(".bag-button");
    if (bag) return openCart();
    if (event.target.closest(".drawer-close, .drawer-backdrop")) return closeCart();
    if (event.target.closest(".keep-shopping")) return closeCart();
    if (event.target.closest(".continue-shopping")) {
      closeCart();
      if ($("#colecao")) $("#colecao").scrollIntoView({ behavior: "smooth" });
      else location.href = "colecao.html";
      return;
    }

    const card = event.target.closest(".product-card, .product-detail");
    if (card) {
      const addButton = event.target.closest("[data-add]");
      if (addButton) {
        const size = card.querySelector(".size-button.is-selected")?.dataset.size || "M";
        const color = card.querySelector(".color-swatch.is-selected")?.dataset.color || products.find((item) => item.id === addButton.dataset.add)?.colors[0].name;
        addToCart(addButton.dataset.add, size, color);
        return;
      }
      const sizeButton = event.target.closest(".size-button");
      if (sizeButton) {
        card.querySelectorAll(".size-button").forEach((button) => {
          button.classList.toggle("is-selected", button === sizeButton);
          button.setAttribute("aria-pressed", String(button === sizeButton));
        });
      }
      const colorButton = event.target.closest(".color-swatch");
      if (colorButton) {
        card.querySelectorAll(".color-swatch").forEach((button) => {
          button.classList.toggle("is-selected", button === colorButton);
          button.setAttribute("aria-pressed", String(button === colorButton));
        });
        const colorName = card.querySelector(".color-name");
        if (colorName) colorName.textContent = colorButton.dataset.color;
      }
      const favorite = event.target.closest(".favorite-button");
      if (favorite) {
        const active = favorite.getAttribute("aria-pressed") !== "true";
        favorite.setAttribute("aria-pressed", String(active));
        favorite.classList.toggle("is-favorite", active);
        favorite.textContent = active ? "♥" : "♡";
        showToast(active ? "Salva na sua lista de favoritas." : "Removida das suas favoritas.");
      }
    }

    const checkout = event.target.closest(".checkout-button");
    if (checkout) {
      $(".checkout-unavailable").hidden = false;
      showToast("A finalização de compra chega junto com a Nuvemshop.");
    }
  });

  $(".search-toggle")?.addEventListener("click", () => {
    const panel = $(".search-panel");
    if (!panel) return;
    closeMobileMenu();
    const open = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    if (open) setTimeout(() => $("#search-input")?.focus(), 80);
  });
  $(".search-close")?.addEventListener("click", closeSearch);
  $("#search-input")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = event.currentTarget.value.trim();
    location.href = `colecao.html${value ? `?busca=${encodeURIComponent(value)}` : ""}`;
  });
  $(".menu-toggle")?.addEventListener("click", (event) => {
    const menu = $(".mobile-menu");
    if (!menu) return;
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    event.currentTarget.setAttribute("aria-expanded", String(open));
    if (open) closeSearch();
  });
  document.querySelectorAll(".mobile-menu a").forEach((link) => link.addEventListener("click", closeMobileMenu));
  $(".newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = $("#newsletter-email");
    if (!email?.reportValidity()) return;
    showToast("Obrigada! A lista de novidades será ativada em breve.");
    event.currentTarget.reset();
  });
  $(".cart-items")?.addEventListener("click", (event) => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");
    if (quantityButton) {
      const index = Number(quantityButton.dataset.quantity);
      cart[index].quantity += Number(quantityButton.dataset.change);
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    }
    if (removeButton) cart.splice(Number(removeButton.dataset.remove), 1);
    saveCart();
    renderCart();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeCart(); closeSearch(); closeMobileMenu(); }
  });

  renderCart();
})();
