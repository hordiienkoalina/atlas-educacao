mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // or any other style you prefer
    center: [-52, -14], // Centered over Brazil
    zoom: 3
});

map.on('load', function() {
    map.addSource('brazil-data', {
        'type': 'geojson',
        'data': './map/data/access_data_state.geojson' // Path to your GeoJSON file
    });

    map.addLayer({
        'id': 'brazil-data-layer',
        'type': 'fill',
        'source': 'brazil-data',
        'layout': {},
        'paint': {
            // Use a data-driven style for the fill color based on the 'A' property
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'A'],
                // Define your color scale here
                0, 'red', // Lowest access score
                // Add intermediate color stops if needed
                100, 'green' // Highest access score
            ],
            'fill-opacity': 0.75
        }
    });

    // Add a border layer for clarity
    map.addLayer({
        'id': 'brazil-data-border',
        'type': 'line',
        'source': 'brazil-data',
        'layout': {},
        'paint': {
            'line-color': '#000', // Black borders
            'line-width': 1
        }
    });
});

// TEST: BRAZIL STATES
// map.on('load', function() {
//     map.addSource('brazil-states', {
//         'type': 'geojson',
//         'data': './map/data/brazil_states.geojson'
//     });

//     // Fill layer for the states
//     map.addLayer({
//         'id': 'brazil-states-fill',
//         'type': 'fill',
//         'source': 'brazil-states',
//         'layout': {},
//         'paint': {
//             'fill-color': '#0080ff', // Fill color
//             'fill-opacity': 0.5
//         }
//     });

//     // Line layer for state borders
//     map.addLayer({
//         'id': 'brazil-states-border',
//         'type': 'line',
//         'source': 'brazil-states',
//         'layout': {},
//         'paint': {
//             'line-color': '#000', // Line color for borders
//             'line-width': 1 // Line width for borders
//         }
//     });
// });