import { apiRequest } from './baseApi';

// Local storage functions (legacy support)
export const getScheduleItems = () => {
  return new Promise((resolve) => {
    const items = JSON.parse(localStorage.getItem("scheduleItems") || "[]");
    setTimeout(() => resolve(items), 300);
  });
};

export const addScheduleItem = (item) => {
  return new Promise((resolve) => {
    const items = JSON.parse(localStorage.getItem("scheduleItems") || "[]");
    const newItem = {
      ...item,
      id: Date.now(),
    };
    items.push(newItem);
    localStorage.setItem("scheduleItems", JSON.stringify(items));
    setTimeout(() => resolve(newItem), 300);
  });
};

export const deleteSchedule = (id) => {
  return new Promise((resolve) => {
    const items = JSON.parse(localStorage.getItem("scheduleItems") || "[]");
    const updatedItems = items.filter((item) => item.id !== id);
    localStorage.setItem("scheduleItems", JSON.stringify(updatedItems));
    setTimeout(() => resolve({ success: true }), 300);
  });
};

// Schedule API Service (/horario) - Requires Authentication

// Create a new schedule for the authenticated user
export const createSchedule = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  return await apiRequest('/horario/', {
    method: 'POST',
    body: formData
  });
};

// Legacy function for backward compatibility
export const saveFile = async (file) => {
  return await createSchedule(file);
};

// Upload schedule file with local storage fallback
export const uploadScheduleFile = async (file) => {
  try {
    // Upload to backend
    const backendResponse = await createSchedule(file);
    
    // Also save reference locally for UI consistency
    const localItem = {
      id: Date.now(),
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date().toISOString(),
      type: file.type,
      backendId: backendResponse.id || backendResponse._id || 'backend-uploaded',
      uploaded: true
    };
    
    const items = JSON.parse(localStorage.getItem("scheduleItems") || "[]");
    items.push(localItem);
    localStorage.setItem("scheduleItems", JSON.stringify(items));
    
    return localItem;
  } catch (error) {
    console.error('Error al procesar archivo:', error);
    throw error;
  }
};

// Get schedules from backend (if endpoint exists in the future)
export const getSchedulesFromAPI = async () => {
  try {
    return await apiRequest('/horario/');
  } catch (error) {
    // If endpoint doesn't exist, return empty array
    if (error.message.includes('404')) {
      console.warn('Schedule list endpoint not available');
      return [];
    }
    throw error;
  }
};

// Sync local schedules with backend
export const syncSchedules = async () => {
  try {
    const localItems = JSON.parse(localStorage.getItem("scheduleItems") || "[]");
    const backendItems = await getSchedulesFromAPI();
    
    // Merge local and backend items
    const mergedItems = [...localItems];
    
    // Add backend items that aren't already in local storage
    backendItems.forEach(backendItem => {
      const existsLocally = localItems.some(localItem => 
        localItem.backendId === (backendItem.id || backendItem._id)
      );
      
      if (!existsLocally) {
        mergedItems.push({
          id: Date.now() + Math.random(),
          fileName: backendItem.fileName || 'Schedule from server',
          fileSize: backendItem.fileSize || 0,
          uploadDate: backendItem.uploadDate || new Date().toISOString(),
          type: backendItem.type || 'application/pdf',
          backendId: backendItem.id || backendItem._id,
          uploaded: true
        });
      }
    });
    
    localStorage.setItem("scheduleItems", JSON.stringify(mergedItems));
    return mergedItems;
  } catch (error) {
    console.error('Error syncing schedules:', error);
    // Return local items if sync fails
    return JSON.parse(localStorage.getItem("scheduleItems") || "[]");
  }
};

// Get all schedules (local + backend)
export const getAllSchedules = async () => {
  try {
    return await syncSchedules();
  } catch (error) {
    console.error('Error getting all schedules:', error);
    // Fallback to local storage only
    return JSON.parse(localStorage.getItem("scheduleItems") || "[]");
  }
};

// Delete schedule from both local and backend
export const deleteScheduleComplete = async (scheduleItem) => {
  try {
    // If it has a backend ID, try to delete from backend
    if (scheduleItem.backendId && scheduleItem.uploaded) {
      try {
        await apiRequest(`/horario/${scheduleItem.backendId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.warn('Could not delete from backend:', error);
        // Continue with local deletion even if backend deletion fails
      }
    }
    
    // Delete from local storage
    const items = JSON.parse(localStorage.getItem("scheduleItems") || "[]");
    const updatedItems = items.filter((item) => item.id !== scheduleItem.id);
    localStorage.setItem("scheduleItems", JSON.stringify(updatedItems));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};

// Check if file is valid schedule format
export const validateScheduleFile = (file) => {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Solo se permiten PDF, JPG, JPEG y PNG.');
  }
  
  if (file.size > maxSize) {
    throw new Error('El archivo es demasiado grande. Máximo 10MB.');
  }
  
  return true;
};

// Upload multiple schedule files
export const uploadMultipleSchedules = async (files) => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      validateScheduleFile(files[i]);
      const result = await uploadScheduleFile(files[i]);
      results.push(result);
    } catch (error) {
      errors.push({
        file: files[i].name,
        error: error.message
      });
    }
  }
  
  return {
    successful: results,
    failed: errors,
    total: files.length
  };
};
