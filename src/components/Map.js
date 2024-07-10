// Importing necessary libraries and components
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import OverlayButtons from './OverlayButtons';
import Legend from './Legend';
import { MAPBOX_ACCESS_TOKEN } from '../config/config';
import './Map.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN; // Set the Mapbox access token

class Map extends Component {
  constructor(props) {
    super(props); // Call the constructor of the parent class (Component)
    this.state = {
      map: null,
      activeVariable: 'H_percentile',
      colorScales: this.initializeColorScales(),
      colors: this.initializeColorScales()['H_percentile'], // Set initial color scale
      labels: ['Scarce', 'Adequate'], // Default labels
      selectedFeature: null,
      popup: null,
    };    
    this.mapContainer = React.createRef(); // Reference to the map container element
    this.zoomThreshold = 5; // Zoom level threshold for switching layers
  }

  // Lifecycle method called after the component is mounted
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer.current, // HTML container ID
      style: 'mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs', // Map style
      center: [-46.63, -23.6], // Initial map center coordinates
      zoom: 7, // Initial zoom level
      minZoom: 5, // Minimum zoom level
      maxZoom: 12, // Maximum zoom level
    });

    // Event listener for when the map has loaded
    map.on('load', () => {
      this.setState({ map }, () => {
        this.initializeMapLayers(); // Initialize map layers and sources
        this.addMapControls(map); // Add navigation and geocoder controls
        this.addMapClickHandler(map); // Add click handlers for map layers

        console.log('Map has loaded.');
        console.log('Current map style:', map.getStyle());
        console.log('Current zoom level:', map.getZoom());
      });
    });
  }

  // Method to add map controls
  addMapControls = (map) => {
    // Add default navigation controls (zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Access token for geocoder
      mapboxgl: mapboxgl, // Reference to mapboxgl library
      countries: 'br', // Limit search to Brazil
      placeholder: 'Search', // Placeholder text in the search box
      zoom: 10, // Zoom level when a search result is selected
      marker: false, // Do not add a marker for the search result
    });

    // Event listener for search results
    geocoder.on('result', (event) => {
      map.flyTo({
        center: event.result.center, // Center the map at the result's coordinates
        zoom: 10, // Set the zoom level
      });
    });

    map.addControl(geocoder, 'top-right'); // Add the geocoder control to the top-right corner of the map
  };

  // Method to add click handler for the map
  addMapClickHandler = (map) => {
    map.on('click', 'brazil-microregion-layer', (e) => {
      this.handleMapClick(e); // Handle click event for microregion layer
    });

    map.on('click', 'brazil-municipality-layer', (e) => {
      this.handleMapClick(e); // Handle click event for municipality layer
    });

    map.on('click', 'brazil-point-layer', (e) => {
      this.handleMapClick(e); // Handle click event for point layer
    });

    map.on('click', 'brazil-polygon-layer', (e) => {
      this.handleMapClick(e); // Handle click event for polygon layer
    });
  };

  // Method to handle map click events
  handleMapClick = (e) => {
    const { activeVariable, colorScales } = this.state;
    const coordinates = e.lngLat;
    const properties = e.features[0].properties;

    // Extract relevant information
    const stateName = properties.name_state;
    const stateCode = properties.state_id || properties.abbrev_state;
    const cityName = properties.city_name || properties.name_muni || properties.code_muni;
    const censusTract = properties.sector_id;
    const avgMonthlyEarnings = this.formatNumber(properties.avg_monthly_earnings);
    const population = this.formatNumber(properties.n_people_15to17);

    // Handle case where data is unavailable
    const value = properties[activeVariable];
    if (value === undefined || isNaN(value)) {
        let popupContent = `
            <div class="popup-container">
                <div style="flex: 1;">
                    <strong>Data Unavailable</strong>
        `;
        if (cityName) popupContent += `<p>${cityName}</p>`;
        if (stateName) popupContent += `<p>${stateName} (${stateCode})</p>`;
        if (censusTract) popupContent += `<p>Census Tract: ${censusTract}</p>`;
        if (population) popupContent += `<p># of Schoolchildren: ${population}</p>`;
        if (avgMonthlyEarnings) popupContent += `<p>Avg Monthly Income: R$${avgMonthlyEarnings}</p>`;
        popupContent += `</div></div>`;

        if (this.state.popup) {
            this.state.popup.remove(); // Remove the existing popup
        }

        const newPopup = new mapboxgl.Popup({ closeButton: false }) // Create a new popup
            .setLngLat(coordinates) // Set the coordinates of the popup
            .setHTML(popupContent) // Set the HTML content of the popup
            .addTo(this.state.map); // Add the popup to the map

        this.setState({ popup: newPopup }); // Update the state with the new popup
        return; // Exit the function early
    }

    console.log('Map clicked at:', coordinates); // Add this log
    console.log('Properties of clicked feature:', properties); // Add this log
    console.log('Active variable:', activeVariable); // Add this log

    // Extract the percentile value for the active layer
    const percentileValue = properties[activeVariable];
    const percentage = Math.round(percentileValue * 100); // Convert to percentage

    const layerNameMap = {
      'A_percentile': 'Access',
      'Q_percentile': 'Quality',
      'H_percentile': 'Quality-Adjusted Access',
      'P_percentile': 'Population',
      'avg_monthly_earnings_percentile': 'Income',
      'pct_men_percentile': 'Gender',
      'majority_race':'Race'
    };
    const layerName = layerNameMap[activeVariable];

    console.log('Layer name:', layerName); // Add this log

    // Format the percentile rank (e.g., 82nd, 21st, 3rd)
    const formatPercentileRank = (rank) => {
      if (rank > 10 && rank < 20) return `${rank}th`; // Handle 'teens' cases
      const lastDigit = rank % 10;
      switch (lastDigit) {
        case 1: return `${rank}st`; // 1st
        case 2: return `${rank}nd`; // 2nd
        case 3: return `${rank}rd`; // 3rd
        default: return `${rank}th`; // Default case
      }
    };

    const percentileRank = formatPercentileRank(percentage);

    // Get the color for the active variable at the clicked percentile
    const colorScale = colorScales[activeVariable];
    console.log('Color scale:', colorScale); // Add this log
    console.log('Percentile value:', percentileValue); // Add this log

    const colorValue = this.getColorForValue(colorScale, percentileValue);
    console.log('Color value:', colorValue); // Add this log

    let popupContent = `
      <div class="popup-container">
        <span class="color-box" style="background-color: ${colorValue};"></span>
        <div style="flex: 1;">
          <strong>${percentileRank}</strong> ${layerName} Percentile
    `;

    if (censusTract) popupContent += `<p style="margin: 0; line-height: 1.2; color: gray; font-variant: small-caps; font-weight: bold;">tract ${censusTract}</p>`;
    const locationLine = [cityName, stateName ? `${stateName} (${stateCode})` : null].filter(Boolean).join(', ');
    if (locationLine) popupContent += `<p style="margin: 0; line-height: 2;"><em>${locationLine}</em></p>`;
    if (population) popupContent += `<p style="margin: 0; line-height: 2;"><strong># of Schoolchildren:</strong> ${population}</p>`;
    if (avgMonthlyEarnings) popupContent += `<p style="margin: 0; line-height: 2;"><strong>Avg Monthly Income:</strong> R$${avgMonthlyEarnings}</p>`;
    popupContent += `</div></div>`;


    // Remove the previous popup if it exists
    if (this.state.popup) {
      this.state.popup.remove(); // Remove the existing popup
    }

    const newPopup = new mapboxgl.Popup({ closeButton: false }) // Create a new popup
      .setLngLat(coordinates) // Set the coordinates of the popup
      .setHTML(popupContent) // Set the HTML content of the popup
      .addTo(this.state.map); // Add the popup to the map

    if (this.state.selectedFeature && this.state.selectedFeature.id === e.features[0].id) {
      this.setState({ selectedFeature: null, popup: null }, () => {
        this.removeHighlight(); // Remove the highlight from the feature
        newPopup.remove(); // Remove the popup
      });
    } else {
      this.setState({ selectedFeature: e.features[0], popup: newPopup }, () => {
        this.highlightFeature(); // Highlight the selected feature
      });
    }
  };

  // Method to format numbers with commas
  formatNumber = (num) => {
    if (num == null) {
        return 'Data Unavailable';
    }
    return Math.round(num).toLocaleString();
  };

  // Method to get color for a value based on color scale
  getColorForValue = (colorScale, value) => {
    if (!Array.isArray(colorScale) || colorScale.length < 6) {
      console.error('Invalid color scale format', colorScale);
      return '#000000'; // Fallback color
    }

    const stops = [
      { stop: 0, color: colorScale[4] },
      { stop: 0.25, color: colorScale[6] },
      { stop: 0.5, color: colorScale[8] },
      { stop: 0.75, color: colorScale[10] },
      { stop: 1, color: colorScale[12] },
    ];
  
    console.log('stops:', stops); // Add this log
  
    // Find the correct color range for the value
    for (let i = 0; i < stops.length - 1; i++) {
      console.log(`Checking if ${value} is between ${stops[i].stop} and ${stops[i + 1].stop}`); // Add this log
      if (value >= stops[i].stop && value <= stops[i + 1].stop) {
        const t = (value - stops[i].stop) / (stops[i + 1].stop - stops[i].stop);
        const interpolatedColor = this.interpolateColor(stops[i].color, stops[i + 1].color, t);
        console.log('Interpolating between', stops[i].color, 'and', stops[i + 1].color, 'with factor', t, 'result:', interpolatedColor); // Add this log
        return interpolatedColor;
      }
    }
  
    // If value is not in any range, return the last color
    console.warn('Value out of range, using last color', stops[stops.length - 1].color); // Add this log
    return stops[stops.length - 1].color;
  };

  // Method to interpolate between two colors
  interpolateColor = (color1, color2, factor) => {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    const result = {
      r: Math.round(c1.r + factor * (c2.r - c1.r)),
      g: Math.round(c1.g + factor * (c2.g - c1.g)),
      b: Math.round(c1.b + factor * (c2.b - c1.b))
    };
    return this.rgbToHex(result); // Convert the interpolated RGB to HEX
  };

  // Method to convert hex color to RGB
  hexToRgb = (hex) => {
    if (typeof hex !== 'string') {
      console.error('Invalid hex color format', hex);
      return { r: 0, g: 0, b: 0 }; // Fallback color
    }
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: (bigint & 255)
    };
  };

  // Method to convert RGB color to hex
  rgbToHex = (rgb) => {
    return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase()}`;
  };

  // Method to highlight a map feature
  highlightFeature = () => {
    const { map, selectedFeature } = this.state;

    if (!map.getSource('highlight-source')) {
      map.addSource('highlight-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      map.addLayer({
        id: 'highlight-layer',
        type: 'line',
        source: 'highlight-source',
        paint: {
          'line-color': '#000000',
          'line-width': 2,
        },
      });
    }

    if (selectedFeature) {
      const highlightData = {
        type: 'FeatureCollection',
        features: [selectedFeature],
      };

      map.getSource('highlight-source').setData(highlightData); // Update the highlight source with the selected feature
    }
  };

  // Method to remove highlight from map features
  removeHighlight = () => {
    const { map } = this.state;
    const highlightData = {
      type: 'FeatureCollection',
      features: [],
    };

    if (map.getSource('highlight-source')) {
      map.getSource('highlight-source').setData(highlightData); // Clear the highlight source data
    }
  };

  // Method to initialize color scales for different variables
  initializeColorScales = () => {
    const colorValues = {
      H_percentile: ['#e8d893', '#b8d993', '#40b5c4', '#2567ad', '#152774'],
      Q_percentile: ['#f9b9c3', '#ee89ae', '#d41ac0', '#78106d', '#49006a'],
      A_percentile: ['#ece99d', '#b4c689', '#87b034', '#11692b', '#263021'],
      P_percentile: ['#f7fcb9', '#addd8e', '#31a354', '#006837', '#004529'],
      avg_monthly_earnings_percentile: ['#fff9c7', '#f7cd86', '#fec561', '#da5b09', '#8a3006'],
      pct_men_percentile: ['#d41ac0', '#e1a7be', '#fbf4ff', '#8caac2', '#083d7f'],
      majority_race: ['#3babfb', '#7ce35c', '#c9d662', '#366d7b', '#cd5468'],
    };

    const colorStops = {
      A_percentile: [0, 0.25, 0.5, 0.75, 1],
      Q_percentile: [0, 0.25, 0.5, 0.75, 1],
      H_percentile: [0, 0.25, 0.5, 0.75, 1],
      P_percentile: [0, 0.25, 0.5, 0.75, 1],
      avg_monthly_earnings_percentile: [0, 0.25, 0.5, 0.75, 1],
      pct_men_percentile: [0, 0.25, 0.5, 0.75, 1],
      majority_race: [0, 0.25, 0.5, 0.75, 1],
    };
    
    let colorScales = {}; // Object to hold the color scales
    Object.keys(colorValues).forEach((key) => {
      colorScales[key] = this.createColorScale(key, colorValues[key], colorStops[key]);
    });
    console.log('Initialized color scales:', colorScales); // Add this log
    return colorScales;
  };

  // Method to create a color scale for a variable
  createColorScale = (mapVariable, colorArray, colorStops) => {
    const colorScale = [
      'interpolate',
      ['linear'],
      ['get', mapVariable],
      colorStops[0], colorArray[0],
      colorStops[1], colorArray[1],
      colorStops[2], colorArray[2],
      colorStops[3], colorArray[3],
      colorStops[4], colorArray[4],
    ];
    console.log(`Color scale for ${mapVariable}:`, colorScale); // Add this log
    return colorScale;
  };

  // Method to initialize map layers
  initializeMapLayers = () => {
    const map = this.state.map;
    this.addMapSourcesAndLayers(map); // Add map sources and layers
  };

  // Method to add sources and layers to the map
  addMapSourcesAndLayers = (map) => {
    map.addSource('brazil-state-data', {
      type: 'geojson',
      data: '/data/access_data_state.geojson',
    });
    map.addSource('brazil-microregion-data', {
      type: 'geojson',
      data: '/data/access_data_microregion.geojson',
    });
    map.addSource('brazil-municipality-data', {
      type: 'geojson',
      data: '/data/access_data_municipality.geojson',
    });
    map.addSource('brazil-point-data', {
      type: 'geojson',
      data: '/data/access_data_points.geojson',
    });
    map.addSource('brazil-polygon-data', {
      type: 'geojson',
      data: '/data/access_data_polygons.geojson',
    });

    this.setupMapLayers(map); // Setup map layers
  };

  // Method to setup map layers
  setupMapLayers = (map) => {
    const { colorScales, activeVariable } = this.state;

    map.addLayer(
      {
        id: 'brazil-state-border',
        type: 'line',
        source: 'brazil-state-data',
        layout: {},
        paint: {
          'line-color': '#000000',
          'line-width': 1.5,
        },
      },
      this.getFirstSymbolLayerId(map) // Ensure this layer is below any symbol layers
    );

    map.addLayer(
      {
        id: 'brazil-microregion-layer',
        type: 'fill',
        source: 'brazil-microregion-data',
        minzoom: this.zoomThreshold,
        maxzoom: this.zoomThreshold + 1,
        layout: {},
        paint: {
          'fill-color': colorScales[activeVariable],
          'fill-opacity': 1,
        },
      },
      'brazil-state-border'
    );

    map.addLayer(
      {
        id: 'brazil-municipality-layer',
        type: 'fill',
        source: 'brazil-municipality-data',
        minzoom: this.zoomThreshold + 1,
        maxzoom: this.zoomThreshold + 3,
        layout: {},
        paint: {
          'fill-color': colorScales[activeVariable],
          'fill-opacity': 1,
        },
      },
      'brazil-microregion-layer'
    );

    map.addLayer(
      {
        id: 'brazil-point-layer',
        type: 'circle',
        source: 'brazil-point-data',
        minzoom: this.zoomThreshold + 3,
        paint: {
          'circle-color': colorScales[activeVariable],
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 13, 5],
          'circle-blur': ['interpolate', ['linear'], ['zoom'], 8, 1, 13, 0],
          'circle-opacity': 0.75,
        },
      },
      this.getFirstLineLayerId(map)
    );

    map.addLayer(
      {
        id: 'brazil-polygon-layer',
        type: 'fill',
        source: 'brazil-polygon-data',
        minzoom: this.zoomThreshold + 3,
        maxzoom: 12,
        layout: {},
        paint: {
          'fill-color': colorScales[activeVariable],
          'fill-opacity': 0.2,
        },
      },
      'brazil-municipality-layer'
    );
  };

  // Method to get the first symbol layer ID
  getFirstSymbolLayerId = (map) => {
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
        return layers[i].id;
      }
    }
    return undefined;
  };

  // Method to get the first line layer ID
  getFirstLineLayerId = (map) => {
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'line') {
        return layers[i].id;
      }
    }
    return undefined;
  };

  // Lifecycle method called when the component is updated
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeVariable !== this.state.activeVariable) {
      console.log('Active variable changed from', prevState.activeVariable, 'to', this.state.activeVariable); // Add this log
      this.updateMapLayers(); // Update map layers if the active variable changes
    }
  }

  // Method to update map layers
// Method to update map layers
updateMapLayers = () => {
  const { map, colorScales, activeVariable } = this.state;
  if (!map) return;

  console.log('Updating map layers for activeVariable:', activeVariable); // Add this log
  console.log('Color scale being applied:', colorScales[activeVariable]); // Add this log

  const layerTypes = {
    'brazil-microregion-layer': 'fill-color',
    'brazil-municipality-layer': 'fill-color',
    'brazil-point-layer': 'circle-color',
    'brazil-polygon-layer': 'fill-color',
  };

  const colorMap = {
    'n_people_15to17_white': '#08519c',
    'n_people_15to17_black': '#006d2c',
    'n_people_15to17_indigenous': '#bea40d',
    'n_people_15to17_asian': '#62367b',
    'n_people_15to17_parda': '#a50f15',
  };

  Object.keys(layerTypes).forEach((layerId) => {
    if (map.getLayer(layerId)) {
      const colorScale = colorScales[activeVariable];
      if (activeVariable === 'majority_race') {
        console.log('Setting color scale for majority race layer'); // Add this log
        map.setPaintProperty(layerId, layerTypes[layerId], [
          'interpolate',
          ['linear'],
          ['get', 'majority_percentage'],
          0, '#ffffff',
          1, [
            'match',
            ['get', 'majority_race'],
            'n_people_15to17_white', colorMap['n_people_15to17_white'],
            'n_people_15to17_black', colorMap['n_people_15to17_black'],
            'n_people_15to17_indigenous', colorMap['n_people_15to17_indigenous'],
            'n_people_15to17_asian', colorMap['n_people_15to17_asian'],
            'n_people_15to17_parda', colorMap['n_people_15to17_parda'],
            '#ccc'
          ]
        ]);
      }
      else if (colorScale) {
        console.log(`Setting color scale for layer ${layerId}`); // Add this log
        map.setPaintProperty(layerId, layerTypes[layerId], colorScale);
      } else {
        console.error(`Color scale for ${activeVariable} is not defined`);
      }
    }
  });
};

  handleButtonClick = (type) => {
    const variableMap = {
      Access: 'A_percentile',
      Quality: 'Q_percentile',
      'Access-Quality': 'H_percentile',
      Population: 'P_percentile',
      Income: 'avg_monthly_earnings_percentile',
      Gender: 'pct_men_percentile',
      Race: 'majority_race',
    };
    const newActiveVariable = variableMap[type];
  
    // Define labels based on the active variable
    const labelsMap = {
      'A_percentile': ['Poor', 'Adequate'],
      'Q_percentile': ['Poor', 'Adequate'],
      'H_percentile': ['Poor', 'Adequate'],
      'P_percentile': ['Sparse', 'Dense'],
      'avg_monthly_earnings_percentile': ['Low', 'High'],
      'pct_men_percentile': ['Female', 'Male'],
      'majority_race': ['White', 'Black', 'Indigenous', 'Asian', 'Parda'],
    };
    const newLabels = labelsMap[newActiveVariable];
  
    this.setState({
      activeVariable: newActiveVariable,
      colors: this.initializeColorScales()[newActiveVariable], // Update colors
      labels: newLabels, // Update labels
    });
    this.props.onLayerChange(type); // Pass to parent component
  };

  // Render method
  render() {
    const { colors, labels } = this.state;
    return (
      <div className="map-wrapper">
        <div ref={this.mapContainer} className="map-container" style={{ height: 'calc(100vh - 100px)' }} /> {/* Adjust height */}
        <OverlayButtons onButtonClick={this.handleButtonClick} onLayerChange={this.props.onLayerChange} />
        <Legend colors={colors} labels={labels} /> {/* Render Legend component */}
      </div>
    );
  }
}  

export default Map;
