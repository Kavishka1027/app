import React, { useState, useEffect } from 'react';
import './createItem.css';

function CreateItem() {
  const [formData, setFormData] = useState({
    itemType: '',
    itemId: '',
    brand: '',
    name: '',
    category: '',
    quantity: '',
    expDate: '',
    manufactureDate: '',
    description: '',
    price: '',
    image: '',
    status: 'available'
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const generateItemId = () => {
      const prefixMap = {
        Food: 'FD',
        Medicine: 'MD',
        Toy: 'TY'
      };

      const prefix = prefixMap[formData.itemType];
      if (prefix) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setFormData(prev => ({
          ...prev,
          itemId: `${prefix}-${randomNum}`,
          ...(formData.itemType === 'Toy' && {
            expDate: '',
            manufactureDate: ''
          })
        }));
      } else {
        setFormData(prev => ({ ...prev, itemId: '' }));
      }
    };

    generateItemId();
  }, [formData.itemType]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'quantity' || name === 'price') && value !== '') {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData(prev => {
      const updatedForm = { ...prev, [name]: value };

      if (name === 'quantity') {
        const qty = parseFloat(value);
        updatedForm.status = !isNaN(qty) && qty > 0 ? 'available' : 'sold';
      }

      return updatedForm;
    });

    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.itemType) errors.itemType = 'Item type is required.';
    if (!formData.brand.trim()) errors.brand = 'Brand is required.';
    if (!formData.name.trim()) errors.name = 'Item name is required.';
    if (!formData.category) errors.category = 'Category is required.';

    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);

    if (isNaN(quantity) || quantity < 0) errors.quantity = 'Quantity must be a positive number.';
    if (isNaN(price) || price < 0) errors.price = 'Price must be a positive number.';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sellItem/addSellItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price)
        }),
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
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Item Type</label>
        <select
          name="itemType"
          value={formData.itemType}
          onChange={handleChange}
          className={`form-select ${formErrors.itemType ? 'is-invalid' : ''}`}
          required
        >
          <option value="">Select type</option>
          <option value="Food">Food</option>
          <option value="Toy">Toy</option>
          <option value="Medicine">Medicine</option>
        </select>
        {formErrors.itemType && <div className="invalid-feedback">{formErrors.itemType}</div>}
      </div>

      {formData.itemId && (
        <div className="mb-3">
          <label className="form-label">Auto-Generated Item ID</label>
          <input type="text" className="form-control" value={formData.itemId} readOnly />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">For Dogs/Cats</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-select ${formErrors.category ? 'is-invalid' : ''}`}
          required
        >
          <option value="">Select Pet Type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>
        {formErrors.category && <div className="invalid-feedback">{formErrors.category}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className={`form-control ${formErrors.brand ? 'is-invalid' : ''}`}
          required
        />
        {formErrors.brand && <div className="invalid-feedback">{formErrors.brand}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Item Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
          required
        />
        {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Quantity</label>
        <input
          type="text"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className={`form-control ${formErrors.quantity ? 'is-invalid' : ''}`}
          required
        />
        {formErrors.quantity && <div className="invalid-feedback">{formErrors.quantity}</div>}
      </div>

      {formData.itemType !== 'Toy' && (
        <>
          <div className="mb-3">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              name="expDate"
              value={formData.expDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Manufacture Date</label>
            <input
              type="date"
              name="manufactureDate"
              value={formData.manufactureDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </>
      )}

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
          rows="3"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price(Rs.)</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
          required
        />
        {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Status</label>
        <input type="text" className="form-control" value={formData.status} readOnly />
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <button type="submit" className="btn btn-primary w-100">Save Item</button>
    </form>
  );
}

export default CreateItem;
