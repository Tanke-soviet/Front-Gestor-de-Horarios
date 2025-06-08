import { apiRequest } from './baseApi';

// User API Service (/usuarios)

// Create a new user
export const createUser = async (userData) => {
  return await apiRequest('/usuarios/', {
    method: 'POST',
    body: JSON.stringify({
      nombre: userData.nombre,
      correo: userData.correo,
      codigo: userData.codigo,
      clave: userData.clave,
      activo: userData.activo ?? true,
      token_notificacion: userData.token_notificacion || null
    })
  });
};

// Get all users with pagination
export const getUsers = async (skip = 0, limit = 100) => {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });
  
  return await apiRequest(`/usuarios/?${queryParams}`);
};

// Get a specific user by ID
export const getUserById = async (userId) => {
  return await apiRequest(`/usuarios/${userId}`);
};

// Update a user
export const updateUser = async (userId, userData) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (userData.nombre !== undefined) updateData.nombre = userData.nombre;
  if (userData.correo !== undefined) updateData.correo = userData.correo;
  if (userData.codigo !== undefined) updateData.codigo = userData.codigo;
  if (userData.clave !== undefined) updateData.clave = userData.clave;
  if (userData.token_notificacion !== undefined) updateData.token_notificacion = userData.token_notificacion;
  if (userData.activo !== undefined) updateData.activo = userData.activo;
  
  return await apiRequest(`/usuarios/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

// Delete a user
export const deleteUser = async (userId) => {
  return await apiRequest(`/usuarios/${userId}`, {
    method: 'DELETE'
  });
};

// Get current user profile
export const getCurrentUserProfile = async () => {
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
    
    return await getUserById(userId);
  } catch (error) {
    console.error('Error getting current user profile:', error);
    throw error;
  }
};

// Update current user profile
export const updateCurrentUserProfile = async (userData) => {
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
    
    const updatedUser = await updateUser(userId, userData);
    
    // Update local storage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error('Error updating current user profile:', error);
    throw error;
  }
};
