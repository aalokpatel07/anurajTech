// Home page product list element
const productListElement = document.getElementById("product-list");

// Render all products on the home page with Add to Cart button
const displayAllProducts = () => {
  if (!productListElement) return;
  let html = "";
  productsArray.forEach((product) => {
    html += `
      <div class="product home-product" style="display:inline-block;vertical-align:top;margin:10px;width:220px;border:1px solid #eee;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,0.04);background:#fff;">
        <img src="${product.img}" alt="${product.name}" style="width:100%;height:140px;object-fit:cover;border-radius:6px 6px 0 0;">
        <div style="padding:12px;">
          <p style="font-weight:700;font-size:1rem;margin-bottom:4px;">${product.name}</p>
          <p style="color:#f63a35;font-weight:700;margin-bottom:8px;">$${product.price}</p>
          <button class="add-to-cart-btn" data-product-id="${product.id}" style="background:#f63a35;color:#fff;padding:8px 16px;border-radius:4px;font-weight:700;cursor:pointer;border:none;">Add to Cart</button>
        </div>
      </div>
    `;
  });
  productListElement.innerHTML = html;
  // Add event listeners for Add to Cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-product-id"));
      const prod = productsArray.find((p) => p.id === id);
      if (!prod) return;
      // If already in cart, increase quantity, else add to cart
      const cartIndex = cart.findIndex((p) => p.id === id);
      if (cartIndex > -1) {
        cart[cartIndex].quantity += 1;
      } else {
        cart.push({ ...prod, quantity: 1 });
      }
      displayProducts();
      updateTotalPrice();
      updateTotalQuantity();
      addEvents();
    });
  });
};
// elements
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeBtn = document.getElementById("close-btn");
const cartProducts = document.getElementById("cart-products");
const totalPriceElement = document.getElementById("total-price");
const totalQuantityElement = document.getElementById("total-quantity");
const totalQuantityText = document.getElementById("total-quantity-text");

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("show");
});

/* variables */
// products data
let productsArray = [];
// cart state: array of { id, name, price, img, quantity }
let cart = [];
// all products (as NodeList)
let productsNodeList;
// all products (as Array)
let productsNodeArray;

/* functions */
// get products
const getProducts = async () => {
  const response = await fetch("./products-data.json");
  const data = await response.json();
  productsArray = data.products;
};

// display products in cart (sidebar only)
const displayProducts = () => {
  let productsHTML = "";
  cart.forEach((product) => {
    productsHTML += `
        <div id="${product.id}" class="product">
          <div class="details">
            <img src=${product.img} alt=${product.name} class="product-img" />
            <div class="product-info">
              <p class="product-name">${product.name}</p>
              <p class="product-price">$${product.price}</p>
            </div>
          </div>
          <div class="controls">
            <div class="quantity">
              <button data-product-id="${product.id}" class="decrement-btn">
                <i class="fa-solid fa-minus fa-sm"></i>
              </button>
              <p class="quantity-num">${product.quantity}</p>
              <button data-product-id="${product.id}" class="increment-btn">
                <i class="fa-solid fa-plus fa-sm"></i>
              </button>
            </div>
            <button data-product-id="${product.id}" class="trash-btn">
              <i class="fa-solid fa-trash-can fa-lg"></i>
            </button>
          </div>
        </div>
    `;
  });
  cartProducts.innerHTML = productsHTML;
};

// remove a product from cart
const removeProduct = (trashButton) => {
  const productId = parseInt(trashButton.dataset.productId);
  // remove from cart array
  cart = cart.filter((product) => product.id !== productId);
  // update UI
  displayProducts();
  updateNodesArray();
  addEvents();
};

// decrease quantity in cart
const decreaseQuantity = (decrementButton) => {
  const productId = parseInt(decrementButton.dataset.productId);
  const productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex === -1) return;
  if (cart[productIndex].quantity === 1) {
    // remove from cart
    cart.splice(productIndex, 1);
  } else {
    cart[productIndex].quantity -= 1;
  }
  displayProducts();
  updateNodesArray();
  addEvents();
};

// increase quantity in cart
const increaseQuantity = (incrementButton) => {
  const productId = parseInt(incrementButton.dataset.productId);
  const productIndex = cart.findIndex((product) => product.id === productId);
  if (productIndex === -1) return;
  cart[productIndex].quantity += 1;
  displayProducts();
  updateNodesArray();
  addEvents();
};

// add event listeners to elements
const addEvents = () => {
  // all trash buttons
  const allTrashButtons = document.querySelectorAll(".trash-btn");
  // add an event for each trash button
  allTrashButtons.forEach((trashButton) => {
    trashButton.addEventListener("click", () => {
      removeProduct(trashButton);
      // update total price
      updateTotalPrice();
      // update total quantity
      updateTotalQuantity();
    });
  });

  // all decrement buttons
  const allDecrementButtons = document.querySelectorAll(".decrement-btn");
  // add an event for each decrement button
  allDecrementButtons.forEach((decrementButton) => {
    decrementButton.addEventListener("click", () => {
      decreaseQuantity(decrementButton);
      // update total price
      updateTotalPrice();
      // update total quantity
      updateTotalQuantity();
    });
  });

  // all increment buttons
  const allIncrementButtons = document.querySelectorAll(".increment-btn");
  // add an event for each increment button
  allIncrementButtons.forEach((incrementButton) => {
    incrementButton.addEventListener("click", () => {
      increaseQuantity(incrementButton);
      // update total price
      updateTotalPrice();
      // update total quantity
      updateTotalQuantity();
    });
  });
};

// in case of removing a product from DOM, update the Nodes array
const updateNodesArray = () => {
  // all products as NodeList
  productsNodeList = document.querySelectorAll(".product");
  // convert a NodeList to an Array; to use array functions
  productsNodeArray = Array.from(productsNodeList);
};

// update total price (sidebar only)
const updateTotalPrice = () => {
  const initialTotalPrice = 0;
  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    initialTotalPrice
  );
  // Format as currency
  totalPriceElement.textContent = totalPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

// update total quantity
const updateTotalQuantity = () => {
  const initialTotalQuantity = 0;
  const totalQuantity = cart.reduce(
    (total, product) => total + product.quantity,
    initialTotalQuantity
  );
  totalQuantityElement.textContent = totalQuantity;
  // "item" or "items" based on total quantity
  if (totalQuantity === 1) {
    totalQuantityText.textContent = "item";
  } else {
    totalQuantityText.textContent = "items";
  }
};

// Add a product to cart (for demo, add all products to cart on load)
const initializeCart = () => {
  // For demo: add all products to cart with their initial quantity
  cart = productsArray.map((product) => ({ ...product }));
};

// after fetching data
getProducts().then(() => {
  // Only initialize cart if you want all products in cart by default
  // initializeCart();
  displayAllProducts();
  displayProducts();
  updateNodesArray();
  updateTotalPrice();
  updateTotalQuantity();
  addEvents();
});
