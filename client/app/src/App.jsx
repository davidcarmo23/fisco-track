import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './Components/ProtectedRoute';

function Logout() {
  localStorage.clear();
  return <Navigate to='/login' />
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path='/login' element={
          <Login />
        } />
        <Route path='/logout' element={
          <Logout />
        } />
        <Route path='/register' element={
          <RegisterAndLogout />
        } />
        <Route path='*' element={
          <NotFound />
        } />
      </Routes>
    </BrowserRouter>
  );

}

export default App
