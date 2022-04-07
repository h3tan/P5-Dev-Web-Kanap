/**
 * Ajoute les balises <option> avec les valeurs passées en paramètres
 * @param {String}
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
 async function getProductByIdFromAPI() {
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
     return false;
   } else {
     let product = { id: id, quantity: quantity, colors: colors };
     return product;
   }
 }

 /**
  * Cherche si le produit (product) est déjà dans le panier (cart) (couple id et couleurs identiques)
  * Si oui, met à jour la quantité du produit déjà dans le panier avec la quantité du produit ajouté
  * @param {Object[]} cart
  * @param {Object} product
  * @returns
  */
 function searchProductInCart(cart, product) {
   let productArray = [product];
   for (let i in cart) {
     if (
       cart[i].id == productArray[0].id &&
       cart[i].colors == productArray[0].colors
     ) {
       cart[i].quantity = `${
         Number(cart[i].quantity) + Number(productArray[0].quantity)
       }`;
       return true;
     }
   }
   return false;
 }

 /**
  * Permet de trier un tableau d'objet en les regroupant par ID
  * A appeler avec la méthode "sort()" des tableaux
  * @param {Object} productA
  * @param {Object} productB
  * @returns
  */
 function sortById(productA, productB) {
   if (productA.id > productB.id) {
     return -1;
   } else {
     return 1;
   }
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
  * @returns
  */
 function updateStorage(id) {
   let colorsTag = document.getElementById("colors");
   let quantityTag = document.getElementById("quantity");
   let cart = JSON.parse(localStorage.getItem("cart"));
   let product = verifyQuantityAndColors(
     id,
     quantityTag.value,
     colorsTag.value
   );
   // Vérifie que l'utilisateur a choisi une couleur et une quantité
   if (product == false) {
     alert("Veuillez choisir une quantité et une couleur");
     return;
   }
   // Si le panier est vide, met le produit dans le panier
   if (localStorage.length == 0) {
     localStorage.setItem("cart", `[${JSON.stringify(product)}]`);
     goToCartPage(false);
     return;
   }
   // Appel de la fonction de recherche du produit dans le panier et mise à jour du panier avec la quantité si c'est le cas
   if (searchProductInCart(cart, product)) {
     localStorage.setItem("cart", JSON.stringify(cart));
     goToCartPage(true);
     return;
   }
   // Ajoute le produit dans le panier s'il n'était pas déjà présent et que le panier est non vide
   cart.push(product);
   cart.sort(sortById);
   localStorage.setItem("cart", JSON.stringify(cart));
   goToCartPage(false);
 }

 /**
  * Construit les éléments nécessaires à l'affiche des informations du produit
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
  */
 async function productPage() {
   await displayProductById();
   document.getElementById("addToCart").addEventListener("click", function () {
     updateStorage(getIdFromUrl());
   });
 }

productPage();
