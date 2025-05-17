import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import "./petRegister.css";

const PetRegistrationForm = () => {
  const [useDOB, setUseDOB] = useState(true);
  const [dob, setDob] = useState("");
  const [age, setAge] = useState({ years: "", months: "", days: "" });
  const [calculatedDOB, setCalculatedDOB] = useState("");
  const [calculatedAge, setCalculatedAge] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [qrCodeData, setQrCodeData] = useState("");
  const qrCodeRef = useRef();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    petType: "",
    petId: "",
    name: "",
    breed: "",
    donorID: "",
    donorName: "",
    donatedDate: dayjs().format("YYYY-MM-DD"),
    healthStatus: "UnderTreatment",
    status: "InCareCenter",
    image: null,
  });

  const generatePetId = (petType) => {
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`.slice(-5);

    const prefix = petType === "Dog" ? "DOG" : petType === "Cat" ? "CAT" : "PET";
    return `${prefix}${timestamp}`;
  };

  useEffect(() => {
    if (formData.petType) {
      const newPetId = generatePetId(formData.petType);
      setFormData((prev) => ({ ...prev, petId: newPetId }));
    }
  }, [formData.petType]);

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

  useEffect(() => {
    if (formData.petId) {
      const timer = setTimeout(() => {
        const svg = qrCodeRef.current?.querySelector("svg");
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const base64 = window.btoa(svgData);
          setQrCodeData(`data:image/svg+xml;base64,${base64}`);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData.petId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAgeChange = (e) => {
    setAge({ ...age, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.petType || !formData.name || !formData.breed || !formData.donorID || !formData.donorName) {
      setError("Please fill all required fields.");
      return;
    }

    // Remove base64 headers
    const trimmedQr = qrCodeData?.replace(/^data:image\/[^;]+;base64,/, "");
    const trimmedImage = formData.image?.replace(/^data:image\/[^;]+;base64,/, "");

    const fullData = {
      petType: formData.petType,
      dogID: formData.petType === "Dog" ? formData.petId : undefined,
      catID: formData.petType === "Cat" ? formData.petId : undefined,
      name: formData.name,
      breed: formData.breed,
      dob: useDOB ? dob : calculatedDOB,
      age: useDOB
        ? {
            years: age.years,
            months: age.months,
            days: age.days,
          }
        : {
            years: age.years,
            months: age.months,
            days: age.days,
          },
      donorId: formData.donorID,
      donorName: formData.donorName,
      donatedDate: formData.donatedDate,
      healthStatus: formData.healthStatus,
      status: formData.status,
      qrCode: trimmedQr,
      image: trimmedImage,
    };

    try {
      const response = await fetch("http://localhost:5000/api/pets/petRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
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

  const getFormTitle = () => {
    return formData.petType === "Dog"
      ? "Dog Registration"
      : formData.petType === "Cat"
      ? "Cat Registration"
      : "Pet Registration";
  };

  return (
    <div className="register-background">
      <div className="register-container">
        <h2>{getFormTitle()}</h2>
        <form onSubmit={handleSubmit} className="form-container">
          {error && <div className="error-message">{error}</div>}

          <div className="type-selection">
            <button type="button" className="type-button" onClick={() => setFormData((prev) => ({ ...prev, petType: "Dog" }))}>Dog</button>
            <button type="button" className="type-button" onClick={() => setFormData((prev) => ({ ...prev, petType: "Cat" }))}>Cat</button>
          </div>

          <div className="form-group" align="center">
            <label>Pet ID: {formData.petId}</label>
          </div>

          <div className="grid-container">
            <input name="name" placeholder="Name" onChange={handleChange} className="input" required />
            <input name="breed" placeholder="Breed" onChange={handleChange} className="input" required />
          </div>

          <label className="label">Choose to input:</label>
          <div className="radio-group">
            <label>
              <input type="radio" checked={useDOB} onChange={() => setUseDOB(true)} /> Birthday
            </label>
            <label>
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
            <div className="age-inputs">
              <input name="years" placeholder="Years" type="number" value={age.years} onChange={handleAgeChange} className="input" required />
              <input name="months" placeholder="Months" type="number" value={age.months} onChange={handleAgeChange} className="input" required />
              <input name="days" placeholder="Days" type="number" value={age.days} onChange={handleAgeChange} className="input" required />
              {calculatedDOB && <p className="text-sm">DOB: {calculatedDOB}</p>}
            </div>
          )}

          <div className="grid-container">
            <input name="donorID" placeholder="Donor ID" onChange={handleChange} className="input" required />
            <input name="donorName" placeholder="Donor Name" onChange={handleChange} className="input" required />
          </div>

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

          <div className="form-group">
            <label className="label">Health Status:</label>
            <select name="healthStatus" value={formData.healthStatus} onChange={handleChange} className="select">
              <option value="Normal">Normal</option>
              <option value="UnderTreatment">Under Treatments</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Status:</label>
            <select name="status" value={formData.status} onChange={handleChange} className="select">
              <option value="InCareCenter">In Care Center</option>
              <option value="ReadytoSell">Ready to Sell</option>
              <option value="Auctioned">Auctioned</option>
              <option value="Reserved">Reserved</option>
              <option value="Adopted">Adopted</option>
              <option value="Dead">Dead</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input type="file" name="image" accept="image/*" onChange={handleChangeImage} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="preview-img" />}
          </div>

          <div className="form-group" ref={qrCodeRef}>
            {formData.petId && <QRCode value={formData.petId} size={150} />}
          </div>

          <button type="submit" className="submit-btn">Register Pet</button>
        </form>
      </div>
    </div>
  );
};

export default PetRegistrationForm;
