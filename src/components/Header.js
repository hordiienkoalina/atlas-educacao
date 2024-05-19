import React from 'react';
import './Header.css';

const Header = () => {
    return (
    <header className="header">
        <div className="header-content">
        <h1>Atlas Educação</h1>
        <hr className="header-line" />
        <div className="subheader">
            <h2>Currently Showing</h2>
            <p>Description of the layer currently being shown.</p>
        </div>
        </div>
    </header>
    );
};

export default Header;