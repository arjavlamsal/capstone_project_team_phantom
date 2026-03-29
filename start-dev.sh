#!/bin/bash
# macOS/Linux Development Startup Script for Capstone Project
# This script starts both the Flask backend and Next.js frontend

set -e

BACKEND_PID=""
FRONTEND_PID=""
BACKEND_WAS_STARTED="false"
FRONTEND_WAS_STARTED="false"

find_free_port() {
    local port=$1
    while lsof -iTCP:"$port" -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
    done
    echo "$port"
}

wait_for_backend_health() {
    local port=$1
    local retries=20
    local delay=1
    local i

    for ((i = 1; i <= retries; i++)); do
        if curl -fsS "http://localhost:${port}/api/test" >/dev/null 2>&1; then
            return 0
        fi
        sleep "$delay"
    done
    return 1
}

echo "🚀 Starting Capstone Project Development Environment..."
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    if [ "$BACKEND_WAS_STARTED" = "true" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ "$FRONTEND_WAS_STARTED" = "true" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    exit 0
}

# Trap Ctrl+C to cleanup
trap cleanup EXIT INT TERM

# Install backend dependencies
echo "[1/4] Installing backend dependencies..."
cd backend

if command -v uv &> /dev/null; then
    echo "      ✓ Using uv for package management"
    uv pip install -r requirements.txt
    USE_UV="true"
else
    echo "      ⚠️  uv not found. Using pip instead..."
    python3 -m pip install -r requirements.txt
    USE_UV="false"
fi

cd ..
echo "      ✓ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "      ✓ Frontend dependencies installed"
echo ""

# Decide backend port and startup strategy
DEFAULT_BACKEND_PORT=5001
BACKEND_PORT="$DEFAULT_BACKEND_PORT"

if curl -fsS "http://localhost:${DEFAULT_BACKEND_PORT}/api/test" >/dev/null 2>&1; then
    echo "[3/4] Backend already running on localhost:${DEFAULT_BACKEND_PORT}"
    echo "      ✓ Reusing existing backend instance"
else
    if lsof -iTCP:"$DEFAULT_BACKEND_PORT" -sTCP:LISTEN -t >/dev/null 2>&1; then
        BACKEND_PORT=$(find_free_port 5002)
        echo "[3/4] Port ${DEFAULT_BACKEND_PORT} is occupied by another process"
        echo "      ✓ Starting Flask Backend on port ${BACKEND_PORT} instead"
    else
        echo "[3/4] Starting Flask Backend (localhost:${BACKEND_PORT})..."
    fi

    if [ "$USE_UV" = "true" ]; then
        (cd backend && PORT="$BACKEND_PORT" uv run app.py) &
    else
        (cd backend && PORT="$BACKEND_PORT" python3 app.py) &
    fi
    BACKEND_PID=$!
    BACKEND_WAS_STARTED="true"

    if ! wait_for_backend_health "$BACKEND_PORT"; then
        echo "      ✗ Backend failed health check at http://localhost:${BACKEND_PORT}/api/test"
        echo "      ℹ️  Check for startup errors above and retry"
        exit 1
    fi

    echo "      ✓ Backend started (PID: $BACKEND_PID)"
fi

API_BASE_URL="http://localhost:${BACKEND_PORT}"
echo ""

# Start frontend in background
FRONTEND_PORT=$(find_free_port 3001)
echo "[4/4] Starting Next.js Frontend (localhost:${FRONTEND_PORT})..."
(cd frontend && NEXT_PUBLIC_API_BASE_URL="$API_BASE_URL" PORT="$FRONTEND_PORT" npm run dev) &
FRONTEND_PID=$!
FRONTEND_WAS_STARTED="true"
echo "      ✓ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "========================================"
echo "✅ Development environment ready!"
echo "========================================"
echo "Backend:  $API_BASE_URL"
echo "Frontend: http://localhost:${FRONTEND_PORT}"
echo "========================================"
echo "Press Ctrl+C to stop"
echo "========================================"
echo ""

# Keep script running and wait for processes
wait
