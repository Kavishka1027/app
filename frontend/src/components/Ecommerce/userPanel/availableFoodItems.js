import React, { useEffect, useState } from 'react';
import axios from 'axios';

import UserNavbar from '../userNavbar';

function AvailableFoodItems() {
  const [sellItems, setSellItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/sellItem/user/availableItem/Food');
        setSellItems(response.data.availableItems);
      } catch (error) {
        console.error("Error fetching sell items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellItems();
  }, []);

  if (loading) {
    return <div className="text-center text-lg py-10">Loading products...</div>;
  }

  if (!sellItems.length) {
    return <div className="text-center text-lg py-10">No products found.</div>;
  }

  return (
    <div className="container py-7">
      <UserNavbar />
      <h1 className="text-3xl font-bold mb-6 text-center">All Selling Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellItems.map(item => (
          <div key={item.itemId} className="border rounded-xl shadow-lg overflow-hidden p-4 bg-white">
            <img 
              src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
              alt={item.name} 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600 mb-1">Brand: {item.brand}</p>
            <p className="text-gray-600 mb-1">Type: {item.itemType}</p>
            <p className="text-gray-600 mb-1">Category: {item.category || 'N/A'}</p>
            <p className="text-gray-800 font-bold mb-2">₹ {item.price}</p>
            <p className={`mb-2 ${item.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>
              Status: {item.status}
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableFoodItems;
