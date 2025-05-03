import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './adminNav.css'; 

function AdminNav() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="admin-nav">
      <nav className="nav-container">
        <ul className="nav-list">
          <li>
            <Link to="/adminDash" className="nav-link">Home</Link>
          </li>

          <li>
            <button onClick={() => toggleDropdown('pets')} className="nav-link dropdown-btn">Pets ▾</button>
            {activeDropdown === 'pets' && (
              <ul className="dropdown-list">
                <li><Link to="/dogs" className="nav-link">Dogs</Link></li>
                <li><Link to="/cats" className="nav-link">Cats</Link></li>
              </ul>
            )}
          </li>

          <li>
            <button onClick={() => toggleDropdown('users')} className="nav-link dropdown-btn">Users ▾</button>
            {activeDropdown === 'users' && (
              <ul className="dropdown-list">
                <li><Link to="/customers" className="nav-link">Customers</Link></li>
                <li><Link to="/veterinarians" className="nav-link">Veterinarians</Link></li>
              </ul>
            )}
          </li>

          <li>
            <button onClick={() => toggleDropdown('register')} className="nav-link dropdown-btn">Register ▾</button>
            {activeDropdown === 'register' && (
              <ul className="dropdown-list">
                <li><Link to="/adminDash/userRegister" className="nav-link">Users</Link></li>
           
                <li><Link to="/addFood" className="nav-link">add foods</Link></li>
                <li><Link to="/showFoods" className="nav-link">show foods</Link></li>
                <li><Link to="/petRegister" className="nav-link">Pet Register</Link></li>


              </ul>
            )}
          </li>
          <li>
            <Link to="/" className="nav-link">Logout</Link>
          </li>
          <li>
            <Link to="/Me" className="nav-link">My profile</Link>
          </li>
          <li>
            <Link to="/Messages" className="nav-link">Messages</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminNav;
