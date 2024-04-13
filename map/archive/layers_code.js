// clear cache
//mapboxgl.clearStorage();

map.on('load', function() {

    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style.
    console.log(layers)

    let firstSymbolId;
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }

    let firstLineId;
    for (const layer of layers) {
        if (layer.type === 'line') {
            firstLineId = layer.id;
            break;
        }
    }
const zoomThreshold = 5;
    // State data source
    map.addSource('brazil-state-data', {
        'type': 'geojson',
        'data': '../map/data/access_data_state.geojson'
    });

    // Microregion data source
    map.addSource('brazil-microregion-data', {
        'type': 'geojson',
        'data': '../map/data/access_data_microregion.geojson'
    });

    // Municipality data source
    map.addSource('brazil-municipality-data', {
        'type': 'geojson',
        'data': '../map/data/access_data_municipality.geojson'
    });

    // Point data source
    map.addSource('brazil-point-data', {
        'type': 'geojson',
        'data': '../map/data/access_data_points_converted.geojson'
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
    },
    firstLineId
    );

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
    },
    firstLineId);

    // Municipality layer
    map.addLayer({
        'id': 'brazil-municipality-layer',
        'type': 'fill',
        'source': 'brazil-municipality-data',
        'minzoom': zoomThreshold + 3,
        'maxzoom': zoomThreshold + 5,
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
    },
    firstLineId);

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
    },
    firstLineId);

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
    }, firstLineId);

    // Municipality border layer
    map.addLayer({
        'id': 'brazil-municipality-border',
        'type': 'line',
        'source': 'brazil-municipality-data',
        'minzoom': zoomThreshold + 3,
        'maxzoom': zoomThreshold + 5,
        'layout': {},
        'paint': {
            'line-color': '#FFFFFF',
            'line-width': 0
        }
    },
    firstLineId);

    // Point layer
    map.addLayer({
        'id': 'brazil-point-layer',
        'type': 'circle',
        'source': 'brazil-point-data',
        'minzoom': zoomThreshold + 5,
        'paint': {
            'circle-color': [
                'interpolate',
                ['linear'],
                ['get', 'A'],
                0, 'red', // Lowest access score
                1, 'green' // Highest access score
            ],
            'circle-opacity': 0.75,
            'circle-radius': 5
        }
    }, firstLineId);
});