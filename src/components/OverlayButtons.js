import React, { useState } from 'react'; // Import React library and useState hook
import './OverlayButtons.css'; // Import CSS for overlay buttons

function OverlayButtons({ onButtonClick, onLayerChange }) {
    const [activeButton, setActiveButton] = useState('Access'); // Initialize state for the active button

    const handleClick = (type) => {
        setActiveButton(type); // Update the active button state
        onButtonClick(type); // Call the onButtonClick function passed as a prop
    };

    return (
        <div className="overlay-buttons"> {/* Container for overlay buttons */}
            <button 
                className={`overlay-button ${activeButton === 'Access' ? 'active' : ''}`} // Apply active class if button is active
                onClick={() => handleClick('Access')} // Handle click event for Access button
            >
                Access {/* Button label */}
            </button>
            <button 
                className={`overlay-button ${activeButton === 'Quality' ? 'active' : ''}`} // Apply active class if button is active
                onClick={() => handleClick('Quality')} // Handle click event for Quality button
            >
                Quality {/* Button label */}
            </button>
            <button 
                className={`overlay-button ${activeButton === 'Access-Quality' ? 'active' : ''}`} // Apply active class if button is active
                onClick={() => handleClick('Access-Quality')} // Handle click event for Access-Quality button
            >
                Access-Quality {/* Button label */}
            </button>
            <button 
                className={`overlay-button ${activeButton === 'Population' ? 'active' : ''}`} // Apply active class if button is active
                onClick={() => handleClick('Population')} // Handle click event for Population button
            >
                Population {/* Button label */}
            </button>
        </div>
    );
}

export default OverlayButtons; // Export the OverlayButtons component as the default export