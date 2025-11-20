#!/bin/bash

# CityCars - Build All Applications for Production

echo "🏗️  Building CityCars for Production..."
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .output
rm -rf .nuxt
rm -rf admin/.output
rm -rf admin/.nuxt
echo "   ✓ Cleaned"
echo ""

# Build Main App
echo "🟢 Building Main App..."
pnpm build
if [ $? -eq 0 ]; then
  echo "   ✓ Main App built successfully"
else
  echo "   ✗ Main App build failed"
  exit 1
fi
echo ""

# Build Admin Portal
echo "🟠 Building Admin Portal..."
cd admin
pnpm build
if [ $? -eq 0 ]; then
  echo "   ✓ Admin Portal built successfully"
else
  echo "   ✗ Admin Portal build failed"
  exit 1
fi
cd ..
echo ""

echo "✅ All applications built successfully!"
echo ""
echo "📦 Build Outputs:"
echo "   Main App:      .output/"
echo "   Admin Portal:  admin/.output/"
echo ""
