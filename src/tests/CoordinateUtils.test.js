// Tests for CoordinateUtils
import { CoordinateUtils } from '../utils/CoordinateUtils.js';

describe('CoordinateUtils', () => {
    describe('skyToScreen', () => {
        test('should convert valid coordinates to screen position', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const zoom = 1.0;
            const canvas = { width: 800, height: 600 };
            const lst = 12;

            const result = CoordinateUtils.skyToScreen(12, 0, viewCenter, zoom, canvas, lst);
            
            expect(result).toBeDefined();
            expect(result.x).toBeCloseTo(400, 0); // Should be near center
            expect(result.y).toBeCloseTo(300, 0);
        });

        test('should return null for coordinates behind viewer', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const zoom = 1.0;
            const canvas = { width: 800, height: 600 };
            const lst = 12;

            const result = CoordinateUtils.skyToScreen(12, 91, viewCenter, zoom, canvas, lst);
            
            expect(result).toBeNull();
        });

        test('should handle edge cases gracefully', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const zoom = 1.0;
            const canvas = { width: 800, height: 600 };
            const lst = 12;

            // Test with extreme values
            expect(() => {
                CoordinateUtils.skyToScreen(0, 0, viewCenter, zoom, canvas, lst);
            }).not.toThrow();
        });
    });

    describe('screenToSky', () => {
        test('should convert screen coordinates to sky coordinates', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const zoom = 1.0;
            const canvas = { width: 800, height: 600 };
            const lst = 12;

            const result = CoordinateUtils.screenToSky(400, 300, viewCenter, zoom, canvas, lst);
            
            expect(result).toBeDefined();
            expect(result.ra).toBeCloseTo(12, 1);
            expect(result.dec).toBeCloseTo(0, 1);
        });

        test('should handle edge coordinates', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const zoom = 1.0;
            const canvas = { width: 800, height: 600 };
            const lst = 12;

            // Test corners
            expect(() => {
                CoordinateUtils.screenToSky(0, 0, viewCenter, zoom, canvas, lst);
                CoordinateUtils.screenToSky(800, 600, viewCenter, zoom, canvas, lst);
            }).not.toThrow();
        });
    });

    describe('distance', () => {
        test('should calculate distance between two points', () => {
            const point1 = { x: 0, y: 0 };
            const point2 = { x: 3, y: 4 };
            
            const distance = CoordinateUtils.distance(point1, point2);
            expect(distance).toBe(5);
        });

        test('should return 0 for same points', () => {
            const point1 = { x: 5, y: 5 };
            const point2 = { x: 5, y: 5 };
            
            const distance = CoordinateUtils.distance(point1, point2);
            expect(distance).toBe(0);
        });
    });

    describe('normalizeRA', () => {
        test('should normalize RA to 0-24 range', () => {
            expect(CoordinateUtils.normalizeRA(25)).toBe(1);
            expect(CoordinateUtils.normalizeRA(-1)).toBe(23);
            expect(CoordinateUtils.normalizeRA(12)).toBe(12);
            expect(CoordinateUtils.normalizeRA(0)).toBe(0);
            expect(CoordinateUtils.normalizeRA(24)).toBe(0);
        });
    });

    describe('clampDec', () => {
        test('should clamp declination to -90 to 90 range', () => {
            expect(CoordinateUtils.clampDec(91)).toBe(90);
            expect(CoordinateUtils.clampDec(-91)).toBe(-90);
            expect(CoordinateUtils.clampDec(45)).toBe(45);
            expect(CoordinateUtils.clampDec(0)).toBe(0);
        });
    });
});
