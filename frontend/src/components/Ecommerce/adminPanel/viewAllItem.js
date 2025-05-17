import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateItem from './createItem';
import './viewAllItem.css';

function ViewAllItem() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/sellItem')
      .then((res) => {
        const fetchedItems = res.data?.sellItems || [];
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setItems([]);
        setFilteredItems([]);
      });
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterItems(term, selectedCategory);
  };

  const handleCategoryFilter = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterItems(searchTerm, category);
  };

  const filterItems = (searchTerm, category) => {
    let filtered = [...items];

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm)
      );
    }

    if (category) {
      filtered = filtered.filter((item) =>
        item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredItems(filtered);
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/sellItem/${id}`);
      alert(response.data.message);
      const updatedItems = items.filter((item) => item.itemId !== id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
    } catch (error) {
      console.error("Error deleting item!", error);
    }
  };

  return (
    <div className="view-container">
      <h2 className="title">🛒 All Items</h2>

      {/* Search and Category Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <select onChange={handleCategoryFilter} value={selectedCategory} className="category-filter">
          <option value="">All Categories</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
        </select>
      </div>

      <button className="add-button" onClick={() => setShowModal(true)}>
        ➕ Add Sell Item
      </button>

      {/* Items Table */}
      <div className="table-wrapper">
        <table className="item-table">
          <thead>
            <tr>
              <th>Pet Type</th>
              <th>ID</th>
              <th>Brand</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.category}</td>
                  <td>{item.itemId}</td>
                  <td>{item.brand}</td>
                  <td>{item.name}</td>
                  <td>Rs.{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <span className={`status ${item.status === 'available' ? 'available' : 'unavailable'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="edit-button">Edit</button>
                    <button className="delete-button" onClick={() => deleteItem(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-items">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding New Item */}
      {showModal && (
        <div className="custom-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Sell Item</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <CreateItem />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAllItem;
