#!/bin/bash
# Test runner script for Constellation Viewer

echo "🧪 Running Constellation Viewer Tests..."
echo "======================================"

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root directory (one level up from scripts)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root directory
cd "$PROJECT_ROOT" || {
    echo "❌ Failed to change to project directory: $PROJECT_ROOT"
    exit 1
}

echo "📁 Working directory: $(pwd)"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install npm first."
    echo "   npm comes with Node.js"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    if ! npm install; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Check if Jest is available
if ! npx jest --version &> /dev/null; then
    echo "❌ Jest not found. Installing Jest..."
    if ! npm install --save-dev jest jest-environment-jsdom; then
        echo "❌ Failed to install Jest"
        exit 1
    fi
fi

# Run tests with better output
echo "🚀 Running Jest tests..."
echo "======================================"

if npm test; then
    echo "======================================"
    echo "✅ All tests passed successfully!"
    exit 0
else
    echo "======================================"
    echo "❌ Some tests failed!"
    echo ""
    echo "💡 Tips:"
    echo "   - Check the test output above for details"
    echo "   - Run 'npm run test:watch' for continuous testing"
    echo "   - Run 'npm run test:coverage' for coverage report"
    exit 1
fi
