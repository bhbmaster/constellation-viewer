#!/bin/bash
# Development server startup script

echo "🌟 Starting Constellation Viewer Development Server..."
echo "=================================================="

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js found: $(node --version)"
    
    # Check if http-server is available
    if command -v npx &> /dev/null; then
        echo "✅ Starting development server with http-server..."
        echo "🌐 Server will be available at: http://localhost:8000"
        echo "📁 Serving files from: src/"
        echo ""
        echo "Press Ctrl+C to stop the server"
        echo "=================================================="
        
        cd "$(dirname "$0")/.."
        npx http-server src -p 8000 -o --cors
    else
        echo "❌ npx not found. Please install Node.js and npm."
        exit 1
    fi
else
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi
