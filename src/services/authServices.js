import { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser,
  isAuthenticated as apiIsAuthenticated,
  logoutUser as apiLogoutUser,
  getCurrentUser as apiGetCurrentUser
} from './api';

export const login = async (email, password) => {
  return await apiLoginUser({ email, password });
};

export const register = async (userData) => {
  if (!userData.username || !userData.email || !userData.code || !userData.password) {
    throw new Error('Todos los campos son obligatorios');
  }
  
  return await apiRegisterUser(userData);
};

export const isAuthenticated = apiIsAuthenticated;
export const logout = apiLogoutUser;
export const getCurrentUser = apiGetCurrentUser;