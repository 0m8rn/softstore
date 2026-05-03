const WHATSAPP_NUMBER = "00962780959008";
const WARRANTY_OPTIONS = ["No Warranty", "6 Months", "1 Year", "2 Years"];

const productContainer = document.getElementById("productContainer");
const filterButtons = document.querySelectorAll(".filter-btn");
const products = window.ProductStore.getActiveProducts();
const pricingRules = window.PricingEngine.getActivePricingRules();

function formatPrice(amount) {
  return `${Math.round(amount)} JOD`;
}

function getCategoryLabel(category) {
  return category === "os" ? "OS" : category;
}

function getMonths(warranty) {
  if (warranty === "No Warranty") {
    return 0;
  }
  const value = parseInt(warranty, 10);
  if (Number.isNaN(value)) {
    return 0;
  }
  if (warranty.includes("Year")) {
    return value * 12;
  }
  return value;
}

function getCategoryBasePrice(product, version) {
  const name = product.name.toLowerCase();
  const versionLabel = String(version).toLowerCase();

  if (name.includes("windows")) {
    return versionLabel.includes("server")
      ? pricingRules.windows.serverBase
      : pricingRules.windows.desktopBase;
  }

  if (name.includes("macos")) {
    return pricingRules.macos.base;
  }

  if (name.includes("linux")) {
    if (versionLabel.includes("server")) {
      return pricingRules.linux.serverBase;
    }
    if (versionLabel.includes("kali")) {
      return pricingRules.linux.kaliBase;
    }
    return pricingRules.linux.distroBase;
  }

  if (
    product.category === "adobe" ||
    product.category === "autodesk" ||
    product.category === "office" ||
    product.category === "sketchup"
  ) {
    return pricingRules.general.base;
  }

  return product.basePrice;
}

function getCalculatedPrice(product, version, warranty) {
  const warrantyMonths = getMonths(warranty);
  if (warrantyMonths === 0) {
    return getCategoryBasePrice(product, version);
  }
  return window.PricingEngine.getCalculatedPrice(product, version, warranty, pricingRules);
}

function buildWhatsAppMessage(productName, version, warranty, finalPriceText) {
  return `Hello, I want to order:

Product: ${productName}
Version: ${version}
Warranty: ${warranty}
Price: ${finalPriceText}`;
}

function openWhatsAppWithMessage(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function createVersionOptions(product) {
  return product.versions
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");
}

function createWarrantyOptions(defaultValue) {
  return WARRANTY_OPTIONS
    .map((value) => `<option value="${value}" ${value === defaultValue ? "selected" : ""}>${value}</option>`)
    .join("");
}

function createProductCard(product, index) {
  const card = document.createElement("article");
  card.className = "card card-enter";
  card.style.setProperty("--stagger", `${index * 45}ms`);

  const popularBadge = product.popular ? `<span class="badge">🔥 Most Popular</span>` : "";

  card.innerHTML = `
    ${popularBadge}
    <h3 class="product-name">${product.name}</h3>
    <p class="product-category">${getCategoryLabel(product.category)}</p>
    <div class="trust-row">
      <span>⚡ Instant Delivery</span>
      <span>🛡️ Warranty Included</span>
    </div>
    <select class="version-select" aria-label="Select version for ${product.name}">
      ${createVersionOptions(product)}
    </select>
    <select class="warranty-select" aria-label="Select warranty for ${product.name}">
      ${createWarrantyOptions("No Warranty")}
    </select>
    <div class="price">
      <div class="old-price"></div>
      <div class="new-price"></div>
    </div>
    <button class="buy-btn" type="button">Buy via WhatsApp</button>
  `;

  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.className = "product-img";
    img.loading = "lazy";
    img.addEventListener("load", () => {
      img.style.opacity = "1";
    });
    img.addEventListener("error", () => {
      img.style.display = "none";
    });
    card.insertBefore(img, card.firstChild);
  }

  const versionSelect = card.querySelector(".version-select");
  const warrantySelect = card.querySelector(".warranty-select");
  const oldPriceElement = card.querySelector(".old-price");
  const newPriceElement = card.querySelector(".new-price");
  const buyButton = card.querySelector(".buy-btn");

  function updatePriceUI() {
    const newPrice = Math.round(getCalculatedPrice(product, versionSelect.value, warrantySelect.value));
    const oldPrice = Math.round(newPrice * 1.4);
    oldPriceElement.textContent = formatPrice(oldPrice);
    newPriceElement.textContent = formatPrice(newPrice);
  }

  versionSelect.addEventListener("change", updatePriceUI);
  warrantySelect.addEventListener("change", updatePriceUI);
  buyButton.addEventListener("click", () => {
    openCheckoutModal(product, versionSelect.value, warrantySelect.value);
  });

  updatePriceUI();
  return card;
}

function renderProducts(category = "all") {
  productContainer.innerHTML = "";
  const visibleProducts = products.filter(
    (product) => category === "all" || product.category === category
  );
  visibleProducts.forEach((product, index) => {
    productContainer.appendChild(createProductCard(product, index));
  });
}

function setActiveFilterButton(category) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === category;
    button.classList.toggle("active", isActive);
  });
}

function initializeFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.category;
      setActiveFilterButton(selectedCategory);
      renderProducts(selectedCategory);
    });
  });
}

function ensureCheckoutModal() {
  let backdrop = document.querySelector(".checkout-modal-backdrop");
  if (backdrop) {
    return backdrop;
  }

  backdrop = document.createElement("div");
  backdrop.className = "checkout-modal-backdrop";
  backdrop.innerHTML = `
    <div class="checkout-modal">
      <button type="button" class="checkout-close" aria-label="Close checkout">×</button>
      <h3 class="checkout-title">Complete Your Order</h3>
      <div class="checkout-item">
        <label>Product</label>
        <div class="checkout-value" data-field="product"></div>
      </div>
      <div class="checkout-item">
        <label>Version</label>
        <div class="checkout-value" data-field="version"></div>
      </div>
      <div class="checkout-item">
        <label for="checkoutWarrantySelect">Warranty</label>
        <select id="checkoutWarrantySelect" class="checkout-warranty"></select>
      </div>
      <div class="checkout-item">
        <label>Price</label>
        <div class="checkout-price" data-field="price"></div>
      </div>
      <button type="button" class="checkout-confirm">Confirm Order</button>
    </div>
  `;

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      closeCheckoutModal();
    }
  });

  backdrop.querySelector(".checkout-close").addEventListener("click", closeCheckoutModal);
  document.body.appendChild(backdrop);
  return backdrop;
}

function closeCheckoutModal() {
  const backdrop = document.querySelector(".checkout-modal-backdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
  }
}

function openCheckoutModal(product, version, warranty) {
  const backdrop = ensureCheckoutModal();
  const productField = backdrop.querySelector('[data-field="product"]');
  const versionField = backdrop.querySelector('[data-field="version"]');
  const priceField = backdrop.querySelector('[data-field="price"]');
  const warrantySelect = backdrop.querySelector(".checkout-warranty");
  const confirmButton = backdrop.querySelector(".checkout-confirm");

  productField.textContent = product.name;
  versionField.textContent = version;
  warrantySelect.innerHTML = createWarrantyOptions(warranty);

  function updateModalPrice() {
    const price = Math.round(getCalculatedPrice(product, version, warrantySelect.value));
    priceField.textContent = formatPrice(price);
  }

  warrantySelect.onchange = updateModalPrice;
  confirmButton.onclick = () => {
    const finalPriceText = priceField.textContent;
    const message = buildWhatsAppMessage(product.name, version, warrantySelect.value, finalPriceText);
    openWhatsAppWithMessage(message);
    closeCheckoutModal();
  };

  updateModalPrice();
  backdrop.classList.add("open");
}

function addQuickWhatsAppButton() {
  const quickButton = document.createElement("button");
  quickButton.type = "button";
  quickButton.className = "quick-whatsapp-btn";
  quickButton.textContent = "💬 WhatsApp";
  quickButton.addEventListener("click", () => {
    openWhatsAppWithMessage("Hello, I have a question about your products.");
  });
  document.body.appendChild(quickButton);
}

initializeFilters();
renderProducts();
addQuickWhatsAppButton();
