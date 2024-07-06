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
            <a href="https://drive.google.com/file/d/1oG0_7_CYMs5e0WlEUKyfWJsGK--S9mi2/view?usp=sharing" target="_blank" rel="noopener noreferrer">Methodology</a>
            <span className="divider">|</span> {/* Divider between links */}

            {/* Link to the Data Download */}
            <a href="https://github.com/hordiienkoalina/access-to-education/tree/main/public/data" target="_blank" rel="noopener noreferrer">Download Data</a>

        </footer>
    );
}

export default Footer; // Export the Footer component as the default export