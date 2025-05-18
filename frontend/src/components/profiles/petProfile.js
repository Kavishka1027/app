import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../navigation/adminNav";
import "./petProfile.css";

const PetProfile = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/pets/${id}`);
        if (response.data && (response.data.pet || response.data.Pet)) {
          setPet(response.data.pet || response.data.Pet);
        } else {
          setError("Pet information not found");
        }
      } catch (err) {
        console.error("Error fetching pet details:", err);
        setError("Failed to fetch pet details");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  const handleGoBack = () => {
    if (pet?.petType === "Dog") {
      navigate("/dogs");
    } else if (pet?.petType === "Cat") {
      navigate("/cats");
    } else {
      navigate(-1);
    }
  };

  const getImageSrc = (pet) => {
    if (!pet?.image) return 'https://via.placeholder.com/300?text=No+Image';

    if (pet.image.startsWith('data:image/')) {
      return pet.image;
    }

    if (/^[A-Za-z0-9+/=]+$/.test(pet.image)) {
      return `data:image/png;base64,${pet.image}`;
    }

    if (pet.image.startsWith('http')) {
      return pet.image;
    }

    return 'https://via.placeholder.com/300?text=No+Image';
  };

  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString))) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgeDisplay = (pet) => {
    if (pet.age) {
      const { years, months, days } = pet.age;
      const parts = [];
      if (years) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
      if (months) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
      if (days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
      return parts.join(', ');
    }

    if (pet.dob) {
      const dob = new Date(pet.dob);
      const now = new Date();
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      if (months < 0) {
        years--;
        months += 12;
      }
      return `${years} years, ${months} months`;
    }

    return "Age information not available";
  };

  const downloadQRCode = () => {
    if (!pet?.qrCode) return;

    const isBase64 = /^[A-Za-z0-9+/=]+$/.test(pet.qrCode);
    const href = isBase64
      ? `data:image/svg+xml;base64,${pet.qrCode}`
      : pet.qrCode;

    const link = document.createElement('a');
    link.href = href;
    link.download = `${pet.name || "Pet"}_QRCode.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="loading-container">Loading pet information...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="error-container">
        <h2>Pet Not Found</h2>
        <p>The requested pet information could not be found.</p>
        <button className="back-button" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pet-profile-container">
      <Navigation />

      <div className="pet-profile-header">
        <button className="back-button" onClick={handleGoBack}>
          &larr; Back to List
        </button>
        <h1>{pet.name || "Unnamed Pet"}'s Profile</h1>
      </div>

      <div className="pet-profile-content">
        <div className="pet-image-container">
          <img
            src={getImageSrc(pet)}
            alt={pet.name}
            className="pet-profile-image"
          />
          <div className="pet-id">{pet.petType === "Dog" ? pet.dogID : pet.catID}</div>
        </div>

        <div className="pet-details">
          <div className="pet-detail-section">
            <h2>Basic Information</h2>
            <div className="pet-detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{pet.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value">{pet.petType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Breed:</span>
                <span className="detail-value">{pet.breed || "Not specified"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{getAgeDisplay(pet)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">{formatDate(pet.dob)}</span>
              </div>
            </div>
          </div>

          <div className="pet-detail-section">
            <h2>Status Information</h2>
            <div className="pet-detail-grid">
              <div className="detail-item">
                <span className="detail-label">Health Status:</span>
                <span className={`detail-value status-${pet.healthStatus?.toLowerCase() || 'unknown'}`}>
                  {pet.healthStatus || "Not specified"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Status:</span>
                <span className={`detail-value status-${pet.status?.toLowerCase() || 'unknown'}`}>
                  {pet.status || "Unknown"}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Donated By:</span>
                <span className="detail-value">{pet.donorName || "Unknown"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Donor ID:</span>
                <span className="detail-value">{pet.donorId || "Not available"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Donation Date:</span>
                <span className="detail-value">{formatDate(pet.donatedDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {pet.qrCode && (
        <div className="pet-qr-section">
          <div className="pet-qr-header">
            <h2>QR Code</h2>
            <button
              className="download-qr-button"
              onClick={downloadQRCode}
              title="Download QR Code"
            >
              Download QR
            </button>
          </div>
          <div className="pet-qr-container">
            <img
              src={`data:image/svg+xml;base64,${pet.qrCode}`}
              alt="Pet QR Code"
              className="pet-qr-code"
            />
            <p>Scan this QR code for quick access to {pet.name}'s information</p>
          </div>
        </div>
      )}

      <div className="pet-actions">
        <button className="edit-button">Edit Information</button>
        {pet.status === "InCareCenter" && pet.healthStatus === "Normal" && (
          <button className="sell-button">Mark as Ready to Sell</button>
        )}
        {pet.healthStatus === "UnderTreatment" && (
          <button className="treatment-button">View Treatment Records</button>
        )}
      </div>
    </div>
  );
};

export default PetProfile;
