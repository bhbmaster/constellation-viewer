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
            expect(starMap.performanceMonitor.renderTime).toEqual([]);
            expect(starMap.performanceMonitor.frameRate).toBe(0);
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
            starMap.positionCache.set('test', 'value');
            expect(starMap.positionCache.size).toBe(1);
            
            starMap.resizeCanvas();
            
            expect(starMap.positionCache.size).toBe(0);
        });
    });

    describe('setViewCenter', () => {
        test('should set view center coordinates', () => {
            const newCenter = { ra: 6, dec: 30 };
            starMap.setViewCenter(newCenter.ra, newCenter.dec);
            
            expect(starMap.viewCenter.ra).toBe(6);
            expect(starMap.viewCenter.dec).toBe(30);
        });

        test('should normalize RA to 0-24 range', () => {
            starMap.setViewCenter(25, 0);
            expect(starMap.viewCenter.ra).toBe(1);
            
            starMap.setViewCenter(-1, 0);
            expect(starMap.viewCenter.ra).toBe(23);
        });

        test('should clamp declination to -90 to 90 range', () => {
            starMap.setViewCenter(12, 95);
            expect(starMap.viewCenter.dec).toBe(90);
            
            starMap.setViewCenter(12, -95);
            expect(starMap.viewCenter.dec).toBe(-90);
        });
    });

    describe('setZoom', () => {
        test('should set zoom level', () => {
            starMap.setZoom(2.5);
            expect(starMap.zoom).toBe(2.5);
        });

        test('should clamp zoom to valid range', () => {
            starMap.setZoom(0.1);
            expect(starMap.zoom).toBe(0.5);
            
            starMap.setZoom(10);
            expect(starMap.zoom).toBe(5);
        });
    });

    describe('setDate', () => {
        test('should set current date', () => {
            const newDate = new Date('2023-06-15T12:00:00Z');
            starMap.setDate(newDate);
            
            expect(starMap.currentDate).toBe(newDate);
        });

        test('should handle invalid date gracefully', () => {
            const originalDate = starMap.currentDate;
            starMap.setDate('invalid');
            
            expect(starMap.currentDate).toBe(originalDate);
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
            starMap.followObject(null);
            
            expect(starMap.followingObject).toBeNull();
            expect(starMap.followingType).toBeNull();
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

        test('should set playback speed', () => {
            starMap.setPlaybackSpeed(2);
            expect(starMap.playbackSpeed).toBe(2);
        });

        test('should set playback direction', () => {
            starMap.setPlaybackDirection(-1);
            expect(starMap.playbackDirection).toBe(-1);
        });
    });

    describe('display options', () => {
        test('should toggle constellations display', () => {
            expect(starMap.showConstellations).toBe(true);
            
            starMap.toggleConstellations();
            expect(starMap.showConstellations).toBe(false);
            
            starMap.toggleConstellations();
            expect(starMap.showConstellations).toBe(true);
        });

        test('should toggle planets display', () => {
            expect(starMap.showPlanets).toBe(true);
            
            starMap.togglePlanets();
            expect(starMap.showPlanets).toBe(false);
        });

        test('should toggle moon display', () => {
            expect(starMap.showMoon).toBe(true);
            
            starMap.toggleMoon();
            expect(starMap.showMoon).toBe(false);
        });

        test('should toggle star names display', () => {
            expect(starMap.showStarNames).toBe(true);
            
            starMap.toggleStarNames();
            expect(starMap.showStarNames).toBe(false);
        });

        test('should toggle grid display', () => {
            expect(starMap.showGrid).toBe(true);
            
            starMap.toggleGrid();
            expect(starMap.showGrid).toBe(false);
        });

        test('should toggle deep sky objects display', () => {
            expect(starMap.showDeepSky).toBe(true);
            
            starMap.toggleDeepSky();
            expect(starMap.showDeepSky).toBe(false);
        });
    });

    describe('timezone handling', () => {
        test('should set timezone', () => {
            starMap.setTimezone('UTC');
            expect(starMap.selectedTimezone).toBe('UTC');
        });

        test('should handle invalid timezone', () => {
            const originalTimezone = starMap.selectedTimezone;
            starMap.setTimezone('invalid');
            expect(starMap.selectedTimezone).toBe(originalTimezone);
        });
    });

    describe('performance monitoring', () => {
        test('should get performance metrics', () => {
            const metrics = starMap.getPerformanceMetrics();
            
            expect(metrics).toBeDefined();
            expect(metrics).toHaveProperty('frameRate');
            expect(metrics).toHaveProperty('renderTime');
            expect(metrics).toHaveProperty('memoryUsage');
        });

        test('should update performance metrics', () => {
            const initialFrameRate = starMap.performanceMonitor.frameRate;
            starMap.updatePerformanceMetrics();
            
            expect(starMap.performanceMonitor.frameRate).toBeDefined();
        });
    });

    describe('utility methods', () => {
        test('should get current view info', () => {
            const viewInfo = starMap.getViewInfo();
            
            expect(viewInfo).toBeDefined();
            expect(viewInfo).toHaveProperty('center');
            expect(viewInfo).toHaveProperty('zoom');
            expect(viewInfo).toHaveProperty('date');
        });

        test('should check if object is visible', () => {
            const object = { ra: 12, dec: 0 };
            const isVisible = starMap.isObjectVisible(object);
            
            expect(typeof isVisible).toBe('boolean');
        });

        test('should get object screen position', () => {
            const object = { ra: 12, dec: 0 };
            const position = starMap.getObjectScreenPosition(object);
            
            expect(position).toBeDefined();
            expect(position).toHaveProperty('x');
            expect(position).toHaveProperty('y');
        });
    });

    describe('error handling', () => {
        test('should handle canvas context errors', () => {
            mockCanvas.getContext = jest.fn(() => null);
            
            expect(() => new StarMap()).toThrow('2D context not supported');
        });

        test('should handle missing canvas element', () => {
            document.getElementById = jest.fn(() => null);
            
            expect(() => new StarMap()).toThrow('Canvas element not found');
        });
    });
});
