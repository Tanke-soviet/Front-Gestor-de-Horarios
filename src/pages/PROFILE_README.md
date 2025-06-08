# Página de Perfil del Usuario

## Descripción
La página de perfil permite a los usuarios visualizar y editar su información personal de manera segura y fácil de usar.

## Características

### Visualización de Información
- **Nombre completo** del usuario
- **Correo electrónico** 
- **Código de usuario**
- **Estado de la cuenta** (Activo/Inactivo)
- **ID de usuario** (solo lectura)
- **Estado de notificaciones** (si está configurado)

### Edición de Perfil
- **Modo de edición** activable con el botón "Editar Perfil"
- **Validación en tiempo real** de los campos
- **Cambio opcional de contraseña** con confirmación
- **Cancelación** que restaura los valores originales
- **Mensajes de confirmación** y error claros

### Seguridad
- **Autenticación JWT** requerida
- **Validación de formularios** (email, contraseña, campos requeridos)
- **Manejo seguro de contraseñas** (no se muestra, confirmación requerida)
- **Tokens de sesión** actualizados automáticamente

## Flujo de Usuario

1. **Carga inicial**: La página obtiene automáticamente los datos del usuario actual
2. **Visualización**: Muestra la información en modo de solo lectura
3. **Edición**: Al hacer clic en "Editar Perfil" se habilitan los campos
4. **Cambio de contraseña**: Opción adicional con validación y confirmación
5. **Guardar cambios**: Valida y envía los datos actualizados al servidor
6. **Confirmación**: Muestra mensaje de éxito y vuelve al modo de visualización

## Validaciones

### Campos Requeridos
- Nombre completo (no puede estar vacío)
- Correo electrónico (formato válido)
- Código de usuario (no puede estar vacío)

### Contraseña (opcional)
- Mínimo 6 caracteres
- Confirmación debe coincidir
- Solo se actualiza si se proporciona una nueva

### Formato de Correo
- Validación con expresión regular estándar
- Formato: usuario@dominio.com

## Integración con API

### Endpoints Utilizados
- `GET /usuarios/{id}` - Obtener información del usuario
- `PUT /usuarios/{id}` - Actualizar información del usuario

### Manejo de Errores
- **401**: Sesión expirada - redirige al login
- **400**: Datos inválidos - muestra mensaje específico
- **500**: Error del servidor - mensaje genérico

## Navegación

### Acceso
- Desde el menú lateral: Clic en el nombre del usuario
- URL directa: `/perfil`
- Requiere autenticación activa

### Breadcrumbs
- Inicio > Mi Perfil

## Diseño Responsivo

### Desktop (> 768px)
- Layout de dos columnas
- Formulario amplio y cómodo
- Botones alineados a la derecha

### Tablet (768px - 480px)
- Layout adaptativo
- Campos de formulario stack verticalmente
- Botones en columna

### Mobile (< 480px)
- Layout completamente vertical
- Campos optimizados para touch
- Información de cuenta simplificada

## Estados de la Página

### Cargando
- Spinner animado
- Mensaje "Cargando perfil..."

### Error
- Banner rojo con icono de advertencia
- Mensaje específico del error
- Opción de reintentar (recarga)

### Éxito
- Banner verde con icono de confirmación
- Mensaje "Perfil actualizado correctamente"
- Auto-desaparece después de unos segundos

### Editing
- Campos habilitados para edición
- Botones "Guardar" y "Cancelar"
- Opción de cambio de contraseña expandible

## Archivos del Componente

```
src/pages/
├── profile.js          # Componente principal
└── profile.css         # Estilos específicos

src/services/
└── userService.js      # Funciones de API para usuarios
```

## Uso del Componente

```jsx
import Profile from './pages/profile';

// En App.js o router
<Route path="/perfil" element={
  <Nav>
    <Profile />
  </Nav>
} />
```

## Dependencias

- **React** (hooks: useState, useEffect)
- **React Router** (para navegación)
- **Services**: userService, baseApi
- **CSS**: Estilos responsive y modernos

## Próximas Mejoras

1. **Foto de perfil** - Subida y edición de avatar
2. **Configuración de notificaciones** - Preferencias de usuario
3. **Cambio de tema** - Modo oscuro/claro
4. **Historial de cambios** - Log de modificaciones
5. **Verificación por email** - Confirmar cambios importantes
6. **Autenticación 2FA** - Factor de autenticación adicional
