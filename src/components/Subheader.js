import React from 'react'; // Import React library
import './Subheader.css'; // Import CSS for subheader

const Subheader = ({ title, description }) => {
    return (
        <div className="subheader"> {/* Container for subheader */}
            <h2>{title}</h2> {/* Subheader title */}
            <p>{description}</p> {/* Subheader description */}
        </div>
    );
};

export default Subheader; // Export the Subheader component as the default export