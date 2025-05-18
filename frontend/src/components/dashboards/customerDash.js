import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from "../navigation/customerNav";
import "./customerDash.css";

function CustomerDash() {
  const navigate = useNavigate();

  const handleViewItems = () => {
    navigate('/availableItems'); // Update this route if your path is different
  };

  return (
    <div className="customer-dash-container">
      <Navigation />
      <h1>Customer Dashboard</h1>

      <button className="view-items-btn" onClick={handleViewItems}>
        🛍️ View Available Items
      </button>
    </div>
  );
}

export default CustomerDash;
