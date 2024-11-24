import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Popup.css';
import { Trans } from 'react-i18next';
import { BsQuestionCircle } from "react-icons/bs";


const Popup = ({ onClose }) => {
  const { t } = useTranslation();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleCheckboxChange = (e) => {
    setDontShowAgain(e.target.checked);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('popupClosed', 'true');
    }
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={handleClose}>&times;</button>
        <h2>{t('popup.welcomeTitle')}</h2>
        <Trans i18nKey="popup.description1" components={{ u: <u /> }}/>
        <p><Trans i18nKey="popup.description2"/></p>
        <p className="description-with-circle">
          <span className="dot"></span>
          <Trans i18nKey="popup.description3" components={{ BsQuestionCircle: <BsQuestionCircle className="icon-inline"/> }}/>
        </p>
        
        
        <div>
          <input
            type="checkbox"
            id="dont-show-again"
            onChange={handleCheckboxChange}
          />
          <label htmlFor="dont-show-again">{t('popup.dontShowAgain')}</label>
        </div>
      </div>
    </div>
  );
};

export default Popup;