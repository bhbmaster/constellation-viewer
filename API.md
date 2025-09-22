# API Documentation

## Overview

The Constellation Viewer is built with a modular ES6 architecture. This document provides comprehensive API documentation for all components and utilities.

## Core Components

### StarMap Class

The main rendering and interaction engine.

**Location**: `src/components/StarMap.js`

#### Constructor
```javascript
new StarMap(canvas, options)
```

**Parameters**:
- `canvas` (HTMLCanvasElement): The canvas element to render on
- `options` (Object): Configuration options

**Options**:
```javascript
{
  width: 800,           // Canvas width
  height: 600,          // Canvas height
  showConstellations: true,  // Show constellation lines
  showStars: true,      // Show star points
  showPlanets: true,    // Show solar system objects
  showDeepSky: true,    // Show deep sky objects
  showGrid: false,      // Show coordinate grid
  showLabels: true,     // Show object labels
  timeSpeed: 1,         // Time playback speed multiplier
  latitude: 0,          // Observer latitude
  longitude: 0,         // Observer longitude
  timezone: 'UTC'       // Observer timezone
}
```

#### Methods

##### `render()`
Renders the current star map state to the canvas.

##### `updateTime(deltaTime)`
Updates the internal time state.

**Parameters**:
- `deltaTime` (number): Time delta in milliseconds

##### `pan(dx, dy)`
Pans the view by the specified amount.

**Parameters**:
- `dx` (number): Horizontal pan amount
- `dy` (number): Vertical pan amount

##### `zoom(factor, centerX, centerY)`
Zooms the view by the specified factor.

**Parameters**:
- `factor` (number): Zoom factor (>1 to zoom in, <1 to zoom out)
- `centerX` (number): X coordinate of zoom center
- `centerY` (number): Y coordinate of zoom center

##### `setTime(date)`
Sets the current time for astronomical calculations.

**Parameters**:
- `date` (Date): The date/time to set

##### `setLocation(latitude, longitude, timezone)`
Sets the observer location.

**Parameters**:
- `latitude` (number): Latitude in degrees
- `longitude` (number): Longitude in degrees
- `timezone` (string): Timezone identifier

##### `searchObjects(query)`
Searches for astronomical objects.

**Parameters**:
- `query` (string): Search query

**Returns**: Array of matching objects

##### `followObject(objectId)`
Centers the view on a specific object.

**Parameters**:
- `objectId` (string): ID of the object to follow

### SolarSystem Class

Handles solar system object calculations.

**Location**: `src/components/SolarSystem.js`

#### Methods

##### `getSunPosition(julianDay)`
Calculates the Sun's position for a given Julian day.

**Parameters**:
- `julianDay` (number): Julian day number

**Returns**: Object with `ra` (right ascension) and `dec` (declination)

##### `getMoonPosition(julianDay)`
Calculates the Moon's position for a given Julian day.

**Parameters**:
- `julianDay` (number): Julian day number

**Returns**: Object with `ra` (right ascension) and `dec` (declination)

##### `getPlanetPosition(planet, julianDay)`
Calculates a planet's position for a given Julian day.

**Parameters**:
- `planet` (string): Planet name ('mercury', 'venus', 'mars', etc.)
- `julianDay` (number): Julian day number

**Returns**: Object with `ra` (right ascension) and `dec` (declination)

### ObjectSearch Class

Provides search functionality for astronomical objects.

**Location**: `src/components/ObjectSearch.js`

#### Methods

##### `search(query)`
Searches for objects matching the query.

**Parameters**:
- `query` (string): Search query

**Returns**: Array of matching objects with relevance scores

##### `buildSearchIndex()`
Builds the search index from available data.

## Utility Functions

### CoordinateUtils

**Location**: `src/utils/CoordinateUtils.js`

#### `getJulianDay(date)`
Converts a JavaScript Date to Julian day number.

**Parameters**:
- `date` (Date): JavaScript Date object

**Returns**: Julian day number

#### `getDaysSinceJ2000(julianDay)`
Calculates days since J2000.0 epoch.

**Parameters**:
- `julianDay` (number): Julian day number

**Returns**: Days since J2000.0

#### `getLocalSiderealTime(julianDay, longitude)`
Calculates local sidereal time.

**Parameters**:
- `julianDay` (number): Julian day number
- `longitude` (number): Observer longitude in degrees

**Returns**: Local sidereal time in hours

#### `skyToScreen(ra, dec, centerRa, centerDec, scale)`
Converts sky coordinates to screen coordinates.

**Parameters**:
- `ra` (number): Right ascension in hours
- `dec` (number): Declination in degrees
- `centerRa` (number): Center right ascension
- `centerDec` (number): Center declination
- `scale` (number): Scale factor

**Returns**: Object with `x` and `y` screen coordinates

#### `screenToSky(x, y, centerRa, centerDec, scale)`
Converts screen coordinates to sky coordinates.

**Parameters**:
- `x` (number): Screen X coordinate
- `y` (number): Screen Y coordinate
- `centerRa` (number): Center right ascension
- `centerDec` (number): Center declination
- `scale` (number): Scale factor

**Returns**: Object with `ra` and `dec` sky coordinates

### TimeUtils

**Location**: `src/utils/TimeUtils.js`

#### `formatTime(date)`
Formats a date for display.

**Parameters**:
- `date` (Date): Date to format

**Returns**: Formatted time string

#### `formatDate(date)`
Formats a date for display.

**Parameters**:
- `date` (Date): Date to format

**Returns**: Formatted date string

### MathUtils

**Location**: `src/utils/MathUtils.js`

#### `degreesToRadians(degrees)`
Converts degrees to radians.

**Parameters**:
- `degrees` (number): Angle in degrees

**Returns**: Angle in radians

#### `radiansToDegrees(radians)`
Converts radians to degrees.

**Parameters**:
- `radians` (number): Angle in radians

**Returns**: Angle in degrees

#### `normalizeAngle(angle)`
Normalizes an angle to 0-360 degrees.

**Parameters**:
- `angle` (number): Angle in degrees

**Returns**: Normalized angle

## Constants

### CONSTANTS

**Location**: `src/utils/Constants.js`

Contains all configuration constants:

```javascript
CONSTANTS = {
  CANVAS: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 10.0
  },
  STARS: {
    MAX_MAGNITUDE: 6.0,
    POINT_SIZE: 2,
    BRIGHT_POINT_SIZE: 4
  },
  RENDERING: {
    TARGET_FPS: 60,
    CACHE_SIZE: 1000,
    UPDATE_THROTTLE: 16
  }
}
```

## Data Structures

### Constellation Data

**Location**: `src/data/ConstellationData.js`

```javascript
CONSTELLATION_DATA = [
  {
    name: "Andromeda",
    abbreviation: "And",
    lines: [
      { from: "alpheratz", to: "mirach" },
      // ... more lines
    ]
  }
  // ... more constellations
]
```

### Bright Stars

```javascript
BRIGHT_STARS = [
  {
    name: "Vega",
    ra: 18.61565,
    dec: 38.78369,
    magnitude: 0.03,
    constellation: "Lyra"
  }
  // ... more stars
]
```

### Deep Sky Objects

```javascript
DEEP_SKY_OBJECTS = [
  {
    name: "Andromeda Galaxy",
    type: "galaxy",
    ra: 0.71125,
    dec: 41.26917,
    magnitude: 3.4,
    constellation: "Andromeda"
  }
  // ... more objects
]
```

## Event System

The StarMap class emits custom events:

### Events

- `timeChanged`: Emitted when time is updated
- `locationChanged`: Emitted when observer location changes
- `objectSelected`: Emitted when an object is selected
- `viewChanged`: Emitted when pan/zoom changes

### Usage

```javascript
const starMap = new StarMap(canvas);

starMap.addEventListener('timeChanged', (event) => {
  console.log('New time:', event.detail.time);
});

starMap.addEventListener('objectSelected', (event) => {
  console.log('Selected object:', event.detail.object);
});
```

## Performance Considerations

- **Rendering**: Uses requestAnimationFrame for smooth 60 FPS rendering
- **Caching**: Implements position caching to avoid recalculations
- **Throttling**: Throttles updates to prevent excessive calculations
- **Memory Management**: Automatically cleans up unused cache entries

## Browser Compatibility

- **ES6 Modules**: Requires modern browser with ES6 module support
- **Canvas API**: Uses HTML5 Canvas for rendering
- **Web APIs**: Uses modern JavaScript APIs (fetch, requestAnimationFrame, etc.)

## Error Handling

All components include comprehensive error handling:

- **Input Validation**: Validates all input parameters
- **Graceful Degradation**: Falls back to safe defaults on errors
- **User Feedback**: Provides clear error messages to users
- **Logging**: Logs errors for debugging purposes
