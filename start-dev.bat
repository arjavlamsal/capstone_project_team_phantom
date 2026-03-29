@echo off
REM Windows Development Startup Script for Capstone Project
REM This script starts both the Flask backend and Next.js frontend

setlocal enabledelayedexpansion

echo 🚀 Starting Capstone Project Development Environment...
echo.

REM Install backend dependencies
echo [1/4] Installing backend dependencies...
cd backend

REM Check if venv exists
if not exist venv (
	echo       Creating virtual environment...
	python -m venv venv
)

REM Activate venv and install requirements
call venv\Scripts\activate.bat
python -m pip install -r requirements.txt > nul 2>&1
cd ..
echo       ✓ Backend dependencies installed
echo.

REM Install frontend dependencies
echo [2/4] Installing frontend dependencies...
cd frontend
call npm install > nul 2>&1
cd ..
echo       ✓ Frontend dependencies installed
echo.

REM Start backend in background
echo [3/4] Starting Flask Backend (localhost:5001)...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate.bat && python app.py"
echo       ✓ Backend started in new window
echo.

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in background
echo [4/4] Starting Next.js Frontend (localhost:3001)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo       ✓ Frontend started in new window
echo.

echo ========================================
echo ✅ Development environment ready!
echo ========================================
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:3001
echo ========================================
echo Close each window individually to stop
echo ========================================
echo.

exit /b 0
