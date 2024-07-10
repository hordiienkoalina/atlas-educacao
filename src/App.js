import React, { useState } from 'react';
import Map from './components/Map';
import Footer from './components/Footer';
import Header from './components/Header';
import Subheader from './components/Subheader';
import './App.css';

const App = () => {
  // State to manage the selected map layer
  const [selectedLayer, setSelectedLayer] = useState('Access-Quality');

  // Handler for changing the map layer
  const handleLayerChange = (layer) => {
    setSelectedLayer(layer); // Update the selected layer state
  };

  // Descriptions for each layer type
  const layerDescriptions = {
    'Access': 'The spatial access to public high-schools, considering supply and demand of schools and family preferences.',
    'Quality': 'The quality of each school based on test scores and grade progression ratios.',
    'Access-Quality': 'The spatial access to high-quality public high-schools, considering supply and demand of schools, school quality, and family preferences.',
    'Income': 'The monthly household earnings in dollars.',
    'Gender': 'The gender distribution of the population',
    'Race': 'The racial distribution of the population',
  };

  return (
    <div className="App">
      {/* Header component */}
      <Header />

      {/* Main content area */}
      <div className="content">
        {/* Subheader with dynamic title and description based on selected layer */}
        <Subheader 
          title={`${selectedLayer}`} 
          description={layerDescriptions[selectedLayer] || 'No description available.'} 
        />

        {/* Container for the map component */}
        <div className="map-container">
          <Map onLayerChange={handleLayerChange} /> {/* Map component with layer change handler */}
        </div>
      </div>

      {/* Footer component */}
      <Footer />
    </div>
  );
};

export default App; // Export the App component as the default export