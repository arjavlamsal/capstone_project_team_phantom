"""
Flask Backend - Capstone Project Bookings Application
CSC 489 - Spring 2026

INTENTIONALLY VULNERABLE for Milestone 1 - Web Security Learning
This application contains 7 documented vulnerabilities for testing
"""

from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import os
import jwt
import json
import html
import secrets
from datetime import datetime, timedelta
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
from flask import make_response

app = Flask(__name__)
CORS(app)
app.secret_key = 'super_secret_key_12345'  # VUL: Hardcoded secret

# Database configuration
DATABASE = 'database.db'
JWT_SECRET = os.environ.get('JWT_SECRET', secrets.token_hex(32))  # FIX: Strong dynamic secret

def get_db():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with all required tables and seed data if needed"""
    conn = get_db()
    cursor = conn.cursor()

    def ensure_column(table_name, column_name, column_def):
        existing = {
            row[1] for row in cursor.execute(f"PRAGMA table_info({table_name})").fetchall()
        }
        if column_name not in existing:
            cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_def}")

    # Users table - VUL: No password hashing stored
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            full_name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Hotels table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hotels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            city TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT,
            rating REAL DEFAULT 4.5,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Bookings table - VUL: IDOR vulnerability - no user_id check on endpoints
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            hotel_id INTEGER NOT NULL,
            check_in_date TEXT NOT NULL,
            check_out_date TEXT NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (hotel_id) REFERENCES hotels(id)
        )
    ''')

    # Reviews table - VUL: XSS vulnerability - no sanitization
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hotel_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (hotel_id) REFERENCES hotels(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')

    # Handle older local DB files created before new columns were introduced.
    ensure_column('users', 'full_name', 'TEXT')
    ensure_column('hotels', 'image_url', 'TEXT')
    ensure_column('bookings', 'status', "TEXT DEFAULT 'confirmed'")

    users_count = cursor.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    hotels_count = cursor.execute("SELECT COUNT(*) FROM hotels").fetchone()[0]
    bookings_count = cursor.execute("SELECT COUNT(*) FROM bookings").fetchone()[0]
    reviews_count = cursor.execute("SELECT COUNT(*) FROM reviews").fetchone()[0]

    # Ensure test user exists and can always sign in with known credentials
    test_user = cursor.execute(
        "SELECT id FROM users WHERE username=?",
        ('testuser',)
    ).fetchone()

    if test_user:
        cursor.execute(
            "UPDATE users SET password=? WHERE username=?",
            (generate_password_hash('password123'), 'testuser')
        )
    else:
        cursor.execute(
            "INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)",
            ('testuser', 'testuser@example.com', generate_password_hash('password123'), 'Test User')
        )

    # Seed additional users only when table is empty
    if users_count == 0:
        cursor.execute(
            "INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)",
            ('johndoe', 'john@example.com', generate_password_hash('john123'), 'John Doe')
        )

    # Seed hotels only when table is empty
    if hotels_count == 0:
        hotels = [
            ('Luxury Hotel Downtown', 'New York', 150.00, 'A beautiful luxury hotel in downtown NYC', 4.8, 'https://images.unsplash.com/photo-1551882547-ff43c69e5cfd?w=400'),
            ('Beach Resort Paradise', 'Miami', 120.00, 'Beachfront resort with ocean views', 4.6, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400'),
            ('Mountain Cabin Retreat', 'Denver', 95.00, 'Cozy cabin in the mountains', 4.5, 'https://images.unsplash.com/photo-1449156001427-af560f65b06d?w=400'),
            ('City Center Apartment', 'Boston', 110.00, 'Modern apartment in the heart of the city', 4.7, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'),
            ('Suburban Inn', 'Austin', 85.00, 'Comfortable inn near downtown', 4.4, 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?w=400'),
        ]

        for hotel in hotels:
            cursor.execute(
                "INSERT INTO hotels (name, city, price, description, rating, image_url) VALUES (?, ?, ?, ?, ?, ?)",
                hotel
            )

    # Seed sample booking only when table is empty
    if bookings_count == 0:
        cursor.execute(
            "INSERT INTO bookings (user_id, hotel_id, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ?)",
            (1, 1, '2026-03-30', '2026-04-02', 450.00)
        )

    # Seed sample reviews only when table is empty
    if reviews_count == 0:
        cursor.execute(
            "INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
            (1, 1, 5, 'Great stay. Friendly staff and clean room!')
        )
        cursor.execute(
            "INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
            (2, 2, 4, 'Great beach resort with amazing breakfast!')
        )

    # Replace previously seeded obvious XSS payloads so vulnerability is not revealed on load.
    # The app remains intentionally vulnerable because user comments are still stored and rendered unsafely.
    cursor.execute(
        "UPDATE reviews SET comment = ? WHERE comment = ?",
        ('Great stay. Friendly staff and clean room!', '<img src=x onerror="alert(\'XSS\')">')
    )
    cursor.execute(
        "UPDATE reviews SET comment = ? WHERE comment = ?",
        ('Great beach resort with amazing breakfast!', 'Great beach resort! <script>alert("XSS")</script>')
    )

    conn.commit()
    conn.close()
    print("Database schema checked and initialized.")

# Initialize database on startup
init_db()

# Decorator to enforce token validation securely
def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            request.current_user = data
        except Exception:
            return jsonify({'error': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

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
                    <div class="info-value">localhost:5001</div>
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
                    <strong>Default Credentials:</strong> testuser / password123
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
                    <a href="http://localhost:3001" target="_blank" class="footer-link">
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
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user - VUL: No password hashing"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        
        # FIX: Password hashing
        hashed_password = generate_password_hash(password)
        
        conn = get_db()
        conn.execute(
            "INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)",
            (username, email, hashed_password, full_name)
        )
        conn.commit()
        new_user = conn.execute("SELECT id FROM users WHERE username=?", (username,)).fetchone()
        conn.close()
        
        # FIX: Stronger session management with HttpOnly cookie
        token = jwt.encode({
            'user_id': new_user['id'],
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, JWT_SECRET, algorithm='HS256')
        
        resp = make_response(jsonify({
            'message': 'Registration successful',
            'user_id': new_user['id']
        }))
        resp.set_cookie('token', token, httponly=True, samesite='Lax', max_age=3600)
        return resp, 201
    except Exception as e:
        # VUL: Information disclosure - detailed error messages
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

@app.route('/api/login', methods=['POST'])
def login():
    """Login user - VUL: Broken authentication, plain text password check"""
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        password = data.get('password', '')
        
        # FIX: Password hashing verification
        conn = get_db()
        user = conn.execute(
            "SELECT id, username, password FROM users WHERE username=?",
            (username,)
        ).fetchone()
        conn.close()
        
        if user and check_password_hash(user['password'], password):
            token = jwt.encode({
                'user_id': user['id'],
                'username': user['username'],
                'exp': datetime.utcnow() + timedelta(hours=1)
            }, JWT_SECRET, algorithm='HS256')
            resp = make_response(jsonify({'message': 'Login successful', 'user_id': user['id']}))
            resp.set_cookie('token', token, httponly=True, samesite='Lax', max_age=3600)
            return resp
        
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        # VUL: Information disclosure
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

# ============================================================================
# HOTEL ENDPOINTS
# ============================================================================

@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    """Get all hotels with optional filtering - VUL: SQL Injection"""
    try:
        # VUL: SQL Injection - filter parameter not sanitized
        city_filter = request.args.get('city', '')
        min_price = request.args.get('min_price', '0')
        max_price = request.args.get('max_price', '10000')
        
        conn = get_db()
        
        query = "SELECT * FROM hotels WHERE price BETWEEN ? AND ?"
        params = [min_price, max_price]
        
        if city_filter:
            # FIX: Use parameterized query to prevent SQL Injection
            query += " AND city LIKE ?"
            params.append(f"%{city_filter}%")
        
        hotels = conn.execute(query, params).fetchall()
        conn.close()
        
        return jsonify([dict(h) for h in hotels])
    except Exception as e:
        # VUL: Information disclosure
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

@app.route('/api/hotels/<int:hotel_id>', methods=['GET'])
def get_hotel(hotel_id):
    """Get specific hotel details"""
    try:
        conn = get_db()
        hotel = conn.execute(
            "SELECT * FROM hotels WHERE id=?",
            (hotel_id,)
        ).fetchone()
        
        reviews = conn.execute(
            "SELECT id, user_id, rating, comment, created_at FROM reviews WHERE hotel_id=?",
            (hotel_id,)
        ).fetchall()
        
        conn.close()
        
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        hotel_dict = dict(hotel)
        # VUL: XSS - reviews with unescaped HTML/JavaScript returned to frontend
        hotel_dict['reviews'] = [dict(r) for r in reviews]
        
        return jsonify(hotel_dict)
    except Exception as e:
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

# ============================================================================
# BOOKING ENDPOINTS
# ============================================================================

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    """Create a new booking - VUL: No CSRF token, no user verification"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        hotel_id = data.get('hotel_id')
        check_in = data.get('check_in_date')
        check_out = data.get('check_out_date')
        
        # VUL: No CSRF protection (missing csrf token validation)
        # VUL: No verification that user_id matches authenticated user
        
        conn = get_db()
        
        # Get hotel price
        hotel = conn.execute("SELECT price FROM hotels WHERE id=?", (hotel_id,)).fetchone()
        if not hotel:
            return jsonify({'error': 'Hotel not found'}), 404
        
        # Calculate total price (simple: 3 nights at hotel price)
        total_price = hotel['price'] * 3
        
        conn.execute(
            "INSERT INTO bookings (user_id, hotel_id, check_in_date, check_out_date, total_price) VALUES (?, ?, ?, ?, ?)",
            (user_id, hotel_id, check_in, check_out, total_price)
        )
        conn.commit()
        
        booking_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
        conn.close()
        
        return jsonify({
            'message': 'Booking created',
            'booking_id': booking_id,
            'total_price': total_price
        }), 201
    except Exception as e:
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    """Get booking details - VUL: IDOR - no user_id verification!"""
    try:
        conn = get_db()
        # VUL: IDOR - Returns any booking without checking if current user owns it
        booking = conn.execute(
            "SELECT * FROM bookings WHERE id=?",
            (booking_id,)
        ).fetchone()
        conn.close()
        
        if not booking:
            return jsonify({'error': 'Booking not found'}), 404
        
        return jsonify(dict(booking))
    except Exception as e:
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

@app.route('/api/bookings/user/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    """Get all bookings for a user - VUL: IDOR - no auth check"""
    try:
        # VUL: IDOR - Returns any user's bookings without checking if requester is that user
        conn = get_db()
        bookings = conn.execute(
            "SELECT * FROM bookings WHERE user_id=? ORDER BY created_at DESC",
            (user_id,)
        ).fetchall()
        conn.close()
        
        return jsonify([dict(b) for b in bookings])
    except Exception as e:
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    """Delete booking - VUL: IDOR vulnerability"""
    try:
        # VUL: No CSRF token validation
        # VUL: IDOR - Deletes any booking without user verification
        conn = get_db()
        conn.execute("DELETE FROM bookings WHERE id=?", (booking_id,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Booking deleted'})
    except Exception as e:
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

# ============================================================================
# REVIEW ENDPOINTS
# ============================================================================

@app.route('/api/hotels/<int:hotel_id>/reviews', methods=['POST'])
def add_review(hotel_id):
    """Add review to hotel - VUL: XSS, No CSRF"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        rating = data.get('rating')
        # FIX: XSS - sanitize comment input
        comment = html.escape(data.get('comment', ''))
        
        # VUL: No CSRF token validation
        # VUL: No user ownership verification
        
        conn = get_db()
        conn.execute(
            "INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
            (hotel_id, user_id, rating, comment)
        )
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Review added'}), 201
    except Exception as e:
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

# ============================================================================
# SEARCH ENDPOINT (with SQL Injection)
# ============================================================================

@app.route('/api/search', methods=['GET'])
def search():
    """Search hotels - VUL: SQL Injection"""
    try:
        query = request.args.get('q', '')
        
        conn = get_db()
        # FIX: Parameterized query for search
        sql = "SELECT * FROM hotels WHERE name LIKE ? OR description LIKE ?"
        search_pattern = f"%{query}%"
        results = conn.execute(sql, (search_pattern, search_pattern)).fetchall()
        conn.close()
        
        return jsonify([dict(r) for r in results])
    except Exception as e:
        # VUL: Information disclosure - exposes SQL errors
        return jsonify({'error': str(e), 'type': type(e).__name__}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print("=" * 60)
    print("Flask Backend Starting...")
    print(f"Backend running on: http://localhost:{port}")
    print(f"API test endpoint: http://localhost:{port}/api/test")
    print("=" * 60)
    app.run(debug=True, port=port)
