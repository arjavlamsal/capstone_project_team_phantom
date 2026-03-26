'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Login() {
  const [email, setEmail] = useState('');
  
  return (
    <div className="login-page">
      <Navbar />
      
      <main className="auth-page">
        <div className="auth-container">
          <h1 className="auth-title">Sign in or create an account</h1>
          
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-form-group">
              <label className="auth-label">Email address</label>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Continue with email
            </button>
          </form>
          
          <div className="auth-divider">
            <span>or use one of these options</span>
          </div>
          
          <div className="social-auth">
            <button className="social-btn">
              <span className="social-icon">👤</span>
              <span style={{ fontSize: '12px' }}>Facebook</span>
            </button>
            <button className="social-btn">
              <span className="social-icon">🌐</span>
              <span style={{ fontSize: '12px' }}>Google</span>
            </button>
            <button className="social-btn">
              <span className="social-icon">🍎</span>
              <span style={{ fontSize: '12px' }}>Apple</span>
            </button>
          </div>
          
          <div className="auth-footer">
            <p>
              By signing in or creating an account, you agree with our{' '}
              <a href="#" className="auth-link">Terms & Conditions</a> and{' '}
              <a href="#" className="auth-link">Privacy Statement</a>
            </p>
            <div style={{ marginTop: '24px' }}>
              All rights reserved. Copyright (2006-2026) – Booking.com™
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
