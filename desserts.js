import { products } from "./data.js";
// let cart = JSON.parse(localStorage.getItem("cart"));

// if (!cart) {
//   cart = [
//     {
//       productId: 1,
//       quantity: 1
//     },
//     {
//       productId: 2,
//       quantity: 2
//     }
//   ]
// }
let cart = [];
let dessertsHTML = '';
products.forEach(product => {
  dessertsHTML += `
    <li class="dessert-container">
        <div class="dessert-image-container js-dessert-image-container-${product.id}">
          <picture>
            <source media="(max-width: 40em)" srcset=${product.image.mobile}>
            <source media="(max-width: 55em)" srcset=${product.image.tablet}>
            <source media="(min-width: 55.1em)" srcset=${product.image.desktop}>
            <img class="product-image" src="${product.image.thumbnail}" alt="Description of the image">
          </picture>
          <button class="add-to-cart-primary js-add-to-cart-primary-${product.id} add-to-cart" data-product-id="${product.id}">
            <img src="./assets/images/icon-add-to-cart.svg" alt="">
            Add to Cart
          </button>
          <div class="add-to-cart-update add-to-cart-update-${product.id} add-to-cart">
            <button class="update-quantity-button decrement-quantity" data-product-id="${product.id}">
              <img src="./assets/images/icon-decrement-quantity.svg" alt="">
            </button>
            <span class="product-qunatity js-product-qunatity-${product.id}">1</span>
            <button class="update-quantity-button increment-quantity" data-product-id="${product.id}">
              <img src="./assets/images/icon-increment-quantity.svg" alt="">
            </button>
          </div>
        </div>
        <span class="dessert-categoru">${product.categoru}</span>
        <span class="dessert-name">
          ${product.name}
        </span>
        <span class="dessert-price">$${(product.price).toFixed(2)}</span>
      </li>
    `
});

document.querySelector(".desserts-grid-container")
  .innerHTML = dessertsHTML;




// add button (primary)
document.querySelectorAll(".add-to-cart-primary")
  .forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      // take the parent element to add a border to it
      const imageContainer = document.querySelector(`.js-dessert-image-container-${productId}`);
      imageContainer.style.borderColor = "hsl(14, 86%, 42%)";
      // make the primary button disappear
      button.style.display = "none";
      // make the update button apprear
      const updateBtn = document.querySelector(`.add-to-cart-update-${productId}`);
      updateBtn.style.display = "flex";

      // add the item to the cart
      cart.push({
        productId: productId,
        quantity: 1
      });
      updateCartQuantity();
      cartChange();
      gernerateCart();
    })
  })

// increment button
document.querySelectorAll(".increment-quantity")
  .forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      // item's quantity span element
      const quantitySpan = document.querySelector(`.js-product-qunatity-${productId}`)
      // update the quantity in the cart list
      cart.forEach(cartItem => {
        if (cartItem.productId === productId) {
          cartItem.quantity += 1;
          // update the item's quantity span
          quantitySpan.innerText = cartItem.quantity;
        }
      });

      updateCartQuantity();
      cartChange();
      gernerateCart();
    })
  })

// decrement button
document.querySelectorAll(".decrement-quantity")
  .forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantitySpan = document.querySelector(`.js-product-qunatity-${productId}`)
      const primaryBtn = document.querySelector(`.js-add-to-cart-primary-${productId}`)
      const updateBtn = document.querySelector(`.add-to-cart-update-${productId}`);
      // take the parent element to add a border to it
      const imageContainer = document.querySelector(`.js-dessert-image-container-${productId}`);

      // update the quantity in the cart list
      cart.forEach(cartItem => {
        if (cartItem.productId === productId) {
          if (cartItem.quantity === 1) {
            primaryBtn.style.display = "flex";
            updateBtn.style.display = "none";
            imageContainer.style.borderColor = "transparent";
            const newCart = cart.filter(item => item.productId !== productId);
            cart = newCart;
            return;
          }
          cartItem.quantity -= 1;
          // update the item's quantity span
          quantitySpan.innerText = cartItem.quantity;
        }
      });
      updateCartQuantity();
      cartChange();
      gernerateCart();
    })
  });




function updateCartQuantity() {
  const cartQuantitySpan = document.querySelectorAll(".cart-quantity");
  let cartTotalQuantity = 0;

  cart.forEach(cartItem => {
    cartTotalQuantity += cartItem.quantity;
  });
  cartQuantitySpan.forEach(span => span.innerHTML = cartTotalQuantity)
  return cartTotalQuantity;
}


function cartChange() {
  const cartEmpty = document.querySelector('.cart-empty')
  const cartFilled = document.querySelector('.cart-filled')
  const cartTotalQuantity = updateCartQuantity();

  if (cartTotalQuantity > 0) {
    cartEmpty.style.display = "none";
    cartFilled.style.display = "grid";
  } else {
    cartEmpty.style.display = "grid";
    cartFilled.style.display = "none";
  }
}

// gernerate cart elements
function gernerateCart() {
  let cartHTML = "";
  let cartTotal = 0;
  cart.forEach(cartItem => {
    let matchingProduct;
    products.forEach(product => {
      if (product.id === Number(cartItem.productId)) {
        matchingProduct = product;
      }
    });
    const itemPrice = matchingProduct.price * cartItem.quantity;
    cartTotal += itemPrice;
    cartHTML += `
    <li class="cart-item js-cart-item-${matchingProduct.id}">
      <div class="cart-item-details">
        <span class="cart-item-name">${matchingProduct.name}</span>
        <div class="cart-item-price-details">
          <span class="cart-item-quantity-span">
            <span class="cart-item-quantity">${cartItem.quantity}</span>x
          </span>
          <span class="one-item-price-span">@ $<span class="one-item-price">${(matchingProduct.price).toFixed(2)}</span></span>
          <span class="total-item-price-span">$<span class="total-item-price">${(matchingProduct.price * cartItem.quantity).toFixed(2)}</span></span>
  
        </div>
      </div>
      <button class="remove-item-button" data-product-id="${matchingProduct.id}">
        <img src="./assets/images/icon-remove-item.svg" alt="">
      </button>
    </li>
    `;
  })
  document.querySelectorAll(".order-total")
    .forEach(span => {
      span.innerHTML = (cartTotal).toFixed(2);
    })


  document.querySelector(".cart-items-grid").innerHTML = cartHTML;
  removeFromCart();
}

function removeFromCart() {
  // remove item form the cart button
  document.querySelectorAll(".remove-item-button")
    .forEach(button => {
      button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        const cartItem = document.querySelector(`.js-cart-item-${productId}`);
        cartDecrementing(productId);
        cartItem.remove();
        updateCartQuantity();
        gernerateCart();
        cartChange();
      })
    });
}

function cartDecrementing(productId) {
  const primaryBtn = document.querySelector(`.js-add-to-cart-primary-${productId}`)
  const updateBtn = document.querySelector(`.add-to-cart-update-${productId}`);
  // take the parent element to add a border to it
  const imageContainer = document.querySelector(`.js-dessert-image-container-${productId}`);
  primaryBtn.style.display = "flex";
  updateBtn.style.display = "none";
  imageContainer.style.borderColor = "transparent";
  const newCart = cart.filter(item => item.productId !== productId);
  cart = newCart;

}


// get the ordered-confirmation cart
const confirmation = document.querySelector(".order-confirmation")
document.querySelector(".confirm-button").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
  document.body.classList.add("confirmation")
  confirmation.style.display = "grid";
  generateConfirmationCart();
});

// generate confirmation cart
function generateConfirmationCart() {
  let confirmationHTML = "";
  cart.forEach(cartItem => {
    let matchingProduct;
    products.forEach(product => {
      if (product.id === Number(cartItem.productId)) {
        matchingProduct = product;
      }
    });
    const itemPrice = (matchingProduct.price * cartItem.quantity).toFixed(2);

    confirmationHTML += `
    <li class="cart-item">
      <div class="ordered-item-details">
        <img class="ordered-image" src=${matchingProduct.image.mobile} alt="">
        <div class="cart-item-details">
          <span class="cart-item-name">${matchingProduct.name}</span>
          <div class="cart-item-price-details">
            <span class="cart-item-quantity-span">
              <span class="cart-item-quantity cart-item-quantity">${cartItem.quantity}</span>x
            </span>
            <span class="one-item-price-span">@ $<span class="one-item-price">${(matchingProduct.price).toFixed(2)}</span></span>
          </div>
        </div>
      </div>
      <span class="total-item-price-span">$<span class="total-item-price">${itemPrice}</span></span>
    </li>
    `
  });

  document.querySelector(".ordered-products-grid").innerHTML = confirmationHTML;
}

document.querySelector(".start-new-order-button")
  .addEventListener("click", () => {
    location.reload();
  })