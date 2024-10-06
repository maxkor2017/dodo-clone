let cartArr = getCart();
renderProductsInCart(cartArr);

Promise.all([getAllCategories(), getAllProducts()]).then(function ([
  categories,
  products,
]) {
  console.log(categories);
  console.log(products);
  renderCategories(categories);
  renderProducts(products);
  headerSearch.onchange = () => handleSearch(products);
});

function renderCategories(categories) {
  categories.forEach((category, index) => {
    const clone = categoryTemplate.content.cloneNode(true);
    const link = clone.querySelector(".header__link");
    link.innerHTML = category.name;
    link.href = `#${category.id}`;
    productsTitleArr[index].innerHTML = category.name;
    headerNav.append(clone);
  });
}

modalClose.onclick = closeModal;
cartClose.onclick = closeCart;
headerBasket.onclick = openCart;

function renderProducts(products) {
  productBodies.forEach((element) => {
    element.innerHTML = null;
  });
  products.forEach((product) => {
    const clone = productTemplate.content.cloneNode(true);
    const productContainer = clone.querySelector(".product");
    const img = clone.querySelector(".product__img");
    const name = clone.querySelector(".product__name");
    const description = clone.querySelector(".product__description");
    const price = clone.querySelector(".product__price");
    const productsBody = document.getElementById(product.categoryId);
    img.src = product.img;
    name.innerHTML = product.name;
    description.innerHTML = product.description;
    price.innerHTML = product.price + " ₽";
    productContainer.onclick = function () {
      modalImg.src = product.img;
      modalTitle.innerHTML = product.name;
      modalSubtitle.innerHTML = product.weights + " г";
      modalDescription.innerHTML = product.description;
      modalValues.forEach((value, index) => {
        value.innerHTML = product.foodvalue[index];
      });
      modalPrice.innerHTML = product.price + " ₽";
      modalBtn.onclick = () => addToCart(product);
      openModal();
    };

    productsBody.append(clone);
  });
}

function openModal() {
  modal.classList.add("modal__active");
}

function closeModal() {
  modal.classList.remove("modal__active");
}

function openCart() {
  cart.classList.add("cart__active");
}

function closeCart() {
  cart.classList.remove("cart__active");
}

function showAlert(name) {
  cartAlert.classList.add("cart__alert-active");
  cartAlertName.innerHTML = name;
  setTimeout(() => {
    cartAlert.classList.remove("cart__alert-active");
  }, 2000);
}

function addToCart(product) {
  const productInCart = cartArr.find((item) => item.id == product.id);
  if (productInCart) {
    if (productInCart.count < 10) {
      productInCart.count++;
    } else {
      alert("Превышено максимальное количество товара!!!");
    }
  } else {
    cartArr.push({ ...product, count: 1 });
  }
  console.log(cartArr);
  closeModal();
  showAlert(product.name);
  renderProductsInCart(cartArr);
}

function renderProductsInCart(arr) {
  cartBody.innerHTML = null;
  arr.forEach((product) => {
    const clone = cartTemplate.content.cloneNode(true);
    const img = clone.querySelector(".cart__img");
    const name = clone.querySelector(".cart__name");
    const weights = clone.querySelector(".cart__weights");
    const price = clone.querySelector(".cart__price");
    const count = clone.querySelector(".cart__count");
    const cartMinus = clone.querySelector(".cart__minus");
    const cartPlus = clone.querySelector(".cart__plus");
    const cartDelete = clone.querySelector(".cart__delete");

    cartMinus.onclick = function () {
      if (product.count > 1) {
        product.count--;
        renderProductsInCart(cartArr);
      }
    };
    cartPlus.onclick = function () {
      if (product.count < 10) {
        product.count++;
        renderProductsInCart(cartArr);
      }
    };
    cartDelete.onclick = function () {
      if (confirm("Вы уверены, что хотите удалить товар?")) {
        cartArr = cartArr.filter((item) => item.id != product.id);
        renderProductsInCart(cartArr);
      }
    };

    img.src = product.img;
    name.innerHTML = product.name;
    weights.innerHTML = product.weights + " г";
    price.innerHTML = product.price + " ₽";
    count.innerHTML = product.count;

    cartBody.append(clone);
  });
  headerCount.innerHTML = arr.length;
  cartTotalprice.innerHTML = calcFullPrice(cartArr) + " ₽";
  cartTitle.innerHTML = `${arr.length} товар(ов)(a) на ${cartTotalprice.innerHTML}`;
  saveCart(cartArr);
}

function calcFullPrice(arr) {
  let fullPrice = 0;
  arr.forEach((element) => {
    fullPrice += element.price * element.count;
  });
  return fullPrice;
}

function saveCart(arr) {
  localStorage.setItem("cartArr", JSON.stringify(arr));
}

function getCart() {
  const result = localStorage.getItem("cartArr");
  if (result) {
    return JSON.parse(result);
  } else {
    return [];
  }
}

function handleSearch(products) {
  const value = headerSearch.value;

  if (value.trim() == "") {
    renderProducts(products);
  } else {
    const searchResult = products.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    renderProducts(searchResult);
  }
  productBodies.forEach((element) => {
    const section = element.closest(".products");
    if (element.innerHTML == "") {
      section.classList.add("products__hidden");
    } else {
      section.classList.remove("products__hidden");
    }
  });
}
