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
      labels: []
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
      maxZoom: 12
    });

    map.on('load', () => {
      this.setState({ map }, () => {
        this.initializeMapLayers();
        this.addMapControls(map);
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
      marker: false 
    });

    geocoder.on('result', (event) => {
      // Adjust the zoom level manually if needed
      map.flyTo({
        center: event.result.center,
        zoom: 10 // Set your desired zoom level here
      });
    });

    map.addControl(geocoder, 'top-right'); // Add geocoder to the top right
  }

  createColorScale = (percentileKey, colorArray) => [
    "interpolate",
    ["linear"],
    ["get", percentileKey],
    0, colorArray[0],
    0.25, colorArray[1],
    0.5, colorArray[2],
    0.75, colorArray[3],
    1, colorArray[4]
  ];

  initializeColorScales = () => {
    const colorValues = {
      A_percentile: ["#f8fccb", "#b7e3b6", "#40b5c4", "#2567ad", "#152774"],
      Q_percentile: ["#fff9f4", "#fcd2d0", "#f98ab7", "#d41ac0", "#49006a"],
      H_percentile: ["#fefddc", "#a9c689", "#669409", "#11692b", "#263021"]
    };
    let colorScales = {};
    Object.keys(colorValues).forEach(key => {
      colorScales[key] = this.createColorScale(key, colorValues[key]);
    });
    return colorScales;
  }

  initializeMapLayers = () => {
    const map = this.state.map;
    const colorValues = {
      A_percentile: ["#f8fccb", "#b7e3b6", "#40b5c4", "#2567ad", "#152774"],
      Q_percentile: ["#fff9f4", "#fcd2d0", "#f98ab7", "#d41ac0", "#49006a"],
      H_percentile: ["#fefddc", "#a9c689", "#669409", "#11692b", "#263021"]
    };

    this.setState({
      colors: colorValues[this.state.activeVariable],
      labels: ["Scarce", "Low", "Moderate", "High", "Adequate"]
    });

    this.addMapSourcesAndLayers(map);
  }

  addMapSourcesAndLayers = (map) => {
    map.addSource("brazil-state-data", {
      type: "geojson",
      data: "/data/access_data_state.geojson",
    });
    map.addSource("brazil-microregion-data", {
      type: "geojson",
      data: "/data/access_data_microregion.geojson",
    });
    map.addSource("brazil-municipality-data", {
      type: "geojson",
      data: "/data/access_data_municipality.geojson",
    });
    map.addSource("brazil-point-data", {
      type: "geojson",
      data: "/data/access_data_points.geojson",
    });

    this.setupMapLayers(map);
  }

  setupMapLayers = (map) => {
    const { colorScales, activeVariable } = this.state;

    map.addLayer({
      id: "brazil-state-border",
      type: "line",
      source: "brazil-state-data",
      layout: {},
      paint: {
        "line-color": "#000000",
        "line-width": 1.5,
      }
    }, this.getFirstSymbolLayerId(map));

    map.addLayer({
      id: "brazil-microregion-layer",
      type: "fill",
      source: "brazil-microregion-data",
      minzoom: this.zoomThreshold,
      maxzoom: this.zoomThreshold + 1,
      layout: {},
      paint: {
        'fill-color': colorScales[activeVariable],
        'fill-opacity': 1
      }
    }, "brazil-state-border");

    map.addLayer({
      id: "brazil-municipality-layer",
      type: "fill",
      source: "brazil-municipality-data",
      minzoom: this.zoomThreshold + 1,
      maxzoom: this.zoomThreshold + 3,
      layout: {},
      paint: {
        'fill-color': colorScales[activeVariable],
        'fill-opacity': 1
      }
    }, "brazil-microregion-layer");

    map.addLayer({
      id: "brazil-point-layer",
      type: "circle",
      source: "brazil-point-data",
      minzoom: this.zoomThreshold + 3,
      paint: {
        "circle-color": colorScales[activeVariable],
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 13, 5],
        "circle-blur": ["interpolate", ["linear"], ["zoom"], 8, 1, 13, 0],
        "circle-opacity": 0.75
      }
    }, this.getFirstLineLayerId(map));
  }

  getFirstSymbolLayerId = (map) => {
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol') {
        return layers[i].id;
      }
    }
    return undefined;
  }

  getFirstLineLayerId = (map) => {
    const layers = map.getStyle().layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].type === 'line') {
        return layers[i].id;
      }
    }
    return undefined;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeVariable !== this.state.activeVariable) {
      this.updateMapLayers();
    }
  }

  updateMapLayers = () => {
    const { map, colorScales, activeVariable } = this.state;
    if (!map) return;

    const layerTypes = {
      "brazil-microregion-layer": "fill-color",
      "brazil-municipality-layer": "fill-color",
      "brazil-point-layer": "circle-color"
    };

    Object.keys(layerTypes).forEach(layerId => {
      if (map.getLayer(layerId)) {
        const colorScale = colorScales[activeVariable];
        if (colorScale) {
          map.setPaintProperty(layerId, layerTypes[layerId], colorScale);
        } else {
          console.error(`Color scale for ${activeVariable} is not defined`);
        }
      }
    });
  }

  handleButtonClick = (type) => {
    const variableMap = {
      'Access': 'A_percentile',
      'Quality': 'Q_percentile',
      'Access+Quality': 'H_percentile',
      'Population': 'P_percentile'
    };
    this.setState({ activeVariable: variableMap[type] });
  }

  render() {
    const { colors, labels } = this.state;
    return (
      <div className='map-wrapper'>
        <div ref={this.mapContainer} className="map-container" style={{ height: 'calc(100vh - 100px)' }} /> {/* Adjust height */}
        <OverlayButtons onButtonClick={this.handleButtonClick} />
        <Legend colors={colors} labels={labels} />
      </div>
    );
  }
}

export default Map;