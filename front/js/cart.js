let cartTag = document.getElementById("cart__items");
let displayTotalQuantity = document.getElementById("totalQuantity");
let displayTotalPrice = document.getElementById("totalPrice");
// Pas de chiffres dans les noms
const noNumberRegex = /^[A-Z]([^0-9\_])*$/;
/** Premier élément est un nombre suivie du nom de la rue et du code postal
 * Nombre: 1 ou 2 chiffres, si 3 chiffres, doit commencer par 1
 * Nom de la rue: seuls les chiffres, caractères (majuscules et minuscules), espace et tiret sont autorisés
 * Code postal: Doit être composé de 5 chiffres
 */
const addressRegex =
  /^([0-9]|[0-9][0-9]|1[0-9][0-9]) [0-9A-Za-zàéèçù\- ]+ ([0-9]{5})+$/;
/**
 * Doit être de la forme "expression@nomdedomaine.com"
 */
const emailRegex = /^[\w\-\.]+@[\w\-\.]+\.[a-z]{2,3}$/;

/**
 * Affiche le panier vide dans la page panier
 * @param {HTMLElement} tag
 */
function displayEmptyCart(tag) {
  let afficheEmptyCart = createTag("h2");
  afficheEmptyCart.style.textAlign = "center";
  afficheEmptyCart.textContent = "Panier Vide!";
  tag.appendChild(afficheEmptyCart);
  return 0;
}

/**
 * Créé une balise <element>, si des attributs sont présents, implémente ces attributs dans la balise
 * @param {String} element
 * @param {Array} attribut : Array of String
 * @param {Array} attributName : Array of String
 * Taille de attribut et attributName doivent être égales
 * @returns {HTMLElement}
 */
function createTag(tag, attribute, attributeName) {
  let newTag = document.createElement(tag);
  if (arguments.length < 2) {
    return newTag;
  } else {
    for (i in attributeName) {
      newTag.setAttribute(attribute[i], attributeName[i]);
    }
    return newTag;
  }
}

/**
 * Convertit le panier qui est sous forme de String en un tableau
 * à deux dimensions contenant des tableaux à trois éléments
 * @param {String} cart
 * @returns
 */
function cartStringToArray(cart) {
  if (cart.length > 0) {
    cart = cart.split(",");
    let newCart = [];
    let i = 0;
    for (let i = 0; i < cart.length; i = i + 3) {
      let produit = [cart[i], Number(cart[i + 1]), cart[i + 2]];
      newCart.push(produit);
    }
    return newCart;
  }
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
 * Retourne une liste d'ID des produits présents dans le panier
 * @returns {Array}
 */
function getProductsIdFromCart() {
  let cart = cartStringToArray(localStorage.getItem("cart"));
  for (let i in cart) {
    cart[i] = cart[i][0];
  }
  return cart;
}

/**
 * Récupère la liste des produits
 * @returns
 */
async function getProductsFromAPI() {
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
 * Cherche l'élément index dans list
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
  if (localStorage.length == 0) {
    displayEmptyCart(cartTag);
  } else {
    let cart = localStorage.getItem("cart");
    let totalPrice = 0;
    let totalQuantity = 0;
    cart = cartStringToArray(cart);
    let productList = await getProductsFromAPI();
    for (let i in cart) {
      let productFound = searchProductInList(cart[i][0], productList);
      if (productFound != false) {
        let newArticle = createTag(
          "article",
          ["class", "data-id", "data-color"],
          ["cart__item", cart[i][0], cart[i][2]]
        );

        /**
         * Création du conteneur de l'image du produit
         */
        let imgContainer = createTag("div", ["class"], ["cart__item__img"]);
        let imgTag = createTag(
          "img",
          ["src", "alt"],
          [productFound.imageUrl, productFound.altTxt]
        );

        /**
         * Création des conteneurs avec la description du produit: nom, prix, couleurs choisies
         */
        let productContent = createTag(
          "div",
          ["class"],
          ["cart__item__content"]
        );
        let descriptionTag = createTag(
          "div",
          ["class"],
          ["cart__item__content__description"]
        );
        let productNameTag = createTag("h2");
        productNameTag.textContent = productFound.name;
        let productColorsTag = createTag("p");
        productColorsTag.textContent = cart[i][2];
        let productPriceTag = createTag("p");
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
        let settingsTag = createTag(
          "div",
          ["class"],
          ["cart__item__content__settings"]
        );

        let settingsQuantity = createTag(
          "div",
          ["class"],
          ["cart__item__content__settings__quantity"]
        );
        /**
         * Création des éléments pour changer la quantité
         */
        let quantityTag = createTag("p");
        let quantityInput = createTag(
          "input",
          ["type", "class", "name", "min", "max", "value"],
          ["number", "itemQuantity", "itemQuantity", 1, 100, cart[i][1]]
        );
        quantityTag.innerText = `Qté:`;

        /**
         * Création des conteneurs du lien pour supprimer un article
         */
        let deleteContainer = createTag(
          "div",
          ["class"],
          ["cart__item__content__settings__delete"]
        );
        let deleteButton = createTag("div", ["class"], ["deleteItem"]);
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

/** Met à jour la quantité du produit dans le panier et la quantité totale et le prix total sur la page
 */
function updateQuantity() {
  let inputsQuantity = document.querySelectorAll(".itemQuantity");
  inputsQuantity.forEach((inputTag) => {
    let productToModifyTag = inputTag.closest("article");
    let priceTag = productToModifyTag.querySelector("p:nth-child(3)");
    inputTag.addEventListener("change", (event) => {
      let cart = cartStringToArray(localStorage.getItem("cart"));
      let totalPrice = parseInt(displayTotalPrice.textContent);
      for (let i in cart) {
        if (
          productToModifyTag.dataset.id == cart[i][0] &&
          productToModifyTag.dataset.color == cart[i][2]
        ) {
          if (cart[i][1] < Number(event.target.value)) {
            totalPrice = totalPrice + parseInt(priceTag.textContent);
          } else {
            totalPrice = totalPrice - parseInt(priceTag.textContent);
          }
          cart[i][1] = Number(event.target.value);
          displayTotalQuantity.textContent = getTotalQuantity(cart);
          displayTotalPrice.textContent = totalPrice;
          localStorage.setItem("cart", cart);
        }
      }
    });
  });
}

/**
 * Supprime un produit du panier
 */
function deleteProduct() {
  let deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((deleteTag) => {
    let productToDeleteTag = deleteTag.closest("article");
    let priceTag = productToDeleteTag.querySelector("p:nth-child(3)");
    deleteTag.addEventListener("click", (event) => {
      let cart = cartStringToArray(localStorage.getItem("cart"));
      let totalPrice = parseInt(displayTotalPrice.textContent);
      for (let i in cart) {
        if (
          productToDeleteTag.dataset.id == cart[i][0] &&
          productToDeleteTag.dataset.color == cart[i][2]
        ) {
          cartTag.removeChild(productToDeleteTag);
          if (cart.length == 1) {
            cart.pop();
            displayTotalPrice.textContent = 0;
            displayTotalQuantity.textContent = 0;
            localStorage.removeItem("cart");
            displayEmptyCart(cartTag);
          } else {
            totalPrice =
              totalPrice - cart[i][1] * parseInt(priceTag.textContent);
            displayTotalPrice.textContent = totalPrice;
            cart.splice(i, 1);
            localStorage.setItem("cart", cart);
            displayTotalQuantity.textContent = getTotalQuantity(cart);
          }
        }
      }
    });
  });
}

/**
 * Vérifie si le texte saisie dans tag est valide selon le regex donné en paramètre
 * @param {*} regex
 * @param {*} tag
 * @param {*} tagError
 */
function inputCheck(regex, tag, tagError) {
  let inputTag = document.getElementById(tag);
  inputTag.addEventListener("input", (event) => {
    if (regex.test(event.target.value)) {
      document.getElementById(tagError).textContent = "";
      document.getElementById(tagError).setAttribute("value", "true");
    } else {
      document.getElementById(tagError).textContent = "Entrée Invalide";
      document.getElementById(tagError).setAttribute("value", "false");
    }
  });
}

/**
 * Récupère les informations du formulaire de renseignements
 * @returns
 */
function getCustomerInformations() {
  if (localStorage.length == 0) {
    alert("Votre panier est vide");
  } else {
    let contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    };
    return contact;
  }
}

/**
 * Vérifie si toutes les informations entrées par l'utilisateur sont correctes
 * @returns
 */
function checkInformations() {
  if (
    document.getElementById("firstNameErrorMsg").getAttribute("value") ==
      "true" &&
    document.getElementById("lastNameErrorMsg").getAttribute("value") ==
      "true" &&
    document.getElementById("addressErrorMsg").getAttribute("value") ==
      "true" &&
    document.getElementById("cityErrorMsg").getAttribute("value") == "true" &&
    document.getElementById("emailErrorMsg").getAttribute("value") == "true"
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Envoie les informations (données du formulaire et liste des ID des produits dans le panier) vers l'API
 */
async function sendInformations() {
  let products = getProductsIdFromCart();
  let orderInformations = await fetch(
    "http://localhost:3000/api/products/order",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: getCustomerInformations(),
        products: products,
      }),
    }
  );
  if (!orderInformations.ok) {
    let message = `Erreur: ${orderInformations.status}, impossible de trouver l'API`;
    throw new Error(message);
  }
  let orderInformationsJson = await orderInformations.json();
  alert("Vous allez être redirigé vers la page de confirmation");
  localStorage.removeItem("cart");
  document.location.href = `../html/confirmation.html?orderId=${orderInformationsJson.orderId}`;
}

/**
 * Lorsque toutes les informations entrées par l'utilisateur sont correctes, envoie les informations vers l'API
 */
function orderProductFromCart() {
  let orderButton = document.getElementById("order");
  inputCheck(noNumberRegex, "firstName", "firstNameErrorMsg");
  inputCheck(noNumberRegex, "lastName", "lastNameErrorMsg");
  inputCheck(addressRegex, "address", "addressErrorMsg");
  inputCheck(noNumberRegex, "city", "cityErrorMsg");
  inputCheck(emailRegex, "email", "emailErrorMsg");
  orderButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (checkInformations()) {
      sendInformations();
    } else {
      alert("Veuillez vérifier vos informations");
    }
  });
}

/**
 * Gère la page Panier
 */
async function cartPage() {
  await displayCart();
  deleteProduct();
  updateQuantity();
  inputCheck(noNumberRegex, "firstName", "firstNameErrorMsg");
  inputCheck(noNumberRegex, "lastName", "lastNameErrorMsg");
  inputCheck(addressRegex, "address", "addressErrorMsg");
  inputCheck(noNumberRegex, "city", "cityErrorMsg");
  inputCheck(emailRegex, "email", "emailErrorMsg");
  orderProductFromCart();
}

cartPage();
