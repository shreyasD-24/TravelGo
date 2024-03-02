mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: "mapbox://styles/mapbox/streets-v12",
center: coordinates || [77.2090, 28.6139], // starting position [lng, lat]
zoom: 11 // starting zoom
});


// Set marker options.
const marker = new mapboxgl.Marker({
    color: "red",
}).setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 40})
    .setLngLat(coordinates)
    .setHTML(`<h4>${venue}</h4><p>Exact Location will be revealed on booking.</p>`)
    .setMaxWidth("300px")
    .addTo(map))
    .addTo(map);

