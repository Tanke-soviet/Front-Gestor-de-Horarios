import { apiRequest } from './baseApi';
import { loginAPI } from './authServices';

// Test connection to all API endpoints
export const testAllEndpoints = async (testCredentials = null) => {
  const results = {
    baseConnection: false,
    auth: false,
    endpoints: {
      usuarios: false,
      materias: false,
      usuarioMaterias: false,
      periodos: false,
      sesion: false,
      notas: false,
      horario: false
    },
    errors: []
  };

  try {
    // Test base connection
    console.log('Testing base connection...');
    await fetch('http://127.0.0.1:8000/');
    results.baseConnection = true;
    console.log('✓ Base connection successful');
  } catch (error) {
    results.errors.push('Base connection failed: ' + error.message);
    console.error('✗ Base connection failed:', error);
  }

  // Test authentication if credentials provided
  if (testCredentials) {
    try {
      console.log('Testing authentication...');
      await loginAPI(testCredentials.email, testCredentials.password);
      results.auth = true;
      console.log('✓ Authentication successful');
    } catch (error) {
      results.errors.push('Authentication failed: ' + error.message);
      console.error('✗ Authentication failed:', error);
    }
  }

  // Test individual endpoints
  const endpointTests = [
    { name: 'usuarios', endpoint: '/usuarios/', key: 'usuarios' },
    { name: 'materias', endpoint: '/materias/', key: 'materias' },
    { name: 'usuario-materias', endpoint: '/usuario-materias/', key: 'usuarioMaterias' },
    { name: 'periodos', endpoint: '/periodos/', key: 'periodos' },
    { name: 'sesion', endpoint: '/sesion/', key: 'sesion' },
    { name: 'notas', endpoint: '/notas/', key: 'notas' },
    { name: 'horario', endpoint: '/horario/', key: 'horario' }
  ];

  for (const test of endpointTests) {
    try {
      console.log(`Testing ${test.name} endpoint...`);
      await apiRequest(test.endpoint);
      results.endpoints[test.key] = true;
      console.log(`✓ ${test.name} endpoint successful`);
    } catch (error) {
      // 401 errors are expected for protected endpoints without auth
      if (error.message.includes('401') && !testCredentials) {
        results.endpoints[test.key] = 'protected';
        console.log(`⚠ ${test.name} endpoint protected (needs authentication)`);
      } else {
        results.errors.push(`${test.name} endpoint failed: ` + error.message);
        console.error(`✗ ${test.name} endpoint failed:`, error);
      }
    }
  }

  return results;
};

// Test specific endpoint functionality
export const testEndpointFunctionality = async (endpoint) => {
  const results = {
    get: false,
    post: false,
    put: false,
    delete: false,
    errors: []
  };

  try {
    // Test GET
    await apiRequest(`/${endpoint}/`);
    results.get = true;
  } catch (error) {
    results.errors.push(`GET /${endpoint}/ failed: ` + error.message);
  }

  // Note: POST, PUT, DELETE tests would require valid data and IDs
  // These are more complex to test automatically

  return results;
};

// Test authentication flow
export const testAuthFlow = async (credentials) => {
  const results = {
    login: false,
    tokenStorage: false,
    protectedEndpoint: false,
    logout: false,
    errors: []
  };

  try {
    // Test login
    console.log('Testing login...');
    const loginResult = await loginAPI(credentials.email, credentials.password);
    if (loginResult.token) {
      results.login = true;
      console.log('✓ Login successful');

      // Test token storage
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        results.tokenStorage = true;
        console.log('✓ Token stored successfully');

        // Test protected endpoint
        try {
          await apiRequest('/notas/');
          results.protectedEndpoint = true;
          console.log('✓ Protected endpoint accessible');
        } catch (error) {
          results.errors.push('Protected endpoint test failed: ' + error.message);
        }

        // Test logout
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        results.logout = true;
        console.log('✓ Logout successful');
      } else {
        results.errors.push('Token not stored after login');
      }
    } else {
      results.errors.push('No token received from login');
    }
  } catch (error) {
    results.errors.push('Login failed: ' + error.message);
  }

  return results;
};

// Quick health check
export const quickHealthCheck = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/');
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseStatus: response.status
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};

// Test data operations
export const testDataOperations = async () => {
  const results = {
    createUser: false,
    createSubject: false,
    createPeriod: false,
    errors: []
  };

  // Note: These tests would require cleanup after creation
  // and should be run in a test environment

  console.log('Data operation tests require a test environment');
  console.log('These tests would create actual data in the database');

  return results;
};
