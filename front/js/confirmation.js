let url = new URL(document.location);

// Récupération du numéro de commande dans l'url de la page et affichage sur la page
document.getElementById("orderId").textContent =
  url.searchParams.get("orderId");
localStorage.removeItem("cart");
