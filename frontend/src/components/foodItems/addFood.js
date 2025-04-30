import React, { useState, useEffect } from 'react';
import './addFood.css';

const AddFood = () => {
  const [formData, setFormData] = useState({
    category: '',
    foodId: '',
    foodName: '',
    caloriesPer100g: ''
  });

  const [allFoods, setAllFoods] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to generate Food ID
  const generateFoodId = (category) => {
    const timestamp = Date.now().toString().slice(-4);
    let prefix = '';

    switch (category) {
      case 'Meat':
        prefix = 'MEA';
        break;
      case 'Vegetables':
        prefix = 'VEG';
        break;
      case 'Milk':
        prefix = 'MLK';
        break;
      case 'Fruits':
        prefix = 'FRT';
        break;
      default:
        prefix = 'FOOD';
    }
    return `${prefix}${timestamp}`;
  };

  // Fetch all foods from backend
  const fetchFoods = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/foods');
      const data = await response.json();
      setAllFoods(data.foods); // Adjust based on the response structure
    } catch (err) {
      console.error('Error fetching foods:', err);
    }
  };

  useEffect(() => {
    fetchFoods(); // Fetch foods when component mounts
  }, []);

  useEffect(() => {
    if (formData.category) {
      const newFoodId = generateFoodId(formData.category);
      setFormData((prev) => ({ ...prev, foodId: newFoodId }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { category, foodName, caloriesPer100g } = formData;

    // Validate fields
    if (!category || !foodName || !caloriesPer100g) {
      setError('All fields are required');
      return;
    }

    // Check if food name already exists (case insensitive)
    const isFoodExist = allFoods.some(food => food.foodName.toLowerCase() === foodName.toLowerCase());

    if (isFoodExist) {
      setError('Food name already exists!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/foods/addFoodItem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess('Food item added successfully!');
        setFormData({ category: '', foodId: '', foodName: '', caloriesPer100g: '' });
        fetchFoods(); // Refresh the foods list after adding
      } else {
        setError(result.message || 'Failed to add food');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="addfood-container">
      <h2>Add New Food Item</h2>
      <form onSubmit={handleSubmit} className="addfood-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Meat">Meat</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Milk">Milk</option>
            <option value="Fruits">Fruits</option>
          </select>
        </div>

        <div className="form-group">
          <label>Food ID:</label>
          <input type="text" name="foodId" value={formData.foodId} readOnly />
        </div>

        <div className="form-group">
          <label>Food Name:</label>
          <input type="text" name="foodName" value={formData.foodName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Calories per 100g:</label>
          <input type="number" name="caloriesPer100g" value={formData.caloriesPer100g} onChange={handleChange} required />
        </div>

        <button type="submit" className="submit-button">Add Food</button>
      </form>
    </div>
  );
};

export default AddFood;


