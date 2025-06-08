import { apiRequest } from './baseApi';

// Notes API Service (/notas) - Requires Authentication

// Create a new note for a specific subject
export const createNote = async (noteData, materiaId) => {
  const queryParams = new URLSearchParams({
    materia_id: materiaId.toString()
  });
  
  return await apiRequest(`/notas/?${queryParams}`, {
    method: 'POST',
    body: JSON.stringify({
      id_usuario_materia: noteData.id_usuario_materia,
      titulo: noteData.titulo,
      descripcion: noteData.descripcion,
      fecha_fin: noteData.fecha_fin || null
    })
  });
};

// Get notes for the authenticated user with optional filters
export const getNotes = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.materia_id) queryParams.append('materia_id', filters.materia_id.toString());
  if (filters.activas !== undefined) queryParams.append('activas', filters.activas.toString());
  if (filters.proximas_a_vencer) queryParams.append('proximas_a_vencer', filters.proximas_a_vencer.toString());
  
  const endpoint = queryParams.toString() ? `/notas/?${queryParams}` : '/notas/';
  return await apiRequest(endpoint);
};

// Get available subjects for creating notes for the authenticated user
export const getNotesSubjects = async () => {
  return await apiRequest('/notas/materias');
};

// Get a specific note by ID (must belong to authenticated user)
export const getNoteById = async (noteId) => {
  return await apiRequest(`/notas/${noteId}`);
};

// Update a specific note (must belong to authenticated user)
export const updateNote = async (noteId, noteData) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (noteData.id_usuario_materia !== undefined) updateData.id_usuario_materia = noteData.id_usuario_materia;
  if (noteData.titulo !== undefined) updateData.titulo = noteData.titulo;
  if (noteData.descripcion !== undefined) updateData.descripcion = noteData.descripcion;
  if (noteData.fecha_fin !== undefined) updateData.fecha_fin = noteData.fecha_fin;
  
  return await apiRequest(`/notas/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

// Delete a specific note (must belong to authenticated user)
export const deleteNote = async (noteId) => {
  return await apiRequest(`/notas/${noteId}`, {
    method: 'DELETE'
  });
};

// Get notes by subject
export const getNotesBySubject = async (materiaId) => {
  return await getNotes({ materia_id: materiaId });
};

// Get active notes (notes without end date or with future end date)
export const getActiveNotes = async (materiaId = null) => {
  const filters = { activas: true };
  if (materiaId) filters.materia_id = materiaId;
  
  return await getNotes(filters);
};

// Get notes due soon
export const getNotesDueSoon = async (days = 7, materiaId = null) => {
  const filters = { proximas_a_vencer: days };
  if (materiaId) filters.materia_id = materiaId;
  
  return await getNotes(filters);
};

// Get expired notes
export const getExpiredNotes = async () => {
  const allNotes = await getNotes();
  const currentDate = new Date();
  
  const expiredNotes = allNotes.filter(note => {
    if (!note.fecha_fin) return false;
    
    const endDate = new Date(note.fecha_fin);
    return endDate < currentDate;
  });
  
  return expiredNotes;
};

// Mark note as completed (by setting end date to now)
export const markNoteAsCompleted = async (noteId) => {
  return await updateNote(noteId, {
    fecha_fin: new Date().toISOString()
  });
};

// Extend note deadline
export const extendNoteDeadline = async (noteId, newEndDate) => {
  return await updateNote(noteId, {
    fecha_fin: newEndDate
  });
};

// Get notes statistics
export const getNotesStats = async () => {
  try {
    const allNotes = await getNotes();
    const activeNotes = await getActiveNotes();
    const expiredNotes = await getExpiredNotes();
    const dueSoon = await getNotesDueSoon(7);
    
    return {
      total: allNotes.length,
      active: activeNotes.length,
      expired: expiredNotes.length,
      dueSoon: dueSoon.length,
      completed: allNotes.length - activeNotes.length - expiredNotes.length
    };
  } catch (error) {
    console.error('Error getting notes statistics:', error);
    throw error;
  }
};

// Search notes by title or description
export const searchNotes = async (searchTerm, materiaId = null) => {
  const filters = {};
  if (materiaId) filters.materia_id = materiaId;
  
  const notes = await getNotes(filters);
  
  if (!searchTerm) return notes;
  
  const filteredNotes = notes.filter(note => 
    note.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return filteredNotes;
};
