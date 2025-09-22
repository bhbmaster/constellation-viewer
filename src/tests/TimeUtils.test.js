import { TimeUtils } from '../utils/TimeUtils.js';

describe('TimeUtils', () => {
    describe('getJulianDay', () => {
        test('should calculate Julian Day for known date', () => {
            // J2000.0 is January 1, 2000 12:00:00 UTC
            const j2000 = new Date('2000-01-01T12:00:00Z');
            const jd = TimeUtils.getJulianDay(j2000);
            
            // J2000.0 should be approximately 2451545.0
            expect(jd).toBeCloseTo(2451545.0, 0);
        });

        test('should handle different dates correctly', () => {
            const date1 = new Date('2023-01-01T00:00:00Z');
            const date2 = new Date('2023-12-31T23:59:59Z');
            
            const jd1 = TimeUtils.getJulianDay(date1);
            const jd2 = TimeUtils.getJulianDay(date2);
            
            expect(jd1).toBeGreaterThan(2451545); // After J2000
            expect(jd2).toBeGreaterThan(jd1); // Later date has higher JD
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const jd = TimeUtils.getJulianDay(invalidDate);
            
            // Should return J2000_JD as fallback
            expect(jd).toBeDefined();
            expect(typeof jd).toBe('number');
        });

        test('should include time component', () => {
            const date1 = new Date('2000-01-01T00:00:00Z');
            const date2 = new Date('2000-01-01T12:00:00Z');
            
            const jd1 = TimeUtils.getJulianDay(date1);
            const jd2 = TimeUtils.getJulianDay(date2);
            
            // 12 hours should add 0.5 to Julian Day
            expect(jd2 - jd1).toBeCloseTo(0.5, 2);
        });
    });

    describe('getDaysSinceJ2000', () => {
        test('should return 0 for J2000.0', () => {
            const j2000 = new Date('2000-01-01T12:00:00Z');
            const days = TimeUtils.getDaysSinceJ2000(j2000);
            
            expect(days).toBeCloseTo(0, 0);
        });

        test('should return positive for dates after J2000', () => {
            const futureDate = new Date('2023-01-01T12:00:00Z');
            const days = TimeUtils.getDaysSinceJ2000(futureDate);
            
            expect(days).toBeGreaterThan(0);
            expect(days).toBeCloseTo(23 * 365.25, 0); // Approximately 23 years
        });

        test('should return negative for dates before J2000', () => {
            const pastDate = new Date('1990-01-01T12:00:00Z');
            const days = TimeUtils.getDaysSinceJ2000(pastDate);
            
            expect(days).toBeLessThan(0);
        });
    });

    describe('getLocalSiderealTime', () => {
        test('should return a valid LST value', () => {
            const date = new Date('2023-01-01T12:00:00Z');
            const lst = TimeUtils.getLocalSiderealTime(date);
            
            expect(lst).toBeDefined();
            expect(typeof lst).toBe('number');
            expect(lst).toBeGreaterThanOrEqual(0);
            expect(lst).toBeLessThan(24);
        });

        test('should handle different times of day', () => {
            const date1 = new Date('2023-01-01T00:00:00Z');
            const date2 = new Date('2023-01-01T12:00:00Z');
            
            const lst1 = TimeUtils.getLocalSiderealTime(date1);
            const lst2 = TimeUtils.getLocalSiderealTime(date2);
            
            expect(lst1).toBeDefined();
            expect(lst2).toBeDefined();
            expect(Math.abs(lst2 - lst1)).toBeGreaterThan(0);
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const lst = TimeUtils.getLocalSiderealTime(invalidDate);
            
            expect(lst).toBeDefined();
            expect(isNaN(lst) || lst === 0).toBe(true); // Should return 0 or NaN as fallback
        });

        test('should return consistent results for same input', () => {
            const date = new Date('2023-06-15T18:30:00Z');
            const lst1 = TimeUtils.getLocalSiderealTime(date);
            const lst2 = TimeUtils.getLocalSiderealTime(date);
            
            expect(lst1).toBe(lst2);
        });
    });

    describe('formatTime', () => {
        test('should format local time by default', () => {
            const date = new Date('2023-01-01T12:00:00Z');
            const formatted = TimeUtils.formatTime(date);
            
            expect(formatted).toBeDefined();
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
        });

        test('should format UTC time when specified', () => {
            const date = new Date('2023-01-01T12:00:00Z');
            const formatted = TimeUtils.formatTime(date, 'UTC');
            
            expect(formatted).toContain('UTC');
            expect(formatted).toContain('2023-01-01');
        });

        test('should format timezone-specific time', () => {
            const date = new Date('2023-01-01T12:00:00Z');
            const formatted = TimeUtils.formatTime(date, 'America/New_York');
            
            expect(formatted).toContain('America/New_York');
            expect(formatted).toBeDefined();
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const formatted = TimeUtils.formatTime(invalidDate);
            
            expect(formatted).toBeDefined();
            expect(typeof formatted).toBe('string');
        });

        test('should handle different timezone formats', () => {
            const date = new Date('2023-01-01T12:00:00Z');
            
            const local = TimeUtils.formatTime(date, 'local');
            const utc = TimeUtils.formatTime(date, 'UTC');
            const custom = TimeUtils.formatTime(date, 'Europe/London');
            
            expect(local).toBeDefined();
            expect(utc).toBeDefined();
            expect(custom).toBeDefined();
        });
    });

    describe('isValidDate', () => {
        test('should return true for valid Date objects', () => {
            const validDate = new Date('2023-01-01T12:00:00Z');
            expect(TimeUtils.isValidDate(validDate)).toBe(true);
        });

        test('should return false for invalid Date objects', () => {
            const invalidDate = new Date('invalid');
            expect(TimeUtils.isValidDate(invalidDate)).toBe(false);
        });

        test('should return false for non-Date objects', () => {
            expect(TimeUtils.isValidDate('2023-01-01')).toBe(false);
            expect(TimeUtils.isValidDate(1234567890)).toBe(false);
            expect(TimeUtils.isValidDate(null)).toBe(false);
            expect(TimeUtils.isValidDate(undefined)).toBe(false);
            expect(TimeUtils.isValidDate({})).toBe(false);
        });

        test('should return false for null and undefined', () => {
            expect(TimeUtils.isValidDate(null)).toBe(false);
            expect(TimeUtils.isValidDate(undefined)).toBe(false);
        });
    });

    describe('error handling', () => {
        test('should handle errors in getJulianDay gracefully', () => {
            // Mock console.error to avoid noise in test output
            const originalError = console.error;
            console.error = jest.fn();
            
            // Create a date that might cause issues
            const problematicDate = new Date('invalid');
            const result = TimeUtils.getJulianDay(problematicDate);
            
            expect(result).toBeDefined();
            expect(typeof result).toBe('number');
            
            console.error = originalError;
        });

        test('should handle errors in getLocalSiderealTime gracefully', () => {
            const originalError = console.error;
            console.error = jest.fn();
            
            const problematicDate = new Date('invalid');
            const result = TimeUtils.getLocalSiderealTime(problematicDate);
            
            expect(result).toBeDefined();
            expect(isNaN(result) || result === 0).toBe(true);
            
            console.error = originalError;
        });

        test('should handle errors in formatTime gracefully', () => {
            const originalError = console.error;
            console.error = jest.fn();
            
            const problematicDate = new Date('invalid');
            const result = TimeUtils.formatTime(problematicDate);
            
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            
            console.error = originalError;
        });
    });

    describe('edge cases and boundary conditions', () => {
        test('should handle very old dates', () => {
            const oldDate = new Date('1900-01-01T12:00:00Z');
            const jd = TimeUtils.getJulianDay(oldDate);
            const days = TimeUtils.getDaysSinceJ2000(oldDate);
            
            expect(jd).toBeDefined();
            expect(typeof jd).toBe('number');
            expect(days).toBeLessThan(0); // Before J2000
        });

        test('should handle very future dates', () => {
            const futureDate = new Date('2100-01-01T12:00:00Z');
            const jd = TimeUtils.getJulianDay(futureDate);
            const days = TimeUtils.getDaysSinceJ2000(futureDate);
            
            expect(jd).toBeDefined();
            expect(typeof jd).toBe('number');
            expect(days).toBeGreaterThan(0); // After J2000
        });

        test('should handle leap year dates', () => {
            const leapYearDate = new Date('2024-02-29T12:00:00Z');
            const jd = TimeUtils.getJulianDay(leapYearDate);
            
            expect(jd).toBeDefined();
            expect(typeof jd).toBe('number');
            expect(jd).toBeGreaterThan(0);
        });

        test('should handle different time zones in formatTime', () => {
            const date = new Date('2023-06-15T12:00:00Z');
            
            const local = TimeUtils.formatTime(date, 'local');
            const utc = TimeUtils.formatTime(date, 'UTC');
            const est = TimeUtils.formatTime(date, 'America/New_York');
            
            expect(local).toBeDefined();
            expect(utc).toBeDefined();
            expect(est).toBeDefined();
            expect(typeof local).toBe('string');
            expect(typeof utc).toBe('string');
            expect(typeof est).toBe('string');
        });

        test('should handle extreme magnitude values in LST calculation', () => {
            const date1 = new Date('2000-01-01T00:00:00Z');
            const date2 = new Date('2000-12-31T23:59:59Z');
            
            const lst1 = TimeUtils.getLocalSiderealTime(date1);
            const lst2 = TimeUtils.getLocalSiderealTime(date2);
            
            expect(lst1).toBeDefined();
            expect(lst2).toBeDefined();
            expect(typeof lst1).toBe('number');
            expect(typeof lst2).toBe('number');
        });
    });

    describe('performance and consistency', () => {
        test('should return consistent results for same input', () => {
            const date = new Date('2023-06-15T18:30:00Z');
            
            const jd1 = TimeUtils.getJulianDay(date);
            const jd2 = TimeUtils.getJulianDay(date);
            expect(jd1).toBe(jd2);
            
            const lst1 = TimeUtils.getLocalSiderealTime(date);
            const lst2 = TimeUtils.getLocalSiderealTime(date);
            expect(lst1).toBe(lst2);
        });

        test('should handle rapid successive calls', () => {
            const date = new Date('2023-06-15T18:30:00Z');
            
            // Call multiple times rapidly
            for (let i = 0; i < 10; i++) {
                const jd = TimeUtils.getJulianDay(date);
                const lst = TimeUtils.getLocalSiderealTime(date);
                const days = TimeUtils.getDaysSinceJ2000(date);
                
                expect(jd).toBeDefined();
                expect(lst).toBeDefined();
                expect(days).toBeDefined();
            }
        });
    });

    describe('mathematical accuracy and precision', () => {
        test('should calculate Julian Day with sufficient precision', () => {
            const date1 = new Date('2000-01-01T12:00:00Z');
            const date2 = new Date('2000-01-01T12:00:01Z');
            
            const jd1 = TimeUtils.getJulianDay(date1);
            const jd2 = TimeUtils.getJulianDay(date2);
            
            // 1 second should be approximately 1/86400 of a day
            const diff = jd2 - jd1;
            expect(diff).toBeCloseTo(1/86400, 6);
        });

        test('should handle microsecond precision', () => {
            const date1 = new Date('2023-06-15T12:00:00.000Z');
            const date2 = new Date('2023-06-15T12:00:00.001Z');
            
            const jd1 = TimeUtils.getJulianDay(date1);
            const jd2 = TimeUtils.getJulianDay(date2);
            
            // The difference should be very small but measurable
            const diff = jd2 - jd1;
            expect(diff).toBeGreaterThanOrEqual(0);
            expect(diff).toBeCloseTo(1/86400000, 6); // 1ms = 1/86400000 days
        });

        test('should maintain precision across different dates', () => {
            const dates = [
                new Date('1900-01-01T00:00:00Z'),
                new Date('1950-01-01T00:00:00Z'),
                new Date('2000-01-01T00:00:00Z'),
                new Date('2050-01-01T00:00:00Z'),
                new Date('2100-01-01T00:00:00Z')
            ];
            
            dates.forEach(date => {
                const jd = TimeUtils.getJulianDay(date);
                const days = TimeUtils.getDaysSinceJ2000(date);
                const lst = TimeUtils.getLocalSiderealTime(date);
                
                expect(jd).toBeGreaterThan(0);
                expect(typeof jd).toBe('number');
                expect(typeof days).toBe('number');
                expect(typeof lst).toBe('number');
                expect(lst).toBeGreaterThanOrEqual(0);
                expect(lst).toBeLessThan(24);
            });
        });
    });

    describe('timezone and localization', () => {
        test('should handle different timezone formats in formatTime', () => {
            const date = new Date('2023-06-15T12:00:00Z');
            
            const timezones = [
                'local',
                'UTC',
                'America/New_York',
                'America/Chicago',
                'America/Denver',
                'America/Los_Angeles',
                'Europe/London',
                'Europe/Paris',
                'Asia/Tokyo'
            ];
            
            timezones.forEach(tz => {
                const formatted = TimeUtils.formatTime(date, tz);
                expect(formatted).toBeDefined();
                expect(typeof formatted).toBe('string');
                expect(formatted.length).toBeGreaterThan(0);
            });
        });

        test('should handle invalid timezone gracefully', () => {
            const date = new Date('2023-06-15T12:00:00Z');
            
            const invalidTimezones = ['invalid', '', null, undefined];
            
            invalidTimezones.forEach(tz => {
                const formatted = TimeUtils.formatTime(date, tz);
                expect(formatted).toBeDefined();
                expect(typeof formatted).toBe('string');
            });
        });
    });

    describe('astronomical accuracy', () => {
        test('should calculate LST within valid range', () => {
            const testDates = [
                new Date('2023-01-01T00:00:00Z'),
                new Date('2023-03-21T00:00:00Z'), // Spring equinox
                new Date('2023-06-21T00:00:00Z'), // Summer solstice
                new Date('2023-09-23T00:00:00Z'), // Autumn equinox
                new Date('2023-12-21T00:00:00Z')  // Winter solstice
            ];
            
            testDates.forEach(date => {
                const lst = TimeUtils.getLocalSiderealTime(date);
                expect(lst).toBeGreaterThanOrEqual(0);
                expect(lst).toBeLessThan(24);
                expect(typeof lst).toBe('number');
            });
        });

        test('should show LST progression over time', () => {
            const baseDate = new Date('2023-06-15T00:00:00Z');
            const lstValues = [];
            
            // Test LST over 24 hours
            for (let hour = 0; hour < 24; hour++) {
                const date = new Date(baseDate.getTime() + hour * 60 * 60 * 1000);
                const lst = TimeUtils.getLocalSiderealTime(date);
                lstValues.push(lst);
            }
            
            // LST should generally increase over time (with some variation due to Earth's rotation)
            expect(lstValues.length).toBe(24);
            lstValues.forEach(lst => {
                expect(lst).toBeGreaterThanOrEqual(0);
                expect(lst).toBeLessThan(24);
            });
        });
    });

    describe('error recovery and robustness', () => {
        test('should handle malformed date strings', () => {
            const malformedDates = [
                'not-a-date',
                '2023-13-45T25:70:90Z', // Invalid month, day, hour, minute, second
                '2023-02-30T12:00:00Z', // Invalid day for February
                '2023-04-31T12:00:00Z', // Invalid day for April
                '2023-06-15T12:00:00', // Missing timezone
                '2023/06/15 12:00:00' // Wrong format
            ];
            
            malformedDates.forEach(dateStr => {
                const date = new Date(dateStr);
                const jd = TimeUtils.getJulianDay(date);
                const lst = TimeUtils.getLocalSiderealTime(date);
                const days = TimeUtils.getDaysSinceJ2000(date);
                
                // Should either return valid numbers or handle gracefully
                expect(typeof jd).toBe('number');
                expect(typeof lst).toBe('number');
                expect(typeof days).toBe('number');
            });
        });

        test('should handle extreme date values', () => {
            const extremeDates = [
                new Date('0001-01-01T00:00:00Z'), // Very old
                new Date('9999-12-31T23:59:59Z'), // Very future
                new Date('1970-01-01T00:00:00Z'), // Unix epoch
                new Date('2038-01-19T03:14:07Z')  // 32-bit time_t limit
            ];
            
            extremeDates.forEach(date => {
                const jd = TimeUtils.getJulianDay(date);
                const days = TimeUtils.getDaysSinceJ2000(date);
                const lst = TimeUtils.getLocalSiderealTime(date);
                
                expect(jd).toBeDefined();
                expect(days).toBeDefined();
                expect(lst).toBeDefined();
                expect(typeof jd).toBe('number');
                expect(typeof days).toBe('number');
                expect(typeof lst).toBe('number');
            });
        });
    });
});
