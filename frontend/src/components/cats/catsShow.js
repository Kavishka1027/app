import React, { useEffect, useState } from "react";
import axios from "axios";
import "./catsShow.css";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/adminNav"

const CatShow = () => {
  const [cats, setCats] = useState([]);
  const [filteredCats, setFilteredCats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [healthStatusFilter, setHealthStatusFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSellingMode, setIsSellingMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pets/cats");
        if (response.data.cats) {
          setCats(response.data.cats);
          setFilteredCats(response.data.cats);
        }
      } catch (error) {
        console.error("Error fetching cats:", error);
      }
    };

    fetchCats();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    let results = cats;

    if (healthStatusFilter !== "All") {
      results = results.filter(cat => cat.healthStatus === healthStatusFilter);
    }

    if (statusFilter !== "All") {
      results = results.filter(cat => cat.status === statusFilter);
    }

    if (searchTerm.trim()) {
      results = results.filter(
        cat =>
          cat.name?.toLowerCase().includes(lowerSearch) ||
          cat.catID?.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredCats(results);
  }, [searchTerm, cats, healthStatusFilter, statusFilter]);

  const handleCatClick = (id) => {
    navigate(`/petProfile/${id}`);
  };

  const handleChooseToSell = () => {
    const filtered = cats.filter(
      (cat) => cat.healthStatus === "Normal" && cat.status === "In Care Center"
    );
    setFilteredCats(filtered);
    setHealthStatusFilter("All");
    setStatusFilter("All");
    setSearchTerm("");
    setIsSellingMode(true);
  };

  const handleRelease = () => {
    setFilteredCats(cats);
    setHealthStatusFilter("All");
    setStatusFilter("All");
    setSearchTerm("");
    setIsSellingMode(false);
  };

  const handleSellCat = async (catId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/addCat", {
        catId,
      });

      if (response.status === 200) {
        console.log("Cat successfully added to e-commerce");
        const updatedCats = filteredCats.map((cat) =>
          cat._id === catId ? { ...cat, status: "Ready to Sell" } : cat
        );
        setFilteredCats(updatedCats);
      }
    } catch (error) {
      console.error("Error adding cat to e-commerce:", error);
    }
  };

  return (
    
    <div className="cat-grid-wrapper">
      <Navigation/>
      <h2 className="cat-grid-title">Cats List</h2>

      <input
        type="text"
        placeholder="Search by name or type ID..."
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
            <option value="Under Treatment">Under Treatment</option>
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
            <option value="In Care Center">In Care Center</option>
            <option value="Ready to Sell">Ready to Sell</option>
            <option value="Auctioned">Auctioned</option>
            <option value="Reserved">Reserved</option>
            <option value="Adopted">Adopted</option>
            <option value="Dead">Dead</option>
          </select>
        </div>
      </div>

      <div className="cat-grid-container">
        {filteredCats.map((cat) => (
          <div
            key={cat._id}
            className="cat-card"
            onClick={() => handleCatClick(cat._id)}
          >
            <img src={cat.imageUrl} alt={cat.name} className="cat-image" />
            <div className="cat-info">
              <h3>{cat.name}</h3>
              <p>{cat.catID}</p>
              <p>Health Status: {cat.healthStatus}</p>
              <p>{cat.status}</p>
              {isSellingMode && cat.status === "In Care Center" && (
                <button
                  className="sell-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSellCat(cat._id);
                  }}
                >
                  Sell
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatShow;
