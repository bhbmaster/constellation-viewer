// Coordinate transformation utilities
import { CONSTANTS } from './Constants.js';

export class CoordinateUtils {
    /**
     * Convert RA/Dec to screen coordinates with improved dragging
     * @param {number} ra - Right Ascension in hours
     * @param {number} dec - Declination in degrees
     * @param {Object} viewCenter - Current view center {ra, dec}
     * @param {number} zoom - Current zoom level
     * @param {Object} canvas - Canvas dimensions {width, height}
     * @param {number} lst - Local Sidereal Time in hours
     * @returns {Object|null} Screen coordinates {x, y} or null if behind viewer
     */
    static skyToScreen(ra, dec, viewCenter, zoom, canvas, lst) {
        try {
            // Calculate the difference in RA from the view center
            const raDiff = ((ra - viewCenter.ra) % 24 + 24) % 24;
            const adjustedRa = raDiff * 15; // Convert to degrees

            // Simple stereographic projection
            const raRad = adjustedRa * Math.PI / 180;
            const decRad = dec * Math.PI / 180;
            const centerDecRad = viewCenter.dec * Math.PI / 180;

            const cosC = Math.sin(centerDecRad) * Math.sin(decRad) +
                        Math.cos(centerDecRad) * Math.cos(decRad) * Math.cos(raRad);

            // Check if behind viewer (cosC <= 0) or if declination is too extreme
            if (cosC <= 0 || Math.abs(dec) > 90) return null;

            const k = zoom * Math.min(canvas.width, canvas.height) / 4;

            const x = canvas.width / 2 + k * Math.cos(decRad) * Math.sin(raRad) / (1 + cosC);
            const y = canvas.height / 2 - k * (Math.cos(centerDecRad) * Math.sin(decRad) -
                     Math.sin(centerDecRad) * Math.cos(decRad) * Math.cos(raRad)) / (1 + cosC);

            return { x, y };
        } catch (error) {
            console.error('Error in skyToScreen:', error);
            return null;
        }
    }

    /**
     * Convert screen coordinates to RA/Dec
     * @param {number} x - Screen x coordinate
     * @param {number} y - Screen y coordinate
     * @param {Object} viewCenter - Current view center {ra, dec}
     * @param {number} zoom - Current zoom level
     * @param {Object} canvas - Canvas dimensions {width, height}
     * @param {number} lst - Local Sidereal Time in hours
     * @returns {Object} Sky coordinates {ra, dec}
     */
    static screenToSky(x, y, viewCenter, zoom, canvas, lst) {
        try {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const k = zoom * Math.min(canvas.width, canvas.height) / 4;

            const dx = (x - centerX) / k;
            const dy = (centerY - y) / k;

            const rho = Math.sqrt(dx * dx + dy * dy);
            
            // Handle edge case where rho is 0 (center of screen)
            if (rho === 0) {
                return {
                    ra: viewCenter.ra,
                    dec: viewCenter.dec
                };
            }

            const c = 2 * Math.atan(rho / 2);

            const centerDecRad = viewCenter.dec * Math.PI / 180;

            const dec = Math.asin(Math.cos(c) * Math.sin(centerDecRad) +
                                 dy * Math.sin(c) * Math.cos(centerDecRad) / rho);

            const ra = Math.atan2(dx * Math.sin(c),
                                 rho * Math.cos(centerDecRad) * Math.cos(c) -
                                 dy * Math.sin(centerDecRad) * Math.sin(c));

            const adjustedRa = (ra * 180 / Math.PI) / 15 + viewCenter.ra;

            return {
                ra: ((adjustedRa % 24) + 24) % 24,
                dec: Math.max(-90, Math.min(90, dec * 180 / Math.PI))
            };
        } catch (error) {
            console.error('Error in screenToSky:', error);
            return { ra: viewCenter.ra, dec: viewCenter.dec };
        }
    }

    /**
     * Calculate distance between two screen points
     * @param {Object} point1 - {x, y}
     * @param {Object} point2 - {x, y}
     * @returns {number} Distance in pixels
     */
    static distance(point1, point2) {
        const dx = point1.x - point2.x;
        const dy = point1.y - point2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Normalize RA to 0-24 range
     * @param {number} ra - Right Ascension in hours
     * @returns {number} Normalized RA
     */
    static normalizeRA(ra) {
        return ((ra % 24) + 24) % 24;
    }

    /**
     * Clamp declination to -90 to 90 range
     * @param {number} dec - Declination in degrees
     * @returns {number} Clamped declination
     */
    static clampDec(dec) {
        return Math.max(-90, Math.min(90, dec));
    }
}
