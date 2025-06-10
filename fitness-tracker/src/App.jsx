import {useContext, useState} from 'react'
import './App.css'
import './firebase.js';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import { AuthContext } from './AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';

function App() {
    const { currentUser } = useContext(AuthContext);

    return (

        <>
            <Navbar />
            <h1 className="text-4xl font-bold text-blue-600">🚀 Tailwind is working!</h1>
            <Routes>
                <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    );
}

export default App;