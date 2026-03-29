# Capstone Project: Vulnerable Booking Application

**CSC 489 - Web Application Security | Spring 2026**

This is a deliberately vulnerable full-stack web application for Milestone 1.

> WARNING: This project intentionally contains security vulnerabilities for educational testing. Do not deploy to production.

## Quick Start (Scripts Only)

### Prerequisites

- Node.js 18+
- Python 3.8+
- uv (recommended for macOS/Linux)

### Option 1: macOS/Linux (.sh)

```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Windows (.bat)

```bat
start-dev.bat
```

### Option 3: Makefile (macOS/Linux)

```bash
# Start both frontend + backend
make dev

# Start backend only
make backend

# Start frontend only
make frontend
```

## Default URLs

- Frontend: http://localhost:3001
- Backend API: http://localhost:5001

Note: The startup scripts auto-select the next free port if these are occupied.

## Stop the App

- If using start-dev.sh: press Ctrl+C in the same terminal
- If using start-dev.bat: close the backend/frontend terminal windows
- If using make: press Ctrl+C in each running process terminal

## Test Credentials

- Username: testuser
- Password: password123

## Features Implemented

- User registration and login
- Hotel listing and city search
- Hotel detail page with reviews
- Booking creation, view, and deletion
- REST API backend with SQLite

## Intentional Vulnerabilities (7)

1. SQL Injection
2. Stored Cross-Site Scripting (XSS)
3. Insecure Direct Object Reference (IDOR)
4. Broken Authentication
5. Cross-Site Request Forgery (CSRF)
6. Weak Session Management
7. Information Disclosure

See PROJECT_SUMMARY.md for vulnerability locations and exploit payload examples.

## Project Structure

```text
capstone_project_team_phantom/
├── backend/
│   ├── app.py
│   ├── database.db
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── uv.lock
├── frontend/
│   ├── app/
│   ├── package.json
│   └── next.config.js
├── Makefile
├── start-dev.sh
├── start-dev.bat
├── README.md
└── PROJECT_SUMMARY.md
```

## Troubleshooting

### Port in Use

If ports are occupied, scripts can shift automatically. If needed:

```bash
# macOS/Linux
lsof -i :5001
lsof -i :3001
```

### Reset Database

```bash
rm backend/database.db
```

Then restart using one of the startup options above.
