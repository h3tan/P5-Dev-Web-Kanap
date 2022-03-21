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
 *  Ajoute <element> comme enfant de <parent> à la fin de ses autres enfants
 * @param {HTMLElement} parent
 * @param {HTMLElement} element
 * @returns {NHTMLElement}
 */
function append(parent, element) {
  return parent.appendChild(element);
}

/**
 *  Crée un nouvel attribut contentName pour <element> ayant pour valeur contentText
 * @param {HTMLElement} element
 * @param {String} contentName
 * @param {String} contentText
 */
function newAttribute(element, contentName, contentText) {
  element.setAttribute(contentName, contentText);
}

/**
 *  Ajoute text comme contenu de <element>
 * @param {HTMLElement} element
 * @param {String} text
 */
function setText(element, text) {
  element.textContent = text;
}

let blocArticles = document.getElementById("items");

/**
 * Effectue une requête sur l'API et récupère au format JSON les produits de l'API.
 * En cas d'erreur, affiche dans la page d'accueil l'impossibilité d'afficher les produits
 */

fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  /** Parcourt la liste des produits et les affiche sur la page d'accueil
   * Détails des produits affichés: id, image, nom et description.
   */
  .then(function (produits) {
    console.log(produits);
    for (let i in produits) {
      let lienCanape = newElement(
        "a",
        ["href"],
        [`./product.html?id=` + produits[i]._id]
      );

      let canape = newElement("article");

      let imageProduit = newElement(
        "img",
        ["src", "alt"],
        [produits[i].imageUrl, produits[i].altTxt]
      );

      let nomProduit = newElement("h3", ["class"], ["productName"]);

      let descriptionProduit = newElement(
        "p",
        ["class"],
        ["produitDescription"]
      );

      setText(nomProduit, produits[i].name);
      setText(descriptionProduit, produits[i].description);

      append(blocArticles, lienCanape);
      append(lienCanape, canape);
      append(canape, imageProduit);
      append(canape, nomProduit);
      append(canape, descriptionProduit);
    }
  })
  .catch(function (err) {
    blocArticles.innerHTML = "Impossible d'afficher les produits";
  });
