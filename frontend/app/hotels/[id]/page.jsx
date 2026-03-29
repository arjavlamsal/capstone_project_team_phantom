"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function HotelDetails() {
  const params = useParams();
  const hotelId = params.id;
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  const fallbackImage = `https://picsum.photos/seed/hotel-${hotelId}/1200/700`;

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    showForm: false,
  });

  useEffect(() => {
    fetchHotel();
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiBaseUrl}/api/hotels/${hotelId}`);
      const data = await res.json();
      setHotel(data);
    } catch (err) {
      console.error("Error fetching hotel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBaseUrl}/api/hotels/${hotelId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });
      if (res.ok) {
        setNewReview({ rating: 5, comment: "" });
        fetchHotel();
      }
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  const handleBooking = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    try {
      const res = await fetch(`${apiBaseUrl}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          hotel_id: hotelId,
          check_in_date: bookingData.checkIn,
          check_out_date: bookingData.checkOut,
        }),
      });
      if (res.ok) {
        alert("Booking confirmed!");
        setBookingData({ checkIn: "", checkOut: "", showForm: false });
      }
    } catch (err) {
      console.error("Error booking hotel:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div>
      <Navbar />

      <div className="container" style={{ paddingTop: "40px" }}>
        <Link
          href="/hotels"
          style={{
            color: "var(--booking-blue)",
            fontWeight: "600",
            marginBottom: "20px",
            display: "inline-block",
          }}
        >
          ← Back to Hotels
        </Link>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "40px",
          }}
        >
          {/* Hotel Details */}
          <div>
            <img
              src={hotel.image_url || fallbackImage}
              alt={hotel.name}
              style={{
                width: "100%",
                height: "300px",
                objectFit: "cover",
                borderRadius: "var(--border-radius-md)",
                marginBottom: "20px",
                display: "block",
                backgroundColor: "#ddd",
              }}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />

            <h1 style={{ marginBottom: "8px" }}>{hotel.name}</h1>
            <p
              style={{
                color: "var(--booking-text-secondary)",
                marginBottom: "16px",
              }}
            >
              📍 {hotel.city}
            </p>
            <p style={{ marginBottom: "24px", lineHeight: "1.6" }}>
              {hotel.description}
            </p>

            {/* Reviews Section */}
            <div style={{ marginTop: "40px" }}>
              <h2 style={{ marginBottom: "20px" }}>Reviews</h2>

              {/* Add Review Form */}
              <form
                onSubmit={handleAddReview}
                style={{
                  backgroundColor: "var(--booking-gray)",
                  padding: "20px",
                  borderRadius: "var(--border-radius-md)",
                  marginBottom: "30px",
                }}
              >
                <h3 style={{ marginBottom: "16px", fontSize: "16px" }}>
                  Leave a Review
                </h3>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Rating: {newReview.rating}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        rating: parseInt(e.target.value),
                      })
                    }
                    style={{ width: "100%" }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Comment
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Share your experience..."
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "var(--border-radius-sm)",
                      border: "1px solid var(--booking-border)",
                      minHeight: "100px",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Post Review
                </button>
              </form>

              {/* Reviews List */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {hotel.reviews && hotel.reviews.length > 0 ? (
                  hotel.reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        padding: "16px",
                        backgroundColor: "var(--booking-gray)",
                        borderRadius: "var(--border-radius-sm)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <strong>User {review.user_id}</strong>
                        <span style={{ color: "var(--booking-yellow-hover)" }}>
                          ★ {review.rating}
                        </span>
                      </div>
                      {/* VUL: XSS - Comment is rendered without sanitization */}
                      <div
                        style={{ color: "var(--booking-text-secondary)" }}
                        dangerouslySetInnerHTML={{ __html: review.comment }}
                      />
                      <small
                        style={{
                          color: "#999",
                          marginTop: "8px",
                          display: "block",
                        }}
                      >
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "var(--booking-text-secondary)" }}>
                    No reviews yet. Be the first!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div
            style={{
              backgroundColor: "var(--booking-gray)",
              padding: "24px",
              borderRadius: "var(--border-radius-md)",
              height: "fit-content",
              position: "sticky",
              top: "20px",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "var(--booking-blue)",
                  marginBottom: "4px",
                }}
              >
                €{hotel.price}
              </div>
              <small style={{ color: "var(--booking-text-secondary)" }}>
                per night
              </small>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "4px",
                }}
              >
                ★ Rating: {hotel.rating}
              </div>
              {hotel.reviews && (
                <small style={{ color: "var(--booking-text-secondary)" }}>
                  Based on {hotel.reviews.length} reviews
                </small>
              )}
            </div>

            {!bookingData.showForm ? (
              <button
                className="btn-primary"
                onClick={() =>
                  setBookingData({ ...bookingData, showForm: true })
                }
                style={{ width: "100%", padding: "12px" }}
              >
                Book Now
              </button>
            ) : (
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        checkIn: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "var(--border-radius-sm)",
                      border: "1px solid var(--booking-border)",
                    }}
                  />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        checkOut: e.target.value,
                      })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "var(--border-radius-sm)",
                      border: "1px solid var(--booking-border)",
                    }}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={handleBooking}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "8px",
                  }}
                >
                  Confirm Booking
                </button>
                <button
                  className="btn-secondary"
                  onClick={() =>
                    setBookingData({ ...bookingData, showForm: false })
                  }
                  style={{ width: "100%", padding: "12px" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
