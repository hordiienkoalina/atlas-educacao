import React from 'react';

function Legend({ colors = [], labels = [] }) {
    if (!colors || !labels) {
    return null; // or some fallback UI
    }

    return (
    <div className="legend">
        <div className="legend-scale">
        <ul className="legend-labels">
            {colors.map((color, index) => (
            <li key={index} style={{ backgroundColor: color, width: '20px', height: '20px' }}></li>
            ))}
        </ul>
        </div>
        <div className="legend-info">
        {labels.map((label, index) => (
            <p key={index}>{label}</p>
        ))}
        </div>
    </div>
    );
}

export default Legend;
