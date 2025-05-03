import React from 'react';
import { Link } from 'react-router-dom';

function UserNavbar() {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/availableDogItems">Dogs</Link></li>
        <li><Link to="/availableFoodItems">Foods</Link></li>
        <li><Link to="/availableToyItems">Toys</Link></li>
        <li><Link to="/availableMedicineItems">Medicine</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default UserNavbar;
