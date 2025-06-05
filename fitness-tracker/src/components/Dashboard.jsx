import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div>
            <h1>Welcome to your Dashboard, {currentUser.email}!</h1>
            <p className="text-pink-600 font-bold text-xl">Tailwind is working!</p>

            <button onClick={handleLogout}>Log out</button>
        </div>
    );
}

export default Dashboard;