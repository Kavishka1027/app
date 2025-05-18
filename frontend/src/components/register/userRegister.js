import React, { useState, useEffect } from "react";
import "./userRegister.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    role: "4",
    roleId: "",
    AId: "",
    firstname: "",
    lastname: "",
    gender: "",
    dob: "",
    address: "",
    email: "",
    phone: "",
    image: "",
    password: "",
    confirmPassword: "",
    rewards: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const generateRoleId = () => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`.slice(-6);
    return `CUS${timestamp}`;
  };

  useEffect(() => {
    const newRoleId = generateRoleId();
    setFormData((prev) => ({ ...prev, roleId: newRoleId }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setFormData((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    const nicPattern = /^(\d{9}|\d{12})$/;

    if (!nicPattern.test(formData.AId)) {
      setError("NIC must be either 9 or 12 digits and contain only numbers.");
      return false;
    }

    if (!emailPattern.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }

    if (!phonePattern.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submissionData = {
        ...formData,
        AId: String(formData.AId),
        phone: Number(formData.phone),
        role: 4,
        rewards: Number(formData.rewards || 0),
        CustomerID: formData.roleId,
      };

      const res = await fetch(`http://localhost:5000/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
      // window.location.href = "/login";
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="register-background">
      <div className="register-container">
        <h2>Customer Registration</h2>
        <form onSubmit={handleSubmit} className="register-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group" align="center">
            <label>Customer ID: {formData.roleId}</label>
          </div>

          <div className="form-group">
            <label>NIC (Except "v"):</label>
            <input
              type="text"
              name="AId"
              value={formData.AId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="two-columns">
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="two-columns">
            <div>
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label>Birth Date:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="two-columns">
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </div>

          <div className="two-columns">
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Rewards:</label>
            <input
              type="number"
              name="rewards"
              value={formData.rewards}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
