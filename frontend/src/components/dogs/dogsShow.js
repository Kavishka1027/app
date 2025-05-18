import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dogsShow.css";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/adminNav";

const DogShow = () => {
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [healthStatusFilter, setHealthStatusFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSellingMode, setIsSellingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogs = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/pets");
        if (response.data && response.data.pets) {
          const onlyDogs = response.data.pets.filter(pet => pet.petType === "Dog");
          setDogs(onlyDogs);
          setFilteredDogs(onlyDogs);
        } else if (response.data && response.data.Pets) {
          // Handle the alternative response structure
          const onlyDogs = response.data.Pets.filter(pet => pet.petType === "Dog");
          setDogs(onlyDogs);
          setFilteredDogs(onlyDogs);
        } else {
          console.error("Unexpected API response structure:", response.data);
          setError("Failed to retrieve dog data from the server");
        }
      } catch (error) {
        console.error("Error fetching dogs:", error);
        setError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();

    let results = dogs;

    // Apply health status filter (if not "All")
    if (healthStatusFilter !== "All") {
      results = results.filter(
        (dog) => dog.healthStatus === healthStatusFilter
      );
    }

    // Apply status filter (if not "All")
    if (statusFilter !== "All") {
      results = results.filter((dog) => dog.status === statusFilter);
    }

    // Apply search term filter
    if (searchTerm.trim()) {
      results = results.filter(
        (dog) =>
          dog.name?.toLowerCase().includes(lowerSearch) ||
          dog.dogID?.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredDogs(results);
  }, [searchTerm, dogs, healthStatusFilter, statusFilter]);

  const handleDogClick = (id) => {
    // Navigate to the pet details page
    navigate(`/petProfile/${id}`);
  };

  const handleChooseToSell = () => {
    const filtered = dogs.filter(
      (dog) => dog.healthStatus === "Normal" && dog.status === "InCareCenter"
    );
    setFilteredDogs(filtered);
    setHealthStatusFilter("All");
    setStatusFilter("All");
    setSearchTerm("");
    setIsSellingMode(true); // Enable the selling mode
  };

  const handleRelease = () => {
    setFilteredDogs(dogs);
    setHealthStatusFilter("All");
    setStatusFilter("All");
    setSearchTerm("");
    setIsSellingMode(false); // Disable the selling mode
  };

  const handleSellDog = async (dogId, e) => {
    // Prevent the event from bubbling up to the card click handler
    e.stopPropagation();
    
    try {
      // Add dog to the e-commerce platform (adjust API endpoint as needed)
      const response = await axios.post("http://localhost:5000/api/addDog", {
        dogId,
      });

      if (response.status === 200) {
        console.log("Dog successfully added to e-commerce");
        // Update the dog's status to "Ready to Sell"
        const updatedDogs = dogs.map((dog) =>
          dog._id === dogId ? { ...dog, status: "ReadytoSell" } : dog
        );
        setDogs(updatedDogs);
        setFilteredDogs(updatedDogs.filter(dog => 
          dog.healthStatus === "Normal" && 
          (dog.status === "InCareCenter" || dog.status === "ReadytoSell")
        ));
      }
    } catch (error) {
      console.error("Error adding dog to e-commerce:", error);
    }
  };

  const viewDogDetails = (dogId, e) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/petProfile/${dogId}`);
  };

  if (isLoading) {
    return <div className="loading-message">Loading dogs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const getImageSrc = (dog) => {
    // Check if the image is a base64 string (starts with data:image or with /)
    if (dog.image && (dog.image.startsWith('data:image') || dog.image.startsWith('/'))) {
      return dog.image;
    }
    
    // Check if there's an imageUrl field
    if (dog.imageUrl) {
      return dog.imageUrl;
    }
    
    // Return a default image if none available
    return 'https://via.placeholder.com/150?text=No+Image';
  };

  return (
    <div className="dog-grid-wrapper">
      <Navigation />
      <h2 className="dog-grid-title">Dogs List</h2>

      <input
        type="text"
        placeholder="Search by name or dog ID..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="controls">
        <button className="sell-button" onClick={handleChooseToSell}>
          Choose to Sell
        </button>
        <button className="release-button" onClick={handleRelease}>
          Cancel
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Health Status</label>
          <select
            className="filter-dropdown"
            value={healthStatusFilter}
            onChange={(e) => setHealthStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Normal">Normal</option>
            <option value="UnderTreatment">Under Treatment</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            className="filter-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="InCareCenter">In Care Center</option>
            <option value="ReadytoSell">Ready to Sell</option>
            <option value="Auctioned">Auctioned</option>
            <option value="Reserved">Reserved</option>
            <option value="Adopted">Adopted</option>
            <option value="Dead">Dead</option>
          </select>
        </div>
      </div>

      {filteredDogs.length === 0 ? (
        <div className="no-dogs-message">
          No dogs found matching the current filters.
        </div>
      ) : (
        <div className="dog-grid-container">
          {filteredDogs.map((dog) => (
            <div
              key={dog._id}
              className="dog-card"
              onClick={() => handleDogClick(dog._id)}
            >
              <img src={getImageSrc(dog)} alt={dog.name} className="dog-image" />
              <div className="dog-info">
                <h3>{dog.name}</h3>
                <p>{dog.dogID}</p>
                <p>Health Status: {dog.healthStatus}</p>
                <p>Status: {dog.status}</p>
                <p>Breed: {dog.breed}</p>
                
                <div className="dog-card-actions">
                  {isSellingMode && dog.status === "InCareCenter" && dog.healthStatus === "Normal" && (
                    <button
                      className="sell-button"
                      onClick={(e) => handleSellDog(dog._id, e)}
                    >
                      Sell
                    </button>
                  )}
                  
                  <button 
                    className="view-details-button"
                    onClick={(e) => viewDogDetails(dog._id, e)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DogShow;