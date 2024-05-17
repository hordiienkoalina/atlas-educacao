import React from 'react';
import './Footer.css';

function Footer() {
    return (
    <footer className="footer-menu">
        <a href="pages/about-us.html">About Us</a> <span className="divider">|</span>
        <a href="pages/tutorial.html">Tutorial</a> <span className="divider">|</span>
        <a href="pages/methodology.html">Methodology</a> <span className="divider">|</span>
        <a href="pages/download.html">Download</a>
    </footer>
    );
}

export default Footer;