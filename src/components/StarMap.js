// Main star map rendering and interaction engine
import { SolarSystem } from './SolarSystem.js';
import { ObjectSearch } from './ObjectSearch.js';
import { CoordinateUtils } from '../utils/CoordinateUtils.js';
import { TimeUtils } from '../utils/TimeUtils.js';
import { MathUtils } from '../utils/MathUtils.js';
import { CONSTANTS } from '../utils/Constants.js';
import { CONSTELLATION_DATA, BRIGHT_STARS, DEEP_SKY_OBJECTS } from '../data/ConstellationData.js';

export class StarMap {
    constructor() {
        this.canvas = document.getElementById('starCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('2D context not supported');
        }

        this.solarSystem = new SolarSystem();
        this.objectSearch = new ObjectSearch(this);

        // Current viewing parameters
        this.currentDate = new Date();
        this.viewCenter = { ra: 12, dec: 0 }; // RA in hours, Dec in degrees
        this.zoom = 1.0;
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        this.dragStartPos = { x: 0, y: 0 };
        this.dragStartViewCenter = { ra: 0, dec: 0 };

        // Playback parameters
        this.isPlaying = false;
        this.playbackSpeed = 1; // seconds per real second
        this.playbackDirection = 1; // 1 for forward, -1 for reverse
        this.playbackInterval = null;

        // Following parameters
        this.followingObject = null;
        this.followingType = null; // 'star', 'planet', 'moon', 'sun'

        // Timezone handling
        this.selectedTimezone = 'local';

        // Display options
        this.showConstellations = true;
        this.showPlanets = true;
        this.showMoon = true;
        this.showStarNames = true;
        this.showGrid = true;
        this.showDeepSky = true;

        // Performance optimization
        this.positionCache = new Map();
        this.lastRenderTime = 0;
        this.performanceMonitor = {
            renderTime: [],
            frameRate: 0,
            memoryUsage: 0
        };

        this.initializeCanvas();
        this.setupEventListeners();
        this.setupTimeControls();
        this.updateDisplay();
        this.startAnimation();
    }

    /**
     * Initialize canvas and setup resize handling
     */
    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', MathUtils.throttle(() => this.resizeCanvas(), 100));
    }

    /**
     * Resize canvas to fit window
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.positionCache.clear(); // Clear cache on resize
        this.render();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        this.setupMouseEvents();
        this.setupKeyboardEvents();
        this.setupControlEvents();
    }

    /**
     * Setup mouse interaction events
     */
    setupMouseEvents() {
        // Mouse events for panning with improved dragging
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMousePos = { x: e.clientX, y: e.clientY };
            this.dragStartPos = { x: e.clientX, y: e.clientY };
            this.dragStartViewCenter = { ...this.viewCenter };
            this.canvas.style.cursor = 'grabbing';
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMousePos.x;
                const deltaY = e.clientY - this.lastMousePos.y;

                // Convert pixel movement to RA/Dec movement with improved calculation
                const raDelta = deltaX * 24 / this.canvas.width / this.zoom;
                const decDelta = deltaY * 180 / this.canvas.height / this.zoom;

                // Update view center with proper bounds checking
                this.viewCenter.ra = CoordinateUtils.normalizeRA(this.viewCenter.ra - raDelta);
                this.viewCenter.dec = CoordinateUtils.clampDec(this.viewCenter.dec + decDelta);

                this.lastMousePos = { x: e.clientX, y: e.clientY };
                this.render();
            } else {
                // Show coordinates under mouse
                const coords = this.screenToSky(e.clientX, e.clientY);
                const coordsElement = document.getElementById('mouseCoords');
                if (coordsElement) {
                    coordsElement.innerHTML = 
                        `RA: ${coords.ra.toFixed(2)}h, Dec: ${coords.dec.toFixed(1)}°`;
                }
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.canvas.style.cursor = CONSTANTS.CANVAS.CURSOR;
        });

        // Double-click for following objects
        this.canvas.addEventListener('dblclick', (e) => {
            this.handleDoubleClick(e.clientX, e.clientY);
        });

        // Mouse wheel for zooming
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom = MathUtils.clamp(
                this.zoom * zoomFactor, 
                CONSTANTS.INTERACTION.ZOOM_MIN, 
                CONSTANTS.INTERACTION.ZOOM_MAX
            );
            this.positionCache.clear(); // Clear cache on zoom
            this.render();
        });

        // Touch events for mobile support
        this.setupTouchEvents();
    }

    /**
     * Setup touch events for mobile devices
     */
    setupTouchEvents() {
        let lastTouchDistance = 0;
        let lastTouchCenter = { x: 0, y: 0 };

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.isDragging = true;
                this.lastMousePos = { x: touch.clientX, y: touch.clientY };
                this.dragStartPos = { x: touch.clientX, y: touch.clientY };
                this.dragStartViewCenter = { ...this.viewCenter };
            } else if (e.touches.length === 2) {
                // Pinch to zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                lastTouchDistance = MathUtils.distance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY);
                lastTouchCenter = {
                    x: (touch1.clientX + touch2.clientX) / 2,
                    y: (touch1.clientY + touch2.clientY) / 2
                };
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && this.isDragging) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - this.lastMousePos.x;
                const deltaY = touch.clientY - this.lastMousePos.y;

                const raDelta = deltaX * 24 / this.canvas.width / this.zoom;
                const decDelta = deltaY * 180 / this.canvas.height / this.zoom;

                this.viewCenter.ra = CoordinateUtils.normalizeRA(this.viewCenter.ra - raDelta);
                this.viewCenter.dec = CoordinateUtils.clampDec(this.viewCenter.dec + decDelta);

                this.lastMousePos = { x: touch.clientX, y: touch.clientY };
                this.render();
            } else if (e.touches.length === 2) {
                // Pinch to zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = MathUtils.distance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY);
                
                if (lastTouchDistance > 0) {
                    const zoomFactor = currentDistance / lastTouchDistance;
                    this.zoom = MathUtils.clamp(
                        this.zoom * zoomFactor,
                        CONSTANTS.INTERACTION.ZOOM_MIN,
                        CONSTANTS.INTERACTION.ZOOM_MAX
                    );
                    this.positionCache.clear();
                }
                
                lastTouchDistance = currentDistance;
                this.render();
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.isDragging = false;
        });
    }

    /**
     * Setup keyboard events
     */
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'u':
                    this.unfollowObject();
                    break;
                case '?':
                    this.toggleHelp();
                    break;
                case 'escape':
                    this.unfollowObject();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayback();
                    break;
            }
        });
    }

    /**
     * Setup control panel events
     */
    setupControlEvents() {
        // Checkbox event listeners
        const checkboxes = [
            'showConstellations', 'showPlanets', 'showMoon', 
            'showStarNames', 'showGrid', 'showDeepSky'
        ];

        checkboxes.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    this[`show${id.charAt(4).toUpperCase() + id.slice(5)}`] = e.target.checked;
                    this.render();
                });
            }
        });

        // Timezone selector
        const timezoneSelect = document.getElementById('timezoneSelect');
        if (timezoneSelect) {
            timezoneSelect.addEventListener('change', (e) => {
                this.selectedTimezone = e.target.value;
                this.updateDisplay();
            });
        }

        // Help button
        const helpButton = document.getElementById('helpButton');
        if (helpButton) {
            helpButton.addEventListener('click', () => this.toggleHelp());
        }

        const closeHelp = document.getElementById('closeHelp');
        if (closeHelp) {
            closeHelp.addEventListener('click', () => this.toggleHelp());
        }
    }

    /**
     * Setup time control events
     */
    setupTimeControls() {
        const dateInput = document.getElementById('dateInput');
        const timeInput = document.getElementById('timeInput');

        // Set initial values to current date
        this.updateTimeInputs();

        // Time navigation buttons
        const timeButtons = [
            { id: 'prevYear', action: () => this.currentDate.setFullYear(this.currentDate.getFullYear() - 1) },
            { id: 'prevMonth', action: () => this.currentDate.setMonth(this.currentDate.getMonth() - 1) },
            { id: 'prevDay', action: () => this.currentDate.setDate(this.currentDate.getDate() - 1) },
            { id: 'prevHour', action: () => this.currentDate.setHours(this.currentDate.getHours() - 1) },
            { id: 'prevMinute', action: () => this.currentDate.setMinutes(this.currentDate.getMinutes() - 1) },
            { id: 'prevSecond', action: () => this.currentDate.setSeconds(this.currentDate.getSeconds() - 1) },
            { id: 'nextSecond', action: () => this.currentDate.setSeconds(this.currentDate.getSeconds() + 1) },
            { id: 'nextMinute', action: () => this.currentDate.setMinutes(this.currentDate.getMinutes() + 1) },
            { id: 'nextHour', action: () => this.currentDate.setHours(this.currentDate.getHours() + 1) },
            { id: 'nextDay', action: () => this.currentDate.setDate(this.currentDate.getDate() + 1) },
            { id: 'nextMonth', action: () => this.currentDate.setMonth(this.currentDate.getMonth() + 1) },
            { id: 'nextYear', action: () => this.currentDate.setFullYear(this.currentDate.getFullYear() + 1) }
        ];

        timeButtons.forEach(({ id, action }) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => {
                    action();
                    this.updateDisplay();
                });
            }
        });

        // Reset to now button
        const resetToNow = document.getElementById('resetToNow');
        if (resetToNow) {
            resetToNow.addEventListener('click', () => {
                this.currentDate = new Date();
                this.updateDisplay();
            });
        }

        // Playback controls
        this.setupPlaybackControls();

        // Manual date/time input
        if (dateInput) {
            dateInput.addEventListener('change', () => {
                const newDate = new Date(dateInput.value + 'T' + timeInput.value);
                if (TimeUtils.isValidDate(newDate)) {
                    this.currentDate = newDate;
                    this.render();
                }
            });
        }

        if (timeInput) {
            timeInput.addEventListener('change', () => {
                const newDate = new Date(dateInput.value + 'T' + timeInput.value);
                if (TimeUtils.isValidDate(newDate)) {
                    this.currentDate = newDate;
                    this.render();
                }
            });
        }
    }

    /**
     * Setup playback control events
     */
    setupPlaybackControls() {
        const playPause = document.getElementById('playPause');
        if (playPause) {
            playPause.addEventListener('click', () => this.togglePlayback());
        }

        const fastRewind = document.getElementById('fastRewind');
        if (fastRewind) {
            fastRewind.addEventListener('click', () => {
                this.playbackDirection = -1;
                this.playbackSpeed = parseInt(document.getElementById('speedSelect')?.value || '1') * 10;
                this.startPlayback();
            });
        }

        const rewind = document.getElementById('rewind');
        if (rewind) {
            rewind.addEventListener('click', () => {
                this.playbackDirection = -1;
                this.playbackSpeed = parseInt(document.getElementById('speedSelect')?.value || '1');
                this.startPlayback();
            });
        }

        const fastForward = document.getElementById('fastForward');
        if (fastForward) {
            fastForward.addEventListener('click', () => {
                this.playbackDirection = 1;
                this.playbackSpeed = parseInt(document.getElementById('speedSelect')?.value || '1') * 10;
                this.startPlayback();
            });
        }

        const speedSelect = document.getElementById('speedSelect');
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                this.playbackSpeed = parseInt(e.target.value);
                this.updateSpeedDisplay();
                if (this.isPlaying) {
                    this.stopPlayback();
                    this.startPlayback();
                }
            });
        }
    }

    /**
     * Update time input fields
     */
    updateTimeInputs() {
        const dateInput = document.getElementById('dateInput');
        const timeInput = document.getElementById('timeInput');

        if (dateInput && timeInput) {
            dateInput.value = this.currentDate.toISOString().split('T')[0];
            timeInput.value = this.currentDate.toTimeString().slice(0, 8);
        }
    }

    /**
     * Update display information
     */
    updateDisplay() {
        this.updateTimeInputs();

        // Format datetime display with timezone info
        const timeString = TimeUtils.formatTime(this.currentDate, this.selectedTimezone);
        const currentDateTimeElement = document.getElementById('currentDateTime');
        if (currentDateTimeElement) {
            currentDateTimeElement.innerHTML = timeString;
        }

        // Update following object display
        const followingObjectElement = document.getElementById('followingObject');
        if (followingObjectElement) {
            if (this.followingObject) {
                followingObjectElement.innerHTML = `Following: ${this.followingObject.name}`;
            } else {
                followingObjectElement.innerHTML = '';
            }
        }

        this.updateSpeedDisplay();
        this.updateFollowingView();
        this.render();
    }

    /**
     * Update speed display
     */
    updateSpeedDisplay() {
        const speedElement = document.getElementById('timeAcceleration');
        if (!speedElement) return;

        const speed = this.playbackSpeed;
        const direction = this.playbackDirection === 1 ? '' : 'Reverse ';

        let speedText;
        if (speed === 1) {
            speedText = '1x';
        } else if (speed < 60) {
            speedText = `${speed}x`;
        } else if (speed < 3600) {
            speedText = `${Math.round(speed / 60)}min/sec`;
        } else if (speed < 86400) {
            speedText = `${Math.round(speed / 3600)}hr/sec`;
        } else if (speed < 604800) {
            speedText = `${Math.round(speed / 86400)}day/sec`;
        } else if (speed < 2629746) {
            speedText = `${Math.round(speed / 604800)}wk/sec`;
        } else if (speed < 31556952) {
            speedText = `${Math.round(speed / 2629746)}mo/sec`;
        } else {
            speedText = `${Math.round(speed / 31556952)}yr/sec`;
        }

        speedElement.innerHTML = `Speed: ${direction}${speedText}`;
    }

    /**
     * Toggle playback state
     */
    togglePlayback() {
        if (this.isPlaying) {
            this.stopPlayback();
        } else {
            this.playbackDirection = 1;
            this.playbackSpeed = parseInt(document.getElementById('speedSelect')?.value || '1');
            this.startPlayback();
        }
    }

    /**
     * Start playback
     */
    startPlayback() {
        this.stopPlayback(); // Clear any existing interval
        this.isPlaying = true;

        const playPauseBtn = document.getElementById('playPause');
        if (playPauseBtn) {
            playPauseBtn.textContent = '⏸';
        }

        this.updateSpeedDisplay();

        // Update every 100ms for smooth animation
        this.playbackInterval = setInterval(() => {
            const deltaTime = (this.playbackSpeed * this.playbackDirection * 100) / 1000;
            this.currentDate.setTime(this.currentDate.getTime() + deltaTime * 1000);
            this.updateDisplay();
        }, 100);
    }

    /**
     * Stop playback
     */
    stopPlayback() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        this.isPlaying = false;

        const playPauseBtn = document.getElementById('playPause');
        if (playPauseBtn) {
            playPauseBtn.textContent = '▶';
        }

        this.updateSpeedDisplay();
    }

    /**
     * Convert RA/Dec to screen coordinates with caching
     * @param {number} ra - Right Ascension in hours
     * @param {number} dec - Declination in degrees
     * @returns {Object|null} Screen coordinates {x, y} or null if behind viewer
     */
    skyToScreen(ra, dec) {
        const lst = TimeUtils.getLocalSiderealTime(this.currentDate);
        const key = `${ra.toFixed(3)},${dec.toFixed(3)},${this.zoom.toFixed(2)},${this.viewCenter.ra.toFixed(3)},${this.viewCenter.dec.toFixed(3)}`;
        
        if (this.positionCache.has(key)) {
            return this.positionCache.get(key);
        }

        const result = CoordinateUtils.skyToScreen(
            ra, dec, this.viewCenter, this.zoom, 
            { width: this.canvas.width, height: this.canvas.height }, 
            lst
        );

        // Limit cache size
        if (this.positionCache.size > CONSTANTS.RENDERING.CACHE_SIZE) {
            const firstKey = this.positionCache.keys().next().value;
            this.positionCache.delete(firstKey);
        }

        this.positionCache.set(key, result);
        return result;
    }

    /**
     * Convert screen coordinates to RA/Dec
     * @param {number} x - Screen x coordinate
     * @param {number} y - Screen y coordinate
     * @returns {Object} Sky coordinates {ra, dec}
     */
    screenToSky(x, y) {
        const lst = TimeUtils.getLocalSiderealTime(this.currentDate);
        return CoordinateUtils.screenToSky(
            x, y, this.viewCenter, this.zoom,
            { width: this.canvas.width, height: this.canvas.height },
            lst
        );
    }

    /**
     * Get star size based on magnitude
     * @param {number} magnitude - Star magnitude
     * @returns {number} Star size in pixels
     */
    getStarSize(magnitude) {
        return MathUtils.getStarSize(magnitude);
    }

    /**
     * Get star color based on magnitude
     * @param {number} magnitude - Star magnitude
     * @returns {string} Color hex string
     */
    getStarColor(magnitude) {
        return MathUtils.getStarColor(magnitude);
    }

    /**
     * Main render function with performance optimization
     */
    render() {
        const now = performance.now();
        if (now - this.lastRenderTime < CONSTANTS.RENDERING.RENDER_THROTTLE) {
            return;
        }

        const renderStart = performance.now();

        // Clear canvas with deep space background
        this.ctx.fillStyle = CONSTANTS.CANVAS.BACKGROUND_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw coordinate grid
        if (this.showGrid) {
            this.drawGrid();
        }

        // Draw stars and constellations
        this.drawStars();

        if (this.showConstellations) {
            this.drawConstellations();
        }

        // Draw solar system objects
        if (this.showPlanets || this.showMoon) {
            this.drawSolarSystemObjects();
        }

        // Draw deep sky objects
        if (this.showDeepSky) {
            this.drawDeepSkyObjects();
        }

        // Draw star names
        if (this.showStarNames) {
            this.drawStarNames();
        }

        // Update performance metrics
        const renderTime = performance.now() - renderStart;
        this.performanceMonitor.renderTime.push(renderTime);
        if (this.performanceMonitor.renderTime.length > 60) {
            this.performanceMonitor.renderTime.shift();
        }

        this.lastRenderTime = now;
    }

    /**
     * Draw coordinate grid
     */
    drawGrid() {
        this.ctx.strokeStyle = CONSTANTS.CANVAS.GRID_COLOR;
        this.ctx.lineWidth = CONSTANTS.CANVAS.GRID_LINE_WIDTH;

        // RA lines (every 2 hours)
        for (let ra = 0; ra < 24; ra += 2) {
            this.ctx.beginPath();
            for (let dec = -90; dec <= 90; dec += 5) {
                const pos = this.skyToScreen(ra, dec);
                if (pos) {
                    if (dec === -90) {
                        this.ctx.moveTo(pos.x, pos.y);
                    } else {
                        this.ctx.lineTo(pos.x, pos.y);
                    }
                }
            }
            this.ctx.stroke();
        }

        // Dec lines (every 15 degrees)
        for (let dec = -75; dec <= 75; dec += 15) {
            this.ctx.beginPath();
            for (let ra = 0; ra < 24; ra += 0.5) {
                const pos = this.skyToScreen(ra, dec);
                if (pos) {
                    if (ra === 0) {
                        this.ctx.moveTo(pos.x, pos.y);
                    } else {
                        this.ctx.lineTo(pos.x, pos.y);
                    }
                }
            }
            this.ctx.stroke();
        }
    }

    /**
     * Draw stars
     */
    drawStars() {
        // Draw constellation stars
        for (const [constellationName, constellation] of Object.entries(CONSTELLATION_DATA)) {
            for (const star of constellation.stars) {
                const pos = this.skyToScreen(star.ra, star.dec);
                if (pos) {
                    const size = this.getStarSize(star.mag);
                    const color = this.getStarColor(star.mag);

                    this.ctx.fillStyle = color;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                    this.ctx.fill();

                    // Add star glow for bright stars
                    if (star.mag < 2) {
                        this.ctx.fillStyle = color + '33';
                        this.ctx.beginPath();
                        this.ctx.arc(pos.x, pos.y, size * 2, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }

        // Draw additional bright stars
        for (const star of BRIGHT_STARS) {
            const pos = this.skyToScreen(star.ra, star.dec);
            if (pos) {
                const size = this.getStarSize(star.mag);
                const color = this.getStarColor(star.mag);

                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
                this.ctx.fill();

                if (star.mag < 1) {
                    this.ctx.fillStyle = color + '44';
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, size * 2.5, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    /**
     * Draw constellation lines and names
     */
    drawConstellations() {
        this.ctx.strokeStyle = CONSTANTS.COLORS.UI.GRID;
        this.ctx.lineWidth = 1;

        for (const [constellationName, constellation] of Object.entries(CONSTELLATION_DATA)) {
            for (const line of constellation.lines) {
                const star1 = constellation.stars.find(s => s.id === line[0]);
                const star2 = constellation.stars.find(s => s.id === line[1]);

                if (star1 && star2) {
                    const pos1 = this.skyToScreen(star1.ra, star1.dec);
                    const pos2 = this.skyToScreen(star2.ra, star2.dec);

                    if (pos1 && pos2) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(pos1.x, pos1.y);
                        this.ctx.lineTo(pos2.x, pos2.y);
                        this.ctx.stroke();
                    }
                }
            }

            // Draw constellation name
            if (constellation.stars.length > 0) {
                const centerStar = constellation.stars[0];
                const pos = this.skyToScreen(centerStar.ra, centerStar.dec);
                if (pos) {
                    this.ctx.fillStyle = '#666699';
                    this.ctx.font = '12px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(constellationName, pos.x, pos.y - 15);
                }
            }
        }
    }

    /**
     * Draw solar system objects
     */
    drawSolarSystemObjects() {
        const objects = this.solarSystem.getAllObjects(this.currentDate);

        for (const obj of objects) {
            if ((obj.type === 'planet' && !this.showPlanets) ||
                (obj.type === 'moon' && !this.showMoon)) {
                continue;
            }

            const pos = this.skyToScreen(obj.ra, obj.dec);
            if (pos) {
                this.ctx.fillStyle = obj.color;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, obj.size, 0, Math.PI * 2);
                this.ctx.fill();

                // Add object label
                this.ctx.fillStyle = obj.color;
                this.ctx.font = '14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(obj.symbol + ' ' + obj.name, pos.x, pos.y - obj.size - 5);

                // Add glow for Sun
                if (obj.type === 'sun') {
                    this.ctx.fillStyle = obj.color + '44';
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, obj.size * 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    /**
     * Draw star names
     */
    drawStarNames() {
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'left';

        // Draw constellation star names
        for (const [constellationName, constellation] of Object.entries(CONSTELLATION_DATA)) {
            for (const star of constellation.stars) {
                if (star.mag < CONSTANTS.STARS.BRIGHT_THRESHOLD) {
                    const pos = this.skyToScreen(star.ra, star.dec);
                    if (pos) {
                        this.ctx.fillText(star.name, pos.x + 8, pos.y + 3);
                    }
                }
            }
        }

        // Draw bright star names
        for (const star of BRIGHT_STARS) {
            if (star.mag < 2) {
                const pos = this.skyToScreen(star.ra, star.dec);
                if (pos) {
                    this.ctx.fillText(star.name, pos.x + 8, pos.y + 3);
                }
            }
        }
    }

    /**
     * Draw deep sky objects
     */
    drawDeepSkyObjects() {
        for (const obj of DEEP_SKY_OBJECTS) {
            const pos = this.skyToScreen(obj.ra, obj.dec);
            if (pos) {
                // Set color based on object type
                const colors = CONSTANTS.COLORS.DEEP_SKY;
                let color;
                switch (obj.type) {
                    case 'galaxy':
                        color = colors.GALAXY;
                        break;
                    case 'nebula':
                        color = colors.NEBULA;
                        break;
                    case 'globular':
                        color = colors.GLOBULAR;
                        break;
                    case 'open':
                        color = colors.OPEN;
                        break;
                    case 'dark':
                        color = colors.DARK;
                        break;
                    default:
                        color = '#CCCCCC';
                }

                // Draw object based on type
                this.ctx.fillStyle = color;
                this.ctx.strokeStyle = color;

                if (obj.type === 'galaxy') {
                    // Draw as ellipse
                    this.ctx.beginPath();
                    this.ctx.ellipse(pos.x, pos.y, obj.size, obj.size * 0.6, 0, 0, Math.PI * 2);
                    this.ctx.stroke();
                } else if (obj.type === 'nebula') {
                    // Draw as fuzzy circle
                    this.ctx.globalAlpha = 0.6;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, obj.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.globalAlpha = 1.0;
                } else if (obj.type === 'globular') {
                    // Draw as dense cluster
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, obj.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    // Add inner core
                    this.ctx.fillStyle = color + 'AA';
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, obj.size * 0.5, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (obj.type === 'open') {
                    // Draw as loose cluster of points
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const r = obj.size * 0.8;
                        const px = pos.x + Math.cos(angle) * r;
                        const py = pos.y + Math.sin(angle) * r;
                        this.ctx.beginPath();
                        this.ctx.arc(px, py, 1, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                } else if (obj.type === 'dark') {
                    // Draw as dark nebula (outline)
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, obj.size, 0, Math.PI * 2);
                    this.ctx.stroke();
                }

                // Draw object name for brighter objects
                if (obj.mag < 7) {
                    this.ctx.fillStyle = color;
                    this.ctx.font = '9px Arial';
                    this.ctx.textAlign = 'left';
                    this.ctx.fillText(obj.name, pos.x + obj.size + 2, pos.y + 3);
                }
            }
        }
    }

    /**
     * Handle double-click for object following
     * @param {number} x - Click x coordinate
     * @param {number} y - Click y coordinate
     */
    handleDoubleClick(x, y) {
        // Find closest object to click point
        let closestObject = null;
        let closestDistance = CONSTANTS.INTERACTION.MAX_CLICK_DISTANCE;

        // Check solar system objects
        const solarObjects = this.solarSystem.getAllObjects(this.currentDate);
        for (const obj of solarObjects) {
            const pos = this.skyToScreen(obj.ra, obj.dec);
            if (pos) {
                const distance = CoordinateUtils.distance({ x, y }, pos);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestObject = {
                        ...obj,
                        type: obj.type === 'sun' ? 'sun' : obj.type
                    };
                }
            }
        }

        // Check constellation stars
        for (const [constellationName, constellation] of Object.entries(CONSTELLATION_DATA)) {
            for (const star of constellation.stars) {
                const pos = this.skyToScreen(star.ra, star.dec);
                if (pos) {
                    const distance = CoordinateUtils.distance({ x, y }, pos);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestObject = {
                            ...star,
                            type: 'star',
                            constellation: constellationName
                        };
                    }
                }
            }
        }

        // Check bright stars
        for (const star of BRIGHT_STARS) {
            const pos = this.skyToScreen(star.ra, star.dec);
            if (pos) {
                const distance = CoordinateUtils.distance({ x, y }, pos);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestObject = {
                        ...star,
                        type: 'star'
                    };
                }
            }
        }

        // Check deep sky objects
        for (const obj of DEEP_SKY_OBJECTS) {
            const pos = this.skyToScreen(obj.ra, obj.dec);
            if (pos) {
                const distance = CoordinateUtils.distance({ x, y }, pos);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestObject = {
                        ...obj,
                        type: 'deepsky'
                    };
                }
            }
        }

        if (closestObject) {
            this.followObject(closestObject);
        }
    }

    /**
     * Follow an object
     * @param {Object} obj - Object to follow
     */
    followObject(obj) {
        this.followingObject = obj;
        this.followingType = obj.type;
        this.updateDisplay();
    }

    /**
     * Unfollow current object
     */
    unfollowObject() {
        this.followingObject = null;
        this.followingType = null;
        this.updateDisplay();
    }

    /**
     * Update view to follow current object
     */
    updateFollowingView() {
        if (!this.followingObject) return;

        let targetRA, targetDec;

        if (this.followingType === 'star' || this.followingType === 'deepsky') {
            targetRA = this.followingObject.ra;
            targetDec = this.followingObject.dec;
        } else if (['sun', 'moon', 'planet'].includes(this.followingType)) {
            // Recalculate position for moving objects
            if (this.followingObject.name === 'Sun') {
                const sunPos = this.solarSystem.getSunPosition(this.currentDate);
                targetRA = sunPos.ra;
                targetDec = sunPos.dec;
            } else if (this.followingObject.name === 'Moon') {
                const moonPos = this.solarSystem.getMoonPosition(this.currentDate);
                targetRA = moonPos.ra;
                targetDec = moonPos.dec;
            } else {
                const planetPos = this.solarSystem.getPlanetPosition(this.followingObject.name, this.currentDate);
                if (planetPos) {
                    targetRA = planetPos.ra;
                    targetDec = planetPos.dec;
                }
            }
        }

        if (targetRA !== undefined && targetDec !== undefined) {
            // Smoothly move view center to target
            this.viewCenter.ra = targetRA;
            this.viewCenter.dec = targetDec;
        }
    }

    /**
     * Toggle help modal
     */
    toggleHelp() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            if (helpModal.style.display === 'none') {
                helpModal.style.display = 'block';
            } else {
                helpModal.style.display = 'none';
            }
        }
    }

    /**
     * Start animation loop
     */
    startAnimation() {
        // Auto-update every minute to show real-time sky motion
        setInterval(() => {
            if (Math.abs(new Date() - this.currentDate) < 300000) { // If within 5 minutes of current time
                this.currentDate = new Date();
                this.updateDisplay();
            }
        }, 60000);
    }

    /**
     * Get performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        const avgRenderTime = this.performanceMonitor.renderTime.length > 0
            ? this.performanceMonitor.renderTime.reduce((a, b) => a + b, 0) / this.performanceMonitor.renderTime.length
            : 0;

        return {
            averageRenderTime: avgRenderTime,
            frameRate: avgRenderTime > 0 ? 1000 / avgRenderTime : 0,
            cacheSize: this.positionCache.size,
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0
        };
    }
}
