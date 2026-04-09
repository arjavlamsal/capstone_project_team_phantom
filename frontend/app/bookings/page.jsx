"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function MyBookings() {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const currentUserId = localStorage.getItem("user_id") || "1";
    setUserId(parseInt(currentUserId));
  }, []);

  useEffect(() => {
    if (userId !== "") {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // VUL: IDOR vulnerability - can access any user's bookings by changing userId
      const res = await fetch(`${apiBaseUrl}/api/bookings/user/${userId}`, {
        credentials: "include",
      });
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      // VUL: CSRF vulnerability - no token, VUL: IDOR - can delete any booking
      const res = await fetch(`${apiBaseUrl}/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { "X-Requested-With": "XMLHttpRequest" },
        credentials: "include",
      });
      if (res.ok) {
        alert("Booking deleted");
        fetchBookings();
      }
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container" style={{ paddingTop: "40px" }}>
        <h1 style={{ marginBottom: "30px" }}>My Bookings</h1>

        {/* IDOR Test Helper */}
        <div
          style={{
            backgroundColor: "#fff3cd",
            padding: "16px",
            borderRadius: "var(--border-radius-md)",
            marginBottom: "30px",
            border: "1px solid #ffc107",
          }}
        >
          <p style={{ marginBottom: "8px", fontWeight: "600" }}>
            📝 Testing IDOR vulnerability?
          </p>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span>Try user ID:</span>
            <input
              type="number"
              value={userId}
              onChange={(e) => setUserId(parseInt(e.target.value))}
              style={{
                padding: "8px 12px",
                borderRadius: "var(--border-radius-sm)",
                border: "1px solid var(--booking-border)",
                width: "80px",
              }}
            />
            <button
              onClick={fetchBookings}
              style={{
                padding: "8px 16px",
                backgroundColor: "var(--booking-blue)",
                color: "white",
                border: "none",
                borderRadius: "var(--border-radius-sm)",
                cursor: "pointer",
              }}
            >
              Load Bookings
            </button>
          </div>
          <small style={{ marginTop: "8px", display: "block", color: "#666" }}>
            VUL: Can you access bookings from other users?
          </small>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading bookings...
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: "20px",
                    border: "1px solid var(--booking-border)",
                    borderRadius: "var(--border-radius-md)",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h3 style={{ marginBottom: "8px" }}>
                      Booking #{booking.id}
                    </h3>
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Hotel:</strong> Hotel {booking.hotel_id}
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Guest:</strong> User {booking.user_id}
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Check-in:</strong> {booking.check_in_date}
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Check-out:</strong> {booking.check_out_date}
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "var(--booking-blue)",
                      }}
                    >
                      €{booking.total_price}
                    </div>
                    <div
                      style={{
                        marginTop: "4px",
                        fontSize: "12px",
                        color: "var(--booking-success)",
                      }}
                    >
                      Status: {booking.status}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      onClick={() => handleDeleteBooking(booking.id)}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: "var(--booking-error)",
                        color: "white",
                        border: "none",
                        borderRadius: "var(--border-radius-sm)",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--booking-text-secondary)",
                }}
              >
                <p>No bookings found</p>
                <Link href="/hotels">
                  <button className="btn-primary" style={{ marginTop: "16px" }}>
                    Browse Hotels
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
