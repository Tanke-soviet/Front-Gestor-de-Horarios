import React from "react";
import { Link, useLocation } from "react-router-dom";
import './header.css';
import logoUniversidad from '../assets/Logo-nuevo-horizontal.png';

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <header className={`app-header ${!isAuthPage && isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="header-container">
        {!isAuthPage && (
          <button className="menu-icon" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <Link to="/" className="logo-container">
          <img 
            src={logoUniversidad} 
            alt="Logo Universidad Francisco de Paula Santander" 
            className="logoheader" 
          />
        </Link>
        
        {!isAuthPage && (
          <div className="header-controls">
            <div className="notification-container">
              <button className="notification-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </button>
              <span className="notification-dot"></span>
            </div>
            <button className="more-options">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;