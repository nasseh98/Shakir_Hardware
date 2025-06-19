const productList = document.getElementById("productList");
const form = document.getElementById("productForm");
const searchInput = document.getElementById("searchInput");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

let products = JSON.parse(localStorage.getItem("products")) || [];
let filteredProducts = [...products];
let currentPage = 1;
const itemsPerPage = 16;

// Admin Access
const adminToggle = document.getElementById("adminToggle");
const adminForm = document.getElementById("adminForm");
const uploadFormSection = document.querySelector(".upload-form");

adminToggle.addEventListener("click", () => {
  adminForm.style.display = adminForm.style.display === "none" ? "block" : "none";
});

document.getElementById("submitAdmin").addEventListener("click", () => {
  const password = document.getElementById("adminPassword").value;
  if (password === "admin123") {
    window.location.href = "admin.html";
  } else {
    alert("Incorrect password.");
  }
});

// Hide upload form by default
uploadFormSection.style.display = "none";

// File Upload Preview
document.getElementById("imageUpload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      document.getElementById("previewImage").src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Product Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const reader = new FileReader();
  const imageFile = document.getElementById("imageUpload").files[0];

  reader.onloadend = function () {
    const newProduct = {
      id: Date.now(),
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      image: reader.result
    };

    products.unshift(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    form.reset();
    document.getElementById("previewImage").src = "";
    currentPage = 1;
    filteredProducts = [...products];
    renderProducts();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    alert("Please upload an image.");
  }
});

// Search Function
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
  currentPage = 1;
  renderProducts();
});

// Category Filtering
const categoryList = document.getElementById("category-list");
categoryList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const selected = e.target.getAttribute("data-category");
    if (selected === "all") {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(p => p.category === selected);
    }
    currentPage = 1;
    renderProducts();
  }
});

// Pagination Controls
prevPage.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderProducts();
  }
});

nextPage.addEventListener("click", () => {
  if (currentPage < Math.ceil(filteredProducts.length / itemsPerPage)) {
    currentPage++;
    renderProducts();
  }
});


// Add to Cart
// Add to Cart
document.addEventListener("click", function (e) {
  if (e.target.matches("button[data-id]")) {
    const id = e.target.getAttribute("data-id");
    const product = products.find(p => p.id == id);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id == id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    showCartMessage(`${product.name} added to cart.`);
  }
});

function confirmOrder() {
  const name = document.getElementById("fullName").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const method = document.getElementById("method").value;

  if (!name || !phone || !address || !method) {
    alert("Please fill all required fields.");
    return;
  }

  let message = `🧾 *Order from Shakir Hardware*%0A%0A`;
  message += `📦 *Items:*%0A`;

  cart.forEach(item => {
    message += `- ${item.name} x ${item.qty}%0A`;
  });

  message += `%0A💰 *Total:* Ksh. ${total.toFixed(2)}%0A%0A`;
  message += `👤 *Customer Info:*%0A`;
  message += `- Name: ${name}%0A`;
  message += `- Phone: ${phone}%0A`;
  message += `- Email: ${email}%0A`;
  message += `- Address: ${address}%0A`;
  message += `- Delivery Method: ${method}`;

  const phoneNumber = "254113552763"; // Shakir Hardware WhatsApp number
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  localStorage.removeItem("cart");
  document.getElementById("checkoutForm").reset();
  cartSummary.innerHTML = "";
  checkoutTotal.textContent = "Ksh. 0";
  successMessage.style.display = "block";

  window.open(whatsappLink, "_blank");
}




// Show Message Function
function showCartMessage(message) {
  const msg = document.getElementById("cartMessage");
  msg.textContent = message;
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 2500);
}





// Render Products
function renderProducts() {
  productList.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredProducts.slice(start, end);

  pageItems.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>${product.price}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p class="desc">${product.description}</p>
      <button data-id="${product.id}">Add to Cart 🛒</button>
    `;
    productList.appendChild(card);
  });

  pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredProducts.length / itemsPerPage)}`;
}


renderProducts();
