import React from 'react';
import { Link } from 'react-router-dom'; // For navigation


function VeterinarianNav() {

  return (
    <div>
      <nav style={{ backgroundColor: '#333', padding: '10px' }}>
        <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'space-around', margin: 0, padding: 0 }}>
        <li>
            <Link to="/home" style={linkStyle}>vet1</Link>
          </li>
          <li>
            <Link to="/pets" style={linkStyle}>vet2</Link>
          </li>
          <li>
            <Link to="/customers" style={linkStyle}>vet3</Link>
          </li>
          <li>
            <Link to="/veterinarians" style={linkStyle}>vet4</Link>
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

export default VeterinarianNav;