// Legend.js

import React from 'react';
import './Legend.css';

const Legend = ({ colors, labels, legendType, isRaceLegend }) => {
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
if (isRaceLegend) {
    // Split labels and colors into two rows
    const firstRowLabels = labels.slice(0, 3);
    const firstRowColors = colors.slice(0, 3);
    const secondRowLabels = labels.slice(3);
    const secondRowColors = colors.slice(3);

    return (
    <div className="legend-container">
        <div className="legend-buttons-row">
        {firstRowLabels.map((label, index) => (
            <div
            key={`row1-${index}`}
            className={`legend-button legend-button-${index}`}
            style={{ backgroundColor: firstRowColors[index] }}
            >
            <span className="legend-button-label">{label}</span>
            </div>
        ))}
        </div>
        <div className="legend-buttons-row">
        {secondRowLabels.map((label, index) => (
            <div
            key={`row2-${index}`}
            className={`legend-button legend-button-${index + 3}`}
            style={{ backgroundColor: secondRowColors[index] }}
            >
            <span className="legend-button-label">{label}</span>
            </div>
        ))}
        </div>
    </div>
    );
} else {
    // Render buttons with colors and labels as before
    return (
    <div className="legend-container">
        <div className="legend-buttons-row">
        {labels.map((label, index) => (
            <div
            key={index}
            className={`legend-button legend-button-${index}`}
            style={{ backgroundColor: colors[index] }}
            >
            <span className="legend-button-label">{label}</span>
            </div>
        ))}
        </div>
    </div>
    );
}
}
return null; // Or render nothing if legendType is not recognized
};

export default Legend;
