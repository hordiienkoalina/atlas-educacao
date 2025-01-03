import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Map from './components/Map';
import Footer from './components/Footer';
import Header from './components/Header';
import Subheader from './components/Subheader';
import Popup from './components/Popup';
import InfoSection from './components/InfoSection';
import './App.css';

const App = () => {
  const { t, i18n } = useTranslation();
  const [selectedLayer, setSelectedLayer] = useState('Access-Quality');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const handleLayerChange = (layer) => {
    setSelectedLayer(layer);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const layerDescriptions = {
    'Access': t('layerDescriptions.access.description'),
    'Quality': t('layerDescriptions.quality.description'),
    'Access-Quality': t('layerDescriptions.accessQuality.description'),
    'Income': t('layerDescriptions.income.description'),
    'Gender': t('layerDescriptions.gender.description'),
    'Race': t('layerDescriptions.race.description'),
  };

  useEffect(() => {
    if (!localStorage.getItem('popupClosed')) {
      setIsPopupVisible(true);
    }
  }, []);

  useEffect(() => {
    const browserLanguage = i18n.language;
    console.log("Detected language: ", browserLanguage);
  }, [i18n.language]);

  return (
    <div className="App">
      <Header />
      <div className="content">
        <Subheader 
          title={t(selectedLayer)} 
          description={layerDescriptions[selectedLayer] || t('noDescriptionAvailable')} 
        />
        <div className="map-container">
          <Map onLayerChange={handleLayerChange} />
        </div>
      </div>
      <Footer />
      {isPopupVisible && <Popup onClose={handleClosePopup} />}
      <InfoSection content={t('infoSectionContent')} />
    </div>
  );
};

export default App;