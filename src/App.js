import React from 'react';
import Map from './components/Map';
import OverlayButtons from './components/OverlayButtons';
import Legend from './components/Legend';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Map />
      <OverlayButtons />
      <Legend />
      <Footer />
    </div>
  );
};

export default App;