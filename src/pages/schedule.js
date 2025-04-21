import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './schedule.css';
import { getScheduleItems, addScheduleItem, deleteSchedule } from '../services/scheduleServices';

const Schedule = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [navigate]);

    const loadSchedules = async () => {
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

    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) return;
        const newSchedule = {
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            uploadDate: new Date().toISOString(),
            type: selectedFile.type
        };

        try {
            await addScheduleItem(newSchedule);
            setSelectedFile(null);
            loadSchedules(); 
        } catch (error) {
            console.error("Error al guardar el horario:", error);
        }
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await deleteSchedule(id);
            loadSchedules(); 
        } catch (error) {
            console.error("Error al eliminar el horario:", error);
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="schedule-card">
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="schedule-card">
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
            </div>
        </div>
    );
};

export default Schedule;