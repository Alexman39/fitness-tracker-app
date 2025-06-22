import {useContext, useState} from 'react'
import './App.css'
import './firebase.js';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import { AuthContext } from './AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar.jsx';
import WorkoutPage from "@/components/WorkoutPage.jsx";
import { Toaster } from "react-hot-toast";
import HistoryPage from "@/components/history.jsx";

function App() {
    const { currentUser } = useContext(AuthContext);

    return (

        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/dashboard"
                    element={currentUser ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/history" element={<HistoryPage />} />
            </Routes>
            <Toaster position="top-center" reverseOrder={false}/>
        </>
    );
}

export default App;