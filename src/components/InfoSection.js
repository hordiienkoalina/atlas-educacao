import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './InfoSection.css';
import { Trans } from 'react-i18next';
import { BsQuestionCircle } from "react-icons/bs";



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
        <BsQuestionCircle size={25}/>
      </button>
      {isOpen && (
        <div className="info-popup-overlay" onClick={toggleInfo}>
          <div className="info-popup" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={toggleInfo}>×</button>

            <h1 className="info-title">{t('info.title')} </h1>

            <h3><Trans i18nKey="info.dataSource.question" components={{ u: <u /> }}/></h3>
            <p><Trans i18nKey="info.dataSource.answer"/></p>

            <h3><Trans i18nKey="info.dotRepresentation.question" components={{ u: <u /> }}/></h3>
            <p>{t('info.dotRepresentation.answer')}</p>
            
            <h3><Trans i18nKey="info.colorRepresentation.question" components={{ u: <u /> }}/></h3>
            <Trans i18nKey="info.colorRepresentation.answer"/>
            
            <h3><Trans i18nKey="info.pardaRace.question" components={{ u: <u /> }}/></h3>
            <p>{t('info.pardaRace.answer')}</p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoSection;