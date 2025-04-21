import React from "react";
import { Link, useLocation } from "react-router-dom";
import './headerini.css';
import logoUniversidad from '../assets/Logo-nuevo-horizontal.png';

const Headerini = ({ isSidebarOpen }) => {
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return(
    <headerini className={`app-headerini ${!isAuthPage && isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="headerini-container">
        <Link to="/" className="logo-container">
          <img src={logoUniversidad} alt="Logo Universidad Francisco de Paula Santander" className="logoheaderini" />
        </Link>
      </div>
    </headerini>
  );
};

export default Headerini;