mapboxgl.accessToken = mapboxConfig.MAPBOX_ACCESS_TOKEN;

// Add map bounds to prevent user from panning outside of Brazil
const bounds = [
  [-100, -45], // Southwest coordinates
  [-10, 20], // Northeast coordinates
];

// Define the color values in the color scale for each variable
const colorValues = {
  A_percentile: ["#f8fccb", "#b7e3b6", "#40b5c4", "#2567ad", "#152774"],
  Q_percentile: ["#fff9f4", "#fcd2d0", "#f98ab7" ,"#d41ac0", "#49006a"],
  H_percentile: ["#fefddc", "#a9c689", "#669409", "#11692b", "#263021"],
};

function createColorScale(percentileKey, colorArray) {
    // Assuming the scale goes from 0 to 100, evenly distributing color stops
    const stepSize = 1 / (colorArray.length - 1);
    const scale = ['interpolate', ['linear'], ['get', percentileKey]];

    // Add color stops to the scale
    colorArray.forEach((color, index) => {
        scale.push(index * stepSize); // Calculate the step value
        scale.push(color); // Add the color
    });

    return scale;
}


// Formats the color scales in the mapbox format
const colorScales = {
    A_percentile: createColorScale('A_percentile', colorValues.A_percentile),
    Q_percentile: createColorScale('Q_percentile', colorValues.Q_percentile),
    H_percentile: createColorScale('H_percentile', colorValues.H_percentile),
};
// clear cache
//mapboxgl.clearStorage();

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs",
  center: [-46.63, -23.6], // Centered over São Paulo
  zoom: 10, // Start overlooking the country
  minZoom: 5,
  maxZoom: 12,
  maxBounds: bounds,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
  countries: "BR", // Limit search to Brazil
  marker: {
    color: "black",
  },
});

map.addControl(geocoder, "bottom-right");

map.on("load", function () {
  // Log all layers
  const layers = map.getStyle().layers;
  console.log(layers);

  // Initial colors
  updateColorScale("A_percentile");
  updateLegendColor("A_percentile");

  const legend = document.getElementById("legend");
  map.getContainer().appendChild(legend);

  // Function to update the color scale
  function updateColorScale(variable) {
    map.setPaintProperty(
      "access-data-points-converted-dj3ili",
      "circle-color",
      colorScales[variable]
    )
    
    map.setPaintProperty(
        "access-data-municipality-new-9tg8nj",
        "fill-color",
        colorScales[variable]
      )
    
    map.setPaintProperty(
        "access-data-microregion-new-1wvxsu",
        "fill-color",
        colorScales[variable]
      )
    
    map.setPaintProperty(
        "access-data-state-new-9vri20",
        "fill-color",
        colorScales[variable]
      )
    ;
  }

  function updateLegendColor(variable) {
    // Retrieve the array of color values for the selected variable
    const colors = colorValues[variable];

    // Generate a gradient string by joining all color values with commas
    const gradient = `linear-gradient(to right, ${colors.join(", ")})`;

    // Select the legend's color scale element and update its background
    const legendColorElement = document.querySelector("#legend > div"); // Adjust this selector as needed
    legendColorElement.style.background = gradient;
  }

  // Update scale when user clicks on buttons
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
});
