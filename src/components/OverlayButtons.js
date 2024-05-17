import React from 'react';
import './OverlayButtons.css';

function OverlayButtons({ onButtonClick }) {
    console.log("Props received:", onButtonClick);
    return (
        <div className="map-overlay">
            <button onClick={() => onButtonClick('Access')}>Access</button>
            <button onClick={() => onButtonClick('Quality')}>Quality</button>
            <button onClick={() => onButtonClick('Quality-Adjusted Access')}>Quality-Adjusted Access</button>
        </div>
    );
}

export default OverlayButtons;