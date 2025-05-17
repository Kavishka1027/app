import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./adminNav.css";

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
              onClick={() => toggleDropdown("register")}
              className="nav-link dropdown-btn"
            >
              Register ▾
            </button>
            {activeDropdown === "register" && (
              <ul className="dropdown-list">
                <li>
                  <Link to="/userRegister" className="nav-link">
                    Users
                  </Link>
                </li>

                <li>
                  <Link to="/petRegister" className="nav-link">
                    Pets
                  </Link>
                </li>
              </ul>
            )}
          </li>


          <li>
            <button
              onClick={() => toggleDropdown("pets")}
              className="nav-link dropdown-btn"
            >
              Pets ▾
            </button>

            {activeDropdown === "pets" && (
              <ul className="dropdown-list">
                <li>
                  <Link to="/dogs" className="nav-link">
                    Dogs
                  </Link>
                </li>
                <li>
                  <Link to="/cats" className="nav-link">
                    Cats
                  </Link>
                </li>
              </ul>
            )}
          </li>


          <li>
            <button
              onClick={() => toggleDropdown("users")}
              className="nav-link dropdown-btn"
            >
              Users ▾
            </button>
            {activeDropdown === "users" && (
              <ul className="dropdown-list">
                <li>
                  <Link to="/customers" className="nav-link">
                    Customers
                  </Link>
                </li>
                <li>
                  <Link to="/veterinarians" className="nav-link">
                    Veterinarians
                  </Link>
                </li>
              </ul>
            )}
          </li>



          <li>
            <button
              onClick={() => toggleDropdown("store")}
              className="nav-link dropdown-btn"
            >
              Online Store ▾
            </button>
            {activeDropdown === "store" && (
              <ul className="dropdown-list">

                <li>
                  <Link to="/viewAllItem" className="nav-link">
                    View Products
                  </Link>
                </li>
                <li>
                  <Link to="/viewAllPet" className="nav-link">
                    View Pets
                  </Link>
                </li>
                <li>
                  <Link to="/createItem" className="nav-link">
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link to="/createPet" className="nav-link">
                    add Pet
                  </Link>
                </li>
              </ul>
            )}
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
