import React from 'react';
import Navigation from "../navigation/customerNav";
import "./customerDash.css"; // Import the CSS file

function CustomerDash() {
  return (
    <div className="customer-dash-container">
      <Navigation />
      <h1>Customer Dashboard</h1>
    </div>
  );
}

export default CustomerDash;