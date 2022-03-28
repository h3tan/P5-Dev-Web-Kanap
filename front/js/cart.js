let cartTag = document.getElementById("cart__items");
let displayTotalQuantity = document.getElementById("totalQuantity");
let displayTotalPrice = document.getElementById("totalPrice");

/**
 * Affiche le panier vide dans la page panier
 * @param {HTMLElement} tag
 */
function displayEmptyCart(tag) {
  let afficheEmptyCart = newElement("h2");
  afficheEmptyCart.style.textAlign = "center";
  afficheEmptyCart.textContent = "Panier Vide!";
  tag.appendChild(afficheEmptyCart);
  return 0;
}

/**
 * Créé une balise <element>, si des attributs sont présents, implante ces attributs dans la balise
 * @param {String} element
 * @param {Array} attribut : Array of String
 * @param {Array} attributName : Array of String
 * Taille de attribut et attributName doivent être égales
 * @returns {HTMLElement}
 */
function newElement(element, attribut, attributName) {
  let newElt = document.createElement(element);
  if (arguments.length < 2) {
    return newElt;
  } else {
    for (i in attribut) {
      newElt.setAttribute(attribut[i], attributName[i]);
    }
    return newElt;
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
  let i = 0;
  for (let i = 0; i < cart.length; i = i + 3) {
    let produit = [cart[i], Number(cart[i + 1]), cart[i + 2]];
    newCart.push(produit);
  }
  return newCart;
}

/**
 * Calcule la quantité totale des articles du panier
 * @param {Array} cart
 * @returns {Number}
 */
function getTotalQuantity(cart) {
  let totalQuantity = 0;
  for (let i in cart) {
    totalQuantity += cart[i][1];
  }
  return totalQuantity;
}

/**
 * Récupère la liste des produits
 * @returns
 */
async function getProducts() {
  let response = await fetch(`http://localhost:3000/api/products/`);
  if (!response.ok) {
    cartTag.textContent =
      "Impossible de communiquer avec la liste des produits";
    let message = `Erreur: ${response.status}, impossible de trouver l'API`;
    throw new Error(message);
  }
  let resJson = await response.json();
  return resJson;
}

/**
 * Cherche l''élément index dans list
 * @param {String} index
 * @param {Object} list
 * @returns
 */
function searchProductInList(index, list) {
  for (let i in list) {
    if (index == list[i]._id) {
      return list[i];
    }
  }
  return false;
}

/**
 * Construit les éléments nécessaires pour afficher le panier
 * @param {Array} cart
 */
async function displayCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    displayEmptyCart(cartTag);
  } else {
    let totalPrice = 0;
    let totalQuantity = 0;
    cart = panierStringToArray(cart);
    let productList = await getProducts();
    for (let i in cart) {
      let productFound = searchProductInList(cart[i][0], productList);
      if (productFound != false) {
        let newArticle = newElement(
          "article",
          ["class", "data-id", "data-color"],
          ["cart__item", cart[i][0], cart[i][2]]
        );

        /**
         * Création du conteneur de l'image du produit
         */
        let imgContainer = newElement("div", ["class"], ["cart__item__img"]);
        let imgTag = newElement(
          "img",
          ["src", "alt"],
          [productFound.imageUrl, productFound.altTxt]
        );

        /**
         * Création des conteneurs avec la description du produit: nom, prix, couleurs choisies
         */
        let productContent = newElement(
          "div",
          ["class"],
          ["cart__item__content"]
        );
        let descriptionTag = newElement(
          "div",
          ["class"],
          ["cart__item__content__description"]
        );
        let productNameTag = newElement("h2");
        productNameTag.textContent = productFound.name;
        let productColorsTag = newElement("p");
        productColorsTag.textContent = cart[i][2];
        let productPriceTag = newElement("p");
        productPriceTag.textContent = productFound.price + " €";
        /**
         * Association des éléments de description dans le conteneur de description
         */
        descriptionTag.appendChild(productNameTag);
        descriptionTag.appendChild(productColorsTag);
        descriptionTag.appendChild(productPriceTag);
        productContent.appendChild(descriptionTag);

        /**
         * Création du conteneur pour changer les quantités ou supprimer un produit
         */
        let settingsTag = newElement(
          "div",
          ["class"],
          ["cart__item__content__settings"]
        );

        let settingsQuantity = newElement(
          "div",
          ["class"],
          ["cart__item__content__settings__quantity"]
        );
        /**
         * Création des éléments pour changer la quantité
         */
        let quantityTag = newElement("p");
        let quantityInput = newElement(
          "input",
          ["type", "class", "name", "min", "max", "value"],
          ["number", "itemQuantity", "itemQuantity", 1, 100, cart[i][1]]
        );
        quantityTag.innerText = `Qté:`;

        /**
         * Création des conteneurs du lien pour supprimer un article
         */
        let deleteContainer = newElement(
          "div",
          ["class"],
          ["cart__item__content__settings__delete"]
        );
        let deleteButton = newElement("div", ["class"], ["deleteItem"]);
        deleteButton.style.cursor = "pointer";
        deleteButton.textContent = "Supprimer";
        deleteContainer.appendChild(deleteButton);
        /**
         * Association des éléments pour changer la quantité et supprimer un produit dans le conteneur
         */
        settingsQuantity.appendChild(quantityTag);
        settingsQuantity.appendChild(quantityInput);

        settingsTag.appendChild(settingsQuantity);
        settingsTag.appendChild(deleteContainer);

        imgContainer.appendChild(imgTag);

        productContent.appendChild(settingsTag);

        newArticle.appendChild(imgContainer);
        newArticle.appendChild(productContent);

        cartTag.appendChild(newArticle);

        displayTotalQuantity.textContent = totalQuantity;

        /**
         * Affichage de la quantité totale et du prix total au chargement du panier
         */
        totalPrice = totalPrice + cart[i][1] * productFound.price;
        displayTotalPrice.textContent = totalPrice;
        displayTotalQuantity.textContent = getTotalQuantity(cart);
      }
    }
  }
}

/**
 * Affiche le panier
 */
async function cartPage() {
  await displayCart();
}

cartPage();
