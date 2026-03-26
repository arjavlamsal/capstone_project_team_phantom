'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  return (
    <div className="register-page">
      <Navbar />
      
      <main className="auth-page">
        <div className="auth-container">
          <h1 className="auth-title">Create an account</h1>
          <p style={{ textAlign: 'left', marginBottom: '24px', fontSize: '14px', color: 'var(--booking-text-secondary)' }}>
            Sign in to your account with your email address.
          </p>
          
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
            
            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Confirm Password</label>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Create account
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
              Already have an account?{' '}
              <Link href="/login" className="auth-link">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
