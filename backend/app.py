"""
Flask Backend - Capstone Project Starter Template
CSC 489 - Spring 2026

This is a minimal Flask application to get you started.
Add your features and vulnerabilities here!
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Database configuration
DATABASE = 'database.db'

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def init_db():
    """Initialize database with basic users table"""
    if not os.path.exists(DATABASE):
        conn = get_db()
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insert a test user
        conn.execute(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            ('admin', 'admin123', 'admin@example.com')
        )
        
        conn.commit()
        conn.close()
        print("Database initialized!")

# Initialize database on startup
init_db()

# ============================================================================
# BASIC EXAMPLE ENDPOINTS
# ============================================================================

@app.route('/')
def home():
    """Beautiful backend home page"""
    html = '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flask Backend - CSC 489</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .container {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 800px;
                width: 100%;
                padding: 40px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 40px;
            }
            
            .status-badge {
                display: inline-block;
                background: #10b981;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            h1 {
                font-size: 2.5rem;
                color: #1a202c;
                margin-bottom: 10px;
            }
            
            .subtitle {
                color: #64748b;
                font-size: 1.1rem;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            
            .info-card {
                background: #f8fafc;
                padding: 20px;
                border-radius: 12px;
                border: 2px solid #e2e8f0;
            }
            
            .info-label {
                color: #64748b;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
                font-weight: 600;
            }
            
            .info-value {
                color: #1a202c;
                font-size: 1.1rem;
                font-weight: 600;
                font-family: monospace;
            }
            
            .endpoints {
                margin-top: 40px;
            }
            
            .section-title {
                font-size: 1.5rem;
                color: #1a202c;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .endpoint {
                background: #f8fafc;
                padding: 16px;
                border-radius: 12px;
                margin-bottom: 12px;
                border-left: 4px solid #667eea;
                transition: all 0.3s ease;
            }
            
            .endpoint:hover {
                background: #f1f5f9;
                transform: translateX(5px);
            }
            
            .endpoint-method {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 4px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 700;
                margin-right: 10px;
            }
            
            .endpoint-method.post {
                background: #10b981;
            }
            
            .endpoint-path {
                font-family: monospace;
                color: #1a202c;
                font-weight: 600;
            }
            
            .endpoint-desc {
                color: #64748b;
                font-size: 14px;
                margin-top: 8px;
            }
            
            .test-button {
                background: #667eea;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                margin-top: 10px;
            }
            
            .test-button:hover {
                background: #5568d3;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            
            .footer {
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #e2e8f0;
                text-align: center;
            }
            
            .footer-text {
                color: #64748b;
                font-size: 14px;
            }
            
            .footer-links {
                margin-top: 15px;
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .footer-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s ease;
            }
            
            .footer-link:hover {
                color: #5568d3;
            }
            
            .emoji {
                font-size: 1.5rem;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="status-badge">✓ ONLINE</div>
                <h1>🚀 Flask Backend</h1>
                <p class="subtitle">CSC 489 - Web Application Security</p>
            </div>
            
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">Framework</div>
                    <div class="info-value">Flask 3.0</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Database</div>
                    <div class="info-value">SQLite 3</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Server</div>
                    <div class="info-value">localhost:5000</div>
                </div>
                <div class="info-card">
                    <div class="info-label">Status</div>
                    <div class="info-value" style="color: #10b981;">Running</div>
                </div>
            </div>
            
            <div class="endpoints">
                <h2 class="section-title">
                    <span class="emoji">📡</span>
                    Available Endpoints
                </h2>
                
                <div class="endpoint">
                    <div>
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/test</span>
                    </div>
                    <div class="endpoint-desc">Test endpoint to verify API connectivity</div>
                    <a href="/api/test" target="_blank">
                        <button class="test-button">Test Endpoint →</button>
                    </a>
                </div>
                
                <div class="endpoint">
                    <div>
                        <span class="endpoint-method post">POST</span>
                        <span class="endpoint-path">/api/login</span>
                    </div>
                    <div class="endpoint-desc">User authentication (placeholder - implement your logic)</div>
                </div>
                
                <div class="endpoint">
                    <div>
                        <span class="endpoint-method">GET</span>
                        <span class="endpoint-path">/api/...</span>
                    </div>
                    <div class="endpoint-desc">Add your custom endpoints here!</div>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    <strong>Default Credentials:</strong> admin / admin123
                </p>
                <p class="footer-text" style="margin-top: 10px;">
                    Add your features in <code>backend/app.py</code>
                </p>
                <div class="footer-links">
                    <a href="https://flask.palletsprojects.com/" target="_blank" class="footer-link">
                        Flask Docs
                    </a>
                    <a href="https://www.sqlite.org/docs.html" target="_blank" class="footer-link">
                        SQLite Docs
                    </a>
                    <a href="http://localhost:3000" target="_blank" class="footer-link">
                        Open Frontend →
                    </a>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''
    return html

@app.route('/api/test')
def test():
    """Test endpoint to verify API is working"""
    return jsonify({
        'message': 'API is working!',
        'backend': 'Flask',
        'database': 'SQLite'
    })

@app.route('/api/')
def api_index():
    """Simple API index endpoint"""
    return jsonify({
        'message': 'API root',
        'endpoints': [
            '/api/test',
            '/api/login'
        ]
    })

# ============================================================================
# ADD YOUR ENDPOINTS BELOW
# ============================================================================

# Example: Login endpoint (you can modify or replace this)
@app.route('/api/login', methods=['POST'])
def login():
    """
    Example login endpoint
    
    TODO: Add your authentication logic here
    HINT: This is where you might add SQL injection vulnerability!
    """
    data = request.get_json()
    username = data.get('username', '')
    password = data.get('password', '')
    
    # TODO: Implement your login logic
    # EXAMPLE (modify as needed):
    # conn = get_db()
    # user = conn.execute(
    #     "SELECT * FROM users WHERE username=? AND password=?",
    #     (username, password)
    # ).fetchone()
    # conn.close()
    
    return jsonify({
        'message': 'Login endpoint - implement your logic here',
        'username': username
    })

# TODO: Add more endpoints for your application features
# Examples:
# - POST /api/register - User registration
# - GET /api/profile/<user_id> - Get user profile
# - POST /api/posts - Create a post
# - GET /api/posts - Get all posts
# - GET /api/search?q=query - Search functionality

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print("Flask Backend Starting...")
    print("Backend running on: http://localhost:5000")
    print("API test endpoint: http://localhost:5000/api/test")
    print("=" * 60)
    app.run(debug=True, port=5000)
