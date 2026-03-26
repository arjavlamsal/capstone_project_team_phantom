# Capstone Project Starter Template
CSC 489 - Web Application Security | Spring 2026

This is a minimal boilerplate template to get you started with your capstone project. It includes a Next.js frontend, Flask backend, and SQLite database.

## Quick Start

### Prerequisites

Make sure you have these installed:
- **Node.js** v18+ ([download](https://nodejs.org/))
- **Python** 3.8+ ([download](https://www.python.org/downloads/))
- **uv** ([install](https://docs.astral.sh/uv/getting-started/installation/))

Check versions:
```bash
node --version
python --version  # or python3 --version
uv --version
```

### Installation

**1. Setup Backend (Flask) with uv**

```bash
cd backend

# Create lockfile + virtual environment and install dependencies
uv sync

# Run backend
uv run app.py
```

Backend will run on: `http://localhost:5000`

**IMPORTANT:** Keep this terminal open and running!

---

**2. Setup Frontend (Next.js)** 

Open a **NEW** terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

---

**3. Open in Browser**

Go to: [http://localhost:3000](http://localhost:3000)

You should see the starter page with a green "Connected" message.

## Make Commands

From the project root, you can use:

```bash
make backend   # uv sync + run Flask backend
make frontend  # run Next.js frontend
make dev       # run backend + frontend together
```

## Project Structure

```
capstone-starter-template/
├── backend/                # Flask API
│   ├── app.py             # Main Flask application
│   ├── pyproject.toml     # Python project metadata + dependencies
│   ├── uv.lock            # Locked Python dependencies for uv
│   ├── .venv/             # Virtual environment (created by uv)
│   ├── database.db        # SQLite database (auto-created)
│   └── README.md          # Backend documentation
│
├── frontend/              # Next.js UI
│   ├── app/               # Pages and components
│   │   ├── layout.jsx    # Main layout
│   │   └── page.jsx      # Home page
│   ├── package.json       # Node dependencies
│   ├── node_modules/      # Node packages (created by npm install)
│   └── README.md          # Frontend documentation
│
├── Makefile               # Convenience commands for local development
│
└── README.md              # This file
```

## Default Test User

The database comes with one test user:
- **Username:** `admin`
- **Password:** `admin123`

## Daily Workflow

### Starting Your Work Session

**Terminal 1 (Backend):**
```bash
cd backend
uv run app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Stopping Your Work Session

**Terminal 1:** Press `Ctrl+C` to stop Flask

**Terminal 2:** Press `Ctrl+C` to stop Next.js

## What to Build

This template provides the basic structure. You need to:

1. **Design your application** - What will it do? Who uses it?
2. **Add features** - Login, profiles, posts, search, etc.
3. **Implement vulnerabilities** - SQL injection, XSS, CSRF, IDOR, etc.
4. **Document everything** - README, code comments, vulnerability notes

## Adding Features

### Backend (Flask)

Add new API endpoints in `backend/app.py`:

```python
@app.route('/api/your-endpoint', methods=['POST'])
def your_function():
    data = request.get_json()
    # Your logic here
    return jsonify({'message': 'Success!'})
```

### Frontend (Next.js)

Create new pages in `frontend/app/`:

```
frontend/app/
└── your-page/
    └── page.jsx
```

This creates the route: `http://localhost:3000/your-page`

## Resources

- **AI Prompt Library** (Canvas Files) - 50+ prompts to generate features
- **Vulnerability Guide** (Canvas Files) - Code examples for each vulnerability type
- **Quick Reference** (Canvas Files) - Troubleshooting and commands
- **Next.js Docs:** https://nextjs.org/docs
- **Flask Docs:** https://flask.palletsprojects.com/

## Troubleshooting

**"externally-managed-environment" error (macOS/Linux):**
```bash
# Use uv to install dependencies in project virtual environment
cd backend
uv sync
```

**Backend won't start:**
```bash
# Make sure you're in the backend folder with dependencies synced
cd backend
uv sync
uv run app.py
```

**Frontend won't start:**
```bash
# Make sure you're in the frontend folder
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**"Backend not running" message:**
- Make sure Flask is running on port 5000
- Check for error messages in the Flask terminal
- Try restarting both servers

**Database errors:**
- Delete `backend/database.db` and restart Flask
- Database will auto-recreate with test user

**Port already in use:**
```bash
# Find and kill process on port 5000
lsof -i :5000
kill -9 [PID]

# Or use different port in app.py
app.run(debug=True, port=5001)
```

## Git/Version Control

### .gitignore File

Create `.gitignore` in your project root:

```
# Python
__pycache__/
*.pyc
*.pyo
*.db
.venv/
venv/
env/

# Node
node_modules/
.next/
out/

# OS
.DS_Store
.env
```

**IMPORTANT:** Add `.venv/` (or `venv/`) to `.gitignore` - never commit your virtual environment!

## Need Help?

- **In-class:** Tuesday & Thursday work sessions
- **Office Hours:** Tu-Th 3:00-3:55 PM, TEC 380
- **Email:** oluseyi.olukola@usm.edu

---

**You're ready to start building! 🚀**

Customize this template, add your features, and implement your vulnerabilities.

Good luck!
