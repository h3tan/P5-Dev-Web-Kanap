/**
 * Ajoute les balises <option> avec les valeurs passées en paramètres
 * @param {Array} options
 */
function setOptions(id, optionsList) {
  for (let option of optionsList) {
    let optionTag = document.createElement("option");
    optionTag.setAttribute("value", option);
    optionTag.textContent = option;
    document.getElementById(id).appendChild(optionTag);
  }
}

/**
 * Retourne l'ID du produit contenu dans l'url de la page
 * @returns
 */
function getIdFromUrl() {
  let url = new URL(document.location);
  if (url.searchParams.has("id")) {
    return url.searchParams.get("id");
  } else {
    document.querySelector(".item").textContent = "ID introuvable";
  }
}

/**
 * Retourne les informations d'un produit à partir de son clic sur la page d'accueil
 * @returns
 */
async function getProductById() {
  id = getIdFromUrl();
  let response = await fetch(`http://localhost:3000/api/products/${id}`);
  if (!response.ok) {
    document.querySelector(".item").textContent = "Produit introuvable!";
    let message = `Erreur: ${response.status}, impossible de trouver l'API`;
    throw new Error(message);
  }
  let resJson = await response.json();
  return resJson;
}

/**
 * Vérifie si la quantité est entre 0 et 300 et qu'une couleur a bien été sélectionnée
 * Retourne un tableau contenant l'id, la quantité et les couleurs du produit souhaité
 * Retourne 0 si l'une des deux conditions n'est pas satisfaite
 * @param {String} id
 * @param {Number} quantity
 * @param {String} colors
 * @returns
 */
function verifyQuantityAndColors(id, quantity, colors) {
  if (quantity == 0 || quantity > 300 || colors == "") {
    return 0;
  } else {
    let product = [id, quantity, colors];
    return product;
  }
}

/**
 * Convertit le panier qui est sous forme de String en un tableau
 * à deux dimensions contenant des tableaux à trois éléments
 * @param {String} cart
 * @returns
 */
function panierStringToArray(cart) {
  cart = cart.split(",");
  let newCart = [];
  for (let i = 0; i < cart.length; i = i + 3) {
    let product = [cart[i], Number(cart[i + 1]), cart[i + 2]];
    newCart.push(product);
  }
  return newCart;
}

/**
 * Cherche si le produit est déjà dans le panier (couple id et couleurs identiques)
 * Si déjà présent, met à jour la quantité du produit déjà dans le panier avec la valeur du produit ajouté
 * @param {Array} cart
 * @param {Array} product
 * @returns
 */
function searchProduct(cart, product) {
  for (let articleInCart of cart) {
    if (articleInCart[0] == product[0] && articleInCart[2] == product[2]) {
      articleInCart[1] += Number(product[1]);
      return true;
    }
  }
  return false;
}

/**
 * Gère la redirection vers la page Panier en fonction du type d'ajout (mise à jour de la quantité ou ajout du produit)
 * @param {Boolean} add
 */
function goToCartPage(addType) {
  let quantityUpdated = "";
  let productAdded = "";
  if (addType == true) {
    quantityUpdated = window.confirm("Quantité mise à jour, allez au Panier?");
  } else {
    productAdded = window.confirm("Produit ajouté, allez au Panier?");
  }
  if (quantityUpdated == true || productAdded == true) {
    document.location.href = "../html/cart.html";
  }
}

/**
 * Met à jour le panier en fonction du type d'ajout (mise à jour de la quantité ou ajout d'un nouveau produit)
 * @param {Array} cart
 * @param {Array} product
 */
function updateStorage(id) {
  let colorsTag = document.getElementById("colors");
  let quantityTag = document.getElementById("quantity");
  let product = verifyQuantityAndColors(id, quantityTag.value, colorsTag.value);
  if (product == 0) {
    alert("Veuillez choisir une quantité et une couleur");
    return;
  }
  if (localStorage.length == 0) {
    localStorage.setItem("cart", product);
    goToCartPage(false);
    return;
  }
  cart = panierStringToArray(localStorage.getItem("cart"));
  if (searchProduct(cart, product)) {
    localStorage.setItem("cart", cart);
    goToCartPage(true);
  } else {
    cart.push(product);
    localStorage.setItem("cart", cart);
    goToCartPage(false);
  }
}

/**
 * Gère l'ajout au panier lorsqu'on clique sur le bouton "Ajouter au panier"
 */
function addActionAddProductToCart() {
  let addToCartButton = document.getElementById("addToCart");
  addToCartButton.addEventListener("click", function () {
    updateStorage(getIdFromUrl());
  });
}

/**
 * Construit les éléments nécessaires à l'affiche des informations du produit
 */
async function displayProductById() {
  let product = await getProductById();
  let imageProduct = document.createElement("img");
  imageProduct.setAttribute("src", product.imageUrl);
  imageProduct.setAttribute("alt", product.altTxt);
  document.querySelector(".item__img").appendChild(imageProduct);
  document.getElementById("title").textContent = product.name;
  document.getElementById("price").textContent = product.price;
  document.getElementById("description").textContent = product.description;
  setOptions("colors", product.colors);
}

/**
 * Affiche les informations du produit et permet l'ajout du produit au panier
 */
async function productPage() {
  await displayProductById();
  addActionAddProductToCart();
}

productPage();
