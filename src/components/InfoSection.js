import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './InfoSection.css';
import { Trans } from 'react-i18next';


const InfoSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        onClick={toggleInfo}
        className="info-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12" y2="8"></line>
        </svg>
      </button>
      {isOpen && (
        <div className="info-popup-overlay" onClick={toggleInfo}>
          <div className="info-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleInfo}>×</button>

            <h1 className="info-title">{t('info.title')} </h1>

            <h3><Trans i18nKey="info.dotRepresentation.question" components={{ u: <u /> }}/></h3>
            <p>{t('info.dotRepresentation.answer')}</p>
            
            <h3><Trans i18nKey="info.colorRepresentation.question" components={{ u: <u /> }}/></h3>
            <Trans i18nKey="info.colorRepresentation.answer"/>
            
            <h3>{t('info.pardaRace.question')}</h3>
            <p>{t('info.pardaRace.answer')}</p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;