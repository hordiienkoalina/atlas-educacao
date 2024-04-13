mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

// Define the map bounds to limit panning outside of Brazil
const bounds = [
  [-100, -45], // Southwest coordinates
  [-10, 20],  // Northeast coordinates
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
  const scale = ['interpolate', ['linear'], ['get', percentileKey]];

  // Add color stops to the scale
  colorArray.forEach((color, index) => {
    scale.push(index * stepSize);
    scale.push(color);
  });

  return ["case", ["==", ["get", percentileKey], null], nullValue, scale];
}

// Store color scales formatted for Mapbox
const colorScales = {
  A_percentile: createColorScale('A_percentile', colorValues.A_percentile, colorValues.A_percentile[0]),
  Q_percentile: createColorScale('Q_percentile', colorValues.Q_percentile, "gray"),
  H_percentile: createColorScale('H_percentile', colorValues.H_percentile, colorValues.H_percentile[0]),
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
geocoder.on('result', function(e) {
  map.flyTo({
    center: e.result.geometry.coordinates,
    zoom: 10
  });
});

// Store the ID of the currently highlighted feature
var currentHighlightedId = null;

// Setup map event listeners
map.on("load", function () {
  // Log all layers for debugging
  console.log(map.getStyle().layers);

  // Initialize the color scales for data visualization
  updateColorScale("A_percentile");
  updateLegendColor("A_percentile");

  // Append the legend to the map container
  const legend = document.getElementById("legend");
  map.getContainer().appendChild(legend);

  // Define function to update the color scale on the map
  function updateColorScale(variable) {
    map.setPaintProperty("access-data-points-converted-dj3ili", "circle-color", colorScales[variable]);
    map.setPaintProperty("access-data-municipality-new-9tg8nj", "fill-color", colorScales[variable]);
    map.setPaintProperty("access-data-microregion-new-1wvxsu", "fill-color", colorScales[variable]);
    map.setPaintProperty("access-data-state-new-9vri20", "fill-color", colorScales[variable]);
  }

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
    'id': 'highlight-feature',
    'type': 'line',
    'source': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': []
      }
    },
    'layout': {},
    'paint': {
      'line-color': '#111111',
      'line-width': 2
    }
  });

  // Variable to hold the currently open popup to manage its visibility
  let currentPopup = null;

  ['access-data-state-new-9vri20', 'access-data-microregion-new-1wvxsu', 'access-data-municipality-new-9tg8nj'].forEach(function(layerId) {
      map.on('click', layerId, function(e) {
          var features = map.queryRenderedFeatures(e.point, { layers: [layerId] });
          if (features.length > 0) {
              var feature = features[0];
              var featureId = feature.id; // Assuming each feature has a unique ID

              // Check if the currently highlighted feature is the same as the clicked one
              if (currentHighlightedId === featureId) {
                  // If the same feature is clicked again, toggle the highlight and popup off
                  map.getSource('highlight-feature').setData({
                      'type': 'FeatureCollection',
                      'features': []
                  });
                  currentHighlightedId = null;

                  // Close the currently open popup
                  if (currentPopup) {
                      currentPopup.remove();
                      currentPopup = null;
                  }
              } else {
                  // Highlight the new clicked feature and update the current ID
                  map.getSource('highlight-feature').setData(feature.geometry);
                  currentHighlightedId = featureId;

                  // Close the previous popup if it exists
                  if (currentPopup) {
                      currentPopup.remove();
                  }

                  // Create and display the popup with detailed percentile information
                  var description = `<div style="font-size: 12px;">`;
                  const percentileProps = ['A_percentile', 'H_percentile', 'Q_percentile'];
                  percentileProps.forEach(prop => {
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
});