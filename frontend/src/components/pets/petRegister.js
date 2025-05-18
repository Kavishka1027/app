import React, { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import dayjs from "dayjs";
import "./petRegister.css";
import axios from "axios";

const PetRegistrationForm = () => {
  const [useDOB, setUseDOB] = useState(true);
  const [dob, setDob] = useState("");
  const [age, setAge] = useState({ years: "", months: "", days: "" });
  const [calculatedDOB, setCalculatedDOB] = useState("");
  const [calculatedAge, setCalculatedAge] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [qrCodeData, setQrCodeData] = useState("");
  const [rewards, setRewards] = useState(0);
  const qrCodeRef = useRef();
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState([]);

  const [formData, setFormData] = useState({
    petType: "",
    petId: "",
    name: "",
    breed: "",
    gender: "",
    donorID: "",
    donorName: "",
    donatedDate: dayjs().format("YYYY-MM-DD"),
    healthStatus: "UnderTreatment",
    status: "InCareCenter",
    image: null,
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/customers"
        );
        setCustomers(res.data.customers);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

    const prefix =
      petType === "Dog" ? "DOG" : petType === "Cat" ? "CAT" : "PET";
    return `${prefix}${timestamp}`;
  };

  // Calculate rewards based on pet type and total days
  const calculateRewards = (totalDays, petType) => {
    if (petType === "Dog") {
      if (totalDays < 365) return 4; // Less than 1 year
      if (totalDays >= 365 && totalDays < 2555) return 3; // 1-7 years (365*7=2555)
      return 2; // 7+ years
    } else if (petType === "Cat") {
      if (totalDays < 365) return 3; // Less than 1 year
      if (totalDays >= 365 && totalDays < 3650) return 2; // 1-10 years (365*10=3650)
      return 1; // 10+ years
    }
    return 0;
  };

  // Calculate total days from years, months, days
  const calculateTotalDays = (years, months, days) => {
    return years * 365 + months * 30 + parseInt(days);
  };

  const handleAgeChange = (e) => {
    const { name, value } = e.target;
    // Validate that the input is a positive number
    if (
      value === "" ||
      (Number(value) >= 0 && Number.isInteger(Number(value)))
    ) {
      setAge((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = dayjs().format("YYYY-MM-DD");

    if (selectedDate <= today) {
      setDob(selectedDate);
      setError("");
    } else {
      setError("Date of birth cannot be in the future");
    }
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
      const days = now.diff(
        birth.add(years, "year").add(months, "month"),
        "day"
      );

      setAge({ years, months, days });
      setCalculatedAge(`${years}y-${months}m-${days}d`);

      // Calculate total days and then rewards
      const totalDays = calculateTotalDays(years, months, days);
      setRewards(calculateRewards(totalDays, formData.petType));
    }
  }, [dob, useDOB, formData.petType]);

  useEffect(() => {
    if (!useDOB && age.years !== "" && age.months !== "" && age.days !== "") {
      const now = dayjs();
      const birth = now
        .subtract(age.years, "year")
        .subtract(age.months, "month")
        .subtract(age.days, "day");
      setCalculatedDOB(birth.format("YYYY-MM-DD"));

      // Calculate total days and then rewards
      const totalDays = calculateTotalDays(
        parseInt(age.years),
        parseInt(age.months),
        parseInt(age.days)
      );
      setRewards(calculateRewards(totalDays, formData.petType));
    }
  }, [age, useDOB, formData.petType]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.petType ||
      !formData.name ||
      !formData.breed ||
      !formData.donorID ||
      !formData.gender
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (useDOB && dob > dayjs().format("YYYY-MM-DD")) {
      setError("Date of birth cannot be in the future");
      return;
    }

    if (!useDOB && (age.years === "" || age.months === "" || age.days === "")) {
      setError("Please enter valid age values");
      return;
    }

    // Remove base64 headers
    const trimmedQr = qrCodeData?.replace(/^data:image\/[^;]+;base64,/, "");
    const trimmedImage = formData.image?.replace(
      /^data:image\/[^;]+;base64,/,
      ""
    );

    const fullData = {
      petType: formData.petType,
      dogID: formData.petType === "Dog" ? formData.petId : undefined,
      catID: formData.petType === "Cat" ? formData.petId : undefined,
      name: formData.name,
      breed: formData.breed,
      gender: formData.gender,
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
      rewards: rewards,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/pets/petRegister",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fullData),
        }
      );

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
            <button
              type="button"
              className="type-button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, petType: "Dog" }))
              }
            >
              Dog
            </button>
            <button
              type="button"
              className="type-button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, petType: "Cat" }))
              }
            >
              Cat
            </button>
          </div>

          <div className="form-group" align="center">
            <label>Pet ID: {formData.petId}</label>
          </div>

          <div className="grid-container">
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              className="input"
              required
            />
            <input
              name="breed"
              placeholder="Breed"
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <label className="label">Choose to input:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                checked={useDOB}
                onChange={() => setUseDOB(true)}
              />{" "}
              Birthday
            </label>
            <label>
              <input
                type="radio"
                checked={!useDOB}
                onChange={() => setUseDOB(false)}
              />{" "}
              Age
            </label>
          </div>

          {useDOB ? (
            <div>
              <label className="label">DOB:</label>
              <input
                type="date"
                value={dob}
                onChange={handleDateChange}
                className="input"
                max={dayjs().format("YYYY-MM-DD")}
                required
              />
              {calculatedAge && <p className="text-sm">Age: {calculatedAge}</p>}
            </div>
          ) : (
            <div className="age-inputs">
              <input
                name="years"
                placeholder="Years"
                type="number"
                min="0"
                value={age.years}
                onChange={handleAgeChange}
                className="input"
                required
              />
              <input
                name="months"
                placeholder="Months"
                type="number"
                min="0"
                max="11"
                value={age.months}
                onChange={handleAgeChange}
                className="input"
                required
              />
              <input
                name="days"
                placeholder="Days"
                type="number"
                min="0"
                max="30"
                value={age.days}
                onChange={handleAgeChange}
                className="input"
                required
              />
              {calculatedDOB && <p className="text-sm">DOB: {calculatedDOB}</p>}
            </div>
          )}

          <div className="form-group">
            <label className="label">Rewards: {rewards}</label>
          </div>

          <div className="grid-container">
            <select
              name="donorID"
              value={formData.donorID}
              onChange={(e) => {
                const selectedCustomer = customers.find(
                  (c) => c._id === e.target.value
                );
                handleChange(e); // Update donorID
                // Update donorName with the selected customer's full name
                setFormData((prev) => ({
                  ...prev,
                  donorName: selectedCustomer
                    ? `${selectedCustomer.firstname} ${selectedCustomer.lastname}`
                    : "",
                }));
              }}
              className="input"
              required
            >
              <option value="">Select Donor ID</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer._id}>
                  {customer.firstname} {customer.lastname} (
                  {customer.CustomerID})
                </option>
              ))}
            </select>
            <input
              name="donorName"
              placeholder="Donor Name"
              value={formData.donorName}
              onChange={handleChange}
              className="input"
              required
              readOnly
            />
          </div>

          <div>
            <label className="label">Donated Date:</label>
            <input
              type="date"
              name="donatedDate"
              value={formData.donatedDate}
              onChange={handleChange}
              className="input"
              max={dayjs().format("YYYY-MM-DD")}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Health Status:</label>
            <select
              name="healthStatus"
              value={formData.healthStatus}
              onChange={handleChange}
              className="select"
            >
              <option value="Normal">Normal</option>
              <option value="UnderTreatment">Under Treatments</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select"
            >
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
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChangeImage}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="preview-img" />
            )}
          </div>

          <div className="form-group" ref={qrCodeRef}>
            {formData.petId && <QRCode value={formData.petId} size={150} />}
          </div>

          <button type="submit" className="submit-btn">
            Register Pet
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetRegistrationForm;
