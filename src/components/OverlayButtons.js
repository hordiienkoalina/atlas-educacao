import React, { useState } from 'react';
import './OverlayButtons.css';

function OverlayButtons({ onButtonClick }) {
    const [activeButton, setActiveButton] = useState('Access');

    const handleClick = (type) => {
    setActiveButton(type);
    onButtonClick(type);
    };

    return (
    <div className="overlay-buttons">
        <button 
        className={`overlay-button ${activeButton === 'Access' ? 'active' : ''}`} 
        onClick={() => handleClick('Access')}
        >
        Access
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Quality' ? 'active' : ''}`} 
        onClick={() => handleClick('Quality')}
        >
        Quality
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Access+Quality' ? 'active' : ''}`} 
        onClick={() => handleClick('Access+Quality')}
        >
        Access-Quality
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Population' ? 'active' : ''}`} 
        onClick={() => handleClick('Population')}
        >
        Population
        </button>
    </div>
    );
}

export default OverlayButtons;