# API Services Documentation

This directory contains comprehensive service modules for all API endpoints of the Gestor de Horarios application.

## 📁 File Structure

```
services/
├── baseApi.js              # Base API utilities and common functions
├── authServices.js         # Authentication endpoints (/auth)
├── userService.js          # User management (/usuarios)
├── subjectService.js       # Subject management (/materias)
├── userSubjectService.js   # User-Subject relationships (/usuario-materias)
├── periodService.js        # Academic periods (/periodos)
├── sessionService.js       # Class sessions (/sesion)
├── notesService.js         # Notes management (/notas)
├── scheduleServices.js     # Schedule file management (/horario)
├── testService.js          # API testing utilities
├── index.js                # Central exports
└── api.js                  # Legacy API functions
```

## 🚀 Quick Start

### Basic Usage

```javascript
// Import specific services
import { login, register } from './services/authServices';
import { createUser, getUsers } from './services/userService';
import { createNote, getNotes } from './services/notesService';

// Or import everything
import * as API from './services';

// Or use organized collections
import { authAPI, userAPI, notesAPI } from './services';
```

### Authentication

```javascript
import { login, logout, isAuthenticated } from './services/authServices';

// Login
try {
  const result = await login('user@example.com', 'password');
  console.log('Logged in:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Check authentication status
if (isAuthenticated()) {
  console.log('User is logged in');
}

// Logout
logout();
```

## 📚 Service Modules

### 🔐 Authentication Service (`authServices.js`)

Handles user authentication and session management.

**Main Functions:**
- `login(email, password)` - User login
- `register(userData)` - User registration
- `logout()` - Clear authentication data
- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user data

### 👤 User Service (`userService.js`)

Manages user CRUD operations.

**Main Functions:**
- `createUser(userData)` - Create new user
- `getUsers(skip, limit)` - Get all users with pagination
- `getUserById(userId)` - Get specific user
- `updateUser(userId, userData)` - Update user information
- `deleteUser(userId)` - Delete user
- `getCurrentUserProfile()` - Get current user profile
- `updateCurrentUserProfile(userData)` - Update current user

### 📚 Subject Service (`subjectService.js`)

Manages academic subjects.

**Main Functions:**
- `createSubject(subjectData)` - Create new subject
- `getSubjects(skip, limit)` - Get all subjects
- `getSubjectById(subjectId)` - Get specific subject
- `updateSubject(subjectId, subjectData)` - Update subject
- `deleteSubject(subjectId)` - Delete subject
- `searchSubjects(searchTerm)` - Search subjects

### 🔗 User-Subject Service (`userSubjectService.js`)

Manages relationships between users and subjects.

**Main Functions:**
- `createUserSubjectRelation(relationData)` - Create relationship
- `getSubjectsByUserId(userId)` - Get user's subjects
- `getUsersBySubjectId(subjectId)` - Get subject's users
- `getMySubjects()` - Get current user's subjects
- `enrollInSubject(subjectId, periodId)` - Enroll in subject
- `unenrollFromSubject(relationId)` - Unenroll from subject

### 📅 Period Service (`periodService.js`)

Manages academic periods.

**Main Functions:**
- `createPeriod(periodData)` - Create new period
- `getPeriods(skip, limit)` - Get all periods
- `getCurrentPeriod()` - Get current active period
- `updatePeriod(periodId, periodData)` - Update period
- `deletePeriod(periodId)` - Delete period
- `getActivePeriods()` - Get currently active periods

### 🕐 Session Service (`sessionService.js`)

Manages class sessions and schedules.

**Main Functions:**
- `createSession(sessionData)` - Create class session
- `getSessions(skip, limit)` - Get all sessions
- `getSessionsByUserSubject(userSubjectId)` - Get sessions for subject
- `getMyWeeklySchedule()` - Get current user's weekly schedule
- `checkScheduleConflicts(newSession)` - Check for time conflicts
- `getSessionsByDay(dayOfWeek)` - Get sessions by day
- `getMySchedule()` - Get user's complete schedule (optimized)

### 📝 Notes Service (`notesService.js`)

Manages user notes and tasks.

**Main Functions:**
- `createNote(noteData, materiaId)` - Create new note
- `getNotes(filters)` - Get notes with filters
- `updateNote(noteId, noteData)` - Update note
- `deleteNote(noteId)` - Delete note
- `getActiveNotes(materiaId)` - Get active notes
- `getNotesDueSoon(days)` - Get notes due soon
- `getNotesStats()` - Get notes statistics

### 📄 Schedule Service (`scheduleServices.js`)

Manages schedule file uploads and storage.

**Main Functions:**
- `uploadScheduleFile(file)` - Upload schedule file
- `createSchedule(file)` - Create schedule via API
- `getAllSchedules()` - Get all schedules (local + backend)
- `syncSchedules()` - Sync local and backend schedules
- `validateScheduleFile(file)` - Validate file format
- `uploadMultipleSchedules(files)` - Upload multiple files

## 🛠 Base API Utilities (`baseApi.js`)

Provides common functionality for all services.

**Features:**
- Automatic authentication header injection
- Error handling and authentication expiry detection
- Generic API request function
- FormData support for file uploads

**Usage:**
```javascript
import { apiRequest } from './services/baseApi';

// Make authenticated API request
const result = await apiRequest('/usuarios/', {
  method: 'POST',
  body: JSON.stringify(userData)
});
```

## 🧪 Testing (`testService.js`)

Utilities for testing API connectivity and functionality.

**Functions:**
- `testAllEndpoints(credentials)` - Test all API endpoints
- `testAuthFlow(credentials)` - Test authentication flow
- `quickHealthCheck()` - Quick server health check

**Usage:**
```javascript
import { testAllEndpoints, quickHealthCheck } from './services/testService';

// Test API health
const health = await quickHealthCheck();
console.log('API Status:', health.status);

// Test all endpoints
const results = await testAllEndpoints({
  email: 'test@example.com',
  password: 'password'
});
```

## 🔧 Configuration

### API Base URL

The base URL is configured in `baseApi.js`:

```javascript
const API_URL = "https://gestor-horarios-api.jdav01.duckdns.org";
```

To change the API URL, update this value or use environment variables:

```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
```

### Authentication

All services automatically handle authentication by:
1. Reading JWT token from localStorage
2. Adding Authorization header to requests
3. Handling token expiry (401 errors)
4. Redirecting to login when needed

## 📋 Error Handling

All services include comprehensive error handling:

- **Network errors**: Connection issues
- **Authentication errors**: Token expiry, invalid credentials
- **Validation errors**: Invalid input data
- **Server errors**: 500 status codes
- **Not found errors**: 404 status codes

## 🔄 Backward Compatibility

Legacy functions are maintained for backward compatibility:

```javascript
// Legacy localStorage functions still available
import { getScheduleItems, addScheduleItem } from './services/scheduleServices';

// New API functions
import { uploadScheduleFile, getAllSchedules } from './services/scheduleServices';
```

## 📖 Examples

### Complete User Registration Flow

```javascript
import { register, login } from './services/authServices';
import { getCurrentUserProfile } from './services/userService';

// Register new user
const userData = {
  username: 'John Doe',
  email: 'john@example.com',
  code: 'STU001',
  password: 'securePassword'
};

try {
  await register(userData);
  
  // Login after registration
  const loginResult = await login(userData.email, userData.password);
  
  // Get user profile
  const profile = await getCurrentUserProfile();
  console.log('User profile:', profile);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Managing Notes

```javascript
import { createNote, getNotes, getActiveNotes } from './services/notesService';

// Create a note
const noteData = {
  id_usuario_materia: 1,
  titulo: 'Study for exam',
  descripcion: 'Review chapters 1-5',
  fecha_fin: '2024-12-31T23:59:59'
};

await createNote(noteData, 1); // materiaId = 1

// Get all active notes
const activeNotes = await getActiveNotes();
console.log('Active notes:', activeNotes);
```

### Schedule Management

```javascript
import { uploadScheduleFile, getMyWeeklySchedule } from './services';

// Upload schedule file
const fileInput = document.getElementById('scheduleFile');
const file = fileInput.files[0];

try {
  await uploadScheduleFile(file);
  console.log('Schedule uploaded successfully');
  
  // Get weekly schedule
  const schedule = await getMyWeeklySchedule();
  console.log('Weekly schedule:', schedule);
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

### Session Service Examples

```javascript
// Get user's complete schedule (NEW - Optimized)
import { getMySchedule, getMyWeeklySchedule } from '../services/sessionService';

// Option 1: Get raw schedule data from API
const rawSchedule = await getMySchedule();

// Option 2: Get formatted weekly schedule
const weeklySchedule = await getMyWeeklySchedule();
console.log(weeklySchedule.lunes); // Monday's classes

// Check for schedule conflicts
const conflicts = await checkScheduleConflicts({
  dia_semana: 'Lunes',
  hora_inicio: '08:00:00',
  hora_fin: '10:00:00'
});
```

## Recent Updates (v2.0)

### Schedule Viewing Optimization
- **NEW**: Implemented efficient schedule loading using `/sesion/mi-horario` endpoint
- **IMPROVED**: Single API call instead of multiple requests for user schedule
- **ENHANCED**: Better error handling for users without schedule data
- **ADDED**: Conditional rendering based on user's session data availability

### New Features
- **Schedule Table View**: Visual weekly schedule display with time slots and sessions
- **Conditional UI**: Shows either schedule table (with upload option) or upload-only view
- **Real-time Updates**: Refresh functionality for schedule data
- **Better UX**: Loading states and error handling throughout the application

### Performance Improvements
- Reduced API calls from ~10+ to 1 for schedule loading
- Optimized data fetching with dedicated endpoint
- Improved response time for schedule display
- Better caching and error recovery

## 🤝 Contributing

When adding new endpoints or modifying existing services:

1. Follow the existing pattern in service files
2. Use the `apiRequest` function from `baseApi.js`
3. Include proper error handling
4. Add JSDoc comments for functions
5. Update this README with new functionality
6. Add tests in `testService.js` if applicable

## 📞 Support

For issues with the API services:
1. Check the browser console for detailed error messages
2. Verify API server is running
3. Test endpoints using `testService.js` functions
4. Check authentication status with `isAuthenticated()`
