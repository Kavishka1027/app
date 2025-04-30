import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../navigation/adminNav";
import "./dogsShow.css";

const DogTable = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/pets/dogs")
      .then((response) => {
        setDogs(response.data.dogs || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this dog?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/pets/${id}`);
      setDogs(dogs.filter((dog) => dog._id !== id));
    } catch (err) {
      alert("Error deleting dog.");
    }
  };

  const filteredDogs = dogs.filter((dog) =>
    `${dog.name} ${dog.breed} ${dog.gender} ${dog.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="dog-container">
      <AdminNav />
      <div className="dog-card">
        <h2 className="dog-title">Dog List</h2>

        <input
          type="text"
          placeholder="Search dogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="dog-search"
        />

        <div className="dog-table-wrapper">
          <table className="dog-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Breed</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Dog ID</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDogs.length > 0 ? (
                filteredDogs.map((dog) => (
                  <tr key={dog._id}>
                    <td>{dog.name}</td>
                    <td>{dog.breed || "N/A"}</td>
                    <td>{dog.gender}</td>
                    <td>{new Date(dog.dob).toLocaleDateString()}</td>
                    <td>{dog.age}</td>
                    <td>{dog.DogID || "N/A"}</td>
                    <td>
                      {dog.image ? (
                        <img
                          src={dog.image}
                          alt={dog.name}
                          className="dog-avatar"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(dog._id)}
                        className="btn delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-data">
                    No dogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DogTable;
