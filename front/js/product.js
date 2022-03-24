let url = new URL(document.location);
let blocPanier = document.getElementById("cart__items");
let menuCouleurs = document.getElementById("colors");
let menuQuantite = document.getElementById("quantity");
let bouton = document.getElementById("addToCart");

/**
 * Ajoute les balises <option> avec les valeurs passées en paramètres
 * @param {Array} options
 */
function setOptions(id, options) {
  for (let i in options) {
    let optionTag = document.createElement("option");
    optionTag.setAttribute("value", options[i]);
    optionTag.innerHTML = options[i];
    document.getElementById(id).appendChild(optionTag);
  }
}

/**
 * Vérifie si la quantité est entre 0 et 300 et qu'une couleur a bien été sélectionnée
 * Retourne un tableau contenant l'id, la quantité et les couleurs du produit souhaité
 * Retourne 0 si les deux conditions ne sont pas satisfaites
 * @param {String} id
 * @param {Number} quantity
 * @param {String} colors
 * @returns
 */
function verifyProduct(id, quantity, colors) {
  if (quantity == 0 || quantity > 300 || colors == "") {
    return 0;
  } else {
    let array = [id, quantity, colors];
    return array;
  }
}

/**
 * Convertit le panier qui est sous forme de String en un tableau
 * à deux dimensions contenant des tableaux à trois éléments
 * @param {String} cart
 * @returns
 */
function panierStringToPanier(cart) {
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

/**
 * Cherche si le produit est déjà dans le panier (couple id et couleurs identiques)
 * Si déjà présent, met à jour la quantité du produit déjà dans le panier avec la valeur du produit ajouté
 * @param {Array} cart
 * @param {Array} product
 * @returns
 */
function searchProduct(cart, product) {
  for (i in cart) {
    if (cart[i][0] == product[0] && cart[i][2] == product[2]) {
      cart[i][1] += Number(product[1]);
      return true;
    }
  }
  return false;
}

/**
 * Met à jour le panier en fonction de l'ajout (mise à jour de la quantité ou ajout dans le panier)
 * @param {Array} cart
 * @param {Array} product
 */
function updateStorage(cart, product) {
  if (localStorage.length == 0) {
    localStorage.setItem("cart", product);
    alert("Produit ajouté au panier!");
  } else {
    cart = panierStringToPanier(localStorage.getItem("cart"));
    if (searchProduct(cart, product)) {
      localStorage.setItem("cart", cart);
      alert("Quantité mise à jour!");
    } else {
      cart.push(product);
      localStorage.setItem("cart", cart);
      alert("Produit ajouté au panier!");
    }
  }
}

/**
 * Ajoute le produit dans le panier
 * @param {String} id
 * @param {Number} quantity
 * @param {String} colors
 * @returns {Boolean}
 */
function addToCart(id, quantity, colors) {
  let currentCart = [];
  let product = verifyProduct(id, quantity, colors);
  if (product == 0) {
    alert("Veuillez choisir une quantité et une couleur");
    return false;
  } else {
    updateStorage(currentCart, product);
    return true;
  }
}

/** Récupère l'id dans l'URL de la page */
if (url.searchParams.has("id")) {
  let getColors = "";
  let getQuantity = "";
  let id = url.searchParams.get("id");
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    /**
     * Affiche les détails du produit dans la page
     * La boucle for ajoute les options de couleurs du produit dans le <select>
     */
    .then((produit) => {
      let imageProduit = document.createElement("img");
      imageProduit.setAttribute("src", produit.imageUrl);
      imageProduit.setAttribute("alt", produit.altTxt);
      document.querySelector(".item__img").appendChild(imageProduit);

      document.getElementById("title").textContent = produit.name;
      document.getElementById("price").textContent = produit.price;
      document.getElementById("description").textContent = produit.description;

      setOptions("colors", produit.colors);

      menuCouleurs.addEventListener("change", function () {
        getColors = menuCouleurs.value;
      });
      menuQuantite.addEventListener("change", function () {
        getQuantity = menuQuantite.value;
      });

      /**
       * Ajoute le produit au panier au moment du clic sur le bouton
       */
      bouton.addEventListener("click", function () {
        addToCart(id, getQuantity, getColors);
      });
    })
    .catch((err) => {});
}
