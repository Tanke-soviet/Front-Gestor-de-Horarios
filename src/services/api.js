const API_URL = "http://127.0.0.1:8000";

export const testConnection = async () => {
  try {
    console.log("Probando conexión al servidor...");
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error("Error en la respuesta del servidor:", response.status, response.statusText);
      return false;
    }

    const data = await response.text();
    console.log("Respuesta del servidor:", data);
    return true;
  } catch (error) {
    console.error("Error general al probar conexión:", error);
    return false;
  }
};

// Función para obtener datos (ejemplo)
export const fetchData = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`).catch(error => {
      console.error("Error de red:", error);
      throw new Error("No se pudo conectar al servidor. Verifica tu conexión a internet y que el servidor esté funcionando.");
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Función para enviar datos (ejemplo) con mejor manejo de errores
export const postData = async (endpoint, data) => {
  try {
    console.log(`Enviando a ${API_URL}/${endpoint}:`, data);
    
    const response = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'cors',
      cache: 'no-cache',
    }).catch(networkError => {
      console.error("Error de red detallado:", networkError);
      throw new Error("No se pudo conectar al servidor. Verifica tu conexión a internet y que el servidor esté funcionando.");
    });
    
    // Obtener la respuesta como texto primero
    const responseText = await response.text();
    console.log("Respuesta cruda del servidor:", responseText);
    console.log("Headers de respuesta:", Object.fromEntries(response.headers));
    
    if (!response.ok) {
      let errorDetail;
      try {
        // Intentar parsear como JSON si es posible
        const errorData = JSON.parse(responseText);
        errorDetail = errorData.detail || JSON.stringify(errorData);
      } catch (e) {
        errorDetail = responseText || response.statusText;
      }
      throw new Error(`Error (${response.status}): ${errorDetail}`);
    }
    
    // Si hay contenido en la respuesta, intentar parsearlo como JSON
    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch (e) {
        console.warn("La respuesta no es JSON válido:", responseText);
        return { success: true };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error detallado en postData:", error);
    throw error;
  }
};

// Función para registrar usuarios con mejor manejo de errores
export const registerUser = async (userData) => {
  try {
    // Verificar conexión primero
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("No se pudo conectar al servidor. Verifica tu conexión y que el servidor esté en ejecución.");
    }
    
    // Adaptar los datos al formato esperado por el backend
    const formattedUserData = {
      nombre: userData.username,
      correo: userData.email,
      codigo: userData.code,
      clave: userData.password,
      activo: true
    };
    
    console.log("Datos formateados para enviar:", formattedUserData);
    
    const response = await fetch(`${API_URL}/usuarios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formattedUserData),
      mode: 'cors'
    });

    const responseText = await response.text();
    console.log('Respuesta completa del servidor:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      body: responseText
    });

    if (!response.ok) {
      console.error('Error response:', responseText);
      throw new Error(`Error en el registro: ${responseText}`);
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.warn('La respuesta no es JSON válido:', responseText);
      return { success: true };
    }
  } catch (error) {
    console.error("Error detallado en registro:", error);
    throw error;
  }
};

// Función para iniciar sesión
export const loginUser = async (credentials) => {
  try {
    // Formatear los datos según espera OAuth2PasswordRequestForm
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // OAuth2 usa 'username', pero tu form usa 'email'
    formData.append('password', credentials.password);
    
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
    
    // Si el login es exitoso, guardamos el token en localStorage
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Como no tenemos endpoint /me, extraer el ID del token y hacer una petición
      // para obtener los datos del usuario
      const userId = getUserIdFromToken(data.access_token);
      if (userId) {
        const userResponse = await fetchAuthData(`usuarios/${userId}`);
        localStorage.setItem('user', JSON.stringify(userResponse));
        return { 
          token: data.access_token, 
          user: userResponse
        };
      }
    }
    
    throw new Error('Error al procesar la autenticación');
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

// Función para obtener el ID de usuario desde el token JWT
const getUserIdFromToken = (token) => {
  try {
    // Decodificar la parte de payload del token JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.sub;  // 'sub' contiene el ID del usuario
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

// Función para obtener datos con autenticación
export const fetchAuthData = async (endpoint) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Si recibimos un 401 Unauthorized, el token puede haber caducado
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        throw new Error('Sesión expirada, por favor inicia sesión nuevamente');
      }
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching authenticated data:", error);
    throw error;
  }
};

// Función para determinar si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem('authToken') !== null;
};

// Función para cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userData');
};

// Función para obtener el usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem('user') || localStorage.getItem('userData');
  return user ? JSON.parse(user) : null;
};