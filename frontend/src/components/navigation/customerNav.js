import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./customerNav.css";

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
            <Link to="/adminDash" className="nav-link">
              Dashboard
            </Link>
          </li>

          <li>
            <button
              onClick={() => toggleDropdown("pets")}
              className="nav-link dropdown-btn"
            >
              My Pets ▾
            </button>

            {activeDropdown === "pets" && (
              <ul className="dropdown-list">
                <li>
                  <Link to="/" className="nav-link">
                    Dogs
                  </Link>
                </li>
                <li>
                  <Link to="/" className="nav-link">
                    Cats
                  </Link>
                </li>
              </ul>
            )}
          </li>
            <li>
            <Link to="/DietPlan" className="nav-link-right">
              Diet Plan
            </Link>
          </li>

          <li>
            <Link to="/" className="nav-link-right">
              Online Store
            </Link>
          </li>

          <li>
            <Link to="/" className="nav-link-right">
              Logout
            </Link>
          </li>
          <li>
            <Link to="/MyProfile" className="nav-link-right">
              My profile
            </Link>
          </li>
          <li>
            <Link to="/Messages" className="nav-link-right">
              Messages
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminNav;
