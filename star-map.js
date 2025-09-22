// Main star map rendering and interaction engine

class StarMap {
    constructor() {
        this.canvas = document.getElementById('starCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.solarSystem = new SolarSystem();

        // Current viewing parameters
        this.currentDate = new Date();
        this.viewCenter = { ra: 12, dec: 0 }; // RA in hours, Dec in degrees
        this.zoom = 1.0;
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };

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

        this.initializeCanvas();
        this.setupEventListeners();
        this.setupTimeControls();
        this.updateDisplay();
        this.startAnimation();
    }

    initializeCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render();
    }

    setupEventListeners() {
        // Mouse events for panning
        this.canvas.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.lastMousePos = { x: e.clientX, y: e.clientY };
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const deltaX = e.clientX - this.lastMousePos.x;
                const deltaY = e.clientY - this.lastMousePos.y;

                // Convert pixel movement to RA/Dec movement using the new coordinate system
                const scale = this.zoom * Math.min(this.canvas.width, this.canvas.height) / 180; // pixels per degree

                // Calculate angular movements
                const deltaRADeg = -deltaX / (scale * Math.cos(this.viewCenter.dec * Math.PI / 180));
                const deltaDec = deltaY / scale;

                // Convert RA to hours and apply
                const deltaRAHours = deltaRADeg / 15;

                let newRA = this.viewCenter.ra + deltaRAHours;
                let newDec = this.viewCenter.dec + deltaDec;

                // Handle RA wraparound
                if (newRA < 0) newRA += 24;
                if (newRA >= 24) newRA -= 24;

                // Clamp declination
                newDec = Math.max(-90, Math.min(90, newDec));

                this.viewCenter.ra = newRA;
                this.viewCenter.dec = newDec;

                // Stop following if we're manually panning
                if (this.followingObject) {
                    this.unfollowObject();
                }

                this.lastMousePos = { x: e.clientX, y: e.clientY };
                this.render();
            } else {
                // Show coordinates under mouse
                const coords = this.screenToSky(e.clientX, e.clientY);
                document.getElementById('mouseCoords').innerHTML =
                    `RA: ${coords.ra.toFixed(2)}h, Dec: ${coords.dec.toFixed(1)}°`;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Double-click for following objects
        this.canvas.addEventListener('dblclick', (e) => {
            this.handleDoubleClick(e.clientX, e.clientY);
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'u') {
                this.unfollowObject();
            } else if (e.key === '?') {
                this.toggleHelp();
            }
        });

        // Mouse wheel for zooming
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoom = Math.max(0.1, Math.min(10, this.zoom * zoomFactor));
            this.render();
        });

        // Checkbox event listeners
        document.getElementById('showConstellations').addEventListener('change', (e) => {
            this.showConstellations = e.target.checked;
            this.render();
        });

        document.getElementById('showPlanets').addEventListener('change', (e) => {
            this.showPlanets = e.target.checked;
            this.render();
        });

        document.getElementById('showMoon').addEventListener('change', (e) => {
            this.showMoon = e.target.checked;
            this.render();
        });

        document.getElementById('showStarNames').addEventListener('change', (e) => {
            this.showStarNames = e.target.checked;
            this.render();
        });

        document.getElementById('showGrid').addEventListener('change', (e) => {
            this.showGrid = e.target.checked;
            this.render();
        });

        // Timezone selector
        document.getElementById('timezoneSelect').addEventListener('change', (e) => {
            this.selectedTimezone = e.target.value;
            this.updateDisplay();
        });

        // Help button
        document.getElementById('helpButton').addEventListener('click', () => {
            this.toggleHelp();
        });

        // Close help button
        document.getElementById('closeHelp').addEventListener('click', () => {
            this.toggleHelp();
        });

        document.getElementById('showDeepSky').addEventListener('change', (e) => {
            this.showDeepSky = e.target.checked;
            this.render();
        });
    }

    setupTimeControls() {
        const dateInput = document.getElementById('dateInput');
        const timeInput = document.getElementById('timeInput');

        // Set initial values to current date
        this.updateTimeInputs();

        // Time navigation buttons
        document.getElementById('prevYear').addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
            this.updateDisplay();
        });

        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.updateDisplay();
        });

        document.getElementById('prevDay').addEventListener('click', () => {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.updateDisplay();
        });

        document.getElementById('prevHour').addEventListener('click', () => {
            this.currentDate.setHours(this.currentDate.getHours() - 1);
            this.updateDisplay();
        });

        document.getElementById('nextHour').addEventListener('click', () => {
            this.currentDate.setHours(this.currentDate.getHours() + 1);
            this.updateDisplay();
        });

        document.getElementById('nextDay').addEventListener('click', () => {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.updateDisplay();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.updateDisplay();
        });

        document.getElementById('nextYear').addEventListener('click', () => {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
            this.updateDisplay();
        });

        document.getElementById('prevMinute').addEventListener('click', () => {
            this.currentDate.setMinutes(this.currentDate.getMinutes() - 1);
            this.updateDisplay();
        });

        document.getElementById('nextMinute').addEventListener('click', () => {
            this.currentDate.setMinutes(this.currentDate.getMinutes() + 1);
            this.updateDisplay();
        });

        document.getElementById('prevSecond').addEventListener('click', () => {
            this.currentDate.setSeconds(this.currentDate.getSeconds() - 1);
            this.updateDisplay();
        });

        document.getElementById('nextSecond').addEventListener('click', () => {
            this.currentDate.setSeconds(this.currentDate.getSeconds() + 1);
            this.updateDisplay();
        });

        document.getElementById('resetToNow').addEventListener('click', () => {
            this.currentDate = new Date();
            this.updateDisplay();
        });

        // Playback controls
        document.getElementById('playPause').addEventListener('click', () => {
            this.togglePlayback();
        });

        document.getElementById('fastRewind').addEventListener('click', () => {
            this.playbackDirection = -1;
            this.playbackSpeed = parseInt(document.getElementById('speedSelect').value) * 10;
            this.startPlayback();
        });

        document.getElementById('rewind').addEventListener('click', () => {
            this.playbackDirection = -1;
            this.playbackSpeed = parseInt(document.getElementById('speedSelect').value);
            this.startPlayback();
        });

        document.getElementById('fastForward').addEventListener('click', () => {
            this.playbackDirection = 1;
            this.playbackSpeed = parseInt(document.getElementById('speedSelect').value) * 10;
            this.startPlayback();
        });

        document.getElementById('speedSelect').addEventListener('change', (e) => {
            this.playbackSpeed = parseInt(e.target.value);
            this.updateSpeedDisplay();
            if (this.isPlaying) {
                this.stopPlayback();
                this.startPlayback();
            }
        });

        // Manual date/time input
        dateInput.addEventListener('change', () => {
            const newDate = new Date(dateInput.value + 'T' + timeInput.value);
            if (!isNaN(newDate)) {
                this.currentDate = newDate;
                this.render();
            }
        });

        timeInput.addEventListener('change', () => {
            const newDate = new Date(dateInput.value + 'T' + timeInput.value);
            if (!isNaN(newDate)) {
                this.currentDate = newDate;
                this.render();
            }
        });
    }

    updateTimeInputs() {
        const dateInput = document.getElementById('dateInput');
        const timeInput = document.getElementById('timeInput');

        // Handle timezone conversion
        let displayDate = this.currentDate;
        if (this.selectedTimezone !== 'local' && this.selectedTimezone !== 'UTC') {
            // For named timezones, we'll display in local format but note the timezone
            displayDate = this.currentDate;
        }

        dateInput.value = displayDate.toISOString().split('T')[0];
        timeInput.value = displayDate.toTimeString().slice(0, 8); // Include seconds
    }

    updateDisplay() {
        this.updateTimeInputs();

        // Format datetime display with timezone info
        let timeString;
        if (this.selectedTimezone === 'local') {
            timeString = this.currentDate.toLocaleString();
        } else if (this.selectedTimezone === 'UTC') {
            timeString = this.currentDate.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        } else {
            // For other timezones, show local time but indicate the selected timezone
            timeString = this.currentDate.toLocaleString() + ` (${this.selectedTimezone})`;
        }

        document.getElementById('currentDateTime').innerHTML = timeString;

        // Update following object display
        if (this.followingObject) {
            document.getElementById('followingObject').innerHTML =
                `Following: ${this.followingObject.name}`;
        } else {
            document.getElementById('followingObject').innerHTML = '';
        }

        this.updateSpeedDisplay();
        this.updateFollowingView();
        this.render();
    }

    updateSpeedDisplay() {
        const speedElement = document.getElementById('timeAcceleration');
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

    togglePlayback() {
        if (this.isPlaying) {
            this.stopPlayback();
        } else {
            this.playbackDirection = 1;
            this.playbackSpeed = parseInt(document.getElementById('speedSelect').value);
            this.startPlayback();
        }
    }

    startPlayback() {
        this.stopPlayback(); // Clear any existing interval
        this.isPlaying = true;

        const playPauseBtn = document.getElementById('playPause');
        playPauseBtn.textContent = '⏸';

        this.updateSpeedDisplay();

        // Update every 100ms for smooth animation
        this.playbackInterval = setInterval(() => {
            const deltaTime = (this.playbackSpeed * this.playbackDirection * 100) / 1000; // 100ms intervals
            this.currentDate.setTime(this.currentDate.getTime() + deltaTime * 1000);
            this.updateDisplay();
        }, 100);
    }

    stopPlayback() {
        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }
        this.isPlaying = false;

        const playPauseBtn = document.getElementById('playPause');
        playPauseBtn.textContent = '▶';

        this.updateSpeedDisplay();
    }

    // Convert RA/Dec to screen coordinates
    skyToScreen(ra, dec) {
        // Calculate the difference in RA from the view center
        let deltaRA = ra - this.viewCenter.ra;

        // Handle RA wraparound (0-24 hours)
        if (deltaRA > 12) deltaRA -= 24;
        if (deltaRA < -12) deltaRA += 24;

        const deltaDec = dec - this.viewCenter.dec;

        // Convert to angular distances in degrees
        const deltaRADeg = deltaRA * 15; // 15 degrees per hour

        // Simple azimuthal projection centered on viewCenter
        const scale = this.zoom * Math.min(this.canvas.width, this.canvas.height) / 180; // pixels per degree

        // Project to screen coordinates
        const x = this.canvas.width / 2 + deltaRADeg * Math.cos(this.viewCenter.dec * Math.PI / 180) * scale;
        const y = this.canvas.height / 2 - deltaDec * scale;

        return { x, y };
    }

    // Convert screen coordinates to RA/Dec
    screenToSky(x, y) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        const scale = this.zoom * Math.min(this.canvas.width, this.canvas.height) / 180; // pixels per degree

        // Calculate offsets from center
        const deltaX = x - centerX;
        const deltaY = centerY - y; // Y is flipped

        // Convert back to angular differences
        const deltaRADeg = deltaX / (scale * Math.cos(this.viewCenter.dec * Math.PI / 180));
        const deltaDec = deltaY / scale;

        // Convert RA difference back to hours and add to view center
        const deltaRAHours = deltaRADeg / 15;
        let ra = this.viewCenter.ra + deltaRAHours;

        // Handle RA wraparound
        if (ra < 0) ra += 24;
        if (ra >= 24) ra -= 24;

        const dec = this.viewCenter.dec + deltaDec;

        return {
            ra: ra,
            dec: Math.max(-90, Math.min(90, dec)) // Clamp declination
        };
    }

    // Calculate Local Sidereal Time (simplified)
    getLocalSiderealTime() {
        const jd = this.solarSystem.getJulianDay(this.currentDate);
        const t = (jd - 2451545.0) / 36525.0;

        // Greenwich Sidereal Time
        let gst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
                 0.000387933 * t * t - t * t * t / 38710000.0;

        gst = ((gst % 360) + 360) % 360;

        // Convert to hours
        return gst / 15;
    }

    // Get star size based on magnitude
    getStarSize(magnitude) {
        if (magnitude < 1) return 6;
        if (magnitude < 2) return 4;
        if (magnitude < 3) return 3;
        if (magnitude < 4) return 2;
        if (magnitude < 5) return 1.5;
        return 1;
    }

    // Get star color based on spectral type (simplified)
    getStarColor(magnitude) {
        if (magnitude < 0) return '#BBCCFF'; // Blue-white (very bright)
        if (magnitude < 1) return '#FFFFFF'; // White
        if (magnitude < 2) return '#FFFFCC'; // Yellow-white
        if (magnitude < 3) return '#FFDDAA'; // Yellow
        return '#FFCCAA'; // Orange-red
    }

    render() {
        // Clear canvas with deep space background
        this.ctx.fillStyle = '#000011';
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
    }

    drawGrid() {
        this.ctx.strokeStyle = '#334455';
        this.ctx.lineWidth = 0.8;

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

    drawConstellations() {
        this.ctx.strokeStyle = '#444488';
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

    drawStarNames() {
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'left';

        // Draw constellation star names
        for (const [constellationName, constellation] of Object.entries(CONSTELLATION_DATA)) {
            for (const star of constellation.stars) {
                if (star.mag < 2.5) { // Only show names for bright stars
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

    handleDoubleClick(x, y) {
        // Find closest object to click point
        let closestObject = null;
        let closestDistance = 50; // Maximum click distance in pixels

        // Check solar system objects
        const solarObjects = this.solarSystem.getAllObjects(this.currentDate);
        for (const obj of solarObjects) {
            const pos = this.skyToScreen(obj.ra, obj.dec);
            if (pos) {
                const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
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
                    const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
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
                const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
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
                const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
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

    followObject(obj) {
        this.followingObject = obj;
        this.followingType = obj.type;
        this.updateDisplay();
    }

    unfollowObject() {
        this.followingObject = null;
        this.followingType = null;
        this.updateDisplay();
    }

    updateFollowingView() {
        if (!this.followingObject) return;

        let targetRA, targetDec;

        if (this.followingType === 'star' || this.followingType === 'deepsky') {
            // Fixed objects - use stored coordinates
            targetRA = this.followingObject.ra;
            targetDec = this.followingObject.dec;
        } else if (['sun', 'moon', 'planet'].includes(this.followingType)) {
            // Moving objects - recalculate current position
            if (this.followingObject.name === 'Sun') {
                const sunPos = this.solarSystem.getSunPosition(this.currentDate);
                targetRA = sunPos.ra;
                targetDec = sunPos.dec;
            } else if (this.followingObject.name === 'Moon') {
                const moonPos = this.solarSystem.getMoonPosition(this.currentDate);
                targetRA = moonPos.ra;
                targetDec = moonPos.dec;
            } else {
                // Planet
                const planetPos = this.solarSystem.getPlanetPosition(this.followingObject.name, this.currentDate);
                if (planetPos) {
                    targetRA = planetPos.ra;
                    targetDec = planetPos.dec;
                }
            }
        }

        if (targetRA !== undefined && targetDec !== undefined) {
            // Set view center to exactly match the target coordinates
            this.viewCenter.ra = targetRA;
            this.viewCenter.dec = targetDec;
        }
    }

    toggleHelp() {
        const helpModal = document.getElementById('helpModal');
        if (helpModal.style.display === 'none') {
            helpModal.style.display = 'block';
        } else {
            helpModal.style.display = 'none';
        }
    }

    drawDeepSkyObjects() {
        for (const obj of DEEP_SKY_OBJECTS) {
            const pos = this.skyToScreen(obj.ra, obj.dec);
            if (pos) {
                // Set color based on object type
                let color;
                switch (obj.type) {
                    case 'galaxy':
                        color = '#FF6B6B';
                        break;
                    case 'nebula':
                        color = '#4ECDC4';
                        break;
                    case 'globular':
                        color = '#FFE66D';
                        break;
                    case 'open':
                        color = '#A8E6CF';
                        break;
                    case 'dark':
                        color = '#666666';
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

    startAnimation() {
        // Optional: Auto-update every minute to show real-time sky motion
        setInterval(() => {
            if (Math.abs(new Date() - this.currentDate) < 300000) { // If within 5 minutes of current time
                this.currentDate = new Date();
                this.updateDisplay();
            }
        }, 60000);
    }
}

// Initialize the star map when the page loads
window.addEventListener('load', () => {
    new StarMap();
});