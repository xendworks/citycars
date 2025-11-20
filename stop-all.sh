#!/bin/bash

# CityCars - Stop All Services

echo "🛑 Stopping CityCars Services..."

# Kill processes on ports
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:4000 | xargs kill -9 2>/dev/null

# Kill nuxt and proxy processes
pkill -f "nuxt dev" 2>/dev/null
pkill -f "proxy-server" 2>/dev/null
pkill -f "node proxy-server" 2>/dev/null

sleep 2

echo "✅ All services stopped!"
echo ""
echo "Killed ports: 3000 (proxy), 3001 (main), 4000 (admin)"

