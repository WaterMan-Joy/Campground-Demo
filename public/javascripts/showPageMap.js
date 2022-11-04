mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: findID.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
  projection: "globe", // display the map as a 3D globe
});
map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker({
  color: "#32AAFF",
  draggable: false,
})

  .setLngLat(findID.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup().setHTML(
      `<h3>${findID.title}</h3><p>${findID.location}</p>`
    )
  ) // add popup

  .addTo(map);
