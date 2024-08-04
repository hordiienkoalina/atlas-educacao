import React, { useState } from 'react';
import './Popup.css';

const Popup = ({ onClose }) => {
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
        <h2>Welcome to Atlas Educação</h2>
        <p>Access to education is commonly associated with the cost and proximity of a school. While these are crucial factors, other elements like resource availability, classroom capacity, and education quality are equally pivotal. </p>
        <p> The Atlas Educação uses the Demographic Census and the School Census to highlight which areas have inadequate access to public secondary education. Use the map to explore every neighborhood in Brazil to see which have the most and the least access to high-quality public high schools.</p>
        <div>
          <input
            type="checkbox"
            id="dont-show-again"
            onChange={handleCheckboxChange}
          />
          <label htmlFor="dont-show-again">Don't show this again</label>
        </div>
      </div>
    </div>
  );
};

export default Popup;
