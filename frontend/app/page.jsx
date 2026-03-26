/**
 * Home Page - Capstone Project Starter Template
 * CSC 489 - Spring 2026
 * 
 * A beautiful, professional welcome page to inspire students
 */

'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [showQuickStart, setShowQuickStart] = useState(false);
  
  useEffect(() => {
    // Try localhost first, then 127.0.0.1 as fallback
    fetch('http://localhost:5000/api/test')
      .then(res => {
        if (!res.ok) throw new Error('HTTP error');
        return res.json();
      })
      .then(data => {
        console.log('Backend response:', data);
        setBackendStatus('connected');
      })
      .catch(err => {
        console.log('localhost failed, trying 127.0.0.1...', err);
        // Try 127.0.0.1 as fallback
        fetch('http://127.0.0.1:5000/api/test')
          .then(res => res.json())
          .then(data => {
            console.log('Backend response (127.0.0.1):', data);
            setBackendStatus('connected');
          })
          .catch(err2 => {
            console.error('Backend connection failed:', err, err2);
            setBackendStatus('disconnected');
          });
      });
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>CSC 489 • Spring 2026</div>
          <h1 style={styles.heroTitle}>
            Build Something <span style={styles.gradient}>Amazing</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Your capstone project starts here. Create a unique web application, 
            implement security vulnerabilities, and demonstrate your mastery of web security.
          </p>
          
          {/* Status Indicator */}
          <div style={{
            ...styles.statusBadge,
            ...(backendStatus === 'connected' ? styles.statusConnected : 
                backendStatus === 'disconnected' ? styles.statusDisconnected : 
                styles.statusChecking)
          }}>
            <span style={styles.statusDot}></span>
            {backendStatus === 'connected' && 'Backend Connected'}
            {backendStatus === 'disconnected' && 'Backend Offline - Start Flask Server'}
            {backendStatus === 'checking' && 'Checking Backend...'}
          </div>

          <button 
            style={styles.ctaButton}
            onClick={() => setShowQuickStart(!showQuickStart)}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {showQuickStart ? '↑ Hide Quick Start' : '↓ Quick Start Guide'}
          </button>
        </div>
      </header>

      {/* Quick Start (Collapsible) */}
      {showQuickStart && (
        <section style={styles.quickStart}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>🚀 Quick Start</h2>
            <div style={styles.grid}>
              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>1</div>
                <h3 style={styles.stepTitle}>Start Backend</h3>
                <code style={styles.code}>cd backend && python app.py</code>
                <p style={styles.stepDescription}>Flask server runs on port 5000</p>
              </div>
              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>2</div>
                <h3 style={styles.stepTitle}>Start Frontend</h3>
                <code style={styles.code}>cd frontend && npm run dev</code>
                <p style={styles.stepDescription}>Next.js runs on port 3000</p>
              </div>
              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>3</div>
                <h3 style={styles.stepTitle}>Start Building</h3>
                <code style={styles.code}>See guides below ↓</code>
                <p style={styles.stepDescription}>Customize and create!</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          
          {/* What You'll Build */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>💡 What Will You Build?</h2>
            <div style={styles.ideaGrid}>
              <div style={styles.ideaCard}>
                <div style={styles.ideaIcon}>🛒</div>
                <h3 style={styles.ideaTitle}>Marketplace</h3>
                <p style={styles.ideaText}>
                  Campus marketplace, auction site, peer-to-peer trading platform
                </p>
              </div>
              <div style={styles.ideaCard}>
                <div style={styles.ideaIcon}>💬</div>
                <h3 style={styles.ideaTitle}>Social Platform</h3>
                <p style={styles.ideaText}>
                  Anonymous posts, study groups, confession board, community forum
                </p>
              </div>
              <div style={styles.ideaCard}>
                <div style={styles.ideaIcon}>📝</div>
                <h3 style={styles.ideaTitle}>Productivity</h3>
                <p style={styles.ideaText}>
                  Task manager, note sharing, event planner, collaborative workspace
                </p>
              </div>
              <div style={styles.ideaCard}>
                <div style={styles.ideaIcon}>🎮</div>
                <h3 style={styles.ideaTitle}>Entertainment</h3>
                <p style={styles.ideaText}>
                  Quiz platform, meme generator, leaderboards, gaming stats tracker
                </p>
              </div>
              <div style={styles.ideaCard}>
                <div style={styles.ideaIcon}>💳</div>
                <h3 style={styles.ideaTitle}>Finance</h3>
                <p style={styles.ideaText}>
                  Expense tracker, peer payments, budget planner, crypto wallet
                </p>
              </div>
              <div style={styles.ideaCard}>
                <div style={styles.ideaIcon}>✨</div>
                <h3 style={styles.ideaTitle}>Your Idea!</h3>
                <p style={styles.ideaText}>
                  Build anything you want - be creative and make it unique
                </p>
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🛠️ Your Tech Stack</h2>
            <div style={styles.techGrid}>
              <div style={styles.techCard}>
                <div style={styles.techName}>Next.js 14</div>
                <div style={styles.techDesc}>Modern React framework</div>
              </div>
              <div style={styles.techCard}>
                <div style={styles.techName}>Flask 3.0</div>
                <div style={styles.techDesc}>Python web framework</div>
              </div>
              <div style={styles.techCard}>
                <div style={styles.techName}>SQLite 3</div>
                <div style={styles.techDesc}>Lightweight database</div>
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>📚 Resources at Your Fingertips</h2>
            <div style={styles.resourceGrid}>
              <a href="#" style={styles.resourceCard} 
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                <div style={styles.resourceIcon}>📦</div>
                <h3 style={styles.resourceTitle}>AI Prompt Library</h3>
                <p style={styles.resourceDesc}>
                  50+ ready-to-use prompts for ChatGPT/Claude to generate features instantly
                </p>
                <div style={styles.resourceTag}>Canvas Files</div>
              </a>
              
              <a href="#" style={styles.resourceCard}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                <div style={styles.resourceIcon}>🔓</div>
                <h3 style={styles.resourceTitle}>Vulnerability Guide</h3>
                <p style={styles.resourceDesc}>
                  Code examples for SQL injection, XSS, CSRF, IDOR, and more
                </p>
                <div style={styles.resourceTag}>Canvas Files</div>
              </a>
              
              <a href="#" style={styles.resourceCard}
                 onMouseEnter={(e) => e.target.style.transform = 'translateY(-4px)'}
                 onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                <div style={styles.resourceIcon}>⚡</div>
                <h3 style={styles.resourceTitle}>Quick Reference</h3>
                <p style={styles.resourceDesc}>
                  Setup, troubleshooting, common commands - everything you need
                </p>
                <div style={styles.resourceTag}>Canvas Files</div>
              </a>
            </div>
          </section>

          {/* Getting Started Steps */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>🎯 Your Roadmap</h2>
            <div style={styles.roadmap}>
              <div style={styles.roadmapItem}>
                <div style={styles.roadmapNumber}>1</div>
                <div style={styles.roadmapContent}>
                  <h3 style={styles.roadmapTitle}>Brainstorm with Your Team</h3>
                  <p style={styles.roadmapDesc}>
                    Choose what to build. Make it creative, make it yours!
                  </p>
                </div>
              </div>
              <div style={styles.roadmapItem}>
                <div style={styles.roadmapNumber}>2</div>
                <div style={styles.roadmapContent}>
                  <h3 style={styles.roadmapTitle}>Use AI to Build Fast</h3>
                  <p style={styles.roadmapDesc}>
                    Check the AI Prompt Library - generate features in minutes, not hours
                  </p>
                </div>
              </div>
              <div style={styles.roadmapItem}>
                <div style={styles.roadmapNumber}>3</div>
                <div style={styles.roadmapContent}>
                  <h3 style={styles.roadmapTitle}>Implement Vulnerabilities</h3>
                  <p style={styles.roadmapDesc}>
                    Add 6+ intentional security flaws using the Vulnerability Guide
                  </p>
                </div>
              </div>
              <div style={styles.roadmapItem}>
                <div style={styles.roadmapNumber}>4</div>
                <div style={styles.roadmapContent}>
                  <h3 style={styles.roadmapTitle}>Test & Document</h3>
                  <p style={styles.roadmapDesc}>
                    Make sure everything works, take screenshots, write your README
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section style={styles.footerCTA}>
            <h2 style={styles.ctaTitle}>Ready to Build Something Unique?</h2>
            <p style={styles.ctaText}>
              This template is just the beginning. Customize everything, add your features,
              and create a portfolio-worthy project that showcases your skills.
            </p>
            <div style={styles.ctaButtons}>
              <a 
                href="http://localhost:5000" 
                target="_blank" 
                style={styles.linkButton}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                View Backend API →
              </a>
              <a 
                href="https://nextjs.org/docs" 
                target="_blank" 
                style={styles.linkButtonSecondary}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                Next.js Docs →
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          CSC 489 - Web Application Security • Spring 2026 • University of Southern Mississippi
        </p>
        <p style={styles.footerText}>
          Need help? Office Hours: Tu-Th 3:00-3:55 PM, TEC 380 • oluseyi.olukola@usm.edu
        </p>
      </footer>
    </div>
  );
}

// Styles
const styles = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  // Hero Section
  hero: {
    padding: '80px 20px',
    textAlign: 'center',
    color: 'white',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '20px',
    backdropFilter: 'blur(10px)',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  gradient: {
    background: 'linear-gradient(45deg, #ffd89b, #19547b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    lineHeight: '1.6',
    opacity: '0.95',
    marginBottom: '40px',
  },
  
  // Status Badge
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    borderRadius: '30px',
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '30px',
    transition: 'all 0.3s ease',
  },
  statusConnected: {
    background: 'rgba(72, 187, 120, 0.2)',
    border: '2px solid rgba(72, 187, 120, 0.5)',
    color: '#F0FFF4',
  },
  statusDisconnected: {
    background: 'rgba(245, 101, 101, 0.2)',
    border: '2px solid rgba(245, 101, 101, 0.5)',
    color: '#FFF5F5',
  },
  statusChecking: {
    background: 'rgba(237, 137, 54, 0.2)',
    border: '2px solid rgba(237, 137, 54, 0.5)',
    color: '#FFFAF0',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    animation: 'pulse 2s infinite',
  },
  
  // CTA Button
  ctaButton: {
    padding: '16px 40px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    background: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
  },
  
  // Quick Start
  quickStart: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '40px 20px',
    marginBottom: '40px',
  },
  
  // Main Content
  main: {
    background: 'white',
    minHeight: '100vh',
    paddingTop: '60px',
    paddingBottom: '60px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  section: {
    marginBottom: '80px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '40px',
    textAlign: 'center',
  },
  
  // Grid Layouts
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
  },
  ideaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
  },
  
  // Step Cards
  stepCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    borderRadius: '16px',
    color: 'white',
    textAlign: 'center',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    fontSize: '24px',
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '15px',
  },
  code: {
    display: 'block',
    background: 'rgba(0, 0, 0, 0.2)',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    marginBottom: '10px',
  },
  stepDescription: {
    fontSize: '14px',
    opacity: '0.9',
  },
  
  // Idea Cards
  ideaCard: {
    background: '#f7fafc',
    padding: '30px',
    borderRadius: '16px',
    border: '2px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  ideaIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  ideaTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '10px',
  },
  ideaText: {
    color: '#4a5568',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  
  // Tech Stack
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  techCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '30px',
    borderRadius: '16px',
    textAlign: 'center',
    color: 'white',
  },
  techName: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '10px',
  },
  techDesc: {
    opacity: '0.9',
  },
  
  // Resources
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
  },
  resourceCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '16px',
    border: '2px solid #e2e8f0',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'all 0.3s ease',
    display: 'block',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  resourceIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  resourceTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '10px',
  },
  resourceDesc: {
    color: '#4a5568',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  resourceTag: {
    display: 'inline-block',
    padding: '6px 12px',
    background: '#edf2f7',
    color: '#667eea',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  
  // Roadmap
  roadmap: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  roadmapItem: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    alignItems: 'flex-start',
  },
  roadmapNumber: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    flexShrink: 0,
  },
  roadmapContent: {
    flex: 1,
  },
  roadmapTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  roadmapDesc: {
    color: '#4a5568',
    lineHeight: '1.6',
  },
  
  // Footer CTA
  footerCTA: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    color: 'white',
    marginTop: '60px',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '20px',
  },
  ctaText: {
    fontSize: '1.1rem',
    marginBottom: '30px',
    maxWidth: '600px',
    margin: '0 auto 30px',
    lineHeight: '1.6',
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  linkButton: {
    padding: '16px 32px',
    background: 'white',
    color: '#667eea',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
  linkButtonSecondary: {
    padding: '16px 32px',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid white',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    backdropFilter: 'blur(10px)',
  },
  
  // Footer
  footer: {
    background: '#1a202c',
    color: 'white',
    padding: '40px 20px',
    textAlign: 'center',
  },
  footerText: {
    opacity: '0.8',
    fontSize: '14px',
    margin: '8px 0',
  },
};
