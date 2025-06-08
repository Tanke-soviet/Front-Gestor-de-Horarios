import { apiRequest } from './baseApi';

// Academic Period API Service (/periodos)

// Create a new academic period
export const createPeriod = async (periodData) => {
  return await apiRequest('/periodos/', {
    method: 'POST',
    body: JSON.stringify({
      nombre: periodData.nombre,
      fecha_inicio: periodData.fecha_inicio,
      fecha_fin: periodData.fecha_fin
    })
  });
};

// Get all academic periods with pagination
export const getPeriods = async (skip = 0, limit = 100) => {
  const queryParams = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString()
  });
  
  return await apiRequest(`/periodos/?${queryParams}`);
};

// Get a specific academic period by ID
export const getPeriodById = async (periodId) => {
  return await apiRequest(`/periodos/${periodId}`);
};

// Get the current active academic period
export const getCurrentPeriod = async () => {
  return await apiRequest('/periodos/actual/');
};

// Update an academic period
export const updatePeriod = async (periodId, periodData) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (periodData.nombre !== undefined) updateData.nombre = periodData.nombre;
  if (periodData.fecha_inicio !== undefined) updateData.fecha_inicio = periodData.fecha_inicio;
  if (periodData.fecha_fin !== undefined) updateData.fecha_fin = periodData.fecha_fin;
  
  return await apiRequest(`/periodos/${periodId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

// Delete an academic period
export const deletePeriod = async (periodId) => {
  return await apiRequest(`/periodos/${periodId}`, {
    method: 'DELETE'
  });
};

// Get periods by date range
export const getPeriodsByDateRange = async (startDate, endDate) => {
  const periods = await getPeriods(0, 1000); // Get all periods
  
  const filteredPeriods = periods.filter(period => {
    const periodStart = new Date(period.fecha_inicio);
    const periodEnd = new Date(period.fecha_fin);
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);
    
    // Check if period overlaps with the date range
    return periodStart <= filterEnd && periodEnd >= filterStart;
  });
  
  return filteredPeriods;
};

// Check if a date falls within a specific period
export const isDateInPeriod = async (periodId, date) => {
  const period = await getPeriodById(periodId);
  const checkDate = new Date(date);
  const startDate = new Date(period.fecha_inicio);
  const endDate = new Date(period.fecha_fin);
  
  return checkDate >= startDate && checkDate <= endDate;
};

// Get active periods (periods that are currently running)
export const getActivePeriods = async () => {
  const periods = await getPeriods(0, 1000); // Get all periods
  const currentDate = new Date();
  
  const activePeriods = periods.filter(period => {
    const startDate = new Date(period.fecha_inicio);
    const endDate = new Date(period.fecha_fin);
    
    return currentDate >= startDate && currentDate <= endDate;
  });
  
  return activePeriods;
};
