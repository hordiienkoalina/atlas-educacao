import React from 'react';
import './Legend.css';

const Legend = ({ colors, labels }) => {
    // Ensure colors is defined and is an array
    const colorValues = Array.isArray(colors) ? colors.filter(value => typeof value === 'string' && value.startsWith('#')) : [];
    const gradient = `linear-gradient(to right, ${colorValues.join(', ')})`;
    console.log('Generated gradient:', gradient); // Debug log

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
};

export default Legend;
