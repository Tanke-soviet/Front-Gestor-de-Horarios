// Central export file for all API services
// This file provides easy access to all service functions

// Base API utilities
export { apiRequest, getAuthHeaders, API_URL } from './baseApi';

// Authentication services
export * from './authServices';

// User management services
export * from './userService';

// Subject management services
export * from './subjectService';

// User-Subject relationship services
export * from './userSubjectService';

// Academic period services
export * from './periodService';

// Class session services
export * from './sessionService';

// Notes services
export * from './notesService';

// Schedule services
export * from './scheduleServices';

// Legacy API services (if still needed)
export * from './api';

// Service collections for specific use cases
export const authAPI = {
  login: require('./authServices').login,
  register: require('./authServices').register,
  logout: require('./authServices').logout,
  isAuthenticated: require('./authServices').isAuthenticated,
  getCurrentUser: require('./authServices').getCurrentUser
};

export const userAPI = {
  create: require('./userService').createUser,
  getAll: require('./userService').getUsers,
  getById: require('./userService').getUserById,
  update: require('./userService').updateUser,
  delete: require('./userService').deleteUser,
  getCurrentProfile: require('./userService').getCurrentUserProfile,
  updateCurrentProfile: require('./userService').updateCurrentUserProfile
};

export const subjectAPI = {
  create: require('./subjectService').createSubject,
  getAll: require('./subjectService').getSubjects,
  getById: require('./subjectService').getSubjectById,
  update: require('./subjectService').updateSubject,
  delete: require('./subjectService').deleteSubject,
  search: require('./subjectService').searchSubjects
};

export const userSubjectAPI = {
  create: require('./userSubjectService').createUserSubjectRelation,
  getAll: require('./userSubjectService').getUserSubjectRelations,
  getById: require('./userSubjectService').getUserSubjectRelationById,
  getByUser: require('./userSubjectService').getSubjectsByUserId,
  getBySubject: require('./userSubjectService').getUsersBySubjectId,
  update: require('./userSubjectService').updateUserSubjectRelation,
  delete: require('./userSubjectService').deleteUserSubjectRelation,
  getMySubjects: require('./userSubjectService').getMySubjects,
  enroll: require('./userSubjectService').enrollInSubject,
  unenroll: require('./userSubjectService').unenrollFromSubject
};

export const periodAPI = {
  create: require('./periodService').createPeriod,
  getAll: require('./periodService').getPeriods,
  getById: require('./periodService').getPeriodById,
  getCurrent: require('./periodService').getCurrentPeriod,
  update: require('./periodService').updatePeriod,
  delete: require('./periodService').deletePeriod,
  getByDateRange: require('./periodService').getPeriodsByDateRange,
  isDateInPeriod: require('./periodService').isDateInPeriod,
  getActive: require('./periodService').getActivePeriods
};

export const sessionAPI = {
  create: require('./sessionService').createSession,
  getAll: require('./sessionService').getSessions,
  getById: require('./sessionService').getSessionById,
  getByUserSubject: require('./sessionService').getSessionsByUserSubject,
  getComplete: require('./sessionService').getCompleteSessionInfo,
  update: require('./sessionService').updateSession,
  delete: require('./sessionService').deleteSession,
  getByDay: require('./sessionService').getSessionsByDay,
  getByBuilding: require('./sessionService').getSessionsByBuilding,
  getByClassroom: require('./sessionService').getSessionsByClassroom,
  getByTimeRange: require('./sessionService').getSessionsByTimeRange,
  getMySchedule: require('./sessionService').getMySchedule,
  getMyWeeklySchedule: require('./sessionService').getMyWeeklySchedule,
  checkConflicts: require('./sessionService').checkScheduleConflicts
};

export const notesAPI = {
  create: require('./notesService').createNote,
  getAll: require('./notesService').getNotes,
  getSubjects: require('./notesService').getNotesSubjects,
  getById: require('./notesService').getNoteById,
  update: require('./notesService').updateNote,
  delete: require('./notesService').deleteNote,
  getBySubject: require('./notesService').getNotesBySubject,
  getActive: require('./notesService').getActiveNotes,
  getDueSoon: require('./notesService').getNotesDueSoon,
  getExpired: require('./notesService').getExpiredNotes,
  markCompleted: require('./notesService').markNoteAsCompleted,
  extendDeadline: require('./notesService').extendNoteDeadline,
  getStats: require('./notesService').getNotesStats,
  search: require('./notesService').searchNotes
};

export const scheduleAPI = {
  create: require('./scheduleServices').createSchedule,
  upload: require('./scheduleServices').uploadScheduleFile,
  getFromAPI: require('./scheduleServices').getSchedulesFromAPI,
  sync: require('./scheduleServices').syncSchedules,
  getAll: require('./scheduleServices').getAllSchedules,
  deleteComplete: require('./scheduleServices').deleteScheduleComplete,
  validate: require('./scheduleServices').validateScheduleFile,
  uploadMultiple: require('./scheduleServices').uploadMultipleSchedules,
  // Legacy functions
  getLocal: require('./scheduleServices').getScheduleItems,
  addLocal: require('./scheduleServices').addScheduleItem,
  deleteLocal: require('./scheduleServices').deleteSchedule
};
