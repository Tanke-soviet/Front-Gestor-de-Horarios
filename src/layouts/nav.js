import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Header from '../layouts/header';
import Footer from '../layouts/footer';
import { getCurrentUser } from '../services/api';
import './nav.css';

const Nav = ({ children, userName }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userDisplayName, setUserDisplayName] = useState('Usuario');
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    useEffect(() => {
        const getUserData = () => {
            const user = getCurrentUser();
            console.log('Nav - userData obtenido:', user);

            if (user && user.nombre) {
                console.log('Usando nombre del usuario:', user.nombre);
                setUserDisplayName(user.nombre);
            } else if (userName) {
                console.log('Usando nombre de props:', userName);
                setUserDisplayName(userName);
            } else {
                console.log('Sin nombre disponible, usando "Usuario"');
                setUserDisplayName('Usuario');
            }
        };

        getUserData();
    }, [userName]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        navigate('/login');
    };

    return (
        <div className="nav-container">
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {!isAuthPage && (
                <>
                    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                        <div className="sidebar-header">
                            <h2>Menú</h2>
                            <button className="close-button" onClick={toggleSidebar}>✕</button>
                        </div>

                        <div className="sidebar-content">
                            <ul className="sidebar-menu">
                                <li>
                                    <Link to="/perfil">
                                        <i className="user-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="8" r="5"></circle>
                                                <path d="M20 21a8 8 0 0 0-16 0"></path>
                                            </svg>
                                        </i>
                                        <span>{userDisplayName}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/agenda">
                                        <i className="calendar-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </i>
                                        <span>Agenda</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/dia">
                                        <i className="day-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                <line x1="12" y1="4" x2="12" y2="22"></line>
                                            </svg>
                                        </i>
                                        <span>Día</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/semana">
                                        <i className="week-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                                                <path d="M3 9h18"></path>
                                                <path d="M9 21V9"></path>
                                                <path d="M15 21V9"></path>
                                            </svg>
                                        </i>
                                        <span>Semana</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/mes">
                                        <i className="month-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </i>
                                        <span>Mes</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/horario">
                                        <i className="schedule-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                                <path d="M8 14h.01"></path>
                                                <path d="M12 14h.01"></path>
                                                <path d="M16 14h.01"></path>
                                                <path d="M8 18h.01"></path>
                                                <path d="M12 18h.01"></path>
                                                <path d="M16 18h.01"></path>
                                            </svg>
                                        </i>
                                        <span>Horario</span>
                                    </Link>
                                </li>
                            </ul>

                            <div className="sidebar-divider"></div>

                            <div className="sidebar-footer">
                                <Link to="/sincronizar" className="sync-link">
                                    <i className="sync-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path>
                                        </svg>
                                    </i>
                                    <span>Sincronizar con Google</span>
                                </Link>

                                <button className="logout-button" onClick={handleLogout}>
                                    <i className="logout-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                    </i>
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                        <div className="page-content">
                            {children}
                        </div>
                        <Footer />
                    </div>
                </>
            )}
        </div>
    );
};

export default Nav;