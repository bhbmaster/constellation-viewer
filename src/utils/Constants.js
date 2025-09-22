// Application constants
export const CONSTANTS = {
    CANVAS: {
        BACKGROUND_COLOR: '#000011',
        GRID_COLOR: '#334455',
        GRID_LINE_WIDTH: 0.8,
        CURSOR: 'crosshair'
    },
    STARS: {
        MAX_MAGNITUDE: 5,
        SIZE_MULTIPLIER: 1.5,
        GLOW_OPACITY: 0.2,
        BRIGHT_THRESHOLD: 2.5
    },
    RENDERING: {
        MAX_FPS: 60,
        CACHE_SIZE: 1000,
        RENDER_THROTTLE: 16 // ms
    },
    INTERACTION: {
        MAX_CLICK_DISTANCE: 50,
        ZOOM_MIN: 0.1,
        ZOOM_MAX: 10,
        ZOOM_FACTOR: 0.1
    },
    TIME: {
        J2000_EPOCH: new Date('2000-01-01T12:00:00Z'),
        J2000_JD: 2451545.0
    },
    COLORS: {
        STAR: {
            VERY_BRIGHT: '#BBCCFF',
            BRIGHT: '#FFFFFF',
            MEDIUM: '#FFFFCC',
            DIM: '#FFDDAA',
            FAINT: '#FFCCAA'
        },
        DEEP_SKY: {
            GALAXY: '#FF6B6B',
            NEBULA: '#4ECDC4',
            GLOBULAR: '#FFE66D',
            OPEN: '#A8E6CF',
            DARK: '#666666'
        },
        UI: {
            PANEL_BG: 'rgba(0, 0, 0, 0.8)',
            BORDER: '#333',
            TEXT: '#fff',
            GRID: '#444488'
        }
    }
};
