#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=5000
FRONTEND_PORT=5001
BACKEND_PID=""
FRONTEND_PID=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Mudra - Full Stack Application${NC}"
echo -e "${BLUE}  Development Mode${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down services...${NC}"
    if [ ! -z "$BACKEND_PID" ] && kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ] && kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${YELLOW}Stopping frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Kill any remaining processes on those ports
    lsof -ti:$BACKEND_PORT | xargs kill -9 2>/dev/null
    lsof -ti:$FRONTEND_PORT | xargs kill -9 2>/dev/null
    echo -e "${GREEN}✓ All services stopped${NC}"
    exit
}

trap cleanup EXIT INT TERM

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Port $port is in use. Killing existing process...${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null
    sleep 1
}

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}Node.js: $(node --version) | NPM: $(npm --version)${NC}"

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}✗ Please run this script from the project root directory${NC}"
    exit 1
fi

# Check and kill ports if in use
if check_port $BACKEND_PORT; then
    kill_port $BACKEND_PORT
fi
if check_port $FRONTEND_PORT; then
    kill_port $FRONTEND_PORT
fi

# Check if node_modules exist
echo -e "\n${BLUE}Checking dependencies...${NC}"
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Dependencies not found. Installing...${NC}"
    npm run install:all
    if [ $? -ne 0 ]; then
        echo -e "${RED}✗ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependencies found${NC}"
fi

# Check for .env files
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ Warning: backend/.env not found. Backend may not work correctly.${NC}"
fi

echo -e "\n${BLUE}Starting services...${NC}"
echo -e "${BLUE}========================================${NC}"

# Start Backend
echo -e "${GREEN}Starting Backend Server...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

sleep 2

# Start Frontend
echo -e "${GREEN}Starting Frontend Server...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Services Running${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Backend:  http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}✓ Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${YELLOW}Logs: backend.log, frontend.log${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Monitor processes
while true; do
    if [ ! -z "$BACKEND_PID" ] && ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}✗ Backend crashed! Check backend.log${NC}"
        cleanup
    fi
    if [ ! -z "$FRONTEND_PID" ] && ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}✗ Frontend crashed! Check frontend.log${NC}"
        cleanup
    fi
    sleep 5
done
