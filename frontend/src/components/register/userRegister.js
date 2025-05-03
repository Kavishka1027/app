import React, { useState, useEffect } from 'react';
import './userRegister.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    role: '',
    roleId: '',
    AId: '',
    firstname: '',
    lastname: '',
    gender: '',
    dob: '',
    address: '',
    email: '',
    phone: '',
    image: '',
    password: '',
    confirmPassword: '',
    rewards: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');

  // const generateRoleId = (role) => {
  //   const timestamp = Date.now().toString().slice(-4);
  //   let prefix = '';

  //   switch (parseInt(role)) {
  //     case 1: prefix = 'ADM'; break;
  //     case 2: prefix = 'MAN'; break;
  //     case 3: prefix = 'VET'; break;
  //     case 4: prefix = 'CUS'; break;
  //     default: prefix = 'USR';
  //   }
  //   return `${prefix}${timestamp}`;
  // };

 //useEffect(() => {
  //   if (formData.role) {
  //     const newRoleId = generateRoleId(formData.role);
  //     setFormData((prev) => ({ ...prev, roleId: newRoleId }));
  //   }
  // }, [formData.role]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
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

    if (!emailPattern.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }

    if (!phonePattern.test(formData.phone)) {
      setError('Phone number must be 10 digits');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
        role: Number(formData.role),
        rewards: formData.role === "4" ? Number(formData.rewards || 0) : undefined,
        AdminID: formData.role === "1" ? formData.roleId : undefined,
        ManagerID: formData.role === "2" ? formData.roleId : undefined,
        VeterinarianID: formData.role === "3" ? formData.roleId : undefined,
        CustomerID: formData.role === "4" ? formData.roleId : undefined,
      };

      // Check if email, NIC, or phone already exist
      const checkResponse = await fetch(`http://localhost:5000/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const checkResult = await checkResponse.json();
      if (!checkResponse.ok) {
        setError(checkResult.message || 'Validation failed');
        return;
      }

      if (checkResult.exists) {
        setError(checkResult.message);
        return;
      }

      if (checkResponse.status === 201) {
        alert('Registration successful!');
        window.location.href = '/login';  // Navigate to the login page
      } else {
        setError(checkResult.message || 'Registration failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="register-container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} className="register-form">
        {error && <div className="error-message">{error}</div>}

        <div className="role-selection">
          <label><input type="radio" name="role" value="1" onChange={handleChange} required /> Admin</label>
          <label><input type="radio" name="role" value="2" onChange={handleChange} /> Manager</label>
          <label><input type="radio" name="role" value="3" onChange={handleChange} /> Veterinarian</label>
          <label><input type="radio" name="role" value="4" onChange={handleChange} /> Customer</label>
        </div>

        <div className="form-group">
          <label>Role ID:</label>
          <input type="text" name="roleId" onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>NIC Number (AId):</label>
          <input type="text" name="AId" value={formData.AId} onChange={handleChange} required />
        </div>

        <div className="two-columns">
          <div>
            <label>First Name:</label>
            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
          </div>
        </div>

        <div className="two-columns">
          <div>
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label>Birth Date:</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="two-columns">
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        {formData.role === "4" && (
          <div className="form-group">
            <label>Rewards:</label>
            <input type="number" name="rewards" value={formData.rewards} onChange={handleChange} />
          </div>
        )}

        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
