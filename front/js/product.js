/** Récupère l'id dans l'URL de la page */

let url = new URL(document.location);
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
      let imageProduit = document.createElement("img");
      imageProduit.setAttribute("src", produit.imageUrl);
      imageProduit.setAttribute("alt", produit.altTxt);
      document.querySelector(".item__img").appendChild(imageProduit);

      document.getElementById("title").textContent = produit.name;
      document.getElementById("price").textContent = produit.price;
      document.getElementById("description").textContent = produit.description;

      for (let i in produit.colors) {
        console.log(produit.colors[i]);
        let option = document.createElement("option");
        option.setAttribute("value", produit.colors[i]);
        option.innerHTML = produit.colors[i];
        document.getElementById("colors").appendChild(option);
      }
    })
    .catch(function (err) {});
}
