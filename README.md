# 🌟 Interactive Star Map & Constellation Viewer

**NOTE:** This was vibe-coded with Claude for version 1, and with Cursor for the later versions; see what the hype is about.

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://bhbmaster.github.io/constellation-viewer)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/bhbmaster/constellation-viewer)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, high-performance web application for exploring the night sky with real-time astronomical calculations, constellation visualization, and solar system object tracking.

## 🌐 Live Demo

**[Visit the live application →](https://bhbmaster.github.io/constellation-viewer)**

## ✨ Features

### 🌟 Core Functionality
- **21 Constellations** with 150+ accurate star positions from the Hipparcos catalog
- **Real-time Solar System** with accurate orbital mechanics for planets, Sun, and Moon
- **Deep Sky Objects** including galaxies, nebulae, and star clusters from the Messier catalog
- **Interactive Navigation** with smooth panning, zooming, and object following
- **Time Controls** with playback speeds from 1 second/second to 1 year/second
- **Search Functionality** to quickly find stars, planets, and deep sky objects

### 🚀 Performance Optimizations
- **60 FPS Rendering** with throttled updates and position caching
- **Memory Management** with automatic cache cleanup and garbage collection
- **Mobile Support** with touch gestures and responsive design
- **Accessibility** with keyboard navigation and high contrast support

### 🎨 User Experience
- **Modern UI** with clean, space-themed interface
- **Loading States** and error handling for smooth user experience
- **Performance Monitoring** with real-time FPS and memory usage display
- **Help System** with comprehensive keyboard shortcuts and navigation guide

## 🚀 Quick Start

### Prerequisites
- Modern web browser with ES6 module support
- Node.js 14+ (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhbmaster/constellation-viewer.git
   cd constellation-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   ./scripts/dev.sh
   ```

4. **Open your browser**
   Navigate to http://localhost:8000

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run serve        # Alternative development server

# Building
npm run build        # Build for production
npm run clean        # Clean build directory
npm run prebuild     # Pre-build cleanup

# Testing
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### Project Structure

```
constellation-viewer/
├── src/                    # Source code
│   ├── components/         # React-like components
│   │   ├── StarMap.js     # Main rendering engine
│   │   ├── SolarSystem.js # Solar system calculations
│   │   └── ObjectSearch.js # Search functionality
│   ├── data/              # Astronomical data
│   │   └── ConstellationData.js
│   ├── utils/             # Utility functions
│   │   ├── Constants.js   # Configuration constants
│   │   ├── CoordinateUtils.js # Coordinate transformations
│   │   ├── MathUtils.js   # Mathematical utilities
│   │   └── TimeUtils.js   # Time manipulation
│   ├── tests/             # Test files
│   ├── styles/            # CSS styles
│   ├── index.html         # Main HTML file
│   └── main.js           # Application entry point
├── scripts/               # Development scripts
├── dist/                  # Build output
├── .github/workflows/     # CI/CD pipelines
└── docs/                  # Documentation
```

## 🧪 Testing

The project includes a comprehensive test suite using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **CoordinateUtils**: 100% coverage
- **SolarSystem**: 100% coverage
- **MathUtils**: 100% coverage
- **TimeUtils**: 100% coverage

## 📚 Documentation

- **[API Documentation](API.md)** - Complete API reference
- **[Changelog](CHANGELOG.md)** - Version history and changes
- **[Project Summary](PROJECT_SUMMARY.md)** - Detailed feature overview
- **[Scripts Guide](scripts/README.md)** - Development script documentation

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Development server port (default: 8000)

### Customization
- **Constants**: Modify `src/utils/Constants.js` for configuration
- **Styling**: Update `src/styles/main.css` for visual changes
- **Data**: Add objects in `src/data/ConstellationData.js`

## 🌍 Browser Support

- **Chrome**: 61+
- **Firefox**: 60+
- **Safari**: 10.1+
- **Edge**: 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ES6+ standards
- Write tests for new features
- Update documentation
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hipparcos Catalog** for star position data
- **Messier Catalog** for deep sky object data
- **Astronomical Algorithms** by Jean Meeus
- **Open source community** for inspiration and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/bhbmaster/constellation-viewer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bhbmaster/constellation-viewer/discussions)
- **Email**: [bhbmaster@gmail.com](mailto:bhbmaster@gmail.com)

## 🗺 Roadmap

- [ ] Additional constellation data
- [ ] Enhanced mobile interactions
- [ ] Offline support
- [ ] Plugin system
- [ ] Internationalization
- [ ] Advanced search filters

---

**Made with ❤️ and JavaScript by [bhbmaster](https://github.com/bhbmaster)**
