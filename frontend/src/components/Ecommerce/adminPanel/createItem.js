import React, { useState } from 'react'

function CreateItem() {
  const [formData, setFormData] = useState({
    itemType: '',
    itemId: '',
    brand: '',
    name: '',
    category: '',
    quantity: 0,
    expDate: '',
    manufactureDate: '',
    description: '',
    price: 0,
    image: '',
    status: ''
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
      const response = await fetch('http://localhost:3000/api/sellItem/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Item added successfully!');
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
  <label className="form-label">Item Type</label>
  <select name="itemType" value={formData.itemType} onChange={handleChange} className="form-select">
    <option value="">Select type</option>
    <option value="Food">Food</option>
    <option value="Toy">Toy</option>
    <option value="Medicine">Medicine</option>
  </select>
</div>

      <div className="mb-3">
        <label className="form-label">Item ID</label>
        <input type="text" name="itemId" value={formData.itemId} onChange={handleChange} className="form-control" placeholder="Enter item ID" />
      </div>

      <div className="mb-3">
        <label className="form-label">Brand</label>
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="form-control" placeholder="Enter brand" />
      </div>

      <div className="mb-3">
        <label className="form-label">Item Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Enter item name" />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" placeholder="Enter category (optional)" />
      </div>

      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" placeholder="Enter quantity" />
      </div>

      <div className="mb-3">
        <label className="form-label">Expiry Date</label>
        <input type="date" name="expiryDate" value={formData.expDate} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Manufacture Date</label>
        <input type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" placeholder="Enter description"></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" placeholder="Enter price" />
      </div>

      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input type="text" name="imageUrl" value={formData.image} onChange={handleChange} className="form-control" placeholder="Enter image URL (optional)" />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="form-select">
          <option value="available">Available</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <button type="submit" className="btn btn-primary w-100">Save Item</button>
    </form>
  );
}

export default CreateItem;
