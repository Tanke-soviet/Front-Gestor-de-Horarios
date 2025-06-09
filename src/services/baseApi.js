// Base API service with common functionality
//const API_URL = "https://gestor-horarios-api.jdav01.duckdns.org";
const API_URL = "http://127.0.0.1:8000"
// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle authentication errors
export const handleAuthError = (response) => {
  if (response.status === 401) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    throw new Error('Sesión expirada, por favor inicia sesión nuevamente');
  }
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: getAuthHeaders(),
      ...options
    };

    // Don't override Content-Type for FormData
    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    const response = await fetch(url, config);

    handleAuthError(response);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorText;
      } catch (e) {
        errorMessage = errorText || response.statusText;
      }
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

export { API_URL };
