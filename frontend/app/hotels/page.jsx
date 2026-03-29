"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Hotels() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (city = "") => {
    try {
      setLoading(true);
      let url = `${apiBaseUrl}/api/hotels`;
      if (city) {
        // VUL: SQL Injection vulnerability - city parameter not sanitized
        url += `?city=${city}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setHotels(data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchHotels(searchCity);
  };

  return (
    <div>
      <Navbar />

      <div className="container" style={{ paddingTop: "40px" }}>
        <h1 style={{ marginBottom: "20px" }}>Browse Hotels</h1>

        <form
          onSubmit={handleSearch}
          style={{ marginBottom: "40px", display: "flex", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "var(--border-radius-sm)",
              border: "1px solid var(--booking-border)",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ padding: "12px 24px" }}
          >
            Search
          </button>
        </form>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading hotels...
          </div>
        ) : (
          <div className="grid grid-4" style={{ gap: "20px" }}>
            {hotels.map((hotel) => (
              <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                <div
                  className="card"
                  style={{
                    cursor: "pointer",
                    border: "1px solid var(--booking-border)",
                    borderRadius: "var(--border-radius-md)",
                    overflow: "hidden",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--shadow-lg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      backgroundColor: "#ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "48px",
                    }}
                  >
                    🏨
                  </div>
                  <div style={{ padding: "12px" }}>
                    <div className="card-title">{hotel.name}</div>
                    <div className="card-subtitle">{hotel.city}</div>
                    <div
                      style={{
                        marginTop: "8px",
                        fontWeight: "700",
                        color: "var(--booking-blue)",
                      }}
                    >
                      €{hotel.price} per night
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "14px",
                        color: "var(--booking-yellow-hover)",
                      }}
                    >
                      ★ {hotel.rating}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && hotels.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--booking-text-secondary)",
            }}
          >
            No hotels found. Try a different search.
          </div>
        )}
      </div>
    </div>
  );
}
