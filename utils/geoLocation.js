async function geocodeAddress(address) {
    // const query = encodeURIComponent(address);
    // const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length === 0) {
      throw new Error("Location not found");
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding Error:", error);
    return null;
  }
}

module.exports = geocodeAddress;