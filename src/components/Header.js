import React from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook
import './Header.css';

const Header = () => {
    const { t } = useTranslation(); // Initialize translation hook

    return (
        <header className="header">
            <div className="header-content">
                <h1>{t('header.title')}</h1> {/* Translate header title */}
            </div>
        </header>
    );
};

export default Header;
