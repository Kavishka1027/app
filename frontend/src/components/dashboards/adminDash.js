import React from 'react';
import AdminNav from '../navigation/adminNav';
import './adminDash.css'; 

function AdminPage() {
  return (
    <>
      <AdminNav />
      <div className="admin-content">
        {/* Your actual page content here */}
        <h1>Welcome to Admin Dashboard</h1>
        {/* etc. */}
      </div>
    </>
  );
}

export default AdminPage;
