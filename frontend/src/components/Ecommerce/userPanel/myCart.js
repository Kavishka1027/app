import React, { useEffect, useState } from 'react';
import './Cart.css';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await axios.put('http://localhost:5000/api/cart/update', {
        userId,
        itemId,
        orderQuantity: quantity
      });
      fetchCart();
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete('http://localhost:5000/api/cart/remove', {
        data: { userId, itemId }
      });
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item', err);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axios.post(`http://localhost:5000/api/cart/place-order/${userId}`);
      fetchCart();
      alert('Order placed successfully!');
    } catch (err) {
      console.error('Failed to place order', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  if (!cart) return <div className="cart-container">Loading cart...</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.itemId} className="cart-item">
                <img src={item.imageUrl} alt={item.name} />
                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <input
                    type="number"
                    value={item.orderQuantity}
                    min="1"
                    onChange={(e) => handleQuantityChange(item.itemId, parseInt(e.target.value))}
                  />
                  <p>Total: ${item.total.toFixed(2)}</p>
                  <button onClick={() => handleRemove(item.itemId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button className="place-order" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
