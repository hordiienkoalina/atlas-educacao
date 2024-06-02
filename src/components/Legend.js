import React from 'react';

function Legend({ colors = [], labels = [] }) {
    // Return null if colors or labels are not provided
    if (!colors || !labels) {
        return null; // or some fallback UI
    }

    return (
        // Legend container with class "legend"
        <div className="legend">
            {/* Container for the legend scale */}
            <div className="legend-scale">
                <ul className="legend-labels">
                    {/* Map through the colors array and create a list item for each color */}
                    {colors.map((color, index) => (
                        <li key={index} style={{ backgroundColor: color, width: '20px', height: '20px' }}></li>
                    ))}
                </ul>
            </div>
            {/* Container for the legend info */}
            <div className="legend-info">
                {/* Map through the labels array and create a paragraph for each label */}
                {labels.map((label, index) => (
                    <p key={index}>{label}</p>
                ))}
            </div>
        </div>
    );
}

export default Legend; // Export the Legend component as the default export