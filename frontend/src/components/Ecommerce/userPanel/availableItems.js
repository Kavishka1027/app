// Updated ViewAllItem.js and MyCart.js with improvements and consistent cart handling

// ViewAllItem.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  const userId = localStorage.getItem('userMongoId');

  useEffect(() => {
    axios.get('http://localhost:5000/api/sellItem')
      .then(res => {
        const data = res.data?.sellItems || [];
        setItems(data);
        setFilteredItems(data);
      })
      .catch(err => {
        console.error("Failed to fetch items", err);
        setItems([]);
        setFilteredItems([]);
      });
  }, []);

  const filterItems = (search, type, category, price) => {
    let results = [...items];

    if (search) results = results.filter(item => item.name?.toLowerCase().includes(search));
    if (type && type !== 'All') results = results.filter(item => item.itemType?.toLowerCase() === type.toLowerCase());
    if (category && category !== 'All') results = results.filter(item => item.category?.toLowerCase() === category.toLowerCase());

    const min = parseFloat(price.min);
    const max = parseFloat(price.max);
    if (!isNaN(min)) results = results.filter(item => item.price >= min);
    if (!isNaN(max)) results = results.filter(item => item.price <= max);

    setFilteredItems(results);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterItems(term, selectedType, selectedCategory, priceRange);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...priceRange, [name]: value };
    setPriceRange(updated);
    filterItems(searchTerm, selectedType, selectedCategory, updated);
  };

  const openModalById = (id) => {
    const item = items.find(i => i._id === id);
    if (item) {
      setModalItem(item);
      setOrderQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    if (!modalItem || orderQuantity < 1 || orderQuantity > modalItem.quantity) return;

    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId,
        itemId: modalItem._id,
        orderQuantity,
      });

      alert('Item added to cart!');
      closeModal();
    } catch (err) {
      console.error("Error adding to cart", err);
      alert("Failed to add item to cart.");
    }
  };

  const closeModal = () => setModalItem(null);

  return (
    <div className="view-container">
      <div className="cart-icon-wrapper">
        <button className="cart-button" onClick={() => navigate('/myCart')}>
          🛒 My Cart
        </button>
      </div>

      <h2 className="title">🛒 All Items</h2>

      <div className="filters">
        <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} className="search-bar" />

        <div className="type-buttons">
          <button onClick={() => { setSelectedType('All'); filterItems(searchTerm, 'All', selectedCategory, priceRange); }}>📦 All</button>
          <button onClick={() => { setSelectedType('Food'); filterItems(searchTerm, 'Food', selectedCategory, priceRange); }}>🍖 Foods</button>
          <button onClick={() => { setSelectedType('Medicine'); filterItems(searchTerm, 'Medicine', selectedCategory, priceRange); }}>💊 Medicines</button>
          <button onClick={() => { setSelectedType('Toy'); filterItems(searchTerm, 'Toy', selectedCategory, priceRange); }}>🧸 Toys</button>
        </div>

        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); filterItems(searchTerm, selectedType, e.target.value, priceRange); }}>
          <option value="">🐾 All Categories</option>
          <option value="Dog">🐶 Dog</option>
          <option value="Cat">🐱 Cat</option>
        </select>

        <div className="price-range">
          <input type="number" name="min" placeholder="Min Price" value={priceRange.min} onChange={handlePriceChange} />
          <input type="number" name="max" placeholder="Max Price" value={priceRange.max} onChange={handlePriceChange} />
        </div>
      </div>

      <div className="grid-wrapper">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item._id} className="grid-card" onClick={() => openModalById(item._id)}>
              <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.name} className="item-image" />
              <h4>{item.name}</h4>
              <p>Rs. {item.price}</p>
              <p>Qty: {item.quantity}</p>
            </div>
          ))
        ) : <p>No items found.</p>}
      </div>

      {modalItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>×</button>
            <h3>{modalItem.name}</h3>
            <img src={modalItem.imageUrl || 'https://via.placeholder.com/300'} alt={modalItem.name} className="modal-img" />
            <p><strong>Brand:</strong> {modalItem.brand}</p>
            <p><strong>Price:</strong> Rs. {modalItem.price}</p>
            <p><strong>Qty Available:</strong> {modalItem.quantity}</p>
            <p><strong>Category:</strong> {modalItem.category}</p>
            <p><strong>Status:</strong> {modalItem.status}</p>
            <p><strong>Description:</strong> {modalItem.description || 'No description available.'}</p>

            <div className="cart-section">
              <label>🧾 Order Quantity:</label>
              <input type="number" min="1" max={modalItem.quantity} value={orderQuantity} onChange={(e) => setOrderQuantity(Number(e.target.value))} />
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
