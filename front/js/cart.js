function getElement(item) {
  if (localStorage.length > 0) {
    return localStorage.getItem(item);
  } else {
    let empty = [];
    console.log("Panier Vide!");
    return empty;
  }
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

let blocPanier = document.getElementById("cart__items");

/**
 * Convertit le panier qui est sous forme de String en un tableau
 * à deux dimensions contenant des tableaux à trois éléments
 * @param {String} cart
 * @returns
 */
function panierStringToPanier(cart) {
  if (cart.length == 0) {
    console.log("Panier vide!");
  } else {
    cart = cart.split(",");
    let newCart = [];
    let i = 0;
    while (i < cart.length) {
      let produit = [cart[i], Number(cart[i + 1]), cart[i + 2]];
      newCart.push(produit);
      i = i + 3;
    }
    return newCart;
  }
}

/**
 * Affiche les articles du panier
 */
let cart = getElement("cart");
cart = panierStringToPanier(cart);
for (let i in cart) {
  let url = "http://localhost:3000/api/products/" + cart[i][0];
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (value) {
      /**
       * Création du conteneur principal des informations d'un produit
       */
      let newArticle = newElement(
        "article",
        ["class", "data-id", "data-color"],
        ["cart__item", cart[i][0], cart[i][2]]
      );

      /**
       * Création du conteneur de l'image du produit
       */
      let blocImage = newElement("div", ["class"], ["cart__item__img"]);
      /*     newAttribute(blocImage, "class", "cart__item__img"); */
      let imageProduit = newElement(
        "img",
        ["src", "alt"],
        [value.imageUrl, value.altTxt]
      );

      /**
       * Création des conteneurs avec la description du produit: nom, prix, couleurs choisies
       */
      let articleContenu = newElement(
        "div",
        ["class"],
        ["cart__item__content"]
      );
      /* newAttribute(articleContenu, "class", "cart__item__content"); */
      let contenuDescription = newElement(
        "div",
        ["class"],
        ["cart__item__content__description"]
      );
      let nomProduit = newElement("h2");
      nomProduit.textContent = value.name;
      let couleursProduit = newElement("p");
      couleursProduit.textContent = cart[i][2];
      let prixProduit = newElement("p");
      prixProduit.textContent = value.price + " €";
      /**
       * Association des éléments de description dans le conteneur de description
       */
      contenuDescription.appendChild(nomProduit);
      contenuDescription.appendChild(couleursProduit);
      contenuDescription.appendChild(prixProduit);
      articleContenu.appendChild(contenuDescription);

      /**
       * Création du conteneur pour changer les quantités ou supprimer un produit
       */
      let contenuSettings = newElement(
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
      let valeurQuantite = newElement("p");
      let changeQuantite = newElement(
        "input",
        ["type", "itemQuantity", "name", "min", "max", "value"],
        ["number", "itemQuantity", "itemQuantity", 1, 100, cart[i][1]]
      );
      valeurQuantite.textContent = "Qté : " + cart[i][1];

      /**
       * Création des conteneurs du lien pour supprimer un article
       */
      let deleteConteneur = newElement(
        "div",
        ["class"],
        ["cart__item__content__settings__delete"]
      );
      let deleteButton = newElement("div", ["class"], ["deleteItem"]);
      deleteButton.textContent = "Supprimer";
      deleteConteneur.appendChild(deleteButton);
      /**
       * Association des éléments pour changer la quantité et supprimer un produit dans le conteneur
       */
      settingsQuantity.appendChild(valeurQuantite);
      settingsQuantity.appendChild(changeQuantite);

      contenuSettings.appendChild(settingsQuantity);
      contenuSettings.appendChild(deleteConteneur);

      blocImage.appendChild(imageProduit);

      articleContenu.appendChild(contenuSettings);

      newArticle.appendChild(blocImage);
      newArticle.appendChild(articleContenu);

      blocPanier.appendChild(newArticle);
    });
}

let totalQuantity = document.getElementById("totalQuantity");
let prixTotal = document.getElementById("totalPrice");
let changeQuantity = document.getElementsByName("itemQuantity");
console.log(changeQuantity);

changeQuantity.addEventListener("change", function () {
  totalQuantity.textContent = changeQuantity.value;
});
