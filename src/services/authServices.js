import { apiRequest, API_URL } from './baseApi';

// Authentication API functions
export const loginAPI = async (email, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al iniciar sesión');
    }
    
    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Get user ID from token and fetch user data
      const userId = getUserIdFromToken(data.access_token);
      if (userId) {
        try {
          const userResponse = await apiRequest(`/usuarios/${userId}`);
          localStorage.setItem('user', JSON.stringify(userResponse));
          localStorage.setItem('userData', JSON.stringify(userResponse));
          return { 
            token: data.access_token, 
            user: userResponse
          };
        } catch (error) {
          console.warn('Could not fetch user data:', error);
          return { token: data.access_token };
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Function to get user ID from JWT token
const getUserIdFromToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.sub;
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

// Register user
export const registerAPI = async (userData) => {
  try {
    const formattedUserData = {
      nombre: userData.username,
      correo: userData.email,
      codigo: userData.code,
      clave: userData.password,
      activo: true,
      token_notificacion: userData.token_notificacion || null
    };
    
    return await apiRequest('/usuarios/', {
      method: 'POST',
      body: JSON.stringify(formattedUserData)
    });
  } catch (error) {
    console.error("Error en registro:", error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const login = async (email, password) => {
  return await loginAPI(email, password);
};

export const register = async (userData) => {
  if (!userData.username || !userData.email || !userData.code || !userData.password) {
    throw new Error('Todos los campos son obligatorios');
  }
  
  return await registerAPI(userData);
};

export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userData');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user') || localStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
};