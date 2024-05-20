import React, { useState } from 'react';
import Map from './components/Map';
import Footer from './components/Footer';
import Header from './components/Header';
import Subheader from './components/Subheader';
import './App.css';

const App = () => {
  const [selectedLayer, setSelectedLayer] = useState('Access');

  const handleLayerChange = (layer) => {
    console.log(`Layer changed to: ${layer}`); // Debug log
    setSelectedLayer(layer);
  };

  const layerDescriptions = {
    'Access': 'Description of the Access layer currently being shown.',
    'Quality': 'Description of the Quality layer currently being shown.',
    'Access-Quality': 'Description of the Quality-Adjusted Access layer currently being shown.',
    'Population': 'Description of the Population layer currently being shown.'
  };

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Subheader 
          title={`Currently Showing: ${selectedLayer}`} 
          description={layerDescriptions[selectedLayer] || 'No description available.'} 
        />
        <div className="map-container">
          <Map onLayerChange={handleLayerChange} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;