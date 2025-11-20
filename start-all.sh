#!/bin/bash

# CityCars - Start All Services (Module Federation Architecture)
# Proxy: localhost:3000 (routes to main/admin)
# Main App: localhost:3001 (internal)
# Admin Portal: localhost:4000 (internal)

echo "🚀 Starting CityCars Services (Module Federation)..."
echo ""

# Kill existing processes
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:4000 | xargs kill -9 2>/dev/null
pkill -f "nuxt dev" 2>/dev/null
pkill -f "proxy-server" 2>/dev/null
sleep 2

# Start Main App (Port 3001 - internal)
echo "🟢 Starting Main App on port 3001..."
pnpm dev > logs/main.log 2>&1 &
MAIN_PID=$!
echo "   Main PID: $MAIN_PID"

# Wait for main app to start
sleep 5

# Start Admin Portal (Port 4000 - internal)
echo "🟠 Starting Admin Portal on port 4000..."
cd admin && pnpm dev > ../logs/admin.log 2>&1 &
ADMIN_PID=$!
echo "   Admin PID: $ADMIN_PID"
cd ..

# Wait for admin to start
sleep 5

# Start Proxy Server (Port 3000 - public facing)
echo "🔀 Starting Proxy Server on port 3000..."
node proxy-server.cjs > logs/proxy.log 2>&1 &
PROXY_PID=$!
echo "   Proxy PID: $PROXY_PID"

# Wait for proxy to start
sleep 3

echo ""
echo "✅ All services started!"
echo ""
echo "📍 Access Points:"
echo "   🌐 Public Proxy:  http://localhost:3000"
echo "   📱 Main App:      http://localhost:3000"
echo "   ⚙️  Admin Portal:  http://localhost:3000/admin"
echo ""
echo "🔧 Internal Ports:"
echo "   Main App:      localhost:3001"
echo "   Admin Portal:  localhost:4000"
echo ""
echo "📊 Logs:"
echo "   Proxy:        tail -f logs/proxy.log"
echo "   Main App:     tail -f logs/main.log"
echo "   Admin Portal: tail -f logs/admin.log"
echo ""
echo "🛑 To stop all services:"
echo "   ./stop-all.sh"
echo ""

# Keep script running
wait
