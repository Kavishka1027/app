import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import "./petRegister.css";

const PetRegistrationForm = () => {
  const [type, setType] = useState("");
  const [petId, setPetId] = useState("");
  const [useDOB, setUseDOB] = useState(true);
  const [dob, setDob] = useState("");
  const [age, setAge] = useState({ years: "", months: "", days: "" });
  const [calculatedDOB, setCalculatedDOB] = useState("");
  const [calculatedAge, setCalculatedAge] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    donorID: "",
    donorName: "",
    donatedDate: dayjs().format("YYYY-MM-DD"),
    healthStatus: "normal",
    status: "in care center",
    ownerID: "",
    ownerName: "",
    image: null,
  });

  const [qrCodeData, setQrCodeData] = useState("");
  const qrCodeRef = useRef();

  useEffect(() => {
    if (type) {
      const random = Math.floor(100 + Math.random() * 900);
      setPetId(`${type}${random}`);
    }
  }, [type]);

  useEffect(() => {
    if (useDOB && dob) {
      const birth = dayjs(dob);
      const now = dayjs();
      const years = now.diff(birth, "year");
      const months = now.diff(birth.add(years, "year"), "month");
      const days = now.diff(birth.add(years, "year").add(months, "month"), "day");
      setAge({ years, months, days });
      setCalculatedAge(`${years}y-${months}m-${days}d`);
    }
  }, [dob, useDOB]);

  useEffect(() => {
    if (!useDOB && age.years !== "" && age.months !== "" && age.days !== "") {
      const now = dayjs();
      const birth = now
        .subtract(age.years, "year")
        .subtract(age.months, "month")
        .subtract(age.days, "day");
      setCalculatedDOB(birth.format("YYYY-MM-DD"));
    }
  }, [age, useDOB]);

  // Automatically generate QR code when petId is set
  useEffect(() => {
    if (petId) {
      const timer = setTimeout(() => {
        const canvas = qrCodeRef.current?.querySelector("canvas");
        if (canvas) {
          const base64QR = canvas.toDataURL("image/png");
          setQrCodeData(base64QR);
        }
      }, 500); // Wait a bit to ensure QR is rendered
      return () => clearTimeout(timer);
    }
  }, [petId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAgeChange = (e) => {
    setAge({ ...age, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullData = {
      ...formData,
      type,
      petId,
      dob: useDOB ? dob : calculatedDOB,
      age: useDOB ? calculatedAge : `${age.years}y-${age.months}m-${age.days}d`,
    };

    const payload = new FormData();
    Object.keys(fullData).forEach((key) => {
      if (fullData[key]) payload.append(key, fullData[key]);
    });

    if (qrCodeData) payload.append("qrCodeData", qrCodeData);

    try {
      const response = await fetch("http://localhost:5000/api/pets/petRegister", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Pet Registered Successfully!");
      } else {
        alert("Registration failed: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while registering the pet.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Register Pet</h2>

      {/* Pet Type */}
      <div className="radio-group">
        <label className="label">Pet Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="select" required>
          <option value="">Choose Pet Type</option>
          <option value="DOG">Dog</option>
          <option value="CAT">Cat</option>
        </select>
      </div>

      <div>
        <label className="label">Pet ID:</label>
        <input type="text" value={petId} readOnly className="input" />
      </div>

      <div className="grid-container">
        <input name="name" placeholder="Name" onChange={handleChange} className="input" required />
        <input name="breed" placeholder="Breed" onChange={handleChange} className="input" required />
      </div>

      {/* DOB or Age */}
      <div>
        <label className="label">Choose to input:</label>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" checked={useDOB} onChange={() => setUseDOB(true)} /> DOB
          </label>
          <label className="radio-label">
            <input type="radio" checked={!useDOB} onChange={() => setUseDOB(false)} /> Age
          </label>
        </div>

        {useDOB ? (
          <div>
            <label className="label">DOB:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="input"
              required
            />
            {calculatedAge && <p className="text-sm">Age: {calculatedAge}</p>}
          </div>
        ) : (
          <div className="grid-container">
            <input name="years" placeholder="Years" type="number" value={age.years} onChange={handleAgeChange} className="input" required />
            <input name="months" placeholder="Months" type="number" value={age.months} onChange={handleAgeChange} className="input" required />
            <input name="days" placeholder="Days" type="number" value={age.days} onChange={handleAgeChange} className="input" required />
            {calculatedDOB && <p className="text-sm">DOB: {calculatedDOB}</p>}
          </div>
        )}
      </div>

      {/* Donor Info */}
      <div className="grid-container">
        <input name="donorID" placeholder="Donor ID" onChange={handleChange} className="input" required />
        <input name="donorName" placeholder="Donor Name" onChange={handleChange} className="input" required />
      </div>

      {/* Donated Date */}
      <div>
        <label className="label">Donated Date:</label>
        <input
          type="date"
          name="donatedDate"
          value={formData.donatedDate}
          onChange={handleChange}
          className="input"
          required
        />
      </div>

      {/* Health and Status */}
      <div className="grid-container">
        <select name="healthStatus" onChange={handleChange} className="select">
          <option value="normal">Normal</option>
          <option value="under treatments">Under Treatments</option>
        </select>
        <select name="status" onChange={handleChange} className="select">
          <option value="in care center">In Care Center</option>
          <option value="ready to sell">Ready to Sell</option>
          <option value="Auctioned">Auctioned</option>
          <option value="reserved">Reserved</option>
          <option value="adopted">Adopted</option>
          <option value="Dead">Dead</option>
        </select>
      </div>

      {/* Owner Info */}
      <div className="grid-container">
        <input name="ownerID" placeholder="Owner ID" onChange={handleChange} className="input" />
        <input name="ownerName" placeholder="Owner Name" onChange={handleChange} className="input" />
      </div>

      {/* Image Upload */}
      <div>
        <label className="label">Upload Image:</label>
        <input type="file" onChange={handleImageUpload} className="file-input" />
      </div>

      {/* QR Code */}
      <div className="qr-code-container">
        <label className="label">QR Code:</label>
        <div ref={qrCodeRef}>
          <QRCode value={petId || "sample"} size={128} />
        </div>
      </div>

      <button type="submit" className="submit-btn">Register Pet</button>
    </form>
  );
};

export default PetRegistrationForm;
