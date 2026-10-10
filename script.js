const products = [
  {
    id: "tee-brisa",
    name: "T-shirt Brisa",
    subtitle: "Básica · Caimento regular",
    price: 129,
    category: "classica",
    label: "Essencial",
    image: "assets/tee-brisa.jpg",
    alt: "Modelo usando camiseta marfim Gengibre",
    colors: [{ name: "Areia", hex: "#d4c6af" }, { name: "Folha", hex: "#777c68" }, { name: "Café", hex: "#67564a" }]
  },
  {
    id: "tee-forma",
    name: "T-shirt Forma",
    subtitle: "Básica · Caimento clássico",
    price: 149,
    category: "classica",
    label: "Essencial",
    image: "assets/tee-forma.jpg",
    alt: "Modelo usando camiseta marfim Gengibre",
    colors: [{ name: "Nuvem", hex: "#f1eee5" }, { name: "Oliva", hex: "#59624f" }, { name: "Marinho", hex: "#28343a" }]
  },
  {
    id: "tee-livre",
    name: "T-shirt Livre",
    subtitle: "Básica · Caimento amplo",
    price: 159,
    category: "classica",
    label: "Novo jeito",
    image: "assets/tee-livre.jpg",
    alt: "Modelo usando camiseta verde-sálvia Gengibre",
    colors: [{ name: "Telha", hex: "#ad674f" }, { name: "Baunilha", hex: "#e3ddcc" }, { name: "Preto", hex: "#262725" }]
  },
  {
    id: "tee-textura",
    name: "T-shirt Trama",
    subtitle: "Básica · Caimento ajustado",
    price: 139,
    category: "textura",
    label: "Textura suave",
    image: "assets/tee-trama.jpg",
    alt: "Modelo usando camiseta canelada marrom Gengibre",
    colors: [{ name: "Sálvia", hex: "#a6a78f" }, { name: "Creme", hex: "#e8dfcd" }, { name: "Cacau", hex: "#766054" }]
  }
];

const money = (value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const grid = document.querySelector("#product-grid");
const cartDrawer = document.querySelector(".cart-drawer");
const backdrop = document.querySelector(".drawer-backdrop");
const toast = document.querySelector(".toast");
const searchPanel = document.querySelector(".search-panel");
const mobileMenu = document.querySelector(".mobile-menu");
let activeFilter = "all";
let searchTerm = "";
let sortMode = 0;
let toastTimer;
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("gengibre-cart") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try { localStorage.setItem("gengibre-cart", JSON.stringify(cart)); } catch { /* The cart still works for this visit. */ }
}

function getVisibleProducts() {
  let visible = products.filter((product) => {
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
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        <span class="product-label">${product.label}</span>
        <button class="favorite-button" type="button" aria-label="Adicionar ${product.name} aos favoritos" aria-pressed="false">♡</button>
      </div>
      <div class="product-info">
        <div class="product-title-row"><h3 class="product-title">${product.name}</h3><span class="product-price">${money(product.price)}</span></div>
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
  document.querySelector(".no-results").hidden = visible.length !== 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function openCart() {
  closeSearch();
  closeMobileMenu();
  renderCart();
  backdrop.hidden = false;
  requestAnimationFrame(() => cartDrawer.classList.add("is-open"));
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  document.querySelector(".drawer-close").focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.classList.remove("is-locked");
}

function renderCart() {
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);
  document.querySelector(".bag-count").textContent = count;
  document.querySelector(".drawer-count").textContent = `(${count})`;
  document.querySelector(".subtotal strong").textContent = money(subtotal);
  const empty = cart.length === 0;
  document.querySelector(".empty-cart").hidden = !empty;
  document.querySelector(".drawer-foot").hidden = empty;
  const shippingText = subtotal >= 249 ? "Seu pedido ganhou frete grátis." : `Faltam ${money(249 - subtotal)} para o seu frete grátis.`;
  document.querySelector(".cart-items").innerHTML = cart.map((line, index) => `
    <div class="cart-line">
      <img src="${line.image}" alt="${line.name}" />
      <div class="cart-line-info">
        <h3>${line.name}</h3><p>Cor: ${line.color}</p><p>Tamanho: ${line.size}</p>
        <div class="quantity-control"><button type="button" data-quantity="${index}" data-change="-1" aria-label="Diminuir quantidade">−</button><span>${line.quantity}</span><button type="button" data-quantity="${index}" data-change="1" aria-label="Aumentar quantidade">+</button></div>
      </div>
      <div class="cart-line-price">${money(line.price * line.quantity)}<button class="remove-line" type="button" data-remove="${index}">Remover</button></div>
    </div>
  `).join("");
}

function addToCart(productId, card) {
  const product = products.find((item) => item.id === productId);
  const size = card.querySelector(".size-button.is-selected")?.dataset.size || "M";
  const color = card.querySelector(".color-swatch.is-selected")?.dataset.color || product.colors[0].name;
  const key = `${product.id}-${size}-${color}`;
  const existing = cart.find((line) => line.key === key);
  if (existing) existing.quantity += 1;
  else cart.push({ key, id: product.id, name: product.name, price: product.price, image: product.image, color, size, quantity: 1 });
  saveCart();
  renderCart();
  showToast(`${product.name} adicionada à sua sacola.`);
  openCart();
}

function openSearch() {
  closeMobileMenu();
  searchPanel.classList.add("is-open");
  searchPanel.setAttribute("aria-hidden", "false");
  setTimeout(() => document.querySelector("#search-input").focus(), 80);
}

function closeSearch() {
  searchPanel.classList.remove("is-open");
  searchPanel.setAttribute("aria-hidden", "true");
}

function closeMobileMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false");
}

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".product-card");
  if (!card) return;
  const addButton = event.target.closest("[data-add]");
  if (addButton) return addToCart(addButton.dataset.add, card);
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
    card.querySelector(".color-name").textContent = colorButton.dataset.color;
  }
  const favoriteButton = event.target.closest(".favorite-button");
  if (favoriteButton) {
    const isFavorite = favoriteButton.getAttribute("aria-pressed") !== "true";
    favoriteButton.setAttribute("aria-pressed", String(isFavorite));
    favoriteButton.classList.toggle("is-favorite", isFavorite);
    favoriteButton.textContent = isFavorite ? "♥" : "♡";
    showToast(isFavorite ? "Salva na sua lista de favoritas." : "Removida das suas favoritas.");
  }
});

document.querySelectorAll(".filter-tab").forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("is-active", tab === button));
  renderProducts();
}));

document.querySelector(".sort-button").addEventListener("click", (event) => {
  sortMode = (sortMode + 1) % 3;
  event.currentTarget.innerHTML = ["Em destaque", "Menor preço", "Maior preço"][sortMode] + ' <span aria-hidden="true">⌄</span>';
  renderProducts();
});

document.querySelector(".search-toggle").addEventListener("click", () => searchPanel.classList.contains("is-open") ? closeSearch() : openSearch());
document.querySelector(".search-close").addEventListener("click", () => {
  closeSearch();
  document.querySelector("#search-input").value = "";
  searchTerm = "";
  renderProducts();
});
document.querySelector("#search-input").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
  document.querySelector("#colecao").scrollIntoView({ behavior: "smooth", block: "start" });
});
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
  const opening = !mobileMenu.classList.contains("is-open");
  mobileMenu.classList.toggle("is-open", opening);
  mobileMenu.setAttribute("aria-hidden", String(!opening));
  event.currentTarget.setAttribute("aria-expanded", String(opening));
  if (opening) closeSearch();
});
document.querySelectorAll(".mobile-menu a").forEach((link) => link.addEventListener("click", closeMobileMenu));
document.querySelector(".bag-button").addEventListener("click", openCart);
document.querySelector(".drawer-close").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
document.querySelector(".continue-shopping").addEventListener("click", () => {
  closeCart();
  document.querySelector("#colecao").scrollIntoView({ behavior: "smooth" });
});
document.querySelector(".keep-shopping").addEventListener("click", closeCart);
document.querySelector(".cart-items").addEventListener("click", (event) => {
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
document.querySelector(".checkout-button").addEventListener("click", () => {
  document.querySelector(".checkout-unavailable").hidden = false;
  showToast("A finalização de compra chega junto com a Nuvemshop.");
});
document.querySelector(".newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  if (!email.reportValidity()) return;
  showToast("Obrigada! A lista de novidades será ativada em breve.");
  event.currentTarget.reset();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeSearch();
    closeMobileMenu();
  }
});

renderProducts();
renderCart();
