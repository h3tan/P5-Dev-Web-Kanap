const cartTag = document.getElementById("cart__items");
const displayTotalQuantity = document.getElementById("totalQuantity");
const displayTotalPrice = document.getElementById("totalPrice");
// Pas de chiffres dans les noms, doit commencer par une majuscule
const noNumberRegex = /^[A-Z]([^0-9\_])*$/;
/** Premier élément est un nombre suivie du nom de la rue et du code postal
 * Nombre: 1 ou 2 chiffres, si 3 chiffres, doit commencer par 1
 * Nom de la rue: seuls les chiffres, caractères (majuscules et minuscules), espace et tiret sont autorisés
 * Code postal: Doit être composé de 5 chiffres
 */
const addressRegex = /^([0-9]|[0-9][0-9]|1[0-9][0-9]) ([^0-9\_])+ ([0-9]{5})+$/;
/**
 * Doit être de la forme "expression@nomdedomaine.com"
 */
const emailRegex = /^[\w\-\.]+@[\w\-\.]+\.[a-z]{2,3}$/;

/**
 * Créé une balise <element>, si des attributs sont présents, implémente ces attributs dans la balise
 * @param {String} tag
 * @param {String[]} attribut
 * @param {String[]} attributName
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
 * Affiche un message sur la page informant que le panier est vide
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
 * Calcule la quantité totale des articles du panier
 * @param {Object[]} cart
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
 * Retourne une liste d'ID des produits présents dans le panier
 * @param {Object} cart
 * @returns {String[]}
 */
function getProductsIdFromCart(cart) {
  for (let i in cart) {
    cart[i] = cart[i].id;
  }
  return cart;
}

/**
 * Récupère la liste des produits
 * @returns {Object[]}
 */
async function getAllProductsFromAPI() {
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
 * Récupère un produit dans l'API à partir de son id
 * @param {String} id
 * @returns {Object[]}
 */
async function getProductFromAPI(id) {
  let response = await fetch(`http://localhost:3000/api/products/${id}`);
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
 * @param {Object[]} list
 * @returns {Object | Boolean}
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
 * Construit les éléments nécessaires pour afficher le panier, liste de tous les produits en paramètre afin
 * de récupérer les informations manquantes aux produits du panier
 * @param {Object[]} cart
 * @param {Object[]} productList
 */
async function displayCart(cart, productList) {
  // Vérifie si le panier est vide, affiche que le panier est vide dans la page lorsque c'est le cas
  if (localStorage.length == 0) {
    displayEmptyCart(cartTag);
  } else {
    let totalPrice = 0;
    for (let i in cart) {
      // Cherche le produit du panier dans la liste de l'API pour retrouver les informations manquantes comme le prix
      productFound = searchProductInList(cart[i].id, productList);
      if (productFound != false) {
        // Création de l'élément: <article class="cart__item" data-id="id du produit" data-color="couleurs choisies"></article>
        let newArticle = createTag(
          "article",
          ["class", "data-id", "data-color"],
          ["cart__item", cart[i].id, cart[i].colors]
        );
        // Création de l'élément <div class="cart__item__img"></div>
        let imgContainer = createTag("div", ["class"], ["cart__item__img"]);
        // Création de l'élément <img src="chemin de l'image" alt="texte alternatif" />
        let imgTag = createTag(
          "img",
          ["src", "alt"],
          [productFound.imageUrl, productFound.altTxt]
        );
        // Création de l'élément <div class="cart__item__content"></div>
        let productContent = createTag(
          "div",
          ["class"],
          ["cart__item__content"]
        );
        // Création de l'élément <div class="cart__item__content__description"></div>
        let descriptionTag = createTag(
          "div",
          ["class"],
          ["cart__item__content__description"]
        );
        // Création de l'élément <h2>Nom du produit</h2>
        let productNameTag = createTag("h2");
        productNameTag.textContent = productFound.name;
        // Création de l'élément <p>Couleurs choisies</p>
        let productColorsTag = createTag("p");
        productColorsTag.textContent = cart[i].colors;
        // Création de l'élément <p>Prix du produit</p>
        let productPriceTag = createTag("p");
        productPriceTag.textContent = productFound.price + " €";
        //Association des éléments pour la description du produit
        descriptionTag.appendChild(productNameTag);
        descriptionTag.appendChild(productColorsTag);
        descriptionTag.appendChild(productPriceTag);
        productContent.appendChild(descriptionTag);
        // Création de l'élément <div class="cart__item__content__settings"></div>
        let settingsTag = createTag(
          "div",
          ["class"],
          ["cart__item__content__settings"]
        );
        // Création de l'élément <div class="cart__item__content__settings__quantity"></div>
        let settingsQuantity = createTag(
          "div",
          ["class"],
          ["cart__item__content__settings__quantity"]
        );
        // Création de l'élément <p>Qté: </p>
        let quantityTag = createTag("p");
        quantityTag.innerText = `Qté:`;
        // Création de l'élément <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="">
        let quantityInput = createTag(
          "input",
          ["type", "class", "name", "min", "max", "value"],
          ["number", "itemQuantity", "itemQuantity", 1, 100, cart[i].quantity]
        );
        // Création de l'élément <div class="cart__item__content__settings__delete">
        let deleteContainer = createTag(
          "div",
          ["class"],
          ["cart__item__content__settings__delete"]
        );
        // Création de l'élément <div class="deleteItem"></div>
        let deleteButton = createTag("div", ["class"], ["deleteItem"]);
        deleteButton.style.cursor = "pointer";
        deleteButton.textContent = "Supprimer";
        deleteContainer.appendChild(deleteButton);
        // Association des éléments pour changer la quantité et supprimer un produit dans le conteneur
        settingsQuantity.appendChild(quantityTag);
        settingsQuantity.appendChild(quantityInput);
        settingsTag.appendChild(settingsQuantity);
        settingsTag.appendChild(deleteContainer);
        imgContainer.appendChild(imgTag);
        productContent.appendChild(settingsTag);
        newArticle.appendChild(imgContainer);
        newArticle.appendChild(productContent);
        cartTag.appendChild(newArticle);
        // Affichage de la quantité totale et du prix total du panier au chargement de la page
        totalPrice = totalPrice + cart[i].quantity * productFound.price;
        displayTotalPrice.textContent = totalPrice;
        displayTotalQuantity.textContent = getTotalQuantityOfCart(cart);
      }
    }
  }
}

/** Met à jour la quantité du produit dans le panier ainsi que la quantité totale et le prix total sur la page
 * @param {Object[]} cart
 */
function updateQuantity(cart) {
  let inputsQuantity = document.querySelectorAll(".itemQuantity");
  inputsQuantity.forEach(async (inputTag) => {
    let productToModifyTag = inputTag.closest("article");
    let product = await getProductFromAPI(productToModifyTag.dataset.id);
    let unitPrice = product.price;
    // Gestion de l'évènement "input" lorsqu'on change la quantité
    inputTag.addEventListener("input", (event) => {
      let totalPrice = parseInt(displayTotalPrice.textContent);
      for (let i in cart) {
        if (
          productToModifyTag.dataset.id == cart[i].id &&
          productToModifyTag.dataset.color == cart[i].colors
        ) {
          if (cart[i].quantity < parseInt(event.target.value)) {
            totalPrice = totalPrice + unitPrice;
          } else {
            totalPrice = totalPrice - unitPrice;
          }
          cart[i].quantity = parseInt(event.target.value);
          displayTotalQuantity.textContent = getTotalQuantityOfCart(cart);
          displayTotalPrice.textContent = totalPrice;
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      }
    });
  });
}

/** Supprime un produit du panier
 * @param {Object[]} cart
 */
function deleteProduct(cart) {
  let deleteButtons = document.querySelectorAll(".deleteItem");
  // Parcours de tous les boutons de suppression
  deleteButtons.forEach(async (deleteTag) => {
    let productToDeleteTag = deleteTag.closest("article");
    let product = await getProductFromAPI(productToDeleteTag.dataset.id);
    let unitPrice = product.price;
    // Gestion de l'évènement "click" au clic sur le bouton "Supprimer"
    deleteTag.addEventListener("click", (event) => {
      let totalPrice = parseInt(displayTotalPrice.textContent);
      for (let i in cart) {
        if (
          productToDeleteTag.dataset.id == cart[i].id &&
          productToDeleteTag.dataset.color == cart[i].colors
        ) {
          cartTag.removeChild(productToDeleteTag);
          if (cart.length == 1) {
            cart.pop();
            displayTotalPrice.textContent = 0;
            displayTotalQuantity.textContent = 0;
            localStorage.removeItem("cart");
            displayEmptyCart(cartTag);
          } else {
            totalPrice = totalPrice - cart[i].quantity * unitPrice;
            displayTotalPrice.textContent = totalPrice;
            cart.splice(i, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            displayTotalQuantity.textContent = getTotalQuantityOfCart(cart);
          }
        }
      }
    });
  });
}

/**
 * Vérifie si le texte saisi au fur et à mesure par l'utilisateur dans "tag" est valide selon le regex donné en paramètre
 * @param {*} regex
 * @param {HTMLElement} tag
 * @param {HTMLElement} tagError
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
 * Récupère les informations du formulaire renseigné par le client
 * @returns {Object}
 */
function getCustomerInformations() {
  let contact = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value,
  };
  return contact;
}

/**
 * Vérifie si toutes les informations entrées par le client sont correctes
 * @returns {Boolean}
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
 * La réponse de l'API permet de récupérer le numéro de commande pour la page de confirmation
 * */
async function sendInformations(cart) {
  let products = getProductsIdFromCart(cart);
  console.log(products);
  let orderInformationsJson = await fetch(
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
  if (!orderInformationsJson.ok) {
    let message = `Erreur: ${orderInformationsJson.status}, impossible de trouver l'API`;
    throw new Error(message);
  }
  let orderInformations = await orderInformationsJson.json();
  alert(`Récapitulatif de votre commande:\n
        Nom: ${orderInformations["contact"].lastName}\n
        Prénom: ${orderInformations["contact"].firstName}\n
        Addresse: ${orderInformations["contact"].address}\n
        Ville: ${orderInformations["contact"].city}\n
        Mail: ${orderInformations["contact"].email}\n
        Produits commandés: ${products}`);
  document.location.href = `../html/confirmation.html?orderId=${orderInformations.orderId}`;
}

/**
 * Lorsque toutes les informations entrées par l'utilisateur sont correctes,
 * appelle la fonction sendInformations pour envoyer les informations vers l'API et
 * ainsi réaliser la commande du panier
 */
function orderProductFromCart(cart) {
  let orderButton = document.getElementById("order");
  inputCheck(noNumberRegex, "firstName", "firstNameErrorMsg");
  inputCheck(noNumberRegex, "lastName", "lastNameErrorMsg");
  inputCheck(addressRegex, "address", "addressErrorMsg");
  inputCheck(noNumberRegex, "city", "cityErrorMsg");
  inputCheck(emailRegex, "email", "emailErrorMsg");
  orderButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (localStorage.length == 0) {
      alert("Votre panier est vide!");
      return;
    }
    if (checkInformations()) {
      sendInformations(cart);
    } else {
      alert("Veuillez vérifier vos informations");
    }
  });
}

// Gère la page Panier
async function cartPage() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  productsList = await getAllProductsFromAPI();
  displayCart(cart, productsList);
  deleteProduct(cart);
  updateQuantity(cart);
  orderProductFromCart(cart);
}

cartPage();
