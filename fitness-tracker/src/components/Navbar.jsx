import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {AuthContext} from "../AuthContext.jsx";

function Navbar() {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.logo}>🏋️ FitTrack</Link>
            <div style={styles.links}>
                {currentUser ? (
                    <>
                        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/signup" style={styles.link}>Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 2rem',
        backgroundColor: '#222',
        color: '#fff',
        alignItems: 'center',
        width: '80em',
    },
    logo: {
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: '#fff'
    },
    links: {
        display: 'flex',
        gap: '1rem'
    },
    link: {
        textDecoration: 'none',
        color: '#fff'
    },
    button: {
        backgroundColor: '#444',
        border: 'none',
        color: '#fff',
        padding: '0.5rem 1rem',
        cursor: 'pointer'
    }
};

export default Navbar;