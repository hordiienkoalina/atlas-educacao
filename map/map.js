mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

// Add map bounds to prevent user from panning outside of Brazil
const bounds = [
    [-100, -45], // Southwest coordinates
    [-10, 20] // Northeast coordinates
];

// clear cache
//mapboxgl.clearStorage();

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs',
    center: [-52, -14], // Centered over Brazil
    zoom: 3, // Start overlooking the country
    minZoom: 3,
    maxZoom: 12,
    maxBounds: bounds
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

map.on('load', function() {

    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    console.log(layers);

});
