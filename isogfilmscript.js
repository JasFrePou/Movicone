function showMenu(type) {
  // Skjul alle menuer
  let menus = document.querySelectorAll(".menu-content");
  menus.forEach(menu => {
    menu.style.display = "none";
  });

  // Vis den valgte menu
  document.getElementById(type).style.display = "block";
}
function showMenu(type) {
  console.log("Klikket:", type);

  let menus = document.querySelectorAll(".menu-content");

  menus.forEach(menu => {
    menu.style.display = "none";
  });

  let selected = document.getElementById(type);

  if (selected) {
    selected.style.display = "block";
  } else {
    console.error("Element ikke fundet:", type);
  }
}

let items = [];

function addItem(name, img, price) {
  items.push({ name, img, price });
  updateUI();
}

function removeItem(index) {
  items.splice(index, 1);
  updateUI();
}

function updateUI() {
  let preview = document.getElementById("preview-box");
  let list = document.getElementById("shopping-list");
  let totalEl = document.getElementById("total-price");

  preview.innerHTML = "";
  list.innerHTML = "";

  let total = 0;

  items.forEach((item, index) => {
    total += item.price;

    // Preview billede
    let img = document.createElement("img");
    img.src = item.img;
    img.classList.add("preview-item");
    img.onclick = () => removeItem(index);

    // Random placering (nice effect)
    img.style.left = Math.random() * 300 + "px";
    img.style.top = Math.random() * 300 + "px";

    preview.appendChild(img);

    // Liste
    let li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} kr`;
    li.onclick = () => removeItem(index);

    list.appendChild(li);
  });

  totalEl.textContent = total;
}



// Åbn/luk kurv
function toggleCart() {
  let popup = document.getElementById("cart-popup");
  popup.classList.toggle("hidden");
}

// Opdater kurv UI
function updateCartUI() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let list = document.getElementById("cart-items");
  let totalEl = document.getElementById("cart-total");
  let countEl = document.getElementById("cart-count");

  list.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    let li = document.createElement("li");
    li.textContent = item.name + " - " + item.price + " kr";

    // Klik for at fjerne
    li.onclick = () => {
      removeFromCart(index);
    };

    list.appendChild(li);
    total += item.price;
  });

  totalEl.textContent = total;
  countEl.textContent = cart.length;
}

// Fjern item
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// Tøm kurv
function clearCart() {
  localStorage.removeItem("cart");
  updateCartUI();
}

// Kør når siden loader
window.onload = updateCartUI;

function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(...items);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartUI(); //
  // Åbn popup
  document.getElementById("cart-popup").classList.remove("hidden");
}

document.addEventListener("click", function(event) {
  let cartPopup = document.getElementById("cart-popup");
  let cartButton = document.getElementById("cart-button");

  // Tjek om man klikker UDENFOR både kurv og knap
  if (
    !cartPopup.contains(event.target) &&
    !cartButton.contains(event.target)
  ) {
    cartPopup.classList.add("hidden"); // luk kurv
  }
});



function addToCart() {
  if (items.length === 0) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(...items);

  localStorage.setItem("cart", JSON.stringify(cart));

  // 🔥 Tøm listen korrekt
  items = [];

  // 🔥 Opdater UI
  updateUI();
  updateCartUI();

    alert("Din pakke er lagt i kurven!");
}



// Tjek ud bekræftelse
document.getElementById("order-form").addEventListener("submit", function(e) {
  e.preventDefault();

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let message = cart.map(item => 
    item.name + " - " + item.price + " kr"
  ).join("\n");

  emailjs.send("service_atnb35j", "template_bzcu9vc", {
    name: this.name.value,
    email: this.email.value,
    address: this.address.value,
    order: message
  }).then(() => {
    alert("Ordre sendt!");
  });
});
let message = cart.map(item => 
  `<li>${item.name} - ${item.price} kr</li>`
).join("");

emailjs.send("service_atnb35j", "template_bzcu9vc", {
  name: this.name.value,
  email: this.email.value,
  address: this.address.value,
  order: `<ul>${message}</ul>`
});

let summary = document.getElementById("order-summary");

if (summary) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  summary.innerHTML = cart.map(item => 
    `<p>${item.name} - ${item.price} kr</p>`
  ).join("");
}