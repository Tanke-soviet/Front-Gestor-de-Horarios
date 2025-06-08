import { apiRequest } from './baseApi';

// Class Session API Service (/sesion)

// Create a new class session
export const createSession = async (sessionData) => {
  return await apiRequest('/sesion/', {
    method: 'POST',
    body: JSON.stringify({
      id_usuario_materia: sessionData.id_usuario_materia,
      edificio: sessionData.edificio,
      salon: sessionData.salon,
      dia_semana: sessionData.dia_semana,
      hora_inicio: sessionData.hora_inicio,
      hora_fin: sessionData.hora_fin
    })
  });
};

// Get all class sessions with pagination
export const getSessions = async (skip = 0, limit = 100) => {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });
  
  return await apiRequest(`/sesion/?${queryParams}`);
};

// Get a specific class session by ID
export const getSessionById = async (sessionId) => {
  return await apiRequest(`/sesion/${sessionId}`);
};

// Get all class sessions for a specific user-subject relationship
export const getSessionsByUserSubject = async (userSubjectId) => {
  return await apiRequest(`/sesion/usuario-materia/${userSubjectId}`);
};

// Get complete class session information including user and subject details
export const getCompleteSessionInfo = async (sessionId) => {
  return await apiRequest(`/sesion/${sessionId}/completa`);
};

// Update a class session
export const updateSession = async (sessionId, sessionData) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (sessionData.id_usuario_materia !== undefined) updateData.id_usuario_materia = sessionData.id_usuario_materia;
  if (sessionData.edificio !== undefined) updateData.edificio = sessionData.edificio;
  if (sessionData.salon !== undefined) updateData.salon = sessionData.salon;
  if (sessionData.dia_semana !== undefined) updateData.dia_semana = sessionData.dia_semana;
  if (sessionData.hora_inicio !== undefined) updateData.hora_inicio = sessionData.hora_inicio;
  if (sessionData.hora_fin !== undefined) updateData.hora_fin = sessionData.hora_fin;
  
  return await apiRequest(`/sesion/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

// Delete a class session
export const deleteSession = async (sessionId) => {
  return await apiRequest(`/sesion/${sessionId}`, {
    method: 'DELETE'
  });
};

// Get sessions by day of week
export const getSessionsByDay = async (dayOfWeek) => {
  const sessions = await getSessions(0, 1000); // Get all sessions
  
  const filteredSessions = sessions.filter(session => 
    session.dia_semana.toLowerCase() === dayOfWeek.toLowerCase()
  );
  
  return filteredSessions;
};

// Get sessions by building
export const getSessionsByBuilding = async (building) => {
  const sessions = await getSessions(0, 1000); // Get all sessions
  
  const filteredSessions = sessions.filter(session => 
    session.edificio.toLowerCase().includes(building.toLowerCase())
  );
  
  return filteredSessions;
};

// Get sessions by classroom
export const getSessionsByClassroom = async (classroom) => {
  const sessions = await getSessions(0, 1000); // Get all sessions
  
  const filteredSessions = sessions.filter(session => 
    session.salon.toLowerCase().includes(classroom.toLowerCase())
  );
  
  return filteredSessions;
};

// Get sessions by time range
export const getSessionsByTimeRange = async (startTime, endTime) => {
  const sessions = await getSessions(0, 1000); // Get all sessions
  
  const filteredSessions = sessions.filter(session => {
    const sessionStart = session.hora_inicio;
    const sessionEnd = session.hora_fin;
    
    return sessionStart >= startTime && sessionEnd <= endTime;
  });
  
  return filteredSessions;
};

// Get weekly schedule for current user using the new dedicated endpoint
export const getMyWeeklySchedule = async () => {
  try {
    // Use the new /sesion/mi-horario endpoint that returns complete user schedule
    const userSchedule = await apiRequest('/sesion/mi-horario');
    
    // Ensure we have an array of sessions
    if (!Array.isArray(userSchedule)) {
      return {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: []
      };
    }
    
    // Group sessions by day
    const weeklySchedule = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    };
    
    userSchedule.forEach(session => {
      // Map the API response to our expected format
      const formattedSession = {
        id_sesion: session.id_sesion,
        edificio: session.edificio,
        salon: session.salon,
        dia_semana: session.dia_semana,
        hora_inicio: session.hora_inicio,
        hora_fin: session.hora_fin,
        materia_nombre: session.materia?.nombre || 'Materia',
        profesor_nombre: session.profesor_nombre || null,
        periodo_nombre: session.periodo?.nombre || null
      };
      
      const day = session.dia_semana.toLowerCase();
      if (weeklySchedule[day]) {
        weeklySchedule[day].push(formattedSession);
      }
    });
    
    // Sort sessions by start time for each day
    Object.keys(weeklySchedule).forEach(day => {
      weeklySchedule[day].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
    });
    
    return weeklySchedule;
  } catch (error) {
    console.error('Error getting weekly schedule:', error);
    // If the user has no schedule or there's an authentication error, return empty schedule
    if (error.message?.includes('No se encontraron sesiones') || 
        error.message?.includes('404') ||
        error.message?.includes('401')) {
      return {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: []
      };
    }
    throw error;
  }
};

// Get user's complete schedule using the dedicated endpoint
export const getMySchedule = async () => {
  return await apiRequest('/sesion/mi-horario');
};

// Check for schedule conflicts using the new endpoint
export const checkScheduleConflicts = async (newSession) => {
  try {
    // Get user's current schedule using the new endpoint
    const userSchedule = await getMySchedule();
    
    // Filter sessions for the same day
    const daySchedule = userSchedule.filter(session => 
      session.dia_semana.toLowerCase() === newSession.dia_semana.toLowerCase()
    );
    
    // Check for time conflicts on the same day
    const conflicts = daySchedule.filter(existingSession => {
      const newStart = newSession.hora_inicio;
      const newEnd = newSession.hora_fin;
      const existingStart = existingSession.hora_inicio;
      const existingEnd = existingSession.hora_fin;
      
      // Check if times overlap
      return (newStart < existingEnd && newEnd > existingStart);
    });
    
    return conflicts;
  } catch (error) {
    console.error('Error checking schedule conflicts:', error);
    throw error;
  }
};
