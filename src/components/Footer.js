import React from 'react';
import './Footer.css';

function Footer() {
    return (
        // Footer container with class "footer-menu"
        <footer className="footer-menu">
            {/* Link to the About Us page */}
            <a href="pages/about-us.html">About Us</a> 
            <span className="divider">|</span> {/* Divider between links */}
            
            {/* Link to the Tutorial page */}
            <a href="pages/tutorial.html">Tutorial</a> 
            <span className="divider">|</span> {/* Divider between links */}
            
            {/* Link to the Methodology page */}
            <a href="pages/methodology.html">Methodology</a> 
            <span className="divider">|</span> {/* Divider between links */}
            
            {/* Link to the Download page */}
            <a href="pages/download.html">Download</a>
        </footer>
    );
}

export default Footer; // Export the Footer component as the default export