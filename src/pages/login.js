import React, { useState, useEffect, formData } from 'react';
import './login.css';
import Headerini from '../layouts/headerini';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authServices';

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/schedule');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                console.log('Usuario logueado:', result.user);

                const userData = {
                    email: result.user.email,
                    name: result.user.username || result.user.name, 
                    id: result.user.id
                };

                console.log('Guardando en localStorage:', userData);
                localStorage.setItem('userData', JSON.stringify(userData));
                localStorage.setItem('isLoggedIn', 'true');

                window.location.href = '/agenda';
            }
        } catch (error) {
            console.error(error);
        }

    try {
        const response = await login(credentials.email, credentials.password);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(response.user));
        navigate('/schedule');
    } catch (error) {
        setError(error.message || 'Error al iniciar sesión');
        console.error(error);
    }
};

return (
    <div className='login-page'>
        <Headerini />
        <div className="login-container">
            <div className="login-form">
                <h1>Iniciar Sesión</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Correo Electrónico"
                            name="email"
                            value={credentials.email}
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
                            value={credentials.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="btn-primary">Iniciar Sesión</button>
                </form>
                <div className="login-links">
                    <Link to="/recuperar-password">Recuperar contraseña</Link>
                </div>
            </div>

            <div className="banner">
                <h2>¡Bienvenido!</h2>
                <p>Ingrese sus datos personales para usar todas las funciones del sitio</p>
                <Link to="/register">
                    <button className="btn-outline">Registrarse</button>
                </Link>
            </div>
        </div>
    </div>
);
};

export default Login;