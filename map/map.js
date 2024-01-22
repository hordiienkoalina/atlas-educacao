mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-52, -14], // Centered over Brazil
    zoom: 3
});

map.on('load', function() {
    map.addSource('brazil-data', {
        'type': 'geojson',
        'data': './map/data/access_data_state.geojson'
    });

    // Colour layer
    map.addLayer({
        'id': 'brazil-data-layer',
        'type': 'fill',
        'source': 'brazil-data',
        'layout': {},
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'A'],
                0, 'red', // Lowest access score
                1, 'green' // Highest access score
            ],
            'fill-opacity': 0.75
        }
    });

    // Border layer
    map.addLayer({
        'id': 'brazil-data-border',
        'type': 'line',
        'source': 'brazil-data',
        'layout': {},
        'paint': {
            'line-color': '#FFFFFF',
            'line-width': 0.3
        }
    });
});