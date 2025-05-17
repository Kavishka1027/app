import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/adminNav"
import "./showFoods.css";

const ShowFoods = () => {
  const [allFoods, setAllFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const categories = ["Meat", "Vegetables", "Milk", "Fruits"];

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/foods/foods");
      const data = await response.json();
      setAllFoods(data.foods || []);
    } catch (err) {
      console.error("Error fetching foods:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddFood = () => {
    navigate("/addFood");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await fetch(`http://localhost:5000/api/foods/${id}`, {
          method: "DELETE",
        });
        alert("Food item deleted successfully!");
        fetchFoods(); // refresh list
      } catch (error) {
        console.error("Error deleting food item:", error);
      }
    }
  };

  const handleUpdateCalories = async (id) => {
    const newCalories = prompt("Enter new calories per 100g:");
    if (newCalories && !isNaN(newCalories)) {
      try {
        const res = await fetch(`http://localhost:5000/api/foods/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ caloriesPer100g: newCalories }),
        });

        if (res.ok) {
          alert("Calories updated successfully!");
          fetchFoods();
        } else {
          alert("Failed to update calories.");
        }
      } catch (error) {
        console.error("Error updating calories:", error);
      }
    } else {
      alert("Invalid input! Please enter a number.");
    }
  };

  const filteredFoods = allFoods.filter((food) =>
    food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="showfoods-container">
      <Navigation/>
      <div className="header-section">
        <h2>Available Food Items</h2>
        <button className="add-food-button" onClick={handleAddFood}>
          + Add Food Item
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search food by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {categories.map((category) => (
        <div key={category} className="category-section">
          <h3>{category}</h3>
          <table className="food-table">
            <thead>
              <tr>
                <th>Food ID</th>
                <th>Food Name</th>
                <th>Calories (per 100g)</th>
                <th>Actions</th> 
              </tr>
            </thead>
            <tbody>
              {filteredFoods.filter((food) => food.category === category)
                .length > 0 ? (
                filteredFoods
                  .filter((food) => food.category === category)
                  .map((food, index) => (
                    <tr key={index}>
                      <td>{food.foodId}</td>
                      <td>{food.foodName}</td>
                      <td>{food.caloriesPer100g}</td>
                      <td>
                        <button
                          className="action-button delete"
                          onClick={() => handleDelete(food._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="action-button update"
                          onClick={() => handleUpdateCalories(food._id)}
                        >
                          Update Calories
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No food items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ShowFoods;
