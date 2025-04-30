import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import sdog from "./sdog.jpg";
import scat from "./scat.jpeg";

const Home = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const backgroundImages = [`url(${sdog})`, `url(${scat})`];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(interval);
  }); // Add empty dependency array

  return (
    <div className="pet-website">
      <div
        className="background-wallpaper"
        style={{
          backgroundImage: backgroundImages[currentBgIndex],
          transition: "background-image 6s ease-in-out",
        }}
      ></div>

      <nav className="navbar">
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.png" alt="Company Logo" className="logo-img" />
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#gallery">Gallery</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <h1>WET SNOUT Pet Caring Company</h1>

          <p>Professional pet care services with love and compassion</p>
          <div className="hero-buttons">
            <Link to="/userRegister" className="cta-button">
              Register
            </Link>
            <Link to="/login" className="cta-button">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="section-container">
          <h2 className="section-OurServices">Our Services</h2>
          <div className="service-cards">
            <div className="card">
              <div className="icon">🐾</div>
              <h3>Pet Caring</h3>
              <p>Look after Stray Dogs and cats</p>
            </div>
            <div className="card">
              <div className="icon">🏠</div>
              <h3>Adoption</h3>
              <p>Give a homeless pet a forever home— adopt today!</p>
            </div>
            <div className="card">
              <div className="icon">🩺</div>
              <h3>Veterinary Service</h3>
              <p>Expert care to keep your furry friends healthy and strong</p>
            </div>
            <div className="card">
              <div className="icon">🛒</div>
              <h3>Online Store</h3>
              <p>hop everything your pet loves — treats, toys, and more!</p>
            </div>
            <div className="card">
              <div className="icon">🥗</div>
              <h3>Diet Plans</h3>
              <p>
                Nutritious meal plans tailored for your pet’s health and
                happiness
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery" id="gallery">
        <div className="section-container">
          <h2>Our Happy Pets</h2>
          <div className="gallery-grid">
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
            <div
              className="gallery-item"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')",
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>wetsnout@petcare.com</p>
              <p>(070) 5790230</p>
            </div>
            <div className="footer-section">
              <h3>Hours</h3>
              <p>Mon-Fri: 9am-6pm</p>
              <p>Sat-Sun: 10am-4pm</p>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#facebook">Facebook</a>
                <a href="#instagram">Instegram</a>
                <a href="#twitter">Twitter</a>
              </div>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 PetCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
