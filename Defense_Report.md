# Team Phantom - Milestone 3 Defense Report

## 1. Executive Summary

This report documents the security remediation of the Team Phantom Bookings Application. The application was previously assessed in Milestone 2 and found to contain critical vulnerabilities, including SQL Injection, Cross-Site Scripting (XSS), Insecure Direct Object References (IDOR), and Broken Authentication.

All 7 vulnerabilities have been thoroughly analyzed, safely remediated, and re-tested to ensure the exploits are no longer achievable while preserving application functionality.

---

## 2. Vulnerability Remediation Details

### Vulnerability 1: SQL Injection (Critical)
**Location:** `backend/app.py` `GET /api/hotels` and `GET /api/search` endpoints.  
**Description:** Untrusted input was directly interpolated into SQL queries.  
**Remediation:** We refactored both endpoints to utilize parameterized SQL queries.  
**Before Code:**
```python
query += f" AND city LIKE '%{city_filter}%'"
```
**After Code:**
```python
query += " AND city LIKE ?"
params.append(f"%{city_filter}%")
```
**Verification:** Running `GET /api/hotels?city=' OR '1'='1` now safely returns nothing instead of returning the entire hotel database, verifying that the payload is treated strictly as data.

### Vulnerability 2: Stored Cross-Site Scripting (XSS) (Critical)
**Location:** `backend/app.py` `POST /api/hotels/<id>/reviews` and `frontend/app/hotels/[id]/page.jsx`.  
**Description:** Review comments were stored without HTML escaping and rendered dangerously.  
**Remediation:** We implemented `html.escape()` for storage and removed `dangerouslySetInnerHTML` on the React frontend.  
**Before Code (Frontend):**
```javascript
<div dangerouslySetInnerHTML={{ __html: review.comment }} />
```
**After Code (Frontend):**
```javascript
<div>{review.comment}</div>
```
**Verification:** Attempting to inject `<script>alert(1)</script>` results in the raw text being displayed to the browser safely without executing any code.

### Vulnerability 3: Broken Authentication (Critical)
**Location:** `backend/app.py` `register` and `login` endpoints.  
**Description:** Passwords were saved and compared in plaintext, and hardcoded credentials were used.  
**Remediation:** We integrated `werkzeug.security` to enforce password hashing with `generate_password_hash` and `check_password_hash`. We removed hardcoded default credentials from both the frontend UI and the backend login verification.  
**Before Code:**
```python
if user and user['password'] == password:
```
**After Code:**
```python
if user and check_password_hash(user['password'], password):
```
**Verification:** Submitting plaintext passwords during login fails unless it matches the generated bcrypt hash in the database.

### Vulnerability 4: Insecure Direct Object Reference - IDOR (High)
**Location:** `backend/app.py` `/api/bookings` endpoints.  
**Description:** Users could view and delete other guests' bookings by altering the ID parameters.  
**Remediation:** We created a `@jwt_required` decorator that extracts the secure `user_id` from the JWT token and verifies that the logged-in user owns the requested record.  
**Before Code:**
```python
conn.execute("DELETE FROM bookings WHERE id=?", (booking_id,))
```
**After Code:**
```python
if booking['user_id'] != request.current_user['user_id']:
    return jsonify({'error': 'Unauthorized'}), 403
```
**Verification:** Modifying the `userId` in the frontend console to view user 2's bookings while logged in as user 1 immediately returns a `403 Unauthorized` status code.

### Vulnerability 5: Cross-Site Request Forgery - CSRF (Medium)
**Location:** `backend/app.py` globally.  
**Description:** Attackers could trick logged-in users into submitting state-changing requests passively.  
**Remediation:** Added `X-Requested-With: XMLHttpRequest` validation globally for all POST, PUT, DELETE, and PATCH methods to prevent off-site form submissions.  
**Before Code (Backend Handling):**
*(No validation)*
**After Code (Middleware):**
```python
@app.before_request
def require_csrf_header():
    if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
        if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
            return jsonify({'error': 'CSRF validation failed'}), 403
```
**Verification:** A traditional HTML form `<form action="/api/bookings" method="POST">` submitted without custom headers is rejected.

### Vulnerability 6: Weak Session Management (Medium)
**Location:** Session token issuance in `backend/app.py`.  
**Description:** JWT tokens were sent insecurely, lasted 365 days, and were stored in `localStorage` making them vulnerable to XSS theft.  
**Remediation:** Migrated the JWT to be stored in an `HttpOnly, SameSite=Lax` cookie and reduced its lifespan strictly to 1 hour. Additionally, implemented an `/api/logout` endpoint to explicitly drop the cookie since HttpOnly cookies cannot be cleared client-side, resolving the ineffective logout vulnerability.  
**Before Code:**
```javascript
localStorage.setItem("token", data.token);
```
**After Code:**
```python
resp.set_cookie('token', token, httponly=True, samesite='Lax', max_age=3600)
```
**Verification:** The `token` cannot be accessed via `document.cookie` or `localStorage`, rendering session theft via XSS impossible.

### Vulnerability 7: Information Disclosure (Low)
**Location:** Global backend `Exception` handling.  
**Description:** Python stack traces and exact SQLite database schemas were leaked upon arbitrary application failures.  
**Remediation:** Caught exceptions are now logged gracefully to stdout on the server side but return simple strings like `An internal error occurred`.  
**Before Code:**
```python
return jsonify({'error': str(e), 'type': type(e).__name__}), 400
```
**After Code:**
```python
return jsonify({'error': 'An internal error occurred.'}), 500
```
**Verification:** Deliberately failing application constraints no longer exposes underlying model paths or tracebacks.

---

## 3. Lessons Learned

By fixing this application top-to-bottom, we reinforced key AppSec concepts:
1. **Never trust input:** Whether it's the `city` ID for a query or the body of a comment, every value intersecting our logical domains must be checked, escaped, and parameterized at the point of action.
2. **Shift-Left Authentication:** Rather than trusting ID parameters, identity should always exclusively derive from backend-verified cryptographic sessions (like JWT).
3. **Defense in Depth makes a difference:** An active XSS vulnerability combined with a loose JWT inside `localStorage` created an immediate path for complete Account Takeover. Simply migrating to `HttpOnly` cookie mitigated the session-theft independently of fixing the XSS payload injection.
