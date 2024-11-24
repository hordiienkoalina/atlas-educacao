import React, { useState } from 'react'; // Import React library and useState hook
import { useTranslation } from 'react-i18next'; // Import i18n translation hook
import './OverlayButtons.css'; // Import CSS for overlay buttons

function OverlayButtons({ onButtonClick, onLayerChange }) {
    const { t } = useTranslation(); // Initialize translation hook
    const [activeButton, setActiveButton] = useState('Access-Quality'); // Initialize state for the active button

    const handleClick = (type) => {
        setActiveButton(type); // Update the active button state
        onButtonClick(type); // Call the onButtonClick function passed as a prop
    };

    return (
        <div className="overlay-buttons">
            <div className="tooltip">
                <button 
                    className={`overlay-button ${activeButton === 'Access-Quality' ? 'active' : ''}`} 
                    onClick={() => handleClick('Access-Quality')}
                >
                    {t('layerDescriptions.accessQuality.title')} {/* Translate button text */}
                </button>
                <span className="tooltiptext">{t("layerDescriptions.accessQuality.blurb")}</span>
            </div>
            <div className="tooltip">
                <button 
                    className={`overlay-button ${activeButton === 'Quality' ? 'active' : ''}`} 
                    onClick={() => handleClick('Quality')}
                >
                    {t('layerDescriptions.quality.title')}
                </button>
                <span className="tooltiptext">{t("layerDescriptions.quality.blurb")}</span>
            </div>
            <div className="tooltip">
                <button 
                    className={`overlay-button ${activeButton === 'Access' ? 'active' : ''}`} 
                    onClick={() => handleClick('Access')}
                >
                    {t('layerDescriptions.access.title')}
                </button>
                <span className="tooltiptext">{t("layerDescriptions.access.blurb")}</span>
            </div>
            <div className="tooltip">
                <button 
                    className={`overlay-button ${activeButton === 'Income' ? 'active' : ''}`} 
                    onClick={() => handleClick('Income')}
                >
                    {t('layerDescriptions.income.title')}
                </button>
                <span className="tooltiptext">{t("layerDescriptions.income.blurb")}</span>
            </div>
            {/* <div className="tooltip">
                <button 
                    className={`overlay-button ${activeButton === 'Gender' ? 'active' : ''}`} 
                    onClick={() => handleClick('Gender')}
                >
                    {t('overlayButtons.gender')}
                </button>
                <span className="tooltiptext">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</span>
            </div> */}
            <div className="tooltip">
                <button 
                    className={`overlay-button ${activeButton === 'Race' ? 'active' : ''}`} 
                    onClick={() => handleClick('Race')}
                >
                    {t('layerDescriptions.race.title')}
                </button>
                <span className="tooltiptext">{t("layerDescriptions.race.blurb")}</span>
            </div>
        </div>
    );
}

export default OverlayButtons;