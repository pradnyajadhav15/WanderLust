document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.getElementById("map");
  if (!mapElement) {
    console.error("Map element not found!");
    return;
  }

  const getCoord = (attr, defaultVal) => attr ? parseFloat(attr) : defaultVal;

  const lat = getCoord(mapElement.getAttribute("data-lat"), 21.76287);
  const lng = getCoord(mapElement.getAttribute("data-lng"), 72.15331);

  const map = L.map("map").setView([lat, lng], 10);

  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attribution = "&copy; WanderLust";
  L.tileLayer(tileUrl, { attribution }).addTo(map);

  const marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup("<b>WanderLust</b>").openPopup();
});
