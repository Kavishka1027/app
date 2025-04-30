// src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './resetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response.data.message || 'Error occurred');
        }
    };

    return (
        <div className="auth-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
