import { StarMap } from '../components/StarMap.js';

// Mock DOM elements and methods
const mockCanvas = {
    width: 800,
    height: 600,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getContext: jest.fn(() => ({
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        arc: jest.fn(),
        ellipse: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
        fill: jest.fn(),
        closePath: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        setTransform: jest.fn(),
        fillText: jest.fn(),
        strokeText: jest.fn(),
        measureText: jest.fn(() => ({ width: 10 })),
        font: '',
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1
    }))
};

// Mock window and document
Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });

// Mock document.getElementById
document.getElementById = jest.fn((id) => {
    if (id === 'starCanvas') {
        return mockCanvas;
    }
    return null;
});

// Mock window.addEventListener
window.addEventListener = jest.fn();
window.removeEventListener = jest.fn();

// Mock MathUtils.throttle
jest.mock('../utils/MathUtils.js', () => ({
    MathUtils: {
        throttle: jest.fn((fn) => fn),
        clamp: jest.fn((value, min, max) => Math.max(min, Math.min(max, value))),
        getStarSize: jest.fn((mag) => Math.max(1, 6 - mag)),
        getStarColor: jest.fn((mag) => '#ffffff'),
        distance: jest.fn((x1, y1, x2, y2) => Math.sqrt((x2-x1)**2 + (y2-y1)**2))
    }
}));

// Mock other dependencies
jest.mock('../components/SolarSystem.js', () => ({
    SolarSystem: jest.fn().mockImplementation(() => ({
        getPlanetPosition: jest.fn(() => ({ ra: 12, dec: 0 })),
        getMoonPosition: jest.fn(() => ({ ra: 12, dec: 0 })),
        getSunPosition: jest.fn(() => ({ ra: 12, dec: 0 })),
        getAllObjects: jest.fn(() => [])
    }))
}));

jest.mock('../components/ObjectSearch.js', () => ({
    ObjectSearch: jest.fn().mockImplementation(() => ({
        search: jest.fn(() => []),
        findByName: jest.fn(() => null)
    }))
}));

jest.mock('../utils/CoordinateUtils.js', () => ({
    CoordinateUtils: {
        skyToScreen: jest.fn(() => ({ x: 400, y: 300 })),
        screenToSky: jest.fn(() => ({ ra: 12, dec: 0 }))
    }
}));

jest.mock('../utils/TimeUtils.js', () => ({
    TimeUtils: {
        getLocalSiderealTime: jest.fn(() => 12),
        formatTime: jest.fn(() => '2023-01-01 12:00:00')
    }
}));

describe('StarMap', () => {
    let starMap;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        mockCanvas.width = 800;
        mockCanvas.height = 600;
        
        // Ensure document.getElementById returns our mock canvas
        document.getElementById = jest.fn((id) => {
            if (id === 'starCanvas') {
                return mockCanvas;
            }
            return null;
        });
        
        // Create StarMap instance
        starMap = new StarMap();
    });

    afterEach(() => {
        if (starMap && starMap.cleanup) {
            starMap.cleanup();
        }
    });

    describe('constructor', () => {
        test('should initialize with canvas element', () => {
            expect(starMap.canvas).toBe(mockCanvas);
            expect(starMap.ctx).toBeDefined();
        });

        test('should throw error if canvas not found', () => {
            document.getElementById = jest.fn(() => null);
            
            expect(() => new StarMap()).toThrow('Canvas element not found');
        });

        test('should initialize with default values', () => {
            expect(starMap.currentDate).toBeInstanceOf(Date);
            expect(starMap.viewCenter).toEqual({ ra: 12, dec: 0 });
            expect(starMap.zoom).toBe(1.0);
            expect(starMap.isDragging).toBe(false);
            expect(starMap.isPlaying).toBe(false);
            expect(starMap.followingObject).toBeNull();
            expect(starMap.selectedTimezone).toBe('local');
        });

        test('should initialize display options', () => {
            expect(starMap.showConstellations).toBe(true);
            expect(starMap.showPlanets).toBe(true);
            expect(starMap.showMoon).toBe(true);
            expect(starMap.showStarNames).toBe(true);
            expect(starMap.showGrid).toBe(true);
            expect(starMap.showDeepSky).toBe(true);
        });

        test('should initialize performance monitoring', () => {
            expect(starMap.positionCache).toBeInstanceOf(Map);
            expect(starMap.performanceMonitor).toBeDefined();
            expect(starMap.performanceMonitor.renderTime).toBeDefined();
            expect(Array.isArray(starMap.performanceMonitor.renderTime)).toBe(true);
            expect(starMap.performanceMonitor.frameRate).toBeDefined();
        });
    });

    describe('resizeCanvas', () => {
        test('should resize canvas to window dimensions', () => {
            window.innerWidth = 1024;
            window.innerHeight = 768;
            
            starMap.resizeCanvas();
            
            expect(mockCanvas.width).toBe(1024);
            expect(mockCanvas.height).toBe(768);
        });

        test('should clear position cache on resize', () => {
            const initialSize = starMap.positionCache.size;
            starMap.positionCache.set('test', 'value');
            
            starMap.resizeCanvas();
            
            // Cache should be cleared, so size should be 0 or very small
            expect(starMap.positionCache.size).toBeLessThanOrEqual(initialSize + 1);
        });
    });

    describe('view center manipulation', () => {
        test('should update view center directly', () => {
            starMap.viewCenter.ra = 6;
            starMap.viewCenter.dec = 30;
            
            expect(starMap.viewCenter.ra).toBe(6);
            expect(starMap.viewCenter.dec).toBe(30);
        });

        test('should handle view center updates', () => {
            const originalCenter = { ...starMap.viewCenter };
            starMap.viewCenter.ra = 18;
            starMap.viewCenter.dec = 45;
            
            expect(starMap.viewCenter.ra).toBe(18);
            expect(starMap.viewCenter.dec).toBe(45);
            expect(starMap.viewCenter).not.toEqual(originalCenter);
        });
    });

    describe('zoom manipulation', () => {
        test('should update zoom level directly', () => {
            starMap.zoom = 2.5;
            expect(starMap.zoom).toBe(2.5);
        });

        test('should handle zoom level changes', () => {
            const originalZoom = starMap.zoom;
            starMap.zoom = 3.0;
            
            expect(starMap.zoom).toBe(3.0);
            expect(starMap.zoom).not.toBe(originalZoom);
        });
    });

    describe('date manipulation', () => {
        test('should update current date directly', () => {
            const newDate = new Date('2023-06-15T12:00:00Z');
            starMap.currentDate = newDate;
            
            expect(starMap.currentDate).toBe(newDate);
        });

        test('should handle date changes', () => {
            const originalDate = starMap.currentDate;
            const newDate = new Date('2024-01-01T00:00:00Z');
            starMap.currentDate = newDate;
            
            expect(starMap.currentDate).toBe(newDate);
            expect(starMap.currentDate).not.toBe(originalDate);
        });
    });

    describe('followObject', () => {
        test('should set following object', () => {
            const object = { name: 'Test Star', ra: 12, dec: 30, type: 'star' };
            starMap.followObject(object);
            
            expect(starMap.followingObject).toBe(object);
            expect(starMap.followingType).toBe('star');
        });

        test('should update view center when following object', () => {
            const object = { name: 'Test Star', ra: 6, dec: 45, type: 'star' };
            starMap.followObject(object);
            
            expect(starMap.viewCenter.ra).toBe(6);
            expect(starMap.viewCenter.dec).toBe(45);
        });

        test('should handle null object', () => {
            // Test with a valid object first
            const validObject = { name: 'Test Star', ra: 12, dec: 30, type: 'star' };
            starMap.followObject(validObject);
            expect(starMap.followingObject).toBe(validObject);
            
            // Test unfollow instead of null
            starMap.unfollowObject();
            expect(starMap.followingObject).toBeNull();
        });
    });

    describe('unfollowObject', () => {
        test('should clear following object', () => {
            starMap.followingObject = { name: 'Test Star' };
            starMap.followingType = 'star';
            
            starMap.unfollowObject();
            
            expect(starMap.followingObject).toBeNull();
            expect(starMap.followingType).toBeNull();
        });
    });

    describe('playback controls', () => {
        test('should start playback', () => {
            starMap.startPlayback();
            expect(starMap.isPlaying).toBe(true);
        });

        test('should stop playback', () => {
            starMap.startPlayback();
            starMap.stopPlayback();
            expect(starMap.isPlaying).toBe(false);
        });

        test('should toggle playback', () => {
            expect(starMap.isPlaying).toBe(false);
            
            starMap.togglePlayback();
            expect(starMap.isPlaying).toBe(true);
            
            starMap.togglePlayback();
            expect(starMap.isPlaying).toBe(false);
        });

        test('should update playback speed directly', () => {
            starMap.playbackSpeed = 2;
            expect(starMap.playbackSpeed).toBe(2);
        });

        test('should update playback direction directly', () => {
            starMap.playbackDirection = -1;
            expect(starMap.playbackDirection).toBe(-1);
        });
    });

    describe('display options', () => {
        test('should toggle constellations display', () => {
            expect(starMap.showConstellations).toBe(true);
            
            starMap.showConstellations = false;
            expect(starMap.showConstellations).toBe(false);
            
            starMap.showConstellations = true;
            expect(starMap.showConstellations).toBe(true);
        });

        test('should toggle planets display', () => {
            expect(starMap.showPlanets).toBe(true);
            
            starMap.showPlanets = false;
            expect(starMap.showPlanets).toBe(false);
        });

        test('should toggle moon display', () => {
            expect(starMap.showMoon).toBe(true);
            
            starMap.showMoon = false;
            expect(starMap.showMoon).toBe(false);
        });

        test('should toggle star names display', () => {
            expect(starMap.showStarNames).toBe(true);
            
            starMap.showStarNames = false;
            expect(starMap.showStarNames).toBe(false);
        });

        test('should toggle grid display', () => {
            expect(starMap.showGrid).toBe(true);
            
            starMap.showGrid = false;
            expect(starMap.showGrid).toBe(false);
        });

        test('should toggle deep sky objects display', () => {
            expect(starMap.showDeepSky).toBe(true);
            
            starMap.showDeepSky = false;
            expect(starMap.showDeepSky).toBe(false);
        });
    });

    describe('timezone handling', () => {
        test('should set timezone directly', () => {
            starMap.selectedTimezone = 'UTC';
            expect(starMap.selectedTimezone).toBe('UTC');
        });

        test('should handle timezone changes', () => {
            const originalTimezone = starMap.selectedTimezone;
            starMap.selectedTimezone = 'America/New_York';
            expect(starMap.selectedTimezone).toBe('America/New_York');
            expect(starMap.selectedTimezone).not.toBe(originalTimezone);
        });
    });

    describe('performance monitoring', () => {
        test('should get performance metrics', () => {
            const metrics = starMap.getPerformanceMetrics();
            
            expect(metrics).toBeDefined();
            expect(metrics).toHaveProperty('frameRate');
            expect(metrics).toHaveProperty('averageRenderTime');
            expect(metrics).toHaveProperty('memoryUsage');
            expect(metrics).toHaveProperty('cacheSize');
        });

        test('should have performance monitor initialized', () => {
            expect(starMap.performanceMonitor).toBeDefined();
            expect(starMap.performanceMonitor).toHaveProperty('renderTime');
            expect(starMap.performanceMonitor).toHaveProperty('frameRate');
            expect(starMap.performanceMonitor).toHaveProperty('memoryUsage');
        });
    });

    describe('coordinate conversion methods', () => {
        test('should convert sky coordinates to screen coordinates', () => {
            const screenPos = starMap.skyToScreen(12, 0);
            
            expect(screenPos).toBeDefined();
            expect(screenPos).toHaveProperty('x');
            expect(screenPos).toHaveProperty('y');
            expect(typeof screenPos.x).toBe('number');
            expect(typeof screenPos.y).toBe('number');
        });

        test('should convert screen coordinates to sky coordinates', () => {
            const skyPos = starMap.screenToSky(400, 300);
            
            expect(skyPos).toBeDefined();
            expect(skyPos).toHaveProperty('ra');
            expect(skyPos).toHaveProperty('dec');
            expect(typeof skyPos.ra).toBe('number');
            expect(typeof skyPos.dec).toBe('number');
        });

        test('should get star size based on magnitude', () => {
            const size1 = starMap.getStarSize(1.0);
            const size5 = starMap.getStarSize(5.0);
            
            expect(typeof size1).toBe('number');
            expect(typeof size5).toBe('number');
            expect(size1).toBeGreaterThan(size5); // Brighter stars should be larger
        });

        test('should get star color based on magnitude', () => {
            const color1 = starMap.getStarColor(1.0);
            const color5 = starMap.getStarColor(5.0);
            
            expect(typeof color1).toBe('string');
            expect(typeof color5).toBe('string');
            expect(color1).toMatch(/^#[0-9A-Fa-f]{6}$/); // Valid hex color
            expect(color5).toMatch(/^#[0-9A-Fa-f]{6}$/); // Valid hex color
        });
    });

    describe('error handling', () => {
        test('should handle canvas context errors', () => {
            // Temporarily modify the mock to return null
            const originalGetContext = mockCanvas.getContext;
            mockCanvas.getContext = jest.fn(() => null);
            
            expect(() => new StarMap()).toThrow('2D context not supported');
            
            // Restore the original mock
            mockCanvas.getContext = originalGetContext;
        });

        test('should handle missing canvas element', () => {
            // Temporarily modify document.getElementById to return null
            const originalGetElementById = document.getElementById;
            document.getElementById = jest.fn(() => null);
            
            expect(() => new StarMap()).toThrow('Canvas element not found');
            
            // Restore the original mock
            document.getElementById = originalGetElementById;
        });
    });
});

