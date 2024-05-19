import React from 'react';
import Map from './components/Map';
import Footer from './components/Footer';
import Header from './components/Header';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Header /> 
      <Map />
      <Footer />
    </div>
  );
};

export default App;