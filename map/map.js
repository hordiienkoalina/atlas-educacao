mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

// Define the map bounds to limit panning outside of Brazil
const bounds = [
  [-100, -45], // Southwest coordinates
  [-10, 20], // Northeast coordinates
];

// Define color values for the percentile color scales
const colorValues = {
  A_percentile: ["#f8fccb", "#b7e3b6", "#40b5c4", "#2567ad", "#152774"],
  Q_percentile: ["#fff9f4", "#fcd2d0", "#f98ab7", "#d41ac0", "#49006a"],
  H_percentile: ["#fefddc", "#a9c689", "#669409", "#11692b", "#263021"],
};

// Function to create a color scale for map features
function createColorScale(percentileKey, colorArray, nullValue = "#cccccc") {
  const stepSize = 1 / (colorArray.length - 1);
  const scale = ["interpolate", ["linear"], ["get", percentileKey]];

  // Add color stops to the scale
  colorArray.forEach((color, index) => {
    scale.push(index * stepSize);
    scale.push(color);
  });

  return ["case", ["==", ["get", percentileKey], null], nullValue, scale];
}

// Store color scales formatted for Mapbox
const colorScales = {
  A_percentile: createColorScale(
    "A_percentile",
    colorValues.A_percentile,
    colorValues.A_percentile[0]
  ),
  Q_percentile: createColorScale(
    "Q_percentile",
    colorValues.Q_percentile,
    "gray"
  ),
  H_percentile: createColorScale(
    "H_percentile",
    colorValues.H_percentile,
    colorValues.H_percentile[0]
  ),
};

// Initialize the Mapbox map
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs",
  center: [-46.63, -23.6], // Center the map over São Paulo
  zoom: 7, // Initial zoom level
  minZoom: 5,
  maxZoom: 12,
  maxBounds: bounds,
});

// Add navigation controls to the map
map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

// Setup the Mapbox Geocoder
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: "BR", // Limit geocoding to Brazil
  marker: false,
});

// Add the geocoder control to the map
map.addControl(geocoder, "bottom-right");

// Handle geocoder result events
geocoder.on("result", function (e) {
  map.flyTo({
    center: e.result.geometry.coordinates,
    zoom: 10,
  });
});

// Store the ID of the currently highlighted feature
var currentHighlightedId = null;

// Setup map event listeners
map.on("load", function () {
  const layers = map.getStyle().layers;
  // Log all layers for debugging
  console.log(map.getStyle().layers);

  let firstSymbolId;
  for (const layer of layers) {
    if (layer.type === "symbol") {
      firstSymbolId = layer.id;
      break;
    }
  }

  let firstLineId;
  for (const layer of layers) {
    if (layer.type === "line") {
      firstLineId = layer.id;
      break;
    }
  }
  const zoomThreshold = 5;
  // State data source
  map.addSource("brazil-state-data", {
    type: "geojson",
    data: "../map/data/access_data_state.geojson",
  });

  // Microregion data source
  map.addSource("brazil-microregion-data", {
    type: "geojson",
    data: "../map/data/access_data_microregion.geojson",
  });

  // Municipality data source
  map.addSource("brazil-municipality-data", {
    type: "geojson",
    data: "../map/data/access_data_municipality.geojson",
  });

  // Point data source
  map.addSource("brazil-point-data", {
    type: "geojson",
    data: "../map/data/access_data_points.geojson",
  });

  // State border layer
  map.addLayer(
    {
      id: "brazil-state-border",
      type: "line",
      source: "brazil-state-data",
      layout: {},
      paint: {
        "line-color": "#000000",
        "line-width": 1.5,
      },
    },
    firstSymbolId
  );

  // Microregion layer
  map.addLayer(
    {
      id: "brazil-microregion-layer",
      type: "fill",
      source: "brazil-microregion-data",
      minzoom: zoomThreshold,
      maxzoom: zoomThreshold + 1,
      layout: {},
    },
    "brazil-state-border"
  );

  // Municipality layer
  map.addLayer(
    {
      id: "brazil-municipality-layer",
      type: "fill",
      source: "brazil-municipality-data",
      minzoom: zoomThreshold,
      maxzoom: zoomThreshold + 3,
      layout: {},
    },
    "brazil-microregion-layer"
  );

  // Point layer
  map.addLayer(
    {
      id: "brazil-point-layer",
      type: "circle",
      source: "brazil-point-data",
      minzoom: zoomThreshold + 2,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 13, 5],
        "circle-blur": ["interpolate", ["linear"], ["zoom"], 8, 1, 13, 0],
      },
    },
    firstLineId
  );

  // Define function to update the color scale on the map
  function updateColorScale(variable) {
    map.setPaintProperty(
      "brazil-point-layer",
      "circle-color",
      colorScales[variable]
    );
    map.setPaintProperty(
      "brazil-municipality-layer",
      "fill-color",
      colorScales[variable]
    );
    map.setPaintProperty(
      "brazil-microregion-layer",
      "fill-color",
      colorScales[variable]
    );
  }

  // Initialize the color scales for data visualization
  updateColorScale("A_percentile");
  updateLegendColor("A_percentile");

  //   // Toggle visibility of all layers on
  //   map.setLayoutProperty("access-data-points-converted-dj3ili", "visibility", "visible");
  //   map.setLayoutProperty("access-data-municipality-new-9tg8nj", "visibility", "visible");
  //   map.setLayoutProperty("access-data-microregion-new-1wvxsu", "visibility", "visible");
  //   map.setLayoutProperty("access-data-state-new-9vri20", "visibility", "visible");

  // Append the legend to the map container
  const legend = document.getElementById("legend");
  map.getContainer().appendChild(legend);

  // Define function to update the legend color
  function updateLegendColor(variable) {
    const colors = colorValues[variable];
    const gradient = `linear-gradient(to right, ${colors.join(", ")})`;
    const legendColorElement = document.querySelector("#legend > div");
    legendColorElement.style.background = gradient;
  }

  // Event listeners for UI elements to update scales
  document.getElementById("btnA").addEventListener("click", function () {
    updateColorScale("A_percentile");
    updateLegendColor("A_percentile");
  });

  document.getElementById("btnQ").addEventListener("click", function () {
    updateColorScale("Q_percentile");
    updateLegendColor("Q_percentile");
  });

  document.getElementById("btnH").addEventListener("click", function () {
    updateColorScale("H_percentile");
    updateLegendColor("H_percentile");
  });

  // Add a layer to highlight features on click
  map.addLayer({
    id: "highlight-feature",
    type: "line",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    },
    layout: {},
    paint: {
      "line-color": "#111111",
      "line-width": 2,
    },
  });

  // Variables to store the previous zoom level
  let previousZoom = map.getZoom();

  map.on("zoom", function () {
    var newZoom = map.getZoom();

    // Define the zoom level boundaries for your layers
    var zoomRanges = {
      state: {
        min: map.getLayer("access-data-state-new-9vri20").minzoom,
        max: map.getLayer("access-data-microregion-new-1wvxsu").minzoom,
      },
      microregion: {
        min: map.getLayer("access-data-microregion-new-1wvxsu").minzoom,
        max: map.getLayer("access-data-municipality-new-9tg8nj").minzoom,
      },
      municipality: {
        min: map.getLayer("access-data-municipality-new-9tg8nj").minzoom,
        max: map.getLayer("access-data-municipality-new-9tg8nj").maxzoom,
      },
      points: {
        min: map.getLayer("access-data-municipality-new-9tg8nj").maxzoom,
        max: Infinity,
      },
    };

    // Determine the current and previous layer based on zoom level
    let currentLayer = null;
    let previousLayer = null;

    for (const layer in zoomRanges) {
      if (newZoom >= zoomRanges[layer].min && newZoom < zoomRanges[layer].max) {
        currentLayer = layer;
      }
      if (
        previousZoom >= zoomRanges[layer].min &&
        previousZoom < zoomRanges[layer].max
      ) {
        previousLayer = layer;
      }
    }

    // Clear the highlight if the layer has changed
    if (currentLayer !== previousLayer) {
      map.getSource("highlight-feature").setData({
        type: "FeatureCollection",
        features: [],
      });
      currentHighlightedId = null; // Reset the highlighted ID

      // Close any open popups
      if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
      }
    }

    // Update previousZoom for the next event
    previousZoom = newZoom;
  });

  // Variable to hold the currently open popup to manage its visibility
  let currentPopup = null;

  [
    "access-data-state-new-9vri20",
    "access-data-microregion-new-1wvxsu",
    "access-data-municipality-new-9tg8nj",
  ].forEach(function (layerId) {
    map.on("click", layerId, function (e) {
      var features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
      if (features.length > 0) {
        var feature = features[0];
        var featureId = feature.id; // Assuming each feature has a unique ID

        // Check if the currently highlighted feature is the same as the clicked one
        if (currentHighlightedId === featureId) {
          // If the same feature is clicked again, toggle the highlight and popup off
          map.getSource("highlight-feature").setData({
            type: "FeatureCollection",
            features: [],
          });
          currentHighlightedId = null;

          // Close the currently open popup
          if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
          }
        } else {
          // Highlight the new clicked feature and update the current ID
          map.getSource("highlight-feature").setData(feature.geometry);
          currentHighlightedId = featureId;

          // Close the previous popup if it exists
          if (currentPopup) {
            currentPopup.remove();
          }

          // Create and display the popup with detailed percentile information
          var description = `<div style="font-size: 12px;">`;
          const percentileProps = [
            "A_percentile",
            "H_percentile",
            "Q_percentile",
          ];
          percentileProps.forEach((prop) => {
            if (feature.properties[prop] !== undefined) {
              const percentile = Math.round(feature.properties[prop] * 100);
              const label = prop.charAt(0); // Extracts the first letter ('A', 'H', 'Q')
              description += `<strong>${label}:</strong> ${percentile}th percentile<br>`;
            }
          });
          description += `</div>`;

          // Assign the new popup to currentPopup and add it to the map
          currentPopup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(description)
            .addTo(map);
        }
      }
    });
  });

  // --------- CENSUS LEVEL POLYGONS --------- //

  // map.addSource('access-data-polygons', {
  //   type: 'geojson',
  //   data: '../map/data/access_data_polygons.geojson'
  // });

  // // Add a layer to display the polygons but with no fill color
  // map.addLayer({
  //     id: 'polygons-layer',
  //     type: 'fill',
  //     source: 'access-data-polygons',
  //     paint: {
  //         'fill-opacity': 0 // No fill color
  //     },
  //     minzoom: map.getLayer('access-data-points-converted-dj3ili').minzoom // Set minzoom to match the specified layer
  // });

  // // Add a layer to highlight features on click
  // map.addLayer({
  //     id: 'highlight',
  //     type: 'line',
  //     source: 'access-data-polygons',
  //     paint: {
  //         'line-color': '#000000',
  //         'line-width': 2
  //     },
  //     layout: {
  //         'visibility': 'none' // Start with the layer not visible
  //     },
  //     filter: ['==', 'row_id', ''] // Initially set to an impossible condition
  // });

  // // Enable highlight layer when the zoom level is appropriate
  // map.on('zoom', function() {
  //     if (map.getZoom() >= map.getLayer('access-data-points-converted-dj3ili').minzoom) {
  //         map.setLayoutProperty('highlight', 'visibility', 'visible');
  //     } else {
  //         map.setLayoutProperty('highlight', 'visibility', 'none');
  //     }
  // });

  // // Setup click functionality to highlight polygon
  // map.on('click', 'polygons-layer', function(e) {
  //     var features = map.queryRenderedFeatures(e.point, { layers: ['polygons-layer'] });
  //     if (features.length > 0) {
  //         var feature = features[0];

  //         // Set the filter to create the highlight effect
  //         map.setFilter('highlight', ['==', 'row_id', feature.properties.row_id]);
  //     } else {
  //         // No feature was clicked, remove highlight
  //         map.setFilter('highlight', ['==', 'row_id', '']);
  //     }
  // });

  // // Reset highlight when clicking off a feature
  // map.on('click', function(e) {
  //     var features = map.queryRenderedFeatures(e.point, { layers: ['polygons-layer'] });
  //     if (features.length === 0) {
  //         map.setFilter('highlight', ['==', 'row_id', '']);
  //     }
  // });
});
