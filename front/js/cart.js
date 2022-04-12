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
const addressRegex = /^1?\d{1,2} ([^0-9\_])+ (\d{5})+$/;
/**
 * Doit être de la forme "expression@nomdedomaine.com"
 */
const emailRegex = /^[\w\-\.]+@[\w\-\.]+\.[a-z]{2,3}$/;

/**
 * Créé une balise <element>, si des attributs sont présents, implémente ces attributs dans la balise
 * @param {String} tag
 * @param {String[]} [attribut]
 * @param {String[]} [attributName]
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
  displayTotalPrice.textContent = 0;
  displayTotalQuantity.textContent = 0;
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
 * Calcule le prix total dans le panier
 * @async
 * @param {Object[]} cart
 * @param {String} cart[].id
 * @param {Number} cart[].quantity
 * @returns {Number}
 */
async function getTotalPriceOfCart(cart) {
  let totalPrice = 0;
  for (let i in cart) {
    let product = await getProductFromAPI(cart[i].id);
    totalPrice = totalPrice + cart[i].quantity * product.price;
  }
  return totalPrice;
}

/**
 * Retourne une liste des ID des produits présents dans le panier
 * @param {Object[]} cart
 * @param {String} cart[].id
 * @returns {String[]}
 */
function getProductsIdFromCart(cart) {
  return cart.map((cartElement) => cartElement.id);
}

/**
 * Récupère un produit dans l'API à partir de son id
 * @param {String} id
 * @returns {Promise<Object>}
 */
async function getProductFromAPI(id) {
  try {
    let response = await fetch(`http://localhost:3000/api/products/${id}`);
    let resJson = await response.json();
    return resJson;
  } catch (err) {
    cartTag.textContent =
      "Impossible de communiquer avec la liste des produits";
    let message = `Impossible de trouver l'API`;
    throw new Error(message);
  }
}

/**
 * Construit les éléments nécessaires pour afficher le panier, liste de tous les produits en paramètre afin
 * de récupérer les informations manquantes aux produits du panier
 * @param {Object[]} cart
 * @param {String} cart[].id
 * @param {Number} cart[].quantity
 * @param {String} cart[].colors
 * @param {Object[]} productList
 * @param {String} productList._id
 */
async function displayCart(cart) {
  // Vérifie si le panier est vide, affiche que le panier est vide dans la page lorsque c'est le cas
  if (localStorage.length == 0) {
    displayEmptyCart(cartTag);
  } else {
    for (let i in cart) {
      productFound = await getProductFromAPI(cart[i].id);
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
      let productContent = createTag("div", ["class"], ["cart__item__content"]);
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
      let totalPrice = await getTotalPriceOfCart(cart);
      displayTotalPrice.textContent = totalPrice;
      displayTotalQuantity.textContent = getTotalQuantityOfCart(cart);
    }
  }
}

/** Met à jour la quantité du produit dans le panier ainsi que la quantité totale et le prix total sur la page
 * @param {Object[]} cart
 * @param {String} cart[].id
 * @param {Number} cart[].quantity
 * @param {String} cart[].colors
 */
function updateQuantity(cart) {
  let inputsQuantity = document.querySelectorAll(".itemQuantity");
  inputsQuantity.forEach((inputTag) => {
    let productToModifyTag = inputTag.closest("article");
    // Gestion de l'évènement "input" lorsqu'on change la quantité
    inputTag.addEventListener("input", async (event) => {
      for (let i in cart) {
        if (
          productToModifyTag.dataset.id == cart[i].id &&
          productToModifyTag.dataset.color == cart[i].colors
        ) {
          cart[i].quantity = parseInt(event.target.value);
          displayTotalPrice.textContent = await getTotalPriceOfCart(cart);
          displayTotalQuantity.textContent = getTotalQuantityOfCart(cart);
          localStorage.setItem("cart", JSON.stringify(cart));
        }
      }
    });
  });
}

/** Supprime un produit du panier
 * @param {Object[]} cart
 * @param {String} cart[].id
 * @param {Number} cart[].quantity
 * @param {String} cart[].colors
 */
function deleteProduct(cart) {
  let deleteButtons = document.querySelectorAll(".deleteItem");
  // Parcours de tous les boutons de suppression
  deleteButtons.forEach((deleteTag) => {
    let productToDeleteTag = deleteTag.closest("article");
    // Gestion de l'évènement "click" au clic sur le bouton "Supprimer"
    deleteTag.addEventListener("click", async (event) => {
      for (let i in cart) {
        if (
          productToDeleteTag.dataset.id == cart[i].id &&
          productToDeleteTag.dataset.color == cart[i].colors
        ) {
          cartTag.removeChild(productToDeleteTag);
          cart.splice(i, 1);
          displayTotalPrice.textContent = await getTotalPriceOfCart(cart);
          localStorage.setItem("cart", JSON.stringify(cart));
          displayTotalQuantity.textContent = getTotalQuantityOfCart(cart);
          if (cart.length == 0) {
            localStorage.removeItem("cart");
            displayEmptyCart(cartTag);
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
 * @async
 * @param {Object[]}
 * @param {String} cart[].id
 */
async function sendInformations(cart) {
  try {
    let products = getProductsIdFromCart(cart);
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
    let orderInformations = await orderInformationsJson.json();
    alert(`Récapitulatif de votre commande:\n
        Nom: ${orderInformations["contact"].lastName}\n
        Prénom: ${orderInformations["contact"].firstName}\n
        Addresse: ${orderInformations["contact"].address}\n
        Ville: ${orderInformations["contact"].city}\n
        Mail: ${orderInformations["contact"].email}\n
        Produits commandés: ${products}`);
    document.location.href = `../html/confirmation.html?orderId=${orderInformations.orderId}`;
  } catch (err) {
    let message = `Impossible de trouver l'API`;
    alert(
      "Une erreur s'est produite au moment de l'envoi de la commande, veuillez réessayez"
    );
    throw new Error(message);
  }
}

/**
 * Lorsque toutes les informations entrées par l'utilisateur sont correctes,
 * appelle la fonction sendInformations pour envoyer les informations vers l'API et
 * ainsi réaliser la commande du panier
 * @async
 * @param {Object[]}
 * @param {String} cart[].id
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

/**
 * Gère la page "Panier"
 * @async
 */
async function cartPage() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  await displayCart(cart);
  deleteProduct(cart);
  updateQuantity(cart);
  orderProductFromCart(cart);
}

cartPage();
