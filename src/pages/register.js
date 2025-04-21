import React, { useState } from 'react';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import Headerini from '../layouts/headerini';
import { register } from '../services/authServices';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        code: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            console.log('Enviando datos de registro:', {
                username: formData.username,
                code: formData.code,
                email: formData.email,
                password: formData.password
            });
            
            const response = await register(formData);
            console.log('Respuesta del registro:', response);

            alert('Registro exitoso');
            navigate('/login');
        } catch (error) {
            console.error('Error al registrar:', error);
            setError(error.message || 'Error al registrar usuario. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <Headerini />
            <div className="register-container">
                <div className="banner">
                    <h2>¡Hola!</h2>
                    <p>Ingrese sus datos personales para usar todas las funciones del sitio</p>
                    <Link to="/login">
                        <button className="btn-outline">Iniciar Sesión</button>
                    </Link>
                </div>

                <div className="register-form">
                    <h1>Registrarse</h1>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Código Institucional"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo Electrónico"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;