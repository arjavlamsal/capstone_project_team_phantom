"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

// Mock Data
const propertyTypes = [
  {
    name: "Hotels",
    count: "921,833 hotels",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&auto=format",
  },
  {
    name: "Apartments",
    count: "916,105 apartments",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&auto=format",
  },
  {
    name: "Resorts",
    count: "178,391 resorts",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207def5?w=500&auto=format",
  },
  {
    name: "Villas",
    count: "516,403 villas",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format",
  },
  {
    name: "Cabins",
    count: "41,105 cabins",
    image:
      "https://images.unsplash.com/photo-1449156001427-af560f65b06d?w=500&auto=format",
  },
  {
    name: "Cottages",
    count: "14,833 cottages",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format",
  },
];

const trendingDestinations = [
  {
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format",
  },
  {
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format",
  },
  {
    name: "London",
    country: "United Kingdom",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format",
  },
  {
    name: "New York",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format",
  },
];

const homeProperties = [
  {
    name: "Aparthotel Stare Miasto",
    city: "Old Town, Poland",
    price: "€ 120",
    rating: 8.9,
    reviews: 2100,
    image:
      "https://images.unsplash.com/photo-1551882547-ff43c69e5cfd?w=400&auto=format",
  },
  {
    name: "Comfort Suites Airport",
    city: "Austin, USA",
    price: "€ 140",
    rating: 9.3,
    reviews: 1540,
    image:
      "https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=400&auto=format",
  },
  {
    name: "Four Seasons Hotel",
    city: "Lisbon, Portugal",
    price: "€ 99",
    rating: 8.8,
    reviews: 890,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&auto=format",
  },
  {
    name: "Sun & Sea Resort",
    city: "Maldives",
    price: "€ 340",
    rating: 9.9,
    reviews: 102,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&auto=format",
  },
];

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/test`);
        if (!res.ok) throw new Error("Backend health check failed");
        setBackendStatus("connected");
      } catch {
        setBackendStatus("disconnected");
      }
    };

    checkBackend();
    const intervalId = setInterval(checkBackend, 5000);

    return () => clearInterval(intervalId);
  }, [apiBaseUrl]);

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />

      {/* Header Links */}
      <header className="header-links">
        <div className="container">
          <ul className="header-links-list">
            <li className="header-links-item active">🛏 Stays</li>
            <li className="header-links-item">✈️ Flights</li>
            <li className="header-links-item">🚘 Car rentals</li>
            <li className="header-links-item">🏛 Attractions</li>
            <li className="header-links-item">🚕 Airport taxis</li>
          </ul>

          <div className="hero">
            <h1 className="hero-title">Find your next stay</h1>
            <p className="hero-subtitle">
              Search deals on hotels, homes, and much more...
            </p>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="container search-container">
        <div className="search-bar">
          <div className="search-field">
            <span>🛏</span>
            <input type="text" placeholder="Where are you going?" />
          </div>
          <div className="search-field">
            <span>📅</span>
            <input type="text" placeholder="Check-in — Check-out" />
          </div>
          <div className="search-field">
            <span>👤</span>
            <input type="text" placeholder="2 adults · 0 children · 1 room" />
          </div>
          <button className="search-btn">Search</button>
        </div>
      </div>

      <main className="container section">
        {/* Backend Status (Affixed to the bottom or integrated into the UI) */}
        <div
          style={{
            padding: "12px",
            borderRadius: "var(--border-radius-sm)",
            backgroundColor:
              backendStatus === "connected"
                ? "rgba(0, 128, 9, 0.1)"
                : backendStatus === "checking"
                  ? "rgba(0, 102, 204, 0.1)"
                  : "rgba(212, 17, 30, 0.1)",
            color:
              backendStatus === "connected"
                ? "var(--booking-success)"
                : backendStatus === "checking"
                  ? "var(--booking-blue)"
                  : "var(--booking-error)",
            marginBottom: "24px",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
            }}
          ></span>
          {backendStatus === "checking" && "Checking backend..."}
          {backendStatus === "connected" && "Backend Services Operational"}
          {backendStatus === "disconnected" &&
            `Offline: Start Flask API (${apiBaseUrl})`}
        </div>

        {/* Property Types */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Browse by property type</h2>
          </div>
          <div className="grid grid-6">
            {propertyTypes.map((type, i) => (
              <div key={i} className="card prop-type-card">
                <img
                  src={type.image}
                  alt={type.name}
                  className="prop-type-img"
                />
                <div className="card-title">{type.name}</div>
                <div className="card-subtitle">{type.count}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Destinations */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Trending destinations</h2>
            <p className="section-subtitle">
              Most popular choices for travelers from USA
            </p>
          </div>
          <div className="grid grid-3">
            {trendingDestinations.slice(0, 3).map((dest, i) => (
              <div key={i} className="dest-card">
                <img src={dest.image} alt={dest.name} className="dest-img" />
                <div className="dest-overlay">
                  <div className="dest-name">{dest.name} 🏙️</div>
                  <div>{dest.country}</div>
                </div>
              </div>
            ))}
          </div>
          <div
            className="grid grid-2"
            style={{
              marginTop: "16px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
            }}
          >
            {trendingDestinations.slice(3, 5).map((dest, i) => (
              <div key={i} className="dest-card">
                <img src={dest.image} alt={dest.name} className="dest-img" />
                <div className="dest-overlay">
                  <div className="dest-name">{dest.name} 🏙️</div>
                  <div>{dest.country}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Homes guests love */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Homes guests love</h2>
          </div>
          <div className="grid grid-4">
            {homeProperties.map((prop, i) => (
              <div
                key={i}
                className="card"
                style={{
                  animation: `fadeIn 0.5s ease forwards ${0.1 * i}s`,
                  opacity: 0,
                }}
              >
                <img src={prop.image} alt={prop.name} className="card-img" />
                <div className="card-content">
                  <div
                    className="card-title"
                    style={{ transition: "color 0.2s" }}
                  >
                    {prop.name}
                  </div>
                  <div className="card-subtitle">{prop.city}</div>
                  <div style={{ fontWeight: "700", marginTop: "4px" }}>
                    Starting from {prop.price}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "var(--booking-blue)",
                        color: "white",
                        padding: "2px 4px",
                        borderRadius: "4px 4px 4px 0",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {prop.rating}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "500" }}>
                      Exceptional
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--booking-text-secondary)",
                      }}
                    >
                      · {prop.reviews} reviews
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          className="section"
          style={{
            backgroundColor: "var(--booking-blue-dark)",
            margin: "40px -20px 0",
            padding: "60px 20px",
            textAlign: "center",
            color: "white",
            borderRadius: "var(--border-radius-md)",
          }}
        >
          <h2
            style={{ fontSize: "24px", fontWeight: "300", marginBottom: "8px" }}
          >
            Save time, save money!
          </h2>
          <p style={{ opacity: 0.7, marginBottom: "24px" }}>
            Sign up and we'll send the best deals to you
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <input
              type="text"
              placeholder="Your email address"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "var(--border-radius-sm)",
                border: "none",
                fontSize: "16px",
              }}
            />
            <button
              style={{
                backgroundColor: "var(--booking-blue)",
                color: "white",
                padding: "12px 24px",
                borderRadius: "var(--border-radius-sm)",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Subscribe
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <div className="footer-column">
              <h4>Regions</h4>
              <ul>
                <li>Countries</li>
                <li>Regions</li>
                <li>Cities</li>
                <li>Districts</li>
                <li>Airports</li>
                <li>Hotels</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Properties</h4>
              <ul>
                <li>Homes</li>
                <li>Apartments</li>
                <li>Resorts</li>
                <li>Villas</li>
                <li>Hostels</li>
                <li>B&Bs</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Explore</h4>
              <ul>
                <li>Travel Communities</li>
                <li>Seasonal deals</li>
                <li>Careers</li>
                <li>Safety Resource Center</li>
                <li>How We Work</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                <li>Customer Service</li>
                <li>Partner Help</li>
                <li>Sustainability</li>
                <li>Security Center</li>
                <li>Investor relations</li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Safety</h4>
              <ul>
                <li>Customer Service</li>
                <li>Partner Help</li>
                <li>Sustainability</li>
                <li>Security Center</li>
                <li>Investor relations</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div
              className="logo"
              style={{ color: "var(--booking-blue)", marginBottom: "16px" }}
            >
              Booking.com
            </div>
            <p>Copyright © 1996–2026 Booking.com™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
