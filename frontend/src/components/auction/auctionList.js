import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './auctionList.css'; // Make sure to create/import your CSS file

const AuctionListWithTimer = () => {
  const [auctions, setAuctions] = useState([]);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get('/api/auctions'); // Replace with your API endpoint
      const auctionsData = response.data;
      setAuctions(auctionsData);
      initializeTimers(auctionsData);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const initializeTimers = (data) => {
    const updatedTimers = {};
    data.forEach((auction) => {
      updatedTimers[auction._id] = calculateTimeLeft(auction.endTime);
    });
    setTimers(updatedTimers);
  };

  const calculateTimeLeft = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return 'Ended';

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours.toString().padStart(2, '0')}h:${minutes
      .toString()
      .padStart(2, '0')}m:${seconds.toString().padStart(2, '0')}s`;
  };

  const updateTimers = () => {
    const newTimers = { ...timers };
    auctions.forEach((auction) => {
      newTimers[auction._id] = calculateTimeLeft(auction.endTime);
    });
    setTimers(newTimers);
  };

  return (
    <div className="auction-list-container">
      <h2 className="auction-list-header">Live Pet Auctions</h2>
      <table className="auction-table">
        <thead>
          <tr>
            <th>Pet Name</th>
            <th>Starting Price</th>
            <th>Current Bid</th>
            <th>Ends In</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction) => (
            <tr key={auction._id}>
              <td>{auction.pet?.name || 'Unnamed'}</td>
              <td>${auction.startingPrice}</td>
              <td>${auction.currentBid}</td>
              <td>{timers[auction._id] || 'Loading...'}</td>
              <td>
                <a
                  href={`/auction/bid/${auction._id}`}
                  className="bid-button"
                >
                  Place Bid
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionListWithTimer;
