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
    let produit = document.getElementById("items");
    for (let i in produits) {
      let lienCanape = document.createElement("a");
      lienCanape.setAttribute("href", `./product.html?id=` + produits[i]._id);

      let canape = document.createElement("article");

      let imageProduit = document.createElement("img");
      imageProduit.setAttribute("src", produits[i].imageUrl);
      imageProduit.setAttribute("alt", produits[i].altTxt);

      let nomProduit = document.createElement("h3");
      nomProduit.setAttribute("class", "productName");

      let descriptionProduit = document.createElement("p");
      descriptionProduit.setAttribute("class", "productDescription");

      nomProduit.textContent = produits[i].name;
      descriptionProduit.textContent = produits[i].description;

      canape.appendChild(imageProduit);
      canape.appendChild(nomProduit);
      canape.appendChild(descriptionProduit);
      lienCanape.appendChild(canape);

      produit.appendChild(lienCanape);
    }
  })
  .catch(function (err) {
    let produit = document.getElementById("items");
    produit.innerHTML = "Impossible d'afficher les produits";
  });
