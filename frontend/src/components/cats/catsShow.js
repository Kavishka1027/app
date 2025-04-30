import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../navigation/adminNav";
import "./catsShow.css";

const CatTable = () => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/pets/cats")
      .then((response) => {
        setCats(response.data.cats || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this cat?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/pets/${id}`);
      setCats(cats.filter((cat) => cat._id !== id));
    } catch (err) {
      alert("Error deleting cat.");
    }
  };

  const filteredCats = cats.filter((cat) =>
    `${cat.name} ${cat.breed} ${cat.gender} ${cat.type}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="cat-container">
      <AdminNav />
      <div className="cat-card">
        <h2 className="cat-title">Cat List</h2>

        <input
          type="text"
          placeholder="Search cats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="cat-search"
        />

        <div className="cat-table-wrapper">
          <table className="cat-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Breed</th>
                <th>Gender</th>
                <th>DOB</th>
                <th>Age</th>
                <th>Cat ID</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCats.length > 0 ? (
                filteredCats.map((cat) => (
                  <tr key={cat._id}>
                    <td>{cat.name}</td>
                    <td>{cat.breed || "N/A"}</td>
                    <td>{cat.gender}</td>
                    <td>{new Date(cat.dob).toLocaleDateString()}</td>
                    <td>{cat.age}</td>
                    <td>{cat.CatID || "N/A"}</td>
                    <td>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="cat-avatar"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(cat._id)}
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
                    No catss found.
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

export default CatTable;
