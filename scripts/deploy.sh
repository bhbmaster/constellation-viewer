#!/bin/bash
# Deployment script for Constellation Viewer

echo "🚀 Deploying Constellation Viewer to GitHub..."
echo "============================================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Please run this from the project root."
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    git status --short
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled."
        exit 1
    fi
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Add, commit, and push changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Repository: https://github.com/bhbmaster/constellation-viewer"
    echo "📖 GitHub Pages: https://bhbmaster.github.io/constellation-viewer"
    echo ""
    echo "Note: GitHub Pages deployment may take a few minutes to complete."
else
    echo "❌ Push failed. Please check your git configuration and try again."
    exit 1
fi
