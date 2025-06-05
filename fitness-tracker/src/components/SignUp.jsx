import React, { useState } from 'react';
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword} from "firebase/auth";

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // On success, Firebase Auth State changes, we'll handle that later
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <br />
                <input
                    type="password"
                    placeholder="Password (6+ characters)"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <br />
                <button type="submit">Sign Up</button>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    );

}