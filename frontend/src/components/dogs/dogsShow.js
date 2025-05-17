import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dogsShow.css";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/adminNav"


const DogShow = () => {
  const [dogs, setDogs] = useState([]);
  const [filteredDogs, setFilteredDogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [healthStatusFilter, setHealthStatusFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSellingMode, setIsSellingMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/pets/dogs");
        if (response.data.dogs) {
          setDogs(response.data.dogs);
          setFilteredDogs(response.data.dogs);
        }
      } catch (error) {
        console.error("Error fetching dogs:", error);
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
    navigate(`/dogs/${id}`);
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

  const handleSellDog = async (dogId) => {
    try {
      // Add dog to the e-commerce platform (adjust API endpoint as needed)
      const response = await axios.post("http://localhost:5000/api/addDog", {
        dogId,
      });

      if (response.status === 200) {
        console.log("Dog successfully added to e-commerce");
        // Optionally, update the dog's status to "Ready to Sell"
        const updatedDogs = filteredDogs.map((dog) =>
          dog._id === dogId ? { ...dog, status: "Ready to Sell" } : dog
        );
        setFilteredDogs(updatedDogs);
      }
    } catch (error) {
      console.error("Error adding dog to e-commerce:", error);
    }
  };

  return (
    <div className="dog-grid-wrapper">
      <Navigation/>
      <h2 className="dog-grid-title">Dogs List</h2>

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

      <div className="dog-grid-container">
        {filteredDogs.map((dog) => (
          <div
            key={dog._id}
            className="dog-card"
            onClick={() => handleDogClick(dog._id)}
          >
            <img src={dog.imageUrl} alt={dog.name} className="dog-image" />
            <div className="dog-info">
              <h3>{dog.name}</h3>
              <p>{dog.dogID}</p>
              <p>Health Status: {dog.healthStatus}</p>
              <p>{dog.status}</p>
              {isSellingMode && dog.status === "InCareCenter" && (
                <button
                  className="sell-button"
                  onClick={() => handleSellDog(dog._id)}
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

export default DogShow;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./dogsShow.css";
// import { useNavigate } from "react-router-dom";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";

// const DogShow = () => {
//   const [dogs, setDogs] = useState([]);
//   const [filteredDogs, setFilteredDogs] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [healthStatusFilter, setHealthStatusFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [isSellingMode, setIsSellingMode] = useState(false);
//   const navigate = useNavigate();

//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition,
//   } = useSpeechRecognition();

//   useEffect(() => {
//     const fetchDogs = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/pets/dogs");
//         if (response.data.dogs) {
//           setDogs(response.data.dogs);
//           setFilteredDogs(response.data.dogs);
//         }
//       } catch (error) {
//         console.error("Error fetching dogs:", error);
//       }
//     };

//     fetchDogs();
//   }, []);

//   useEffect(() => {
//     const lowerSearch = searchTerm.toLowerCase();

//     let results = dogs;

//     if (healthStatusFilter !== "All") {
//       results = results.filter(
//         (dog) => dog.healthStatus === healthStatusFilter
//       );
//     }

//     if (statusFilter !== "All") {
//       results = results.filter((dog) => dog.status === statusFilter);
//     }

//     if (searchTerm.trim()) {
//       results = results.filter(
//         (dog) =>
//           dog.name?.toLowerCase().includes(lowerSearch) ||
//           dog.dogID?.toLowerCase().includes(lowerSearch)
//       );
//     }

//     setFilteredDogs(results);
//   }, [searchTerm, dogs, healthStatusFilter, statusFilter]);

//   // Voice command handler
//   useEffect(() => {
//     if (!browserSupportsSpeechRecognition) {
//       console.warn("Browser does not support speech recognition.");
//       return;
//     }

//     if (transcript) {
//       const lower = transcript.toLowerCase();

//       if (lower.includes("normal health")) {
//         setHealthStatusFilter("Normal");
//       } else if (lower.includes("under treatment")) {
//         setHealthStatusFilter("Under Treatment");
//       }

//       if (lower.includes("in care center")) {
//         setStatusFilter("In Care Center");
//       } else if (lower.includes("ready to sell")) {
//         setStatusFilter("Ready to Sell");
//       } else if (lower.includes("adopted")) {
//         setStatusFilter("Adopted");
//       }

//       if (lower.startsWith("search for")) {
//         const keyword = lower.replace("search for", "").trim();
//         setSearchTerm(keyword);
//       }

//       resetTranscript(); // clear the command
//     }
//   }, [transcript]);

//   const handleDogClick = (id) => {
//     navigate(`/petProfile/${id}`);
//   };

//   const handleChooseToSell = () => {
//     const filtered = dogs.filter(
//       (dog) => dog.healthStatus === "Normal" && dog.status === "In Care Center"
//     );
//     setFilteredDogs(filtered);
//     setHealthStatusFilter("All");
//     setStatusFilter("All");
//     setSearchTerm("");
//     setIsSellingMode(true);
//   };

//   const handleRelease = () => {
//     setFilteredDogs(dogs);
//     setHealthStatusFilter("All");
//     setStatusFilter("All");
//     setSearchTerm("");
//     setIsSellingMode(false);
//   };

//   const handleSellDog = async (dogId) => {
//     try {
//       const response = await axios.post("http://localhost:5000/api/addDog", {
//         dogId,
//       });

//       if (response.status === 200) {
//         console.log("Dog successfully added to e-commerce");
//         const updatedDogs = filteredDogs.map((dog) =>
//           dog._id === dogId ? { ...dog, status: "Ready to Sell" } : dog
//         );
//         setFilteredDogs(updatedDogs);
//       }
//     } catch (error) {
//       console.error("Error adding dog to e-commerce:", error);
//     }
//   };

//   return (
//     <div className="dog-grid-wrapper">
//       <h2 className="dog-grid-title">Dogs List</h2>

//       <input
//         type="text"
//         placeholder="Search by name or type ID..."
//         className="search-input"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div className="controls">
//         <button className="sell-button" onClick={handleChooseToSell}>
//           Choose to Sell
//         </button>
//         <button className="release-button" onClick={handleRelease}>
//           Release
//         </button>
//         <button
//           className="voice-button"
//           onClick={() => SpeechRecognition.startListening({ continuous: false })}
//         >
//           🎤 Start Voice Command
//         </button>
//         {listening && <span className="listening-indicator">Listening...</span>}
//       </div>

//       <div className="filters-section">
//         <div className="filter-group">
//           <label>Health Status</label>
//           <select
//             className="filter-dropdown"
//             value={healthStatusFilter}
//             onChange={(e) => setHealthStatusFilter(e.target.value)}
//           >
//             <option value="All">All</option>
//             <option value="Normal">Normal</option>
//             <option value="Under Treatment">Under Treatment</option>
//           </select>
//         </div>

//         <div className="filter-group">
//           <label>Status</label>
//           <select
//             className="filter-dropdown"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="All">All</option>
//             <option value="In Care Center">In Care Center</option>
//             <option value="Ready to Sell">Ready to Sell</option>
//             <option value="Auctioned">Auctioned</option>
//             <option value="Reserved">Reserved</option>
//             <option value="Adopted">Adopted</option>
//             <option value="Dead">Dead</option>
//           </select>
//         </div>
//       </div>

//       <div className="dog-grid-container">
//         {filteredDogs.map((dog) => (
//           <div
//             key={dog._id}
//             className="dog-card"
//             onClick={() => handleDogClick(dog._id)}
//           >
//             <img src={dog.imageUrl} alt={dog.name} className="dog-image" />
//             <div className="dog-info">
//               <h3>{dog.name}</h3>
//               <p>{dog.dogID}</p>
//               <p>Health Status: {dog.healthStatus}</p>
//               <p>{dog.status}</p>
//               {isSellingMode && dog.status === "In Care Center" && (
//                 <button
//                   className="sell-button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleSellDog(dog._id);
//                   }}
//                 >
//                   Sell
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DogShow;

