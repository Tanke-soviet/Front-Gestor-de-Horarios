import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Schedule from './pages/schedule';
import Calendar from './components/calendar';
import Notes from './components/notes';
import Resources from './components/resources';
import Register from './pages/register';
import Nav from './layouts/nav';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schedule" element={
          <Nav>
            <Schedule />
          </Nav>
        } />
        <Route path="/schedule/calendar" element={
          <Nav>
            <Calendar />
          </Nav>
        } />

        <Route path="/schedule/notes" element={
          <Nav>
            <Notes />
          </Nav>
        } />

        <Route path="/schedule/resources" element={
          <Nav>
            <Resources />
          </Nav>
        } />

        <Route path="/perfil" element={
          <Nav>
            <div>Contenido de Perfil</div>
          </Nav>
        } />

        <Route path="/agenda" element={
          <Nav>
            <div>Contenido de Agenda</div>
          </Nav>
        } />

        <Route path="/dia" element={
          <Nav>
            <div>Contenido de Día</div>
          </Nav>
        } />

        <Route path="/semana" element={
          <Nav>
            <div>Contenido de Semana</div>
          </Nav>
        } />

        <Route path="/mes" element={
          <Nav>
            <div>Contenido de Mes</div>
          </Nav>
        } />

        <Route path="/sincronizar" element={
          <Nav>
            <div>Contenido de Sincronizar</div>
          </Nav>
        } />

        <Route path="/calendario" element={
          <Nav>
            <div>Contenido de Calendario</div>
          </Nav>
        } />

        <Route path="/notas" element={
          <Nav>
            <div>Contenido de Notas</div>
          </Nav>
        } />

        <Route path="/recursos" element={
          <Nav>
            <div>Contenido de Recursos</div>
          </Nav>
        } />

        <Route path="/" element={
          localStorage.getItem('isLoggedIn') === 'true'
            ? <Navigate to="/schedule" />
            : <Navigate to="/login" />
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;