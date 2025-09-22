# 🚀 Development Scripts

This directory contains convenient scripts for developing and testing the Constellation Viewer.

## 📋 Available Scripts

### 🌟 `dev.sh` - Development Server
Starts the development server with hot reloading and CORS support.

```bash
# Run the development script
./scripts/dev.sh

# Or from the project root
bash scripts/dev.sh
```

**What it does:**
- ✅ Checks for Node.js and npm
- 🌐 Starts http-server on port 8000
- 📁 Serves files from `src/` directory
- 🔄 Enables CORS for development
- 🎯 Automatically opens browser

**Server will be available at:** http://localhost:8000

### 🧪 `test.sh` - Test Runner
Runs the complete test suite using Jest.

```bash
# Run the test script
./scripts/test.sh

# Or from the project root
bash scripts/test.sh
```

**What it does:**
- ✅ Checks for Node.js and npm
- 📦 Installs dependencies if needed
- 🧪 Runs Jest test suite
- 📊 Shows test results and coverage

## 🛠 Alternative Methods

### Using npm scripts (recommended)
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### Using npx directly
```bash
# Start development server
npx http-server src -p 8000 -o --cors

# Run tests
npx jest
```

### Using Node.js directly
```bash
# Start development server
node -e "require('http-server').createServer({root:'src',cors:true}).listen(8000,()=>console.log('Server running at http://localhost:8000'))"
```

## 🔧 Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **npx** (comes with npm)

## 📁 Project Structure

```
constellation/
├── scripts/           # Development scripts
│   ├── dev.sh        # Start development server
│   ├── test.sh       # Run test suite
│   └── README.md     # This file
├── src/              # Source code
│   ├── index.html    # Main HTML file
│   ├── main.js       # Application entry point
│   └── ...           # Other source files
└── package.json      # npm scripts and dependencies
```

## 🎯 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd constellation
   ```

2. **Start development server**
   ```bash
   ./scripts/dev.sh
   ```

3. **Open your browser**
   Navigate to http://localhost:8000

4. **Run tests** (in another terminal)
   ```bash
   ./scripts/test.sh
   ```

## 🐛 Troubleshooting

### Node.js not found
```bash
# Install Node.js from https://nodejs.org/
# Or using a package manager:
brew install node          # macOS
sudo apt install nodejs    # Ubuntu/Debian
```

### Permission denied
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

### Port already in use
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
npx http-server src -p 8080 -o --cors
```

### Dependencies not found
```bash
# Install dependencies
npm install
```

## 📚 More Information

- **Main README**: See `../README.md` for complete project documentation
- **Project Summary**: See `../PROJECT_SUMMARY.md` for detailed feature list
- **Package Info**: See `../package.json` for all available scripts
