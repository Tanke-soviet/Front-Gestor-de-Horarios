import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <Link to="/schedule/calendar" className="footer-item">
          <div className="icon-container">
            <div className="calendar-icon"></div>
          </div>
          <span>Calendario</span>
        </Link>
        
        <Link to="/schedule/notes" className="footer-item">
          <div className="icon-container">
            <div className="notes-icon"></div>
          </div>
          <span>Notas</span>
        </Link>
        
        <Link to="/schedule/resources" className="footer-item">
          <div className="icon-container">
            <div className="resources-icon"></div>
          </div>
          <span>Recursos</span>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;