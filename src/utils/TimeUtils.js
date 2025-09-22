// Time calculation utilities
import { CONSTANTS } from './Constants.js';

export class TimeUtils {
    /**
     * Calculate Julian Day Number
     * @param {Date} date - Date object
     * @returns {number} Julian Day Number
     */
    static getJulianDay(date) {
        try {
            const a = Math.floor((14 - (date.getMonth() + 1)) / 12);
            const y = date.getFullYear() + 4800 - a;
            const m = (date.getMonth() + 1) + 12 * a - 3;

            const jdn = date.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y +
                       Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

            const time = (date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600) / 24;

            return jdn + time - 0.5;
        } catch (error) {
            console.error('Error calculating Julian Day:', error);
            return CONSTANTS.TIME.J2000_JD;
        }
    }

    /**
     * Calculate days since J2000.0
     * @param {Date} date - Date object
     * @returns {number} Days since J2000.0
     */
    static getDaysSinceJ2000(date) {
        return this.getJulianDay(date) - CONSTANTS.TIME.J2000_JD;
    }

    /**
     * Calculate Local Sidereal Time (simplified)
     * @param {Date} date - Date object
     * @returns {number} LST in hours
     */
    static getLocalSiderealTime(date) {
        try {
            const jd = this.getJulianDay(date);
            const t = (jd - CONSTANTS.TIME.J2000_JD) / 36525.0;

            // Greenwich Sidereal Time
            let gst = 280.46061837 + 360.98564736629 * (jd - CONSTANTS.TIME.J2000_JD) +
                     0.000387933 * t * t - t * t * t / 38710000.0;

            gst = ((gst % 360) + 360) % 360;

            // Convert to hours
            return gst / 15;
        } catch (error) {
            console.error('Error calculating LST:', error);
            return 0;
        }
    }

    /**
     * Format time for display
     * @param {Date} date - Date object
     * @param {string} timezone - Timezone identifier
     * @returns {string} Formatted time string
     */
    static formatTime(date, timezone = 'local') {
        try {
            if (timezone === 'local') {
                return date.toLocaleString();
            } else if (timezone === 'UTC') {
                return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
            } else {
                return date.toLocaleString() + ` (${timezone})`;
            }
        } catch (error) {
            console.error('Error formatting time:', error);
            return date.toString();
        }
    }

    /**
     * Validate date object
     * @param {any} date - Date to validate
     * @returns {boolean} True if valid date
     */
    static isValidDate(date) {
        return date instanceof Date && !isNaN(date.getTime());
    }
}
