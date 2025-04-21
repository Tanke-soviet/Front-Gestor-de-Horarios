import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notes.css';

const Notes = () => {
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [description, setDescription] = useState('');
    const [currentMonth, setCurrentMonth] = useState('');
    const [currentYear, setCurrentYear] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingNoteId, setEditingNoteId] = useState(null);

    useEffect(() => {
        // Establecer fecha actual
        const date = new Date();
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        setCurrentMonth(months[date.getMonth()]);
        setCurrentYear(date.getFullYear());

        // Cargar notas guardadas si existen
        const savedNotes = localStorage.getItem('userNotes');
        if (savedNotes) {
            setNotes(JSON.parse(savedNotes));
        }
    }, []);

    const handleAddNote = () => {
        setIsEditing(false);
        setEditingNoteId(null);
        setSelectedSubject('');
        setDescription('');
        setShowModal(true);
    };

    const handleEditNote = (note) => {
        setIsEditing(true);
        setEditingNoteId(note.id);
        setSelectedSubject(note.subject);
        setDescription(note.description);
        setShowModal(true);
    };

    const handleDeleteNote = (noteId) => {
        // Confirmar antes de eliminar
        if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            
            // Actualizar localStorage
            localStorage.setItem('userNotes', JSON.stringify(updatedNotes));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSubject('');
        setDescription('');
        setIsEditing(false);
        setEditingNoteId(null);
    };

    const handleSaveNote = () => {
        if (selectedSubject && description) {
            const today = new Date();
            const dateString = today.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            let updatedNotes;

            if (isEditing) {
                // Actualizar nota existente
                updatedNotes = notes.map(note => {
                    if (note.id === editingNoteId) {
                        return {
                            ...note,
                            subject: selectedSubject,
                            description: description,
                            // Mantener la fecha y hora original si estamos editando
                        };
                    }
                    return note;
                });
            } else {
                // Crear nueva nota
                const newNote = {
                    id: Date.now(),
                    subject: selectedSubject,
                    description: description,
                    time: today.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                    dateFormatted: dateString,
                    date: today
                };
                updatedNotes = [...notes, newNote];
            }

            setNotes(updatedNotes);

            // Guardar en localStorage
            localStorage.setItem('userNotes', JSON.stringify(updatedNotes));

            handleCloseModal();
        }
    };

    const groupNotesByDate = () => {
        const groups = {};
        // Ordenar notas por fecha, más recientes primero
        const sortedNotes = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedNotes.forEach(note => {
            if (!groups[note.dateFormatted]) {
                groups[note.dateFormatted] = [];
            }
            groups[note.dateFormatted].push(note);
        });

        return groups;
    };

    return (
        <div className="notes-page">

            {/* Contenido principal de Notas */}
            <div className="notes-content">
                {notes.length === 0 ? (
                    <div className="no-notes">
                        <p>No hay notas</p>
                        <p className="help-text">Haz clic en el botón + para agregar una nueva nota</p>
                    </div>
                ) : (
                    <div className="notes-container">
                        {Object.entries(groupNotesByDate()).map(([date, dateNotes]) => (
                            <div key={date} className="date-group">
                                <h3 className="date-header">{date}</h3>
                                <div className="notes-grid">
                                    {dateNotes.map(note => (
                                        <div key={note.id} className="note-card">
                                            <div className="note-header">
                                                <h4 className="note-subject">{note.subject}</h4>
                                                <div className="note-actions">
                                                    <button 
                                                        className="edit-button" 
                                                        onClick={() => handleEditNote(note)}
                                                    >
                                                        +
                                                    </button>
                                                    <button 
                                                        className="delete-button"
                                                        onClick={() => handleDeleteNote(note.id)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="note-content">
                                                <p className="note-description">{note.description}</p>
                                                <p className="note-time">{note.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Botón para agregar nota */}
                <button className="add-note-button" onClick={handleAddNote}>+</button>
            </div>

            {/* Modal para agregar/editar nota */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="add-note-modal">
                        <div className="modal-header">
                            <h2>{isEditing ? 'Editar Nota' : 'Agregar Nueva Nota'}</h2>
                            <button className="close-button" onClick={handleCloseModal}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="materia">Materia</label>
                                <select
                                    id="materia"
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                >
                                    <option value="">Seleccionar materia</option>
                                    <option value="Bases de datos">Bases de datos</option>
                                    <option value="Sistemas Operativos">Sistemas Operativos</option>
                                    <option value="Electrónica">Electrónica</option>
                                    <option value="Matemáticas">Matemáticas</option>
                                    <option value="Ciencias">Ciencias</option>
                                    <option value="Historia">Historia</option>
                                    <option value="Lenguaje">Lenguaje</option>
                                    <option value="Inglés">Inglés</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción</label>
                                <textarea
                                    id="descripcion"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="5"
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="cancel-button" onClick={handleCloseModal}>Cancelar</button>
                            <button className="save-button" onClick={handleSaveNote}>
                                {isEditing ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;