// OverlayButtons.js
import React from 'react';
import './OverlayButtons.css';

function OverlayButtons({ onButtonClick }) {
    const handleClick = (type) => {
        console.log("Button clicked:", type);
        onButtonClick(type);
    }
    return (
        <div className="map-overlay">
            <button onClick={() => handleClick('Access')}>Access</button>
            <button onClick={() => handleClick('Quality')}>Quality</button>
            <button onClick={() => handleClick('Quality-Adjusted Access')}>Quality-Adjusted Access</button>
        </div>
    );
}

export default OverlayButtons;