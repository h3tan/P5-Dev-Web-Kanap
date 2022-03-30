let url = new URL(document.location);

document.getElementById("orderId").textContent =
  url.searchParams.get("orderId");
