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
      map: null, // Map instance
      activeVariable: 'A_percentile', // Currently active data layer
      colorScales: this.initializeColorScales(), // Color scales for different data layers
      colors: [], // Colors for legend
      labels: [], // Labels for legend
      selectedFeature: null, // Currently selected feature on the map
      popup: null, // Current popup on the map
    };
    this.mapContainer = React.createRef(); // Reference to the map container element
    this.zoomThreshold = 5; // Zoom level threshold for switching layers
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer.current, // HTML container ID
      style: 'mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs', // Map style
      center: [-46.63, -23.6], // Initial map center coordinates
      zoom: 7, // Initial zoom level
      minZoom: 5, // Minimum zoom level
      maxZoom: 12, // Maximum zoom level
    });

    map.on('load', () => {
      this.setState({ map }, () => {
        this.initializeMapLayers(); // Initialize map layers and sources
        this.addMapControls(map); // Add navigation and geocoder controls
        this.addMapClickHandler(map); // Add click handlers for map layers
      });
    });
  }

  addMapControls = (map) => {
    map.addControl(new mapboxgl.NavigationControl(), 'top-left'); // Add navigation control to the top-left corner

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Access token for geocoder
      mapboxgl: mapboxgl, // Reference to mapboxgl library
      countries: 'br', // Limit search to Brazil
      placeholder: 'Search', // Placeholder text in the search box
      zoom: 10, // Zoom level when a search result is selected
      marker: false, // Do not add a marker for the search result
    });

    geocoder.on('result', (event) => {
      map.flyTo({
        center: event.result.center, // Center the map at the result's coordinates
        zoom: 10, // Set the zoom level
      });
    });

    map.addControl(geocoder, 'top-right'); // Add the geocoder control to the top-right corner of the map
  };

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

  handleMapClick = (e) => {
    const { activeVariable, colorScales } = this.state;
    const coordinates = e.lngLat; // Get the coordinates of the click event
    const properties = e.features[0].properties; // Get the properties of the clicked feature

    const percentileValue = properties[activeVariable]; // Get the percentile value for the active variable
    const percentage = Math.round(percentileValue * 100); // Convert the percentile value to a percentage

    const layerNameMap = {
      'A_percentile': 'Access', // Access layer
      'Q_percentile': 'Quality', // Quality layer
      'H_percentile': 'Quality-Adjusted Access', // Quality-Adjusted Access layer
      'P_percentile': 'Population' // Population layer
    };
    const layerName = layerNameMap[activeVariable]; // Get the display name for the active variable

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

    const percentileRank = formatPercentileRank(percentage); // Format the percentile rank

    const colorScale = colorScales[activeVariable]; // Get the color scale for the active variable

    const colorValue = this.getColorForValue(colorScale, percentileValue); // Get the color value for the percentile value

    const popupContent = `
      <div class="popup-container">
        <span class="color-box" style="background-color: ${colorValue};"></span>
        <div style="flex: 1;">
          <strong>${percentileRank}</strong> ${layerName} Percentile
        </div>
      </div>
    `; // HTML content for the popup

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

    for (let i = 0; i < stops.length - 1; i++) {
      if (value >= stops[i].stop && value <= stops[i + 1].stop) {
        const t = (value - stops[i].stop) / (stops[i + 1].stop - stops[i].stop);
        return this.interpolateColor(stops[i].color, stops[i + 1].color, t); // Interpolate color between stops
      }
    }

    return stops[stops.length - 1].color; // Return the last color if no match found
  };

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

  rgbToHex = (rgb) => {
    return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1).toUpperCase()}`;
  };

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

  initializeColorScales = () => {
    const colorValues = {
      A_percentile: ['#f8fccb', '#b7e3b6', '#40b5c4', '#2567ad', '#152774'], // Access layer colors
      Q_percentile: ['#fff9f4', '#fcd2d0', '#f98ab7', '#d41ac0', '#49006a'], // Quality layer colors
      H_percentile: ['#fefddc', '#a9c689', '#669409', '#11692b', '#263021'], // Quality-Adjusted Access layer colors
      P_percentile: ['#f7fcb9', '#addd8e', '#31a354', '#006837', '#004529'], // Population layer colors
    };
    let colorScales = {}; // Object to hold the color scales
    Object.keys(colorValues).forEach((key) => {
      colorScales[key] = this.createColorScale(key, colorValues[key]); // Create color scale for each key
    });
    return colorScales; // Return the initialized color scales
  };

  createColorScale = (percentileKey, colorArray) => [
    'interpolate',
    ['linear'],
    ['get', percentileKey],
    0, colorArray[0], // 0 percentile
    0.25, colorArray[1], // 25th percentile
    0.5, colorArray[2], // 50th percentile
    0.75, colorArray[3], // 75th percentile
    1, colorArray[4], // 100th percentile
  ];

  initializeMapLayers = () => {
    const map = this.state.map;

    this.addMapSourcesAndLayers(map); // Add map sources and layers
  };

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

    this.setupMapLayers(map); // Set up map layers
  };

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
        maxzoom: 13, // Adjust as necessary
        layout: {},
        paint: {
          'fill-color': colorScales[activeVariable],
          'fill-opacity': 0.2,
        },
      },
      'brazil-municipality-layer'
    );
  };

  getFirstSymbolLayerId = (map) => {
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
        return layers[i].id;
      }
    }
    return undefined;
  };

  getFirstLineLayerId = (map) => {
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'line') {
        return layers[i].id;
      }
    }
    return undefined;
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeVariable !== this.state.activeVariable) {
      this.updateMapLayers(); // Update map layers with the new active variable
    }
  }

  updateMapLayers = () => {
    const { map, colorScales, activeVariable } = this.state;
    if (!map) return;

    const layerTypes = {
      'brazil-microregion-layer': 'fill-color',
      'brazil-municipality-layer': 'fill-color',
      'brazil-point-layer': 'circle-color',
      'brazil-polygon-layer': 'fill-color',
    };

    Object.keys(layerTypes).forEach((layerId) => {
      if (map.getLayer(layerId)) {
        const colorScale = colorScales[activeVariable];
        if (colorScale) {
          map.setPaintProperty(layerId, layerTypes[layerId], colorScale); // Set the paint property with the new color scale
        } else {
          console.error(`Color scale for ${activeVariable} is not defined`);
        }
      }
    });
  };

  handleButtonClick = (type) => {
    const variableMap = {
      Access: 'A_percentile', // Access layer
      Quality: 'Q_percentile', // Quality layer
      'Access-Quality': 'H_percentile', // Quality-Adjusted Access layer
      Population: 'P_percentile', // Population layer
    };
    this.setState({ activeVariable: variableMap[type] }); // Update the active variable in the state
    this.props.onLayerChange(type); // Pass the change to the parent component
  };

  render() {
    const { colors, labels } = this.state;
    return (
      <div className="map-wrapper">
        <div ref={this.mapContainer} className="map-container" style={{ height: 'calc(100vh - 100px)' }} /> {/* Adjust height */}
        <OverlayButtons onButtonClick={this.handleButtonClick} onLayerChange={this.props.onLayerChange} /> {/* Overlay buttons */}
        <Legend colors={colors} labels={labels} /> {/* Legend component */}
      </div>
    );
  }
}

export default Map; // Export the Map component as the default export
