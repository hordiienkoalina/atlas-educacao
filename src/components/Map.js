import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import OverlayButtons from './OverlayButtons';
import Legend from './Legend';
import { MAPBOX_ACCESS_TOKEN } from '../config/config';
import './Map.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      activeVariable: 'A_percentile',
      colorScales: this.initializeColorScales(),
      colors: [],
      labels: [],
      selectedFeature: null,
      popup: null,
    };
    this.mapContainer = React.createRef();
    this.zoomThreshold = 5;
  }

  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/felipehlvo/cltz1z7gn00pw01qu2xm23yjs',
      center: [-46.63, -23.6],
      zoom: 7,
      minZoom: 5,
      maxZoom: 12,
    });

    map.on('load', () => {
      this.setState({ map }, () => {
        this.initializeMapLayers();
        this.addMapControls(map);
        this.addMapClickHandler(map);
      });
    });
  }

  addMapControls = (map) => {
    // Add default navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Add search control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      countries: 'br',
      placeholder: 'Search',
      zoom: 10,
      marker: false,
    });

    geocoder.on('result', (event) => {
      // Adjust the zoom level manually if needed
      map.flyTo({
        center: event.result.center,
        zoom: 10, // Set your desired zoom level here
      });
    });

    map.addControl(geocoder, 'top-right'); // Add geocoder to the top right
  };

  addMapClickHandler = (map) => {
    map.on('click', 'brazil-microregion-layer', (e) => {
      this.handleMapClick(e);
    });

    map.on('click', 'brazil-municipality-layer', (e) => {
      this.handleMapClick(e);
    });

    map.on('click', 'brazil-point-layer', (e) => {
      this.handleMapClick(e);
    });
  };

  handleMapClick = (e) => {
    const { activeVariable, colorScales } = this.state;
    const coordinates = e.lngLat;
    const properties = e.features[0].properties;
  
    // Extract the percentile value for the active layer
    const percentileValue = properties[activeVariable];
    const percentage = Math.round(percentileValue * 100); // Convert to percentage
  
    const layerNameMap = {
      'A_percentile': 'Access',
      'Q_percentile': 'Quality',
      'H_percentile': 'Quality-Adjusted Access',
      'P_percentile': 'Population'
    };
    const layerName = layerNameMap[activeVariable];
  
    // Format the percentile rank (e.g., 82nd, 21st, 3rd)
    const formatPercentileRank = (rank) => {
      if (rank > 10 && rank < 20) return `${rank}th`; // Handle 'teens' cases
      const lastDigit = rank % 10;
      switch (lastDigit) {
        case 1: return `${rank}st`;
        case 2: return `${rank}nd`;
        case 3: return `${rank}rd`;
        default: return `${rank}th`;
      }
    };
  
    const percentileRank = formatPercentileRank(percentage);
  
    // Get the color for the active variable at the clicked percentile
    const colorScale = colorScales[activeVariable];
    console.log('colorScale:', colorScale);
    console.log('percentileValue:', percentileValue);
  
    const colorValue = this.getColorForValue(colorScale, percentileValue);
    console.log('colorValue:', colorValue);
  
    const popupContent = `
      <div class="popup-container">
        <span class="color-box" style="background-color: ${colorValue};"></span>
        <div style="flex: 1;">
          <strong>${percentileRank}</strong> ${layerName} Percentile
        </div>
      </div>
    `;
  
    if (this.state.popup) {
      this.state.popup.remove();
    }
  
    const newPopup = new mapboxgl.Popup({ closeButton: false }) // Remove close button
      .setLngLat(coordinates)
      .setHTML(popupContent)
      .addTo(this.state.map);
  
    // Check if the clicked feature is the same as the currently highlighted feature
    if (this.state.selectedFeature && this.state.selectedFeature.id === e.features[0].id) {
      this.setState({ selectedFeature: null, popup: null }, () => {
        this.removeHighlight();
        newPopup.remove();
      });
    } else {
      this.setState({ selectedFeature: e.features[0], popup: newPopup }, () => {
        this.highlightFeature();
      });
    }
  };  
  
  getColorForValue = (colorScale, value) => {
    // Ensure the colorScale is structured correctly
    if (!Array.isArray(colorScale) || colorScale.length < 6) {
      console.error('Invalid color scale format', colorScale);
      return '#000000'; // Fallback color
    }
  
    // Define fixed stops
    const stops = [
      { stop: 0, color: colorScale[4] },
      { stop: 0.25, color: colorScale[6] },
      { stop: 0.5, color: colorScale[8] },
      { stop: 0.75, color: colorScale[10] },
      { stop: 1, color: colorScale[12] },
    ];
  
    console.log('stops:', stops);
  
    // Find the correct color range for the value
    for (let i = 0; i < stops.length - 1; i++) {
      console.log(`Checking if ${value} is between ${stops[i].stop} and ${stops[i + 1].stop}`);
      if (value >= stops[i].stop && value <= stops[i + 1].stop) {
        const t = (value - stops[i].stop) / (stops[i + 1].stop - stops[i].stop);
        const interpolatedColor = this.interpolateColor(stops[i].color, stops[i + 1].color, t);
        console.log('Interpolating between', stops[i].color, 'and', stops[i + 1].color, 'with factor', t, 'result:', interpolatedColor);
        return interpolatedColor;
      }
    }
  
    // If value is not in any range, return the last color
    console.warn('Value out of range, using last color', stops[stops.length - 1].color);
    return stops[stops.length - 1].color;
  };
  
  interpolateColor = (color1, color2, factor) => {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    const result = {
      r: Math.round(c1.r + factor * (c2.r - c1.r)),
      g: Math.round(c1.g + factor * (c2.g - c1.g)),
      b: Math.round(c1.b + factor * (c2.b - c1.b))
    };
    return this.rgbToHex(result);
  };
  
  hexToRgb = (hex) => {
    // Ensure hex is a string
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

      map.getSource('highlight-source').setData(highlightData);
    }
  };

  removeHighlight = () => {
    const { map } = this.state;
    const highlightData = {
      type: 'FeatureCollection',
      features: [],
    };

    if (map.getSource('highlight-source')) {
      map.getSource('highlight-source').setData(highlightData);
    }
  };

  initializeColorScales = () => {
    const colorValues = {
      A_percentile: ['#f8fccb', '#b7e3b6', '#40b5c4', '#2567ad', '#152774'],
      Q_percentile: ['#fff9f4', '#fcd2d0', '#f98ab7', '#d41ac0', '#49006a'],
      H_percentile: ['#fefddc', '#a9c689', '#669409', '#11692b', '#263021'],
      P_percentile: ['#f7fcb9', '#addd8e', '#31a354', '#006837', '#004529'],
    };
    let colorScales = {};
    Object.keys(colorValues).forEach((key) => {
      colorScales[key] = this.createColorScale(key, colorValues[key]);
    });
    return colorScales;
  };
  
  createColorScale = (percentileKey, colorArray) => [
    'interpolate',
    ['linear'],
    ['get', percentileKey],
    0, colorArray[0],
    0.25, colorArray[1],
    0.5, colorArray[2],
    0.75, colorArray[3],
    1, colorArray[4],
  ];

  initializeMapLayers = () => {
    const map = this.state.map;

    this.addMapSourcesAndLayers(map);
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

    this.setupMapLayers(map);
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
      this.getFirstSymbolLayerId(map)
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
      this.updateMapLayers();
    }
  }

  updateMapLayers = () => {
    const { map, colorScales, activeVariable } = this.state;
    if (!map) return;

    const layerTypes = {
      'brazil-microregion-layer': 'fill-color',
      'brazil-municipality-layer': 'fill-color',
      'brazil-point-layer': 'circle-color',
    };

    Object.keys(layerTypes).forEach((layerId) => {
      if (map.getLayer(layerId)) {
        const colorScale = colorScales[activeVariable];
        if (colorScale) {
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
    };
    this.setState({ activeVariable: variableMap[type] });
    this.props.onLayerChange(type); // Pass to parent component
  };

  render() {
    const { colors, labels } = this.state;
    return (
      <div className="map-wrapper">
        <div ref={this.mapContainer} className="map-container" style={{ height: 'calc(100vh - 100px)' }} /> {/* Adjust height */}
        <OverlayButtons onButtonClick={this.handleButtonClick} onLayerChange={this.props.onLayerChange} />
        <Legend colors={colors} labels={labels} />
      </div>
    );
  }
}

export default Map;