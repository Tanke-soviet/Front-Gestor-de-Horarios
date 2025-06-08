import { apiRequest } from './baseApi';

// Subject API Service (/materias)

// Create a new subject
export const createSubject = async (subjectData) => {
  return await apiRequest('/materias/', {
    method: 'POST',
    body: JSON.stringify({
      nombre: subjectData.nombre,
      codigo: subjectData.codigo,
      grupo: subjectData.grupo
    })
  });
};

// Get all subjects with pagination
export const getSubjects = async (skip = 0, limit = 100) => {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });
  
  return await apiRequest(`/materias/?${queryParams}`);
};

// Get a specific subject by ID
export const getSubjectById = async (subjectId) => {
  return await apiRequest(`/materias/${subjectId}`);
};

// Update a subject
export const updateSubject = async (subjectId, subjectData) => {
  return await apiRequest(`/materias/${subjectId}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: subjectData.nombre,
      codigo: subjectData.codigo,
      grupo: subjectData.grupo
    })
  });
};

// Delete a subject
export const deleteSubject = async (subjectId) => {
  return await apiRequest(`/materias/${subjectId}`, {
    method: 'DELETE'
  });
};

// Search subjects by name or code
export const searchSubjects = async (searchTerm, skip = 0, limit = 100) => {
  const subjects = await getSubjects(skip, limit);
  
  if (!searchTerm) return subjects;
  
  // Client-side filtering since API doesn't provide search endpoint
  const filteredSubjects = subjects.filter(subject => 
    subject.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.grupo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return filteredSubjects;
};
