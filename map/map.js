mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-52, -14], // Starting position [lng, lat]
    zoom: 3 // Starting zoom
});