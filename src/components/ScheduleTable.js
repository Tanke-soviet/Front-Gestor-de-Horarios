import React from 'react';
import './ScheduleTable.css';

const ScheduleTable = ({ weeklySchedule, loading }) => {
  const days = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  // Get all unique time slots from all days
  const getAllTimeSlots = () => {
    const timeSlots = new Set();
    
    Object.values(weeklySchedule || {}).forEach(daySessions => {
      daySessions.forEach(session => {
        timeSlots.add(session.hora_inicio);
      });
    });
    
    return Array.from(timeSlots).sort();
  };

  const timeSlots = getAllTimeSlots();

  const formatTime = (time) => {
    // Convert 24h format to 12h format if needed
    if (time && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  const getSessionAtTime = (dayKey, timeSlot) => {
    const daySessions = weeklySchedule?.[dayKey] || [];
    return daySessions.find(session => session.hora_inicio === timeSlot);
  };

  if (loading) {
    return (
      <div className="schedule-table-container">
        <div className="loading-message">
          <p>Cargando horario...</p>
        </div>
      </div>
    );
  }

  if (!weeklySchedule || timeSlots.length === 0) {
    return (
      <div className="schedule-table-container">
        <div className="empty-schedule">
          <p>No se encontraron clases programadas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-table-container">
      <h3 className="schedule-table-title">Mi Horario Semanal</h3>
      
      <div className="schedule-table-wrapper">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="time-header">Hora</th>
              {days.map(day => (
                <th key={day.key} className="day-header">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(timeSlot => (
              <tr key={timeSlot} className="time-row">
                <td className="time-cell">
                  {formatTime(timeSlot)}
                </td>
                {days.map(day => {
                  const session = getSessionAtTime(day.key, timeSlot);
                  return (
                    <td key={`${day.key}-${timeSlot}`} className="session-cell">                      {session ? (
                        <div className="session-block">
                          <div className="subject-name">
                            {session.materia_nombre || session.materia?.nombre || 'Materia'}
                          </div>
                          <div className="session-details">
                            <div className="time-range">
                              {formatTime(session.hora_inicio)} - {formatTime(session.hora_fin)}
                            </div>
                            <div className="location">
                              {session.edificio} - {session.salon}
                            </div>
                            {(session.profesor_nombre || session.periodo_nombre) && (
                              <div className="additional-info">
                                {session.profesor_nombre && (
                                  <div className="professor">
                                    Prof: {session.profesor_nombre}
                                  </div>
                                )}
                                {session.periodo_nombre && (
                                  <div className="period">
                                    {session.periodo_nombre}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-cell"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
