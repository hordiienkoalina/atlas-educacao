// Legend.js

import React from 'react';
import './Legend.css';

const Legend = ({ colors, labels, legendType }) => {
if (legendType === 'gradient') {
// Existing code for gradient legend
const colorValues = Array.isArray(colors)
    ? colors.filter((value) => typeof value === 'string' && value.startsWith('#'))
    : [];
const gradient = `linear-gradient(to right, ${colorValues.join(', ')})`;
return (
    <div className="legend-container">
    <div className="legend-scale" style={{ background: gradient }} />
    <div className="legend-labels">
        {labels.map((label, index) => (
        <span key={index}>{label}</span>
        ))}
    </div>
    </div>
);
} else if (legendType === 'categories') {
// Render buttons with colors and labels
return (
    <div className="legend-container">
    <div className="legend-buttons">
        {labels.map((label, index) => (
        <div
            key={index}
            className="legend-button"
            style={{ backgroundColor: colors[index] }}
        >
            <span className="legend-button-label">{label}</span>
        </div>
        ))}
    </div>
    </div>
);
}
  return null; // Or render nothing if legendType is not recognized
};

export default Legend;
