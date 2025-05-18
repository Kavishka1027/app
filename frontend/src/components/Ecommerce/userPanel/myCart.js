import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './myCart.css';

const MyCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const userId = localStorage.getItem("userMongoId");

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load cart.');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put('http://localhost:5000/api/cart/update', { userId, itemId, orderQuantity: quantity });
      fetchCart();
    } catch (err) {
      alert('Failed to update quantity.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete('http://localhost:5000/api/cart/remove', { data: { userId, itemId } });
      fetchCart();
    } catch {
      alert('Failed to remove item.');
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post(`http://localhost:5000/api/cart/place-order/${userId}`);
      fetchCart();
      alert('Order placed!');
    } catch {
      alert('Failed to place order.');
    }
  };

  if (!userId) return <Navigate to="/login" state={{ from: location }} replace />;
  if (loading) return <div className="cart-container">Loading...</div>;
  if (error) return <div className="cart-container">{error}</div>;
  if (!cart) return <div className="cart-container">No cart found.</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.itemId} className="cart-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="cart-info">
                <h4>{item.name}</h4>
                <p>Price: Rs. {item.price.toFixed(2)}</p>
                <label>
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    value={item.orderQuantity}
                    onChange={(e) => updateQuantity(item.itemId, parseInt(e.target.value))}
                  />
                </label>
                <p>Total: Rs. {item.total.toFixed(2)}</p>
                <button onClick={() => removeItem(item.itemId)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="place-order-btn" onClick={placeOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default MyCart;
