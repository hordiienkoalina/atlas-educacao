import React, { useState } from 'react'; // Import React and useState hook
import './Subheader.css'; // Import CSS for subheader

const Subheader = ({ title, description }) => {
    const [isDescriptionVisible, setDescriptionVisible] = useState(true);

    // Toggle visibility state
    const toggleDescription = () => {
        setDescriptionVisible(!isDescriptionVisible);
    };

    return (
        <div className="subheader"> {/* Container for subheader */}
            <div className="subheader-header">
                <h2>{title}</h2> {/* Subheader title */}
                <button 
                    className="toggle-button" 
                    onClick={toggleDescription}
                    aria-label={isDescriptionVisible ? "Hide description" : "Show description"}
                >
                    {isDescriptionVisible ? '×' : '+'} {/* Toggle button symbol */}
                </button>
            </div>
            <div className={`subheader-description ${isDescriptionVisible ? 'visible' : 'hidden'}`}>
                <p>{description}</p> {/* Subheader description */}
            </div>
        </div>
    );
};

export default Subheader; // Export the Subheader component as the default export
