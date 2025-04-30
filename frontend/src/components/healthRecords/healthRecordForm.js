import React, { useState } from "react";
import axios from "axios";
import "./healthRecordForm.css";

const HealthRecordForm = () => {
  const [petId, setPetId] = useState("");
  const [petType, setPetType] = useState("dog");
  const [treatments, setTreatments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [checkups, setCheckups] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/health-record", {
        petId,
        petType,
        treatments,
        vaccinations,
        checkups,
        recommendedCheckupCount: checkups.length,
        completedCheckupCount: checkups.filter(c => c.status === 'Completed').length,
        failedCheckupCount: checkups.filter(c => c.status === 'Failed').length,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error adding health record");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTreatment = () => {
    setTreatments([...treatments, { description: "", treatedDate: "", veterinarian: "", vetName: "" }]);
  };

  const handleAddVaccination = () => {
    setVaccinations([...vaccinations, { vaccineName: "", vaccinatedDate: "", nextVaccinationDate: "", veterinarian: "", vetName: "" }]);
  };

  const handleAddCheckup = () => {
    setCheckups([...checkups, { description: "", scheduledDate: "", status: "Pending", completedDate: "", veterinarian: "", vetName: "" }]);
  };

  return (
    <div className="health-record-form">
      <h2>Add Health Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Pet ID</label>
          <input
            type="text"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Pet Type</label>
          <select
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            required
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </div>

        <div className="form-group">
          <label>Treatments</label>
          {treatments.map((treatment, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Treatment Description"
                value={treatment.description}
                onChange={(e) => {
                  const newTreatments = [...treatments];
                  newTreatments[index].description = e.target.value;
                  setTreatments(newTreatments);
                }}
              />
              <input
                type="date"
                value={treatment.treatedDate}
                onChange={(e) => {
                  const newTreatments = [...treatments];
                  newTreatments[index].treatedDate = e.target.value;
                  setTreatments(newTreatments);
                }}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddTreatment}>Add Treatment</button>
        </div>

        <div className="form-group">
          <label>Vaccinations</label>
          {vaccinations.map((vaccination, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Vaccine Name"
                value={vaccination.vaccineName}
                onChange={(e) => {
                  const newVaccinations = [...vaccinations];
                  newVaccinations[index].vaccineName = e.target.value;
                  setVaccinations(newVaccinations);
                }}
              />
              <input
                type="date"
                value={vaccination.vaccinatedDate}
                onChange={(e) => {
                  const newVaccinations = [...vaccinations];
                  newVaccinations[index].vaccinatedDate = e.target.value;
                  setVaccinations(newVaccinations);
                }}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddVaccination}>Add Vaccination</button>
        </div>

        <div className="form-group">
          <label>Checkups</label>
          {checkups.map((checkup, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Checkup Description"
                value={checkup.description}
                onChange={(e) => {
                  const newCheckups = [...checkups];
                  newCheckups[index].description = e.target.value;
                  setCheckups(newCheckups);
                }}
              />
              <input
                type="date"
                value={checkup.scheduledDate}
                onChange={(e) => {
                  const newCheckups = [...checkups];
                  newCheckups[index].scheduledDate = e.target.value;
                  setCheckups(newCheckups);
                }}
              />
              <select
                value={checkup.status}
                onChange={(e) => {
                  const newCheckups = [...checkups];
                  newCheckups[index].status = e.target.value;
                  setCheckups(newCheckups);
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          ))}
          <button type="button" onClick={handleAddCheckup}>Add Checkup</button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit Health Record"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default HealthRecordForm;
