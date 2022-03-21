let url = new URL(document.location);
let menuCouleurs = document.getElementById("colors");
let menuQuantite = document.getElementById("quantity");
let bouton = document.getElementById("addToCart");
let getColors = "";
let getQuantity = "";
let CartProduct = [];
let Cart = [];

/**
 * Retourne le nombre d'éléments de localStorage
 * @returns {Number}
 */
function numberLocalStorage() {
  return localStorage.length;
}

/**
 * Permet d'obtenir le panier sous forme de String
 * @returns {String}
 */
function getCart() {
  return localStorage.getItem("cart");
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

let blocPanier = document.getElementById("cart__items");

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
 * Ajoute le produit dans un tableau en vue de son ajout dans le panier
 * @param {Array} cart
 * @param {Array} productToAdd
 * @returns {Array}
 */
function addProduct(cart, productToAdd) {
  for (i in cart) {
    if (productToAdd[0] == cart[i][0] && productToAdd[2] == cart[i][2]) {
      cart[i][1] = cart[i][1] + Number(productToAdd[1]);
      alert("Quantité mise à jour!");
      return cart;
    }
  }
  cart.push(productToAdd);
  alert("Produit ajouté au panier!");
  return cart;
}

/** Récupère l'id dans l'URL de la page */
if (url.searchParams.has("id")) {
  let id = url.searchParams.get("id");
  fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    /**
     * Affiche les détails du produit dans la page
     * La boucle for ajoute les options de couleurs du produit dans le <select>
     */
    .then(function (produit) {
      console.log("http://localhost:3000/api/products/" + id);
      let imageProduit = document.createElement("img");
      imageProduit.setAttribute("src", produit.imageUrl);
      imageProduit.setAttribute("alt", produit.altTxt);
      document.querySelector(".item__img").appendChild(imageProduit);

      document.getElementById("title").textContent = produit.name;
      document.getElementById("price").textContent = produit.price;
      document.getElementById("description").textContent = produit.description;

      for (let i in produit.colors) {
        let option = document.createElement("option");
        option.setAttribute("value", produit.colors[i]);
        option.innerHTML = produit.colors[i];
        document.getElementById("colors").appendChild(option);
      }

      menuCouleurs.addEventListener("change", function () {
        getColors = menuCouleurs.value;
      });
      menuQuantite.addEventListener("change", function () {
        getQuantity = menuQuantite.value;
      });

      /**
       * Gère les différents évènements au moment de l'ajout du produit dans le panier
       */
      bouton.addEventListener("click", function () {
        CartProduct = verifyProduct(id, getQuantity, getColors);
        console.log("Article souhaité: " + CartProduct);
        if (CartProduct == 0) {
          alert("Veuillez indiquer une quantité et une couleur");
        } else {
          if (numberLocalStorage() == 0) {
            localStorage.setItem("cart", CartProduct);
          } else {
            Cart = localStorage.getItem("cart");
            Cart = panierStringToPanier(Cart);
            localStorage.setItem("cart", addProduct(Cart, CartProduct));
          }
        }
      });
    })
    .catch(function (err) {});
}
