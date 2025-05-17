import React, { useState } from 'react';

export default function CreateAuction() {
  const [petId, setPetId] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auctions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ petId, startingPrice, durationDays }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={petId} onChange={e => setPetId(e.target.value)} placeholder="Pet Object ID" required />
      <input type="number" value={startingPrice} onChange={e => setStartingPrice(e.target.value)} placeholder="Starting Price" required />
      <input type="number" value={durationDays} onChange={e => setDurationDays(e.target.value)} placeholder="Duration (days)" required />
      <button type="submit">Create Auction</button>
      {message && <p>{message}</p>}
    </form>
  );
}
