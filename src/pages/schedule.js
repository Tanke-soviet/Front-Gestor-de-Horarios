import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './schedule.css';
import { getScheduleItems, addScheduleItem, deleteSchedule, uploadScheduleFile } from '../services/scheduleServices';
import { getMyWeeklySchedule } from '../services/sessionService';
import ScheduleTable from '../components/ScheduleTable';

const Schedule = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weeklySchedule, setWeeklySchedule] = useState(null);
    const [hasSessionData, setHasSessionData] = useState(false);
    const [scheduleLoading, setScheduleLoading] = useState(true);    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            navigate('/login');
            return;
        }

        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }
        loadSchedules();
        checkForSessionData();
    }, [navigate]);    const loadSchedules = async () => {
        try {
            setLoading(true);
            const items = await getScheduleItems();
            setSchedules(items);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar horarios:", error);
            setLoading(false);
        }
    };

    const checkForSessionData = async () => {
        try {
            setScheduleLoading(true);
            const schedule = await getMyWeeklySchedule();
            
            // Check if user has any sessions scheduled
            const hasSessions = Object.values(schedule).some(daySessions => 
                daySessions && daySessions.length > 0
            );
            
            setHasSessionData(hasSessions);
            setWeeklySchedule(schedule);
            setScheduleLoading(false);
        } catch (error) {
            console.error("Error al verificar datos de sesión:", error);
            // If there's an error (like no token, no user subjects, etc.), 
            // assume user doesn't have session data
            setHasSessionData(false);
            setWeeklySchedule(null);
            setScheduleLoading(false);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) return;

        try {
            setLoading(true);
            await uploadScheduleFile(selectedFile);
            setSelectedFile(null);
            await loadSchedules(); 
            setLoading(false);
            
            // Show success message
            alert("Archivo subido exitosamente.");
        } catch (error) {
            console.error("Error al guardar el horario:", error);
            setLoading(false);
            
            // Manejar error de sesión expirada
            if (error.message.includes('Sesión expirada')) {
                alert("Tu sesión ha expirado. Serás redirigido al login.");
                navigate('/login');
                return;
            }
            
            // Otros errores
            alert("Error al subir el archivo. Por favor, inténtalo de nuevo.");
        }
    };

    const handleDeleteSchedule = async (id) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este horario?")) {
            try {
                await deleteSchedule(id);
                await loadSchedules(); 
                alert("Horario eliminado exitosamente.");
            } catch (error) {
                console.error("Error al eliminar el horario:", error);
                alert("Error al eliminar el horario. Por favor, inténtalo de nuevo.");
            }
        }
    };

    const refreshScheduleData = async () => {
        await checkForSessionData();
    };if (loading || scheduleLoading) {
        return (
            <div className="page-content">
                <div className="schedule-card">
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }    return (
        <div className="page-content">
            <div className="schedule-card">
                {hasSessionData ? (
                    <>                        {/* User has session data - show schedule table with upload option */}
                        <h2 className="schedule-title">Mi Horario</h2>
                        <p className="schedule-subtitle">Horario académico actual</p>
                        
                        <div className="schedule-controls">
                            <button 
                                className="refresh-button"
                                onClick={refreshScheduleData}
                                disabled={scheduleLoading}
                            >
                                {scheduleLoading ? 'Actualizando...' : 'Actualizar Horario'}
                            </button>
                        </div>
                        
                        <ScheduleTable 
                            weeklySchedule={weeklySchedule} 
                            loading={scheduleLoading}
                        />
                        
                        <div className="upload-section-with-schedule">
                            <h3 className="upload-title">Subir nuevo horario PDF</h3>
                            <p className="upload-info">También puedes subir una copia en PDF de tu horario</p>
                            
                            <form onSubmit={handleSubmit} className="upload-form">
                                <div className="file-upload">
                                    <button
                                        type="button"
                                        className="upload-button"
                                        onClick={() => document.getElementById('fileInput').click()}
                                    >
                                        Seleccionar archivo PDF
                                    </button>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        accept=".pdf"
                                        style={{ display: 'none' }}
                                        onChange={handleFileSelect}
                                    />
                                </div>

                                <p className="file-selected">
                                    {selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}
                                </p>

                                <button
                                    type="submit"
                                    className="continue-button"
                                    disabled={!selectedFile}
                                >
                                    Guardar PDF
                                </button>
                            </form>
                            
                            {schedules.length > 0 && (
                                <div className="saved-schedules">
                                    <h4 className="saved-title">Archivos PDF guardados:</h4>
                                    <div className="schedules-list">
                                        {schedules.map(schedule => (
                                            <div key={schedule.id} className="schedule-item">
                                                <p>Archivo: {schedule.fileName}</p>
                                                <p>Tamaño: {Math.round(schedule.fileSize / 1024)} KB</p>
                                                <p>Fecha: {new Date(schedule.uploadDate).toLocaleDateString()}</p>
                                                <button
                                                    className="delete-button"
                                                    onClick={() => handleDeleteSchedule(schedule.id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        {/* User doesn't have session data - show upload-only view */}
                        {schedules.length > 0 ? (
                            <>
                                <h2 className="schedule-title">Horarios guardados</h2>
                                <p className="schedule-subtitle">Se guardan / Se eliminan</p>
                                
                                <div className="schedules-list">
                                    {schedules.map(schedule => (
                                        <div key={schedule.id} className="schedule-item">
                                            <p>Archivo: {schedule.fileName}</p>
                                            <p>Tamaño: {Math.round(schedule.fileSize / 1024)} KB</p>
                                            <p>Fecha: {new Date(schedule.uploadDate).toLocaleDateString()}</p>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteSchedule(schedule.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <h3 className="upload-title">Agregar nuevo horario</h3>
                                <form onSubmit={handleSubmit} className="upload-form">
                                    <div className="file-upload">
                                        <button
                                            type="button"
                                            className="upload-button"
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            Seleccionar archivo PDF
                                        </button>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            accept=".pdf"
                                            style={{ display: 'none' }}
                                            onChange={handleFileSelect}
                                        />
                                    </div>

                                    <p className="file-selected">
                                        {selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}
                                    </p>

                                    <button
                                        type="submit"
                                        className="continue-button"
                                        disabled={!selectedFile}
                                    >
                                        Guardar
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="schedule-title">Aún no tiene horarios</h2>
                                <p className="schedule-subtitle">Se guardan / Se eliminan</p>

                                <div className="upload-section">
                                    <p className="upload-info">Para comenzar, suba su horario en formato PDF</p>

                                    <form onSubmit={handleSubmit} className="upload-form">
                                        <div className="file-upload">
                                            <button
                                                type="button"
                                                className="upload-button"
                                                onClick={() => document.getElementById('fileInput').click()}
                                            >
                                                Seleccionar archivo PDF
                                            </button>
                                            <input
                                                type="file"
                                                id="fileInput"
                                                accept=".pdf"
                                                style={{ display: 'none' }}
                                                onChange={handleFileSelect}
                                            />
                                        </div>

                                        <p className="file-selected">
                                            {selectedFile ? selectedFile.name : "Ningún archivo seleccionado"}
                                        </p>

                                        <button
                                            type="submit"
                                            className="continue-button"
                                            disabled={!selectedFile}
                                        >
                                            Continuar
                                        </button>
                                    </form>
                                </div>

                                <div className="requirements">
                                    <h3 className="requirements-title">Requisitos del archivo:</h3>
                                    <ul className="requirements-list">
                                        <li>• Formato PDF del horario institucional</li>
                                        <li>• Tamaño máximo: 5MB</li>
                                        <li>• Documento legible y sin modificaciones</li>
                                        <li>• Horario del semestre actual</li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Schedule;