// Jest setup file
import { jest } from '@jest/globals';

// Mock canvas for testing
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Array(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => []),
    setTransform: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    fillText: jest.fn(),
    restore: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    rotate: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    measureText: jest.fn(() => ({ width: 0 })),
    transform: jest.fn(),
    rect: jest.fn(),
    clip: jest.fn(),
}));

// Mock canvas dimensions
Object.defineProperty(HTMLCanvasElement.prototype, 'width', {
    writable: true,
    value: 800
});

Object.defineProperty(HTMLCanvasElement.prototype, 'height', {
    writable: true,
    value: 600
});

// Mock DOM methods
global.document.getElementById = jest.fn((id) => {
    const elements = {
        'starCanvas': {
            getContext: jest.fn(() => ({
                fillRect: jest.fn(),
                clearRect: jest.fn(),
                getImageData: jest.fn(() => ({ data: new Array(4) })),
                putImageData: jest.fn(),
                createImageData: jest.fn(() => []),
                setTransform: jest.fn(),
                drawImage: jest.fn(),
                save: jest.fn(),
                fillText: jest.fn(),
                restore: jest.fn(),
                beginPath: jest.fn(),
                moveTo: jest.fn(),
                lineTo: jest.fn(),
                closePath: jest.fn(),
                stroke: jest.fn(),
                translate: jest.fn(),
                scale: jest.fn(),
                rotate: jest.fn(),
                arc: jest.fn(),
                fill: jest.fn(),
                measureText: jest.fn(() => ({ width: 0 })),
                transform: jest.fn(),
                rect: jest.fn(),
                clip: jest.fn(),
            })),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            width: 800,
            height: 600
        },
        'mouseCoords': {
            innerHTML: ''
        },
        'currentDateTime': {
            innerHTML: ''
        },
        'followingObject': {
            innerHTML: ''
        },
        'timeAcceleration': {
            innerHTML: ''
        },
        'searchInput': {
            value: '',
            addEventListener: jest.fn()
        },
        'searchResults': {
            style: { display: 'none' },
            innerHTML: '',
            addEventListener: jest.fn(),
            querySelectorAll: jest.fn(() => [])
        }
    };
    return elements[id] || null;
});

global.document.createElement = jest.fn((tagName) => {
    const element = {
        tagName: tagName.toUpperCase(),
        style: {},
        innerHTML: '',
        textContent: '',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        getAttribute: jest.fn(),
        setAttribute: jest.fn(),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn(),
            toggle: jest.fn()
        }
    };
    return element;
});

global.document.addEventListener = jest.fn();
global.window.addEventListener = jest.fn();
global.window.innerWidth = 800;
global.window.innerHeight = 600;

// Mock performance API
global.performance = {
    now: jest.fn(() => Date.now()),
    memory: {
        usedJSHeapSize: 1000000
    }
};

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
};
