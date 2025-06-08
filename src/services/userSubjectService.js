import { apiRequest } from './baseApi';

// User-Subject Relationship API Service (/usuario-materias)

// Create a user-subject relationship
export const createUserSubjectRelation = async (relationData) => {
  return await apiRequest('/usuario-materias/', {
    method: 'POST',
    body: JSON.stringify({
      id_usuario: relationData.id_usuario,
      id_materia: relationData.id_materia,
      id_periodo: relationData.id_periodo
    })
  });
};

// Get all user-subject relationships with pagination
export const getUserSubjectRelations = async (skip = 0, limit = 100) => {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });
  
  return await apiRequest(`/usuario-materias/?${queryParams}`);
};

// Get a specific user-subject relationship by ID
export const getUserSubjectRelationById = async (relationId) => {
  return await apiRequest(`/usuario-materias/${relationId}`);
};

// Get all subjects for a specific user
export const getSubjectsByUserId = async (userId) => {
  return await apiRequest(`/usuario-materias/usuario/${userId}`);
};

// Get all users for a specific subject
export const getUsersBySubjectId = async (subjectId) => {
  return await apiRequest(`/usuario-materias/materia/${subjectId}`);
};

// Update a user-subject relationship
export const updateUserSubjectRelation = async (relationId, relationData) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (relationData.id_usuario !== undefined) updateData.id_usuario = relationData.id_usuario;
  if (relationData.id_materia !== undefined) updateData.id_materia = relationData.id_materia;
  if (relationData.periodo !== undefined) updateData.periodo = relationData.periodo;
  
  return await apiRequest(`/usuario-materias/${relationId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

// Delete a user-subject relationship
export const deleteUserSubjectRelation = async (relationId) => {
  return await apiRequest(`/usuario-materias/${relationId}`, {
    method: 'DELETE'
  });
};

// Get subjects for current authenticated user
export const getMySubjects = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Extract user ID from token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const userId = payload.sub;
    
    return await getSubjectsByUserId(userId);
  } catch (error) {
    console.error('Error getting current user subjects:', error);
    throw error;
  }
};

// Enroll current user in a subject
export const enrollInSubject = async (subjectId, periodId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Extract user ID from token
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    const userId = payload.sub;
    
    return await createUserSubjectRelation({
      id_usuario: userId,
      id_materia: subjectId,
      id_periodo: periodId
    });
  } catch (error) {
    console.error('Error enrolling in subject:', error);
    throw error;
  }
};

// Unenroll current user from a subject
export const unenrollFromSubject = async (relationId) => {
  return await deleteUserSubjectRelation(relationId);
};
