# Interactive Star Map & Constellation Viewer

A modern, high-performance web application for exploring the night sky with real-time astronomical calculations, constellation visualization, and solar system object tracking.

## Features

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

## Quick Start

### Prerequisites
- Modern web browser with ES6 module support
- Python 3.x (for development server) or Node.js (for build tools)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/constellation-viewer.git
   cd constellation-viewer
   ```

2. **Install dependencies** (optional, for development)
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   # Using Python (recommended for quick start)
   python -m http.server 8000 --directory src
   
   # Or using npm
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8000` to view the star map.

### Production Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

### Navigation
- **Mouse Drag**: Pan across the sky
- **Mouse Wheel**: Zoom in/out
- **Double-click Object**: Follow an object (keeps it centered)
- **Touch Drag**: Pan (mobile)
- **Pinch**: Zoom (mobile)

### Time Controls
- **Manual Buttons**: Navigate by second, minute, hour, day, month, year
- **Play/Pause**: Start/stop time animation
- **Speed Selector**: Choose time acceleration (1 sec/sec to 1 year/sec)
- **Fast Controls**: 10x speed in either direction

### Search
- **Type in search box**: Find stars, planets, and deep sky objects
- **Arrow Keys**: Navigate search results
- **Enter**: Select and follow an object
- **Escape**: Close search results

### Keyboard Shortcuts
- **Space**: Play/pause time animation
- **U**: Unfollow current object
- **?**: Show/hide help
- **Escape**: Close modals and search

## Architecture

### File Structure
```
src/
├── components/          # Main application components
│   ├── StarMap.js      # Core rendering and interaction engine
│   ├── SolarSystem.js  # Solar system calculations
│   └── ObjectSearch.js # Search functionality
├── data/               # Astronomical data
│   └── ConstellationData.js
├── utils/              # Utility functions
│   ├── Constants.js    # Application constants
│   ├── CoordinateUtils.js # Coordinate transformations
│   ├── TimeUtils.js    # Time calculations
│   └── MathUtils.js    # Mathematical utilities
├── styles/             # CSS styles
│   └── main.css
├── tests/              # Unit tests
│   ├── setup.js
│   ├── CoordinateUtils.test.js
│   └── SolarSystem.test.js
├── index.html          # Main HTML file
└── main.js            # Application entry point
```

### Key Classes

#### StarMap
The main application class that handles:
- Canvas rendering and interaction
- Event handling (mouse, touch, keyboard)
- View management and coordinate transformations
- Performance optimization and caching

#### SolarSystem
Handles astronomical calculations for:
- Sun, Moon, and planet positions
- Orbital mechanics and time-based calculations
- Julian Day Number conversions

#### ObjectSearch
Provides search functionality for:
- Stars, planets, and deep sky objects
- Fuzzy text matching and filtering
- Search result ranking and display

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Performance Monitoring
The application includes built-in performance monitoring that displays:
- Frame rate (FPS)
- Average render time
- Cache size
- Memory usage

### Adding New Features

1. **New Constellations**: Add data to `src/data/ConstellationData.js`
2. **New Deep Sky Objects**: Extend the `DEEP_SKY_OBJECTS` array
3. **New Solar System Objects**: Add orbital elements to `SolarSystem.js`
4. **New UI Components**: Create in `src/components/` and import in `main.js`

## Technical Details

### Coordinate Systems
- **Right Ascension (RA)**: Hours (0-24)
- **Declination (Dec)**: Degrees (-90 to +90)
- **Stereographic Projection**: Used for sky-to-screen conversion
- **Local Sidereal Time**: Calculated for accurate sky positioning

### Performance Optimizations
- **Position Caching**: Cached coordinate transformations
- **Render Throttling**: 60 FPS maximum update rate
- **Memory Management**: Automatic cache cleanup
- **Efficient Algorithms**: Optimized mathematical calculations

### Browser Compatibility
- **ES6 Modules**: Required for modern JavaScript features
- **Canvas API**: For 2D rendering
- **Touch Events**: For mobile support
- **Performance API**: For monitoring (optional)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Hipparcos Catalog** for star position data
- **Messier Catalog** for deep sky object data
- **NASA JPL** for planetary orbital elements
- **Astronomical Algorithms** by Jean Meeus for calculation methods

## Changelog

### Version 2.0.0
- Complete rewrite with modern ES6+ modules
- Fixed mouse dragging functionality
- Added comprehensive search system
- Implemented performance optimizations
- Added mobile touch support
- Enhanced error handling and loading states
- Added unit tests and documentation
- Improved accessibility and keyboard navigation

### Version 1.0.0
- Initial release with basic constellation viewing
- Solar system object tracking
- Time controls and playback
- Basic coordinate grid and star rendering
