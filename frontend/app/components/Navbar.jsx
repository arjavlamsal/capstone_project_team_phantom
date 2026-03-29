"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar({ light = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const uid = localStorage.getItem("user_id");
    if (token && uid) {
      setIsLoggedIn(true);
      setUserId(uid);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/");
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link href="/" className="logo">
          Booking.com
        </Link>
        <div className="nav-items">
          {isLoggedIn && (
            <>
              <Link
                href="/hotels"
                className="nav-link"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: pathname === "/hotels" ? "700" : "500",
                }}
              >
                🔍 Browse Hotels
              </Link>
              <Link
                href="/bookings"
                className="nav-link"
                style={{
                  textDecoration: "none",
                  color: "white",
                  fontWeight: pathname === "/bookings" ? "700" : "500",
                }}
              >
                📋 My Bookings
              </Link>
            </>
          )}
          <span className="nav-link">GBP</span>
          <span className="nav-link">🇬🇧</span>
          {!isAuthPage && (
            <>
              {!isLoggedIn ? (
                <>
                  <Link href="/register" className="btn-secondary">
                    Register
                  </Link>
                  <Link href="/login" className="btn-secondary">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  <span style={{ color: "white", fontSize: "12px" }}>
                    User {userId}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
