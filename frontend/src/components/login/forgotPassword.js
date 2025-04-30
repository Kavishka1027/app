// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';
import './forgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/forgotPassword', { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response.data.message || 'Error occurred');
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} class="auth-form">
            <h2>Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
