import React, { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateCurrentUserProfile } from '../services/userService';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    codigo: '',
    clave: '',
    confirmClave: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getCurrentUserProfile();
      setUser(userData);
      setFormData({
        nombre: userData.nombre || '',
        correo: userData.correo || '',
        codigo: userData.codigo || '',
        clave: '',
        confirmClave: ''
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      setError('Error al cargar el perfil del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensajes al cambiar datos
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    
    if (!formData.correo.trim()) {
      setError('El correo es obligatorio');
      return false;
    }
    
    if (!formData.codigo.trim()) {
      setError('El código es obligatorio');
      return false;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('El formato del correo no es válido');
      return false;
    }
    
    // Validar contraseña si se está cambiando
    if (showPasswordFields && formData.clave) {
      if (formData.clave.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return false;
      }
      
      if (formData.clave !== formData.confirmClave) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        nombre: formData.nombre,
        correo: formData.correo,
        codigo: formData.codigo
      };
      
      // Solo incluir contraseña si se está cambiando
      if (showPasswordFields && formData.clave) {
        updateData.clave = formData.clave;
      }
      
      const updatedUser = await updateCurrentUserProfile(updateData);
      setUser(updatedUser);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      setShowPasswordFields(false);
      setFormData(prev => ({
        ...prev,
        clave: '',
        confirmClave: ''
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setShowPasswordFields(false);
    setError(null);
    setSuccess(null);
    // Restaurar datos originales
    setFormData({
      nombre: user?.nombre || '',
      correo: user?.correo || '',
      codigo: user?.codigo || '',
      clave: '',
      confirmClave: ''
    });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <p>Gestiona tu información personal</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Información Personal</h2>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="codigo">Código de Usuario</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Código identificador"
                required
              />
            </div>
          </div>

          {isEditing && (
            <div className="form-section">
              <div className="password-section-header">
                <h2>Cambiar Contraseña</h2>
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                  {showPasswordFields ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
                </button>
              </div>

              {showPasswordFields && (
                <>
                  <div className="form-group">
                    <label htmlFor="clave">Nueva Contraseña</label>
                    <input
                      type="password"
                      id="clave"
                      name="clave"
                      value={formData.clave}
                      onChange={handleInputChange}
                      placeholder="Mínimo 6 caracteres"
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmClave">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      id="confirmClave"
                      name="confirmClave"
                      value={formData.confirmClave}
                      onChange={handleInputChange}
                      placeholder="Repite la nueva contraseña"
                      minLength="6"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <div className="form-actions">
            {!isEditing ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </div>
        </form>

        {user && (
          <div className="profile-info">
            <h3>Información de la Cuenta</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">ID de Usuario:</span>
                <span className="info-value">{user.id_usuario}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className={`info-value status ${user.activo ? 'active' : 'inactive'}`}>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              {user.token_notificacion && (
                <div className="info-item">
                  <span className="info-label">Notificaciones:</span>
                  <span className="info-value">Configuradas</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
