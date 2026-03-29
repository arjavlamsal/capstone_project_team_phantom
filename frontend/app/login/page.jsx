"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function Login() {
  const router = useRouter();
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // VUL: Weak session management - storing JWT in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_id", data.user_id);

      alert("Login successful!");
      router.push("/hotels");
    } catch (err) {
      setError("Error during login: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <main className="auth-page">
        <div className="auth-container">
          <h1 className="auth-title">Sign in to your account</h1>

          {error && (
            <div
              style={{
                backgroundColor: "rgba(212, 17, 30, 0.1)",
                color: "var(--booking-error)",
                padding: "12px",
                borderRadius: "var(--border-radius-sm)",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">Username or Email</label>
              <input
                type="text"
                className="auth-input"
                placeholder="Enter your username or email"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <input
                type="password"
                className="auth-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-divider">
            <span>Test Credentials</span>
          </div>

          <div
            style={{
              backgroundColor: "#f0f0f0",
              padding: "12px",
              borderRadius: "var(--border-radius-sm)",
              marginBottom: "24px",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "4px" }}>
              <strong>Username:</strong> testuser
            </p>
            <p>
              <strong>Password:</strong> password123
            </p>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="auth-link">
                Create one now
              </Link>
            </p>
            <p style={{ marginTop: "24px" }}>
              By signing in, you agree with our{" "}
              <a href="#" className="auth-link">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="auth-link">
                Privacy Statement
              </a>
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background-color: var(--booking-gray);
        }

        .auth-page {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          min-height: calc(100vh - 60px);
        }

        .auth-container {
          background: white;
          padding: 40px;
          border-radius: var(--border-radius-md);
          max-width: 400px;
          width: 100%;
          box-shadow: var(--shadow-md);
        }

        .auth-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .auth-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-label {
          font-weight: 600;
          font-size: 14px;
        }

        .auth-input {
          padding: 12px;
          border: 1px solid var(--booking-border);
          border-radius: var(--border-radius-sm);
          font-size: 14px;
          font-family: inherit;
        }

        .auth-input:focus {
          outline: none;
          border-color: var(--booking-blue);
          box-shadow: 0 0 0 3px rgba(0, 59, 149, 0.1);
        }

        .auth-divider {
          text-align: center;
          margin: 24px 0;
          position: relative;
          font-size: 12px;
          fontweight: 600;
          color: #999;
        }

        .auth-footer {
          text-align: center;
          font-size: 14px;
          color: var(--booking-text-secondary);
        }

        .auth-link {
          color: var(--booking-blue);
          text-decoration: none;
          font-weight: 600;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .btn-primary {
          background-color: var(--booking-blue);
          color: white;
          padding: 12px;
          border: none;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background-color: var(--booking-blue-dark);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
