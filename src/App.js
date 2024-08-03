import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Footer from './components/Footer';
import Header from './components/Header';
import Subheader from './components/Subheader';
import Popup from './components/Popup'; // Import the Popup component
import './App.css';

const App = () => {
  const [selectedLayer, setSelectedLayer] = useState('Access-Quality');
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for the popup visibility

  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const layerDescriptions = {
    'Access': 'The spatial access to public high schools, considering supply and demand of schools and student preferences.',
    'Quality': 'The quality of each school based on test scores and grade progression ratios.',
    'Access-Quality': 'The spatial access to high-quality public high schools, considering supply and demand of schools, student preferences, and school quality.',
    'Income': 'The monthly household earnings.',
    'Gender': 'The gender distribution of the population.',
    'Race': 'The racial distribution of the population.',
  };

  useEffect(() => {
    // Check local storage to determine if popup should be shown
    if (!localStorage.getItem('popupClosed')) {
      setIsPopupVisible(true);
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Subheader 
          title={`${selectedLayer}`} 
          description={layerDescriptions[selectedLayer] || 'No description available.'} 
        />
        <div className="map-container">
          <Map onLayerChange={handleLayerChange} />
        </div>
      </div>
      <Footer />
      {isPopupVisible && <Popup onClose={handleClosePopup} />} {/* Conditionally render the popup */}
    </div>
  );
};

export default App;
