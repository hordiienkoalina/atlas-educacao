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
    data: "../src/data/access_data_state.geojson",
  });

  // Microregion data source
  map.addSource("brazil-microregion-data", {
    type: "geojson",
    data: "../src/data/access_data_microregion.geojson",
  });

  // Municipality data source
  map.addSource("brazil-municipality-data", {
    type: "geojson",
    data: "../src/data/access_data_municipality.geojson",
  });

  // Point data source
  map.addSource("brazil-point-data", {
    type: "geojson",
    data: "../src/data/access_data_points.geojson",
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
});