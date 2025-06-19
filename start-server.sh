#!/bin/bash

echo "Starting Figma Plugin Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if server is already running
if curl -s http://localhost:5500 > /dev/null 2>&1; then
    echo "Server is already running at http://localhost:5500"
    exit 0
fi

# Start the server in background
echo "Starting server on port 5500..."
nohup node server.js > /dev/null 2>&1 &

# Wait a moment for server to start
sleep 2

# Verify server started
if curl -s http://localhost:5500 > /dev/null 2>&1; then
    echo "Server started successfully at http://localhost:5500"
else
    echo "Failed to start server"
    exit 1
fi