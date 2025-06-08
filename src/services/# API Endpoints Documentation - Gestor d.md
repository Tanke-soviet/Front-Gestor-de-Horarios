# API Endpoints Documentation - Gestor de Horarios

## Base URL
All endpoints are prefixed with the respective router prefix.

---

## Authentication Endpoints (`/auth`)

### POST /auth/token
**Description:** Login endpoint to obtain JWT access token

**Request Body:**
```
Content-Type: application/x-www-form-urlencoded

username: string (required)
password: string (required)
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

**Status Codes:**
- 200: Login successful
- 401: Invalid credentials

---

## User Endpoints (`/usuarios`)

### POST /usuarios/
**Description:** Create a new user

**Request Body:**
```json
{
  "nombre": "string",
  "correo": "email@example.com",
  "codigo": "string",
  "clave": "string",
  "activo": true,
  "token_notificacion": "string" (optional)
}
```

**Response:**
```json
{
  "id_usuario": 1,
  "nombre": "string",
  "correo": "email@example.com",
  "codigo": "string",
  "activo": true,
  "token_notificacion": "string"
}
```

**Status Codes:**
- 201: User created successfully
- 400: Invalid data

### GET /usuarios/
**Description:** List all users (requires authentication)

**Query Parameters:**
- `skip`: int (default: 0) - Number of records to skip
- `limit`: int (default: 100) - Maximum number of records to return

**Response:**
```json
[
  {
    "id_usuario": 1,
    "nombre": "string",
    "correo": "email@example.com",
    "codigo": "string",
    "activo": true,
    "token_notificacion": "string"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

### GET /usuarios/{usuario_id}
**Description:** Get a specific user by ID

**Path Parameters:**
- `usuario_id`: int (required)

**Response:**
```json
{
  "id_usuario": 1,
  "nombre": "string",
  "correo": "email@example.com",
  "codigo": "string",
  "activo": true,
  "token_notificacion": "string"
}
```

**Status Codes:**
- 200: Success
- 404: User not found

### PUT /usuarios/{usuario_id}
**Description:** Update a user

**Path Parameters:**
- `usuario_id`: int (required)

**Request Body:**
```json
{
  "nombre": "string" (optional),
  "correo": "email@example.com" (optional),
  "codigo": "string" (optional),
  "clave": "string" (optional),
  "token_notificacion": "string" (optional),
  "activo": true (optional)
}
```

**Response:**
```json
{
  "id_usuario": 1,
  "nombre": "string",
  "correo": "email@example.com",
  "codigo": "string",
  "activo": true,
  "token_notificacion": "string"
}
```

**Status Codes:**
- 200: Success
- 404: User not found

### DELETE /usuarios/{usuario_id}
**Description:** Delete a user

**Path Parameters:**
- `usuario_id`: int (required)

**Response:** No content

**Status Codes:**
- 204: Successfully deleted
- 404: User not found

---

## Subject Endpoints (`/materias`)

### POST /materias/
**Description:** Create a new subject

**Request Body:**
```json
{
  "nombre": "string",
  "codigo": "string",
  "grupo": "string"
}
```

**Response:**
```json
{
  "id_materia": 1,
  "nombre": "string",
  "codigo": "string",
  "grupo": "string"
}
```

**Status Codes:**
- 201: Subject created successfully

### GET /materias/
**Description:** List all subjects

**Query Parameters:**
- `skip`: int (default: 0) - Number of records to skip
- `limit`: int (default: 100) - Maximum number of records to return

**Response:**
```json
[
  {
    "id_materia": 1,
    "nombre": "string",
    "codigo": "string",
    "grupo": "string"
  }
]
```

**Status Codes:**
- 200: Success

### GET /materias/{materia_id}
**Description:** Get a specific subject by ID

**Path Parameters:**
- `materia_id`: int (required)

**Response:**
```json
{
  "id_materia": 1,
  "nombre": "string",
  "codigo": "string",
  "grupo": "string"
}
```

**Status Codes:**
- 200: Success
- 404: Subject not found

### PUT /materias/{materia_id}
**Description:** Update a subject

**Path Parameters:**
- `materia_id`: int (required)

**Request Body:**
```json
{
  "nombre": "string",
  "codigo": "string",
  "grupo": "string"
}
```

**Response:**
```json
{
  "id_materia": 1,
  "nombre": "string",
  "codigo": "string",
  "grupo": "string"
}
```

**Status Codes:**
- 200: Success
- 404: Subject not found

### DELETE /materias/{materia_id}
**Description:** Delete a subject

**Path Parameters:**
- `materia_id`: int (required)

**Response:** No content

**Status Codes:**
- 204: Successfully deleted

---

## User-Subject Relationship Endpoints (`/usuario-materias`)

### POST /usuario-materias/
**Description:** Create a user-subject relationship

**Request Body:**
```json
{
  "id_usuario": 1,
  "id_materia": 1,
  "id_periodo": 1
}
```

**Response:**
```json
{
  "id_usuario_materia": 1,
  "id_usuario": 1,
  "id_materia": 1,
  "id_periodo": 1
}
```

**Status Codes:**
- 201: Relationship created successfully

### GET /usuario-materias/
**Description:** List all user-subject relationships

**Query Parameters:**
- `skip`: int (default: 0) - Number of records to skip
- `limit`: int (default: 100) - Maximum number of records to return

**Response:**
```json
[
  {
    "id_usuario_materia": 1,
    "id_usuario": 1,
    "id_materia": 1,
    "id_periodo": 1
  }
]
```

**Status Codes:**
- 200: Success

### GET /usuario-materias/{id_usuario_materia}
**Description:** Get a specific user-subject relationship by ID

**Path Parameters:**
- `id_usuario_materia`: int (required)

**Response:**
```json
{
  "id_usuario_materia": 1,
  "id_usuario": 1,
  "id_materia": 1,
  "id_periodo": 1
}
```

**Status Codes:**
- 200: Success
- 404: Relationship not found

### GET /usuario-materias/usuario/{id_usuario}
**Description:** Get all subjects for a specific user

**Path Parameters:**
- `id_usuario`: int (required)

**Response:**
```json
[
  {
    "id_usuario_materia": 1,
    "id_usuario": 1,
    "id_materia": 1,
    "id_periodo": 1
  }
]
```

**Status Codes:**
- 200: Success

### GET /usuario-materias/materia/{id_materia}
**Description:** Get all users for a specific subject

**Path Parameters:**
- `id_materia`: int (required)

**Response:**
```json
[
  {
    "id_usuario_materia": 1,
    "id_usuario": 1,
    "id_materia": 1,
    "id_periodo": 1
  }
]
```

**Status Codes:**
- 200: Success

### PUT /usuario-materias/{id_usuario_materia}
**Description:** Update a user-subject relationship

**Path Parameters:**
- `id_usuario_materia`: int (required)

**Request Body:**
```json
{
  "id_usuario": 1 (optional),
  "id_materia": 1 (optional),
  "periodo": "string" (optional)
}
```

**Response:**
```json
{
  "id_usuario_materia": 1,
  "id_usuario": 1,
  "id_materia": 1,
  "id_periodo": 1
}
```

**Status Codes:**
- 200: Success
- 404: Relationship not found

### DELETE /usuario-materias/{id_usuario_materia}
**Description:** Delete a user-subject relationship

**Path Parameters:**
- `id_usuario_materia`: int (required)

**Response:**
```json
{
  "message": "Usuario_Materia eliminado correctamente"
}
```

**Status Codes:**
- 204: Successfully deleted
- 404: Relationship not found

---

## Academic Period Endpoints (`/periodos`)

### POST /periodos/
**Description:** Create a new academic period

**Request Body:**
```json
{
  "nombre": "string",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-06-30"
}
```

**Response:**
```json
{
  "id_periodo": 1,
  "nombre": "string",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-06-30"
}
```

**Status Codes:**
- 201: Period created successfully

### GET /periodos/
**Description:** List all academic periods

**Query Parameters:**
- `skip`: int (default: 0) - Number of records to skip
- `limit`: int (default: 100) - Maximum number of records to return

**Response:**
```json
[
  {
    "id_periodo": 1,
    "nombre": "string",
    "fecha_inicio": "2024-01-01",
    "fecha_fin": "2024-06-30"
  }
]
```

**Status Codes:**
- 200: Success

### GET /periodos/{periodo_id}
**Description:** Get a specific academic period by ID

**Path Parameters:**
- `periodo_id`: int (required)

**Response:**
```json
{
  "id_periodo": 1,
  "nombre": "string",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-06-30"
}
```

**Status Codes:**
- 200: Success

### GET /periodos/actual/
**Description:** Get the current active academic period

**Response:**
```json
{
  "id_periodo": 1,
  "nombre": "string",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-06-30"
}
```

**Status Codes:**
- 200: Success

### PUT /periodos/{periodo_id}
**Description:** Update an academic period

**Path Parameters:**
- `periodo_id`: int (required)

**Request Body:**
```json
{
  "nombre": "string" (optional),
  "fecha_inicio": "2024-01-01" (optional),
  "fecha_fin": "2024-06-30" (optional)
}
```

**Response:**
```json
{
  "id_periodo": 1,
  "nombre": "string",
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-06-30"
}
```

**Status Codes:**
- 200: Success

### DELETE /periodos/{periodo_id}
**Description:** Delete an academic period

**Path Parameters:**
- `periodo_id`: int (required)

**Response:** Service response

**Status Codes:**
- 200: Successfully deleted

---

## Class Session Endpoints (`/sesion`)

### POST /sesion/
**Description:** Create a new class session

**Request Body:**
```json
{
  "id_usuario_materia": 1,
  "edificio": "string",
  "salon": "string",
  "dia_semana": "string",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00"
}
```

**Response:**
```json
{
  "id_sesion": 1,
  "id_usuario_materia": 1,
  "edificio": "string",
  "salon": "string",
  "dia_semana": "string",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00"
}
```

**Status Codes:**
- 201: Session created successfully
- 400: Invalid input data
- 422: Validation error
- 500: Database error

### GET /sesion/
**Description:** List all class sessions

**Query Parameters:**
- `skip`: int (default: 0) - Number of records to skip
- `limit`: int (default: 100) - Maximum number of records to return

**Response:**
```json
[
  {
    "id_sesion": 1,
    "id_usuario_materia": 1,
    "edificio": "string",
    "salon": "string",
    "dia_semana": "string",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00"
  }
]
```

**Status Codes:**
- 200: Success

### GET /sesion/{id_sesion}
**Description:** Get a specific class session by ID

**Path Parameters:**
- `id_sesion`: int (required)

**Response:**
```json
{
  "id_sesion": 1,
  "id_usuario_materia": 1,
  "edificio": "string",
  "salon": "string",
  "dia_semana": "string",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00"
}
```

**Status Codes:**
- 200: Success
- 404: Session not found

### GET /sesion/usuario-materia/{id_usuario_materia}
**Description:** Get all class sessions for a specific user-subject relationship

**Path Parameters:**
- `id_usuario_materia`: int (required)

**Response:**
```json
[
  {
    "id_sesion": 1,
    "id_usuario_materia": 1,
    "edificio": "string",
    "salon": "string",
    "dia_semana": "string",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00"
  }
]
```

**Status Codes:**
- 200: Success

### GET /sesion/{id_sesion}/completa
**Description:** Get complete class session information including user and subject details

**Path Parameters:**
- `id_sesion`: int (required)

**Response:**
```json
{
  "id_sesion": 1,
  "id_usuario_materia": 1,
  "edificio": "string",
  "salon": "string",
  "dia_semana": "string",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00",
  "usuario": {
    "id_usuario": 1,
    "nombre": "string"
  },
  "materia": {
    "id_materia": 1,
    "nombre": "string"
  }
}
```

**Status Codes:**
- 200: Success
- 404: Session not found

### PUT /sesion/{id_sesion}
**Description:** Update a class session

**Path Parameters:**
- `id_sesion`: int (required)

**Request Body:**
```json
{
  "id_usuario_materia": 1 (optional),
  "edificio": "string" (optional),
  "salon": "string" (optional),
  "dia_semana": "string" (optional),
  "hora_inicio": "08:00:00" (optional),
  "hora_fin": "10:00:00" (optional)
}
```

**Response:**
```json
{
  "id_sesion": 1,
  "id_usuario_materia": 1,
  "edificio": "string",
  "salon": "string",
  "dia_semana": "string",
  "hora_inicio": "08:00:00",
  "hora_fin": "10:00:00"
}
```

**Status Codes:**
- 200: Success
- 404: Session not found

### DELETE /sesion/{id_sesion}
**Description:** Delete a class session

**Path Parameters:**
- `id_sesion`: int (required)

**Response:**
```json
{
  "message": "Sesión de clase eliminada correctamente"
}
```

**Status Codes:**
- 204: Successfully deleted
- 404: Session not found

---

## Notes Endpoints (`/notas`) - Requires Authentication

### POST /notas/
**Description:** Create a new note for a specific subject

**Query Parameters:**
- `materia_id`: int (required) - Subject ID

**Request Body:**
```json
{
  "id_usuario_materia": 1,
  "titulo": "string",
  "descripcion": "string",
  "fecha_fin": "2024-12-31T23:59:59" (optional)
}
```

**Response:**
```json
{
  "id_nota": 1,
  "id_usuario_materia": 1,
  "titulo": "string",
  "descripcion": "string",
  "fecha_creacion": "2024-01-01T10:00:00",
  "fecha_fin": "2024-12-31T23:59:59"
}
```

**Status Codes:**
- 201: Note created successfully
- 403: Not assigned to this subject

### GET /notas/
**Description:** Get notes for the authenticated user with optional filters

**Query Parameters:**
- `materia_id`: int (optional) - Filter by specific subject
- `activas`: bool (default: false) - Filter only active notes
- `proximas_a_vencer`: int (optional) - Notes due in X days

**Response:**
```json
[
  {
    "id_nota": 1,
    "id_usuario_materia": 1,
    "titulo": "string",
    "descripcion": "string",
    "fecha_creacion": "2024-01-01T10:00:00",
    "fecha_fin": "2024-12-31T23:59:59"
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Not assigned to subject

### GET /notas/materias
**Description:** Get available subjects for creating notes for the authenticated user

**Response:**
```json
[
  {
    "id_usuario_materia": 1,
    "id_usuario": 1,
    "id_materia": 1,
    "id_periodo": 1
  }
]
```

**Status Codes:**
- 200: Success
- 401: Unauthorized

### GET /notas/{nota_id}
**Description:** Get a specific note by ID (must belong to authenticated user)

**Path Parameters:**
- `nota_id`: int (required)

**Response:**
```json
{
  "id_nota": 1,
  "id_usuario_materia": 1,
  "titulo": "string",
  "descripcion": "string",
  "fecha_creacion": "2024-01-01T10:00:00",
  "fecha_fin": "2024-12-31T23:59:59"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: No permission to access this note
- 404: Note not found

### PUT /notas/{nota_id}
**Description:** Update a specific note (must belong to authenticated user)

**Path Parameters:**
- `nota_id`: int (required)

**Request Body:**
```json
{
  "id_usuario_materia": 1 (optional),
  "titulo": "string" (optional),
  "descripcion": "string" (optional),
  "fecha_fin": "2024-12-31T23:59:59" (optional)
}
```

**Response:**
```json
{
  "id_nota": 1,
  "id_usuario_materia": 1,
  "titulo": "string",
  "descripcion": "string",
  "fecha_creacion": "2024-01-01T10:00:00",
  "fecha_fin": "2024-12-31T23:59:59"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: No permission to modify this note
- 404: Note not found

### DELETE /notas/{nota_id}
**Description:** Delete a specific note (must belong to authenticated user)

**Path Parameters:**
- `nota_id`: int (required)

**Response:** Service response

**Status Codes:**
- 200: Successfully deleted
- 401: Unauthorized
- 403: No permission to delete this note
- 404: Note not found

---

## Schedule Endpoints (`/horario`) - Requires Authentication

### POST /horario/
**Description:** Create a new schedule for the authenticated user

**Request Body:**
```
Content-Type: multipart/form-data

file: PDF file (required) - Schedule in PDF format
```

**Response:**
```json
{
  "message": "Horario creado exitosamente"
}
```

**Status Codes:**
- 201: Schedule created successfully
- 401: Unauthorized

---

## General Response Codes

All endpoints may return the following general status codes:

- **200**: OK - Request successful
- **201**: Created - Resource created successfully  
- **204**: No Content - Request successful, no content returned
- **400**: Bad Request - Invalid request data
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Access denied
- **404**: Not Found - Resource not found
- **422**: Unprocessable Entity - Validation error
- **500**: Internal Server Error - Server error

---

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the `/auth/token` endpoint with valid credentials.

---

## Date and Time Formats

- **Date**: ISO 8601 format (`YYYY-MM-DD`)
- **DateTime**: ISO 8601 format with timezone (`YYYY-MM-DDTHH:MM:SS`)
- **Time**: 24-hour format (`HH:MM:SS`)

---

## Error Response Format

Error responses follow this general format:

```json
{
  "detail": "Error message description"
}
```

For validation errors, the response may include additional field-specific information.


# New Endpoint Documentation: User Schedule

## GET /sesion/mi-horario

**Description**: Obtiene el horario completo del usuario autenticado con información detallada de todas sus sesiones de clase.

**Authentication**: ✅ Required (Bearer Token)

**Method**: GET

**URL**: `/sesion/mi-horario`

### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Query Parameters
None

### Request Body
None

### Response

**Success Response (200 OK)**
```json
[
  {
    "id_sesion": 1,
    "edificio": "Edificio A",
    "salon": "101",
    "dia_semana": "Lunes",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "materia": {
      "id_materia": 1,
      "nombre": "Matemáticas Avanzadas"
    },
    "periodo": {
      "id_periodo": 1,
      "nombre": "2024-1"
    }
  },
  {
    "id_sesion": 2,
    "edificio": "Edificio B",
    "salon": "205",
    "dia_semana": "Martes",
    "hora_inicio": "14:00:00",
    "hora_fin": "16:00:00",
    "materia": {
      "id_materia": 2,
      "nombre": "Programación Web"
    },
    "periodo": {
      "id_periodo": 1,
      "nombre": "2024-1"
    }
  }
]
```

**Error Responses**

- **401 Unauthorized**
```json
{
  "detail": "No se pudieron validar las credenciales"
}
```

- **404 Not Found**
```json
{
  "detail": "No se encontraron sesiones de clase para el usuario"
}
```

- **500 Internal Server Error**
```json
{
  "detail": "Error interno del servidor"
}
```

### Response Schema

**SesionClaseHorario**
| Field | Type | Description |
|-------|------|-------------|
| `id_sesion` | integer | ID único de la sesión de clase |
| `edificio` | string | Nombre del edificio donde se realiza la clase |
| `salon` | string | Número o nombre del salón |
| `dia_semana` | string | Día de la semana (Lunes, Martes, etc.) |
| `hora_inicio` | time | Hora de inicio de la clase (formato HH:MM:SS) |
| `hora_fin` | time | Hora de finalización de la clase (formato HH:MM:SS) |
| `materia` | MateriaBasica | Información básica de la materia |
| `periodo` | PeriodoBasico | Información básica del período académico |

**MateriaBasica**
| Field | Type | Description |
|-------|------|-------------|
| `id_materia` | integer | ID único de la materia |
| `nombre` | string | Nombre de la materia |

**PeriodoBasico**
| Field | Type | Description |
|-------|------|-------------|
| `id_periodo` | integer | ID único del período académico |
| `nombre` | string | Nombre del período académico |

### Usage Example

```bash
curl -X GET "http://localhost:8000/sesion/mi-horario" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
     -H "Content-Type: application/json"
```

### Features

- **Authentication Required**: El endpoint requiere un token JWT válido
- **User-specific**: Retorna únicamente las sesiones del usuario autenticado
- **Complete Information**: Incluye información detallada de materia y período
- **Ordered Results**: Los resultados están ordenados por día de la semana y hora de inicio
- **Error Handling**: Manejo apropiado de errores de autenticación y casos sin datos

### Business Logic

1. **Authentication**: Verifica que el usuario esté autenticado mediante JWT
2. **Data Retrieval**: Obtiene todas las sesiones de clase del usuario mediante joins con:
   - Tabla `usuario_materia` (relación usuario-materia-período)
   - Tabla `materias` (información de la materia)
   - Tabla `periodos_academicos` (información del período)
3. **Data Formatting**: Convierte los resultados al formato de respuesta requerido
4. **Ordering**: Ordena las sesiones por día de la semana y hora de inicio

### Technical Implementation

- **Service Method**: `SesionClaseService.get_horario_usuario()`
- **Database Query**: Utiliza joins SQL para obtener información completa
- **Response Transformation**: Convierte tuplas de resultados a objetos Pydantic
- **Authentication Dependency**: `get_current_user` de `app.dependencies.auth`
