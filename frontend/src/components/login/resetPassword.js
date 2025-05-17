// pages/ResetPassword.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./resetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post(`http://localhost:5000/api/auth/resetPassword/${token}`, { newPassword });
    alert('Password updated');
    navigate('/login');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter New Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}
