/**
 * Créé une balise <element>, si des attributs sont présents, implémente ces attributs dans la balise
 * @param {String} element
 * @param {String[]} attribut
 * @param {String[]} attributName
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
 * Récupère la liste des produits de l'API
 * @returns
 */
async function getAllProductsFromAPI() {
  let response = await fetch("http://localhost:3000/api/products/");
  if (!response.ok) {
    itemsTag.textContent = "Articles introuvables!";
    let message = `Erreur: ${response.status}, impossible de trouver l'API`;
    throw new Error(message);
  }
  let resJson = await response.json();
  return resJson;
}

/**
 * Crée les éléments HTML nécessaires en récupérant la liste des produits pour les afficher sur la page
 */
async function displayProducts() {
  let itemsTag = document.getElementById("items");
  let productList = await getAllProductsFromAPI();
  for (let i in productList) {
    let productLink = newElement(
      "a",
      ["href"],
      [`./product.html?id=${productList[i]._id}`]
    );

    let productArticle = newElement("article");

    let productImage = newElement(
      "img",
      ["src", "alt"],
      [productList[i].imageUrl, productList[i].altTxt]
    );

    let productName = newElement("h3", ["class"], ["productName"]);

    let productDescription = newElement("p", ["class"], ["produitDescription"]);

    productName.textContent = productList[i].name;
    productDescription.textContent = productList[i].description;

    itemsTag.appendChild(productLink);
    productLink.appendChild(productArticle);
    productArticle.appendChild(productImage);
    productArticle.appendChild(productName);
    productArticle.appendChild(productDescription);
  }
}

displayProducts();
