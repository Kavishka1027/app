import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../navigation/adminNav";
import "./veterinariansShow.css"; 

const VeterinarianTable = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/veterinarians") 
      .then((response) => {
        setVeterinarians(response.data.veterinarians || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this veterinarian?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setVeterinarians(veterinarians.filter((vet) => vet.id !== id));
    } catch (err) {
      alert("Error deleting veterinarian.");
    }
  };

  const filteredVets = veterinarians.filter((vet) =>
    `${vet.firstname} ${vet.lastname} ${vet.email} ${vet.AId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="customer-container">
      <AdminNav />
      <div className="customer-card">
        <h2 className="customer-title">Veterinarian List</h2>

        <input
          type="text"
          placeholder="Search veterinarians..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="customer-search"
        />

        <div className="customer-table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>VeterinarianID</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVets.length > 0 ? (
                filteredVets.map((vet) => (
                  <tr key={vet.AId}>
                    <td>{vet.AId}</td>
                    <td>{vet.firstname}</td>
                    <td>{vet.lastname}</td>
                    <td>{vet.gender}</td>
                    <td>{vet.email}</td>
                    <td>{vet.phone || "N/A"}</td>
                    <td>{vet.address}</td>
                    <td>{vet.VetID || "N/A"}</td>
                    <td>
                      {vet.image ? (
                        <img
                          src={vet.image}
                          alt={vet.firstname}
                          className="customer-avatar"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(vet._id)}
                        className="btn delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    No veterinarians found.
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

export default VeterinarianTable;
