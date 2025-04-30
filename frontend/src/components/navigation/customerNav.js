import React from 'react';
import { Link } from 'react-router-dom'; // For navigation


function ManagerNav() {

  return (
    <div>
      <nav style={{ backgroundColor: '#333', padding: '10px' }}>
        <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'space-around', margin: 0, padding: 0 }}>
        <li>
            <Link to="/customerDash" style={linkStyle}>home</Link>
          </li>
          <li>
            <Link to="/Me" style={linkStyle}>my profile</Link>
          </li>

          <li>
            <Link to="/DietPlan" style={linkStyle}>Diet Plan</Link>
          </li>
      
        </ul>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '18px',
  padding: '8px 16px',
  borderRadius: '4px',
};

export default ManagerNav;