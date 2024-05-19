import React from 'react';
import './Subheader.css';

const Subheader = ({ title, description }) => {
    return (
    <div className="subheader">
        <h2>{title}</h2>
        <p>{description}</p>
    </div>
    );
};

export default Subheader;