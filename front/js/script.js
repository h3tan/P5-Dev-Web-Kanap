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

let blocArticles = document.getElementById("items");

/**
 * Affiche les produits dans la page
 * @param {Object} produits
 */
function displayProduits(produits) {
  for (let i in produits) {
    let lienCanape = newElement(
      "a",
      ["href"],
      [`./product.html?id= ${produits[i]._id}`]
    );

    let canape = newElement("article");

    let imageProduit = newElement(
      "img",
      ["src", "alt"],
      [produits[i].imageUrl, produits[i].altTxt]
    );

    let nomProduit = newElement("h3", ["class"], ["productName"]);

    let descriptionProduit = newElement("p", ["class"], ["produitDescription"]);

    nomProduit.textContent = produits[i].name;
    descriptionProduit.textContent = produits[i].description;

    blocArticles.appendChild(lienCanape);
    lienCanape.appendChild(canape);
    canape.appendChild(imageProduit);
    canape.appendChild(nomProduit);
    canape.appendChild(descriptionProduit);
  }
}

/**
 * Effectue une requête sur l'API et récupère au format JSON les produits de l'API.
 * En cas d'erreur, affiche dans la page d'accueil l'impossibilité d'afficher les produits
 */

fetch("http://localhost:3000/api/products/")
  .then((res) => res.json())
  /** Parcourt la liste des produits et les affiche sur la page d'accueil
   * Détails des produits affichés: id, image, nom et description.
   */
  .then(displayProduits)
  .catch(function (err) {
    blocArticles.innerHTML = "Impossible d'afficher les produits";
  });
