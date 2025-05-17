import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './availableItems.css';

function ViewAllItem() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [modalItem, setModalItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [cart, setCart] = useState([]);

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
    filterItems(term, selectedType, selectedCategory, priceRange);
  };

  const filterByType = (type) => {
    setSelectedType(type);
    filterItems(searchTerm, type, selectedCategory, priceRange);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    filterItems(searchTerm, selectedType, category, priceRange);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const updatedPriceRange = { ...priceRange, [name]: value };
    setPriceRange(updatedPriceRange);
    filterItems(searchTerm, selectedType, selectedCategory, updatedPriceRange);
  };

  const filterItems = (search, type, category, price) => {
    let filtered = [...items];

    if (search) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(search)
      );
    }

    if (type && type !== 'All') {
      filtered = filtered.filter((item) =>
        item.itemType?.toLowerCase() === type.toLowerCase()
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter((item) =>
        item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    const min = parseFloat(price.min);
    const max = parseFloat(price.max);

    if (!isNaN(min)) {
      filtered = filtered.filter((item) => item.price >= min);
    }

    if (!isNaN(max)) {
      filtered = filtered.filter((item) => item.price <= max);
    }

    setFilteredItems(filtered);
  };

  const openModalById = (id) => {
    const item = items.find(i => i._id === id);
    if (item) {
      setModalItem(item);
      setOrderQuantity(1); // Reset quantity
    }
  };

  const closeModal = () => {
    setModalItem(null);
  };

  const handleAddToCart = () => {
    if (!modalItem) return;

    if (orderQuantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    if (orderQuantity > modalItem.quantity) {
      alert('Ordered quantity exceeds available stock.');
      return;
    }

    // Update quantity in local state
    const updatedItems = items.map(item => {
      if (item._id === modalItem._id) {
        return {
          ...item,
          quantity: item.quantity - orderQuantity,
        };
      }
      return item;
    });

    setItems(updatedItems);
    filterItems(searchTerm, selectedType, selectedCategory, priceRange);

    // Update modal view
    setModalItem(prev => ({
      ...prev,
      quantity: prev.quantity - orderQuantity,
    }));

    // Add to cart
    setCart([...cart, {
      ...modalItem,
      orderQuantity,
      total: modalItem.price * orderQuantity,
    }]);

    alert('Item added to cart!');
  };

  return (
    <div className="view-container">
      <h2 className="title">🛒 All Items</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />

        <div className="type-buttons">
          <button onClick={() => filterByType('All')}>📦 All Types</button>
          <button onClick={() => filterByType('Food')}>🍖 Foods</button>
          <button onClick={() => filterByType('Medicine')}>💊 Medicines</button>
          <button onClick={() => filterByType('Toy')}>🧸 Toys</button>
        </div>

        <div className="category-dropdown">
          <select
            value={selectedCategory}
            onChange={(e) => filterByCategory(e.target.value)}
          >
            <option value="">🐾 All Categories</option>
            <option value="Dog">🐶 Dog</option>
            <option value="Cat">🐱 Cat</option>
          </select>
        </div>

        <div className="price-range">
          <input
            type="number"
            name="min"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={handlePriceChange}
          />
          <input
            type="number"
            name="max"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={handlePriceChange}
          />
        </div>
      </div>

      <div className="grid-wrapper">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div
              key={item._id}
              className="grid-card"
              onClick={() => openModalById(item._id)}
            >
              <img
                src={item.imageUrl || 'https://via.placeholder.com/150'}
                alt={item.name}
                className="item-image"
              />
              <h4>{item.name}</h4>
              <p>Rs. {item.price}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {modalItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <h3>{modalItem.name}</h3>
            <img
              src={modalItem.imageUrl || 'https://via.placeholder.com/300'}
              alt={modalItem.name}
              className="modal-img"
            />
            <p><strong>Brand:</strong> {modalItem.brand}</p>
            <p><strong>Price:</strong> Rs. {modalItem.price}</p>
            <p><strong>Available Quantity:</strong> {modalItem.quantity}</p>
            <p><strong>Category:</strong> {modalItem.category}</p>
            <p><strong>Status:</strong> {modalItem.status}</p>
            <p><strong>Description:</strong> {modalItem.description || 'No description available.'}</p>

            <div className="cart-section">
              <label>🧾 Order Quantity:</label>
              <input
                type="number"
                min="1"
                max={modalItem.quantity}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
              />
              <p><strong>Total:</strong> Rs. {orderQuantity * modalItem.price}</p>
              <button className="add-to-cart-btn" onClick={handleAddToCart}>🛒 Add to Cart</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAllItem;
