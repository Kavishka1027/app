import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CreateItem from './createItem'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

function ViewAllItem() {
  const [items, setItems] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/sellItem')
      .then(res => {
        setItems(res.data.sellItems)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4">🛒 All Items</h2>
      <button
        type="button"
        className="btn btn-success mb-3"
        data-bs-toggle="modal"
        data-bs-target="#addItemModal"
      >
        ➕ Add Sell Item
      </button>

      <div className="table-responsive shadow-lg rounded">
        <table className="table table-bordered table-dark table-hover">
          <thead className="bg-secondary">
            <tr>
              <th className="text-light">ID</th>
              <th className="text-light">Name</th>
              <th className="text-light">Price</th>
              <th className="text-light">Brand</th>
              <th className="text-light">Quantity</th>
              <th className="text-light">Status</th>
              <th className="text-light">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map(item => (
                <tr key={item.itemId}>
                  <td>{item.itemId}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.brand}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <span className={`badge ${item.status === 'available' ? 'bg-success' : 'bg-danger'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm">Edit</button>
                    <button className="btn btn-danger btn-sm ms-2">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="addItemModal" tabIndex="-1" aria-labelledby="addItemModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addItemModalLabel">Add Sell Item</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <CreateItem />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ViewAllItem
