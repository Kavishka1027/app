// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import './userProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch the user's profile when the component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          credentials: 'include',  // Include credentials (cookies/session)
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);  // Set the user data in state
        } else {
          setError('Unable to fetch user profile.');
        }
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {user ? (
        <div>
          <h1>User Profile</h1>
          <p>ID: {user.id}</p>
          <p>User ID: {user.userId}</p>
          <p>Role: {user.role}</p>
          {/* You can add more user details here */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
