import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNotesSubjects,
} from "../services/notesService";
import "./notes.css";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Establecer fecha actual
    const date = new Date();
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    setCurrentMonth(months[date.getMonth()]);
    setCurrentYear(date.getFullYear());

    // Cargar datos iniciales
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      const subjectsData = await loadAvailableSubjects();
      const notesData = await loadNotes(subjectsData);
      // Cargar notas y materias disponibles en paralelo
      
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError("Error al cargar los datos. Por favor, recarga la página.");
    } finally {
      setLoading(false);
    }
  };

  const loadNotes = async (subjectsData) => {
    try {
      const notesData = await getNotes();

      // Transformar datos para compatibilidad con el componente existente
      const transformedNotes = notesData.map((note) => ({
        id: note.id_nota,
        subject: getSubjectNameById(subjectsData, note.id_usuario_materia),
        title: note.titulo,
        description: note.descripcion,
        time: new Date(note.fecha_creacion).toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        dateFormatted: new Date(note.fecha_creacion).toLocaleDateString(
          "es-ES",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        ),
        date: new Date(note.fecha_creacion),
        endDate: note.fecha_fin,
        id_usuario_materia: note.id_usuario_materia,
        originalNote: note,
      }));

      setNotes(transformedNotes);
      return transformedNotes;
    } catch (error) {
      console.error("Error loading notes:", error);
      throw error;
    }
  };

  const loadAvailableSubjects = async () => {
    try {
      const subjectsData = await getNotesSubjects();
      setAvailableSubjects(subjectsData);      
      return subjectsData;
    } catch (error) {
      console.error("Error loading available subjects:", error);
      throw error;
    }
  };

  const getSubjectNameById = (subjectsData, userSubjectId) => {
    console.log(userSubjectId);

    const subject = subjectsData.find(
      (s) => s.id_usuario_materia === userSubjectId
    );
    console.log(subjectsData, subject);

    return subject ? subject.nombre_materia : "Materia desconocida";
  };
  const handleAddNote = () => {
    setIsEditing(false);
    setEditingNoteId(null);
    setSelectedSubject("");
    setTitle("");
    setDescription("");
    setEndDate("");
    setError(null);
    setShowModal(true);
  };

  const handleEditNote = (note) => {
    setIsEditing(true);
    setEditingNoteId(note.id);
    setSelectedSubject(note.id_usuario_materia);
    setTitle(note.title);
    setDescription(note.description);
    setEndDate(note.endDate ? note.endDate.split("T")[0] : "");
    setError(null);
    setShowModal(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      try {
        await deleteNote(noteId);
        await loadNotes(); // Recargar notas después de eliminar
      } catch (error) {
        console.error("Error deleting note:", error);
        setError("Error al eliminar la nota");
      }
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSubject("");
    setTitle("");
    setDescription("");
    setEndDate("");
    setIsEditing(false);
    setEditingNoteId(null);
    setError(null);
  };

  const handleSaveNote = async () => {
    if (!selectedSubject || !title || !description) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const noteData = {
        id_usuario_materia: parseInt(selectedSubject),
        titulo: title,
        descripcion: description,
        fecha_fin: endDate
          ? new Date(endDate + "T23:59:59").toISOString()
          : null,
      };

      if (isEditing) {
        // Actualizar nota existente
        await updateNote(editingNoteId, noteData);
      } else {
        // Crear nueva nota
        const selectedSubjectData = availableSubjects.find(
          (s) => s.id_usuario_materia === parseInt(selectedSubject)
        );
        if (selectedSubjectData) {
          await createNote(noteData, selectedSubjectData.id_materia);
        }
      }

      // Recargar notas y cerrar modal
      await loadNotes();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving note:", error);
      setError(error.message || "Error al guardar la nota");
    } finally {
      setSaving(false);
    }
  };

  const groupNotesByDate = () => {
    const groups = {};
    // Ordenar notas por fecha, más recientes primero
    const sortedNotes = [...notes].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    sortedNotes.forEach((note) => {
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
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando notas...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button onClick={loadInitialData} className="retry-button">
              Reintentar
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div className="no-notes">
            <p>No hay notas</p>
            <p className="help-text">
              Haz clic en el botón + para agregar una nueva nota
            </p>
          </div>
        ) : (
          <div className="notes-container">
            {Object.entries(groupNotesByDate()).map(([date, dateNotes]) => (
              <div key={date} className="date-group">
                <h3 className="date-header">{date}</h3>
                <div className="notes-grid">
                  {dateNotes.map((note) => (
                    <div key={note.id} className="note-card">
                      <div className="note-header">
                        <h4 className="note-subject">{note.subject}</h4>
                        <div className="note-actions">
                          <button
                            className="edit-button"
                            onClick={() => handleEditNote(note)}
                          >
                            ✏️
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
                        <h5 className="note-title">{note.title}</h5>
                        <p className="note-description">{note.description}</p>
                        <p className="note-time">{note.time}</p>
                        {note.endDate && (
                          <p className="note-deadline">
                            Vence:{" "}
                            {new Date(note.endDate).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para agregar nota */}
        {!loading && (
          <button className="add-note-button" onClick={handleAddNote}>
            +
          </button>
        )}
      </div>{" "}
      {/* Modal para agregar/editar nota */}
      {showModal && (
        <div className="modal-overlay">
          <div className="add-note-modal">
            <div className="modal-header">
              <h2>{isEditing ? "Editar Nota" : "Agregar Nueva Nota"}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="error-alert">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="materia">Materia *</label>
                <select
                  id="materia"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={saving}
                >
                  <option value="">Seleccionar materia</option>
                  {availableSubjects.map((subject) => (
                    <option
                      key={subject.id_usuario_materia}
                      value={subject.id_usuario_materia}
                    >
                      Materia {subject.nombre_materia} - Período{" "}
                      {subject.nombre_periodo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  type="text"
                  id="titulo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título de la nota"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="5"
                  placeholder="Descripción detallada de la nota"
                  disabled={saving}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin">
                  Fecha de vencimiento (opcional)
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={handleCloseModal}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                className="save-button"
                onClick={handleSaveNote}
                disabled={saving}
              >
                {saving ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
