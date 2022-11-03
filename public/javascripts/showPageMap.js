

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: findID.geometry.coordinates, // starting position [lng, lat]
    zoom: 14, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});

new mapboxgl.Marker({
    color: "#32AAFF",
    draggable: false
})
    
    .setLngLat(findID.geometry.coordinates)
    .addTo(map);