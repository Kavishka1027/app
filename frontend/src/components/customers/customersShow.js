import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../navigation/adminNav";
import "./customersShow.css";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/customers")
      .then((response) => {
        setCustomers(response.data.customers || []);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this customer?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setCustomers(customers.filter((cust) => cust.id !== id));
    } catch (err) {
      alert("Error deleting customer.");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstname} ${customer.lastname} ${customer.email} ${customer.AId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="customer-container">
      <AdminNav />
      <div className="customer-card">
        <h2 className="customer-title">Customer List</h2>

        <input
          type="text"
          placeholder="Search customers..."
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
                <th>CustomerID</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.AId}>
                    <td>{customer.AId}</td>
                    <td>{customer.firstname}</td>
                    <td>{customer.lastname}</td>
                    <td>{customer.gender}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || "N/A"}</td>
                    <td>{customer.address}</td>
                    <td>{customer.CustomerID}</td>
                    <td>
                      {customer.image ? (
                        <img
                          src={customer.image}
                          alt={customer.firstname}
                          className="customer-avatar"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(customer._id)}
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
                    No customers found.
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

export default CustomerTable;
