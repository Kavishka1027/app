import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/adminNav"

import axios from "axios";
import "./userProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser || !storedUser.id) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/users/${storedUser.id }`)
      .then((res) => {
        setUser(res.data.user);
        console.log(res.data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        navigate("/login");
      });
  }, [navigate]);


const getUserId = (role) => {
  switch (role) {
    case 1: // Admin
      return user.AdminID;
    case 2: // Manager
      return user.ManagerID;
    case 3: // Veterinarian
      return user.VeterinarianID;
    case 4: // Customer
      return user.CustomerID;
    default:
      return "User ID";
  }
};


  const getRoleDisplayName = (role) => {
    switch (role) {
      case 1:
        return "Administrator";
      case 2:
        return "Manager";
      case 3:
        return "Veterinarian";
      case 4:
        return "Customer";
      default:
        return "User";
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <div className="loading-message" align="center">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  const handleChangePassword = async (userId) => {
    const currentPassword = prompt("Enter your current password:");
    const newPassword = prompt("Enter your new password:");

    if (!currentPassword || !newPassword) {
      alert("Both current and new passwords are required.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/update/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      if (res.ok) {
        alert("Password changed successfully!");
      } else if (res.status === 401) {
        alert("Incorrect current password.");
      } else {
        alert("Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Something went wrong while changing the password.");
    }
  };

  return (
    <div className="profile-container">
        <Navigation/>
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
        
            <h1>User Profile</h1>
            
          </div>

          <div className="profile-body">
            <div className="profile-image-section">
              <img
                src={user.image || "https://via.placeholder.com/300"}
                alt="User"
                className="profile-image"
              />
              <h2>
                {user.firstname} {user.lastname}
              </h2>

              <p className="profile-role">
                <p>User ID: {getUserId(user.role)}</p>
                Role: {getRoleDisplayName(user.role)}

              </p>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{user.phone}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{user.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">
                  {new Date(user.dob).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{user.gender}</span>
              </div>
              <div className="profile-details">
              
                <button
                  onClick={() => handleChangePassword(user.newpassword)}
                  className="change-password-button"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default UserProfile;
