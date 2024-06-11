import React from 'react';
import './Footer.css';

function Footer() {
    return (
        // Footer container with class "footer-menu"
        <footer className="footer-menu">
            {/* Link to the GitHub repository */}
            <a href="https://github.com/hordiienkoalina/access-to-education" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i> {/* GitHub icon */}
            </a>
            <span className="divider">|</span> {/* Divider between links */}

            {/* Link to the Methodology page */}
            <a href="pages/methodology.html">Methodology</a>
            <span className="divider">|</span> {/* Divider between links */}

            {/* Link to the Data Download */}
            <a href="pages/data.html">Download Data</a>
            <span className="divider">|</span> {/* Divider between links */}

            {/* Link to the Map Export */}
            <a href="pages/export.html">Export Map</a>
        </footer>
    );
}

export default Footer; // Export the Footer component as the default export