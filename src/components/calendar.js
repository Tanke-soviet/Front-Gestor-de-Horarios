import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './calendar.css'; 

const Calendar = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [monthName, setMonthName] = useState('');
    const [year, setYear] = useState('');
    
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/login');
            return;
        }
        
        const date = new Date();
        
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        setMonthName(months[date.getMonth()]);
        setYear(date.getFullYear());
    }, [navigate]);
    
    return (
        <div className="calendar-page">
            <div className="calendar-header">
                <div className="calendar-logo-container">
                    <svg className="calendar-logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="#e53935" strokeWidth="2"/>
                        <line x1="3" y1="10" x2="21" y2="10" stroke="#e53935" strokeWidth="2"/>
                        <line x1="8" y1="2" x2="8" y2="6" stroke="#e53935" strokeWidth="2"/>
                        <line x1="16" y1="2" x2="16" y2="6" stroke="#e53935" strokeWidth="2"/>
                    </svg>
                </div>
                <div className="calendar-title-container">
                    <h1 className="calendar-title">Calendario - {monthName} {year}</h1>
                </div>
            </div>
            
            <div className="calendar-content">
                <div className="calendar-grid">
                    {/* Días de la semana */}
                    <div className="calendar-weekdays">
                        <div>Hora</div>
                        <div>Lun</div>
                        <div>Mar</div>
                        <div>Mié</div>
                        <div>Jue</div>
                        <div>Vie</div>
                        <div>Sáb</div>
                    </div>
                    
                    <div className="calendar-days">
                        {Array.from({ length: 31 }, (_, i) => (
                            <div key={i} className="calendar-day">
                                <span>{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;