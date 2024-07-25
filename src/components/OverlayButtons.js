import React, { useState } from 'react'; // Import React library and useState hook
import './OverlayButtons.css'; // Import CSS for overlay buttons

function OverlayButtons({ onButtonClick, onLayerChange }) {
    const [activeButton, setActiveButton] = useState('Access-Quality'); // Initialize state for the active button

    const handleClick = (type) => {
        setActiveButton(type); // Update the active button state
        onButtonClick(type); // Call the onButtonClick function passed as a prop
    };

    return (
    <div className="overlay-buttons">
        <button 
        className={`overlay-button ${activeButton === 'Access-Quality' ? 'active' : ''}`} 
        onClick={() => handleClick('Access-Quality')}
        >
        Access-Quality
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Quality' ? 'active' : ''}`} 
        onClick={() => handleClick('Quality')}
        >
        Quality
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Access' ? 'active' : ''}`} 
        onClick={() => handleClick('Access')}
        >
        Access
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Income' ? 'active' : ''}`} 
        onClick={() => handleClick('Income')}
        >
        Income
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Gender' ? 'active' : ''}`} 
        onClick={() => handleClick('Gender')}
        >
        Gender
        </button>
        <button 
        className={`overlay-button ${activeButton === 'Race' ? 'active' : ''}`} 
        onClick={() => handleClick('Race')}
        >
        Race
        </button>
    </div>
    );
}

export default OverlayButtons; // Export the OverlayButtons component as the default export