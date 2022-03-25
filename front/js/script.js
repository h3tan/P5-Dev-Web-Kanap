let blocArticles = document.getElementById("items");

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
 * Récupère la liste des produits
 * @returns
 */
async function getProduits() {
  let response = await fetch("http://localhost:3000/api/products/");
  if (!response.ok) {
    blocArticles.textContent = "Articles introuvables!";
    let message = `Erreur: ${response.status}, impossible de trouver l'API`;
    throw new Error(message);
  }
  let resJson = await response.json();
  return resJson;
}

/**
 * Affiche les produits dans la page
 * @param {Object} produits
 */
async function displayProduits() {
  let produits = await getProduits();
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

displayProduits();
