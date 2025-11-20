#!/bin/bash

# CityCars - Production Startup Script
# Used by DigitalOcean App Platform

echo "🚀 Starting CityCars in Production Mode..."

# Start Main App (port 3001)
echo "🟢 Starting Main App on port 3001..."
PORT=3001 node .output/server/index.mjs &
MAIN_PID=$!
echo "   Main App PID: $MAIN_PID"

# Wait for main app
sleep 5

# Start Admin Portal (port 4000)
echo "🟠 Starting Admin Portal on port 4000..."
PORT=4000 node admin/.output/server/index.mjs &
ADMIN_PID=$!
echo "   Admin Portal PID: $ADMIN_PID"

# Wait for admin
sleep 5

# Start Proxy (port from $PORT env or 8080)
echo "🔀 Starting Proxy Server..."
MAIN_PORT=3001 ADMIN_PORT=4000 node proxy-production.cjs &
PROXY_PID=$!
echo "   Proxy PID: $PROXY_PID"

echo ""
echo "✅ All services started!"
echo ""

# Keep running
wait

