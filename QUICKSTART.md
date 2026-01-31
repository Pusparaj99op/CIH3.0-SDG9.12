# Mudra - Quick Start Guide

## Running the Full Application

You now have multiple ways to run both backend and frontend together:

### Option 1: Using NPM Scripts (Recommended)

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start

# Install all dependencies (backend + frontend)
npm run install:all

# Seed the database
npm run seed

# Build frontend for production
npm run build:frontend
```

### Option 2: Using Enhanced Bash Scripts

```bash
# Development mode
./start.sh

# Production mode
./start-prod.sh

# Production mode with frontend rebuild
./start-prod.sh --rebuild
```

## What Gets Started

- **Backend**: Runs on `http://localhost:5000` (or port specified in backend/.env)
- **Frontend**: Runs on `http://localhost:3000`

## Enhanced Script Features

### Development Mode (`./start.sh`)
- ✓ Automatic port checking and cleanup
- ✓ Dependency verification
- ✓ Process monitoring (auto-restart on crash)
- ✓ Log files: `backend.log`, `frontend.log`
- ✓ Graceful shutdown with Ctrl+C

### Production Mode (`./start-prod.sh`)
- ✓ All development features plus:
- ✓ Production environment variables
- ✓ Automatic frontend build (if needed)
- ✓ `.env` file validation
- ✓ PID file tracking (`.backend.pid`, `.frontend.pid`)
- ✓ Separate production logs: `backend-prod.log`, `frontend-prod.log`
- ✓ Force rebuild option: `./start-prod.sh --rebuild`

## Individual Services

If you need to run services separately:

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## First Time Setup

```bash
# Install all dependencies
npm run install:all

# Create backend/.env file (required!)
# Add your configuration:
# - MongoDB connection string
# - JWT secret
# - Other environment variables

# Seed the database (optional)
npm run seed

# Start in development mode
npm run dev
# OR
./start.sh
```

## Stopping the Application

- Press `Ctrl+C` to stop all services
- All ports will be automatically cleaned up
- Process monitoring ensures clean shutdown

## Ports

Make sure these ports are available:
- Backend: 5000
- Frontend: 3000

The scripts will automatically kill any processes using these ports before starting.

## Environment Variables

Ensure you have the required `.env` files:
- `backend/.env` - Backend configuration (REQUIRED)
- `frontend/.env.local` - Frontend configuration (optional)

## Troubleshooting

### Check Logs
```bash
# Development logs
tail -f backend.log
tail -f frontend.log

# Production logs
tail -f backend-prod.log
tail -f frontend-prod.log
```

### Process Issues
If services don't start, the scripts will:
- Show Node.js version
- Verify directory structure
- Check dependencies
- Kill port conflicts
- Display helpful error messages

### Manual Port Cleanup
```bash
# Kill backend port
lsof -ti:5000 | xargs kill -9

# Kill frontend port
lsof -ti:3000 | xargs kill -9
```
