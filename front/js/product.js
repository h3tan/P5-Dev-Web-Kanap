let maxQuantityOfCart = 300;
let maxQuantityOfProduct = 100;
let minQuantityOfProduct = 1;

/**
 * Ajoute les balises <option> avec les valeurs passées en paramètres
 * @param {String} idTag
 * @param {String[]} options
 */
function setOptions(idTag, optionsList) {
  for (let option of optionsList) {
    let optionTag = document.createElement("option");
    optionTag.setAttribute("value", option);
    optionTag.textContent = option;
    document.getElementById(idTag).appendChild(optionTag);
  }
}

/**
 * Retourne l'ID du produit contenu dans l'url de la page
 * @returns {String}
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
 * @async
 * @returns {Promise<Object>}
 */
async function getProductByIdFromAPI() {
  try {
    id = getIdFromUrl();
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    let resJson = await response.json();
    return resJson;
  } catch (err) {
    document.querySelector(".item").textContent = "Produit introuvable!";
    let message = `Impossible de trouver l'API`;
    throw new Error(message);
  }
}

/**
 * Vérifie si la quantité est entre 0 et 300 et qu'une couleur a bien été sélectionnée
 * Retourne un objet contenant l'id, la quantité et les couleurs du produit souhaité
 * Retourne 0 si l'une des deux conditions n'est pas satisfaite
 * @param {String} id
 * @param {Number} quantity
 * @param {String} colors
 * @returns {Object}
 */
function verifyQuantityAndColors(id, quantity, colors) {
  if (
    quantity >= minQuantityOfProduct &&
    quantity <= maxQuantityOfProduct &&
    Math.sign(quantity) != -1 &&
    colors != ""
  ) {
    let product = { id: id, quantity: parseInt(quantity), colors: colors };
    return product;
  } else {
    return false;
  }
}

/**
 * Calcule la quantité totale des articles du panier
 * @param {Object[]} cart
 * @param {Number} cart[].quantity
 * @returns {Number}
 */
function getTotalQuantityOfCart(cart) {
  let totalQuantity = 0;
  for (let i in cart) {
    totalQuantity += Number(cart[i].quantity);
  }
  return totalQuantity;
}

/**
 * Cherche si le produit (product) est déjà dans le panier (cart) (couple id et couleurs identiques)
 * @param {Object} product
 * @param {String} product.id
 * @param {String} product.colors
 * @param {Object[]} cart
 * @returns {Object}
 */
function searchProductInCart(product, cart) {
  return cart.find(
    (cartProduct) =>
      product.id == cartProduct.id && product.colors == cartProduct.colors
  );
}

/**
 * Gère la redirection vers la page Panier en fonction du type d'ajout (mise à jour de la quantité ou ajout du produit)
 * @param {Boolean} addType
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
 * @param {String} id
 * @returns {Void}
 */
function updateStorage(id) {
  let colorsTag = document.getElementById("colors");
  let quantityTag = document.getElementById("quantity");
  let cart = JSON.parse(localStorage.getItem("cart"));
  let product = verifyQuantityAndColors(
    id,
    parseInt(quantityTag.value),
    colorsTag.value
  );
  // Vérifie que l'utilisateur a choisi une couleur et une quantité
  if (product == false) {
    alert("Veuillez choisir une quantité et une couleur");
    return;
  }
  /** Si le panier est vide, met le produit dans le panier
   * Crée un tableau avec le produit en cas d'ajout ultérieur de produits pour pouvoir utiliser les méthodes des tableaux
   */
  if (localStorage.length == 0) {
    localStorage.setItem("cart", JSON.stringify([product]));
    goToCartPage(false);
    return;
  }
  // Appel de la fonction de recherche du produit dans le panier et mise à jour du panier avec la quantité si c'est le cas
  let productFound = searchProductInCart(product, cart);
  if (productFound != undefined) {
    productFound.quantity = productFound.quantity + product.quantity;
    if (productFound.quantity > maxQuantityOfProduct) {
      alert("Quantité maximale pour ce produit atteinte");
      return;
    }
    if (getTotalQuantityOfCart(cart) > maxQuantityOfCart) {
      alert(
        "Quantité maximale du panier atteinte, impossible de mettre à jour la quantité"
      );
      return;
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
      goToCartPage(true);
      return;
    }
  }
  // Ajoute le produit dans le panier s'il n'était pas déjà présent et que le panier est non vide
  cart.push(product);
  if (getTotalQuantityOfCart(cart) > maxQuantityOfCart) {
    alert(
      "Quantité maximale du panier atteinte, impossible d'ajouter ce produit"
    );
    cart.pop();
    return;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  goToCartPage(false);
}

/**
 * Construit les éléments HTML en récupérant les informations à partir de l'ID du produit dans l'url de la page
 * @async
 */
async function displayProductById() {
  let product = await getProductByIdFromAPI();

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
 * @async
 */
async function productPage() {
  await displayProductById();
  document.getElementById("addToCart").addEventListener("click", () => {
    updateStorage(getIdFromUrl());
  });
}

productPage();
