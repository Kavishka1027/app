import React, { useState } from 'react';

function CreatePet() {
  const [formData, setFormData] = useState({
    breed: '',
    name: '',
    gender: '',
    category: '',
    dob: '',
    age: '',
    image: '',
    type: '',
    description: '',
    location: '',
    status: '',
    adoptedDate: '',
    price: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/pets/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Pet added successfully!');
        window.location.reload();
      } else {
        setErrorMessage(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Server error. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Breed</label>
        <input type="text" name="breed" value={formData.breed} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} className="form-select" required>
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" required />
      </div>

      <div className="mb-3">
        <label className="form-label">Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Age</label>
        <input type="text" name="age" value={formData.age} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Type</label>
        <select name="type" value={formData.type} onChange={handleChange} className="form-select" required>
          <option value="">Select type</option>
          <option value="dogs">Dogs</option>
          <option value="cats">Cats</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" />
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="form-select" required>
          <option value="">Select status</option>
          <option value="available">Available</option>
          <option value="adopted">Adopted</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Adopted Date</label>
        <input type="date" name="adoptedDate" value={formData.adoptedDate} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" />
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <button type="submit" className="btn btn-primary w-100">Save Pet</button>
    </form>
  );
}

export default CreatePet;
