mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-52, -14], // Centered over Brazil
    zoom: 3
});

const zoomThreshold = 5;

map.on('load', function() {
    // State data source
    map.addSource('brazil-state-data', {
        'type': 'geojson',
        'data': './map/data/access_data_state.geojson'
    });

    // Microregion data source
    map.addSource('brazil-microregion-data', {
        'type': 'geojson',
        'data': './map/data/access_data_microregion.geojson'
    });

    // Municipality data source
    map.addSource('brazil-municipality-data', {
        'type': 'geojson',
        'data': './map/data/access_data_municipality.geojson'
    });

    // State layer
    map.addLayer({
        'id': 'brazil-state-layer',
        'type': 'fill',
        'source': 'brazil-state-data',
        'minzoom': 0,
        'maxzoom': zoomThreshold,
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

    // Microregion layer
    map.addLayer({
        'id': 'brazil-microregion-layer',
        'type': 'fill',
        'source': 'brazil-microregion-data',
        'minzoom': zoomThreshold,
        'maxzoom': zoomThreshold + 3,
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

    // Municipality layer
    map.addLayer({
        'id': 'brazil-municipality-layer',
        'type': 'fill',
        'source': 'brazil-municipality-data',
        'minzoom': zoomThreshold + 3, // Adjust zoom level for municipality layer
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

    // State border layer
    map.addLayer({
        'id': 'brazil-state-border',
        'type': 'line',
        'source': 'brazil-state-data',
        'minzoom': 0,
        'maxzoom': zoomThreshold,
        'layout': {},
        'paint': {
            'line-color': '#FFFFFF',
            'line-width': 0
        }
    });

    // Microregion border layer
    map.addLayer({
        'id': 'brazil-microregion-border',
        'type': 'line',
        'source': 'brazil-microregion-data',
        'minzoom': zoomThreshold,
        'layout': {},
        'paint': {
            'line-color': '#FFFFFF',
            'line-width': 0
        }
    });

    // Municipality border layer
    map.addLayer({
        'id': 'brazil-municipality-border',
        'type': 'line',
        'source': 'brazil-municipality-data',
        'minzoom': zoomThreshold + 3,
        'layout': {},
        'paint': {
            'line-color': '#FFFFFF',
            'line-width': 0
        }
    });
});