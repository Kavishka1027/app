// pages/RequestReset.tsx
import { useState } from 'react';
import axios from 'axios';
import "./forgotPassword.css";

export default function RequestReset() {
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/auth/reqPassword', { email });
    alert('Reset link sent to your email');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}
