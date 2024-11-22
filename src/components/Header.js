import React from 'react';
import './Header.css';

const Header = () => {
    return (
        // Header container with class "header"
        <header className="header">
            <div className="header-content">
                {/* Main title of the header */}
                <h1>Atlas Educação</h1>
            </div>
        </header>
    );
};

export default Header; // Export the Header component as the default export
