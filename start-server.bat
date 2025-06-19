@echo off
echo Starting Figma Plugin Server...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if server is already running
curl -s http://localhost:5500 >nul 2>&1
if %errorlevel% equ 0 (
    echo Server is already running at http://localhost:5500
    exit /b 0
)

REM Start the server
echo Starting server on port 5500...
start /b node server.js

REM Wait a moment for server to start
timeout /t 2 /nobreak >nul

REM Verify server started
curl -s http://localhost:5500 >nul 2>&1
if %errorlevel% equ 0 (
    echo Server started successfully at http://localhost:5500
) else (
    echo Failed to start server
    pause
    exit /b 1
)