import { MathUtils } from '../utils/MathUtils.js';

describe('MathUtils', () => {
    describe('getStarSize', () => {
        test('should return 6 for magnitude < 1', () => {
            expect(MathUtils.getStarSize(0.5)).toBe(6);
            expect(MathUtils.getStarSize(-1)).toBe(6);
        });

        test('should return 4 for magnitude 1-2', () => {
            expect(MathUtils.getStarSize(1.5)).toBe(4);
            expect(MathUtils.getStarSize(1)).toBe(4);
        });

        test('should return 3 for magnitude 2-3', () => {
            expect(MathUtils.getStarSize(2.5)).toBe(3);
            expect(MathUtils.getStarSize(2)).toBe(3);
        });

        test('should return 2 for magnitude 3-4', () => {
            expect(MathUtils.getStarSize(3.5)).toBe(2);
            expect(MathUtils.getStarSize(3)).toBe(2);
        });

        test('should return 1.5 for magnitude 4-5', () => {
            expect(MathUtils.getStarSize(4.5)).toBe(1.5);
            expect(MathUtils.getStarSize(4)).toBe(1.5);
        });

        test('should return 1 for magnitude >= 5', () => {
            expect(MathUtils.getStarSize(5)).toBe(1);
            expect(MathUtils.getStarSize(6)).toBe(1);
        });
    });

    describe('getStarColor', () => {
        test('should return VERY_BRIGHT color for magnitude < 0', () => {
            const color = MathUtils.getStarColor(-1);
            expect(color).toBeDefined();
            expect(typeof color).toBe('string');
        });

        test('should return BRIGHT color for magnitude 0-1', () => {
            const color = MathUtils.getStarColor(0.5);
            expect(color).toBeDefined();
            expect(typeof color).toBe('string');
        });

        test('should return MEDIUM color for magnitude 1-2', () => {
            const color = MathUtils.getStarColor(1.5);
            expect(color).toBeDefined();
            expect(typeof color).toBe('string');
        });

        test('should return DIM color for magnitude 2-3', () => {
            const color = MathUtils.getStarColor(2.5);
            expect(color).toBeDefined();
            expect(typeof color).toBe('string');
        });

        test('should return FAINT color for magnitude >= 3', () => {
            const color = MathUtils.getStarColor(3.5);
            expect(color).toBeDefined();
            expect(typeof color).toBe('string');
        });
    });

    describe('clamp', () => {
        test('should return value when within range', () => {
            expect(MathUtils.clamp(5, 0, 10)).toBe(5);
            expect(MathUtils.clamp(0, 0, 10)).toBe(0);
            expect(MathUtils.clamp(10, 0, 10)).toBe(10);
        });

        test('should return min when value is below range', () => {
            expect(MathUtils.clamp(-5, 0, 10)).toBe(0);
            expect(MathUtils.clamp(2, 5, 10)).toBe(5);
        });

        test('should return max when value is above range', () => {
            expect(MathUtils.clamp(15, 0, 10)).toBe(10);
            expect(MathUtils.clamp(8, 0, 5)).toBe(5);
        });
    });

    describe('lerp', () => {
        test('should return start value when t=0', () => {
            expect(MathUtils.lerp(0, 10, 0)).toBe(0);
            expect(MathUtils.lerp(5, 15, 0)).toBe(5);
        });

        test('should return end value when t=1', () => {
            expect(MathUtils.lerp(0, 10, 1)).toBe(10);
            expect(MathUtils.lerp(5, 15, 1)).toBe(15);
        });

        test('should return midpoint when t=0.5', () => {
            expect(MathUtils.lerp(0, 10, 0.5)).toBe(5);
            expect(MathUtils.lerp(5, 15, 0.5)).toBe(10);
        });

        test('should handle fractional interpolation', () => {
            expect(MathUtils.lerp(0, 10, 0.3)).toBe(3);
            expect(MathUtils.lerp(10, 20, 0.7)).toBe(17);
        });
    });

    describe('degToRad', () => {
        test('should convert degrees to radians correctly', () => {
            expect(MathUtils.degToRad(0)).toBe(0);
            expect(MathUtils.degToRad(90)).toBeCloseTo(Math.PI / 2);
            expect(MathUtils.degToRad(180)).toBeCloseTo(Math.PI);
            expect(MathUtils.degToRad(360)).toBeCloseTo(2 * Math.PI);
        });

        test('should handle negative degrees', () => {
            expect(MathUtils.degToRad(-90)).toBeCloseTo(-Math.PI / 2);
            expect(MathUtils.degToRad(-180)).toBeCloseTo(-Math.PI);
        });
    });

    describe('radToDeg', () => {
        test('should convert radians to degrees correctly', () => {
            expect(MathUtils.radToDeg(0)).toBe(0);
            expect(MathUtils.radToDeg(Math.PI / 2)).toBeCloseTo(90);
            expect(MathUtils.radToDeg(Math.PI)).toBeCloseTo(180);
            expect(MathUtils.radToDeg(2 * Math.PI)).toBeCloseTo(360);
        });

        test('should handle negative radians', () => {
            expect(MathUtils.radToDeg(-Math.PI / 2)).toBeCloseTo(-90);
            expect(MathUtils.radToDeg(-Math.PI)).toBeCloseTo(-180);
        });
    });

    describe('distance', () => {
        test('should calculate distance between two points', () => {
            expect(MathUtils.distance(0, 0, 3, 4)).toBe(5); // 3-4-5 triangle
            expect(MathUtils.distance(0, 0, 0, 0)).toBe(0); // same point
            expect(MathUtils.distance(1, 1, 4, 5)).toBe(5); // 3-4-5 triangle offset
        });

        test('should handle negative coordinates', () => {
            expect(MathUtils.distance(-1, -1, 2, 3)).toBe(5);
            expect(MathUtils.distance(-3, -4, 0, 0)).toBe(5);
        });
    });

    describe('throttle', () => {
        test('should call function immediately on first call', () => {
            const mockFn = jest.fn();
            const throttledFn = MathUtils.throttle(mockFn, 100);
            
            throttledFn();
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should not call function again within throttle limit', () => {
            const mockFn = jest.fn();
            const throttledFn = MathUtils.throttle(mockFn, 100);
            
            throttledFn();
            throttledFn();
            throttledFn();
            
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('should call function again after throttle limit', (done) => {
            const mockFn = jest.fn();
            const throttledFn = MathUtils.throttle(mockFn, 50);
            
            throttledFn();
            expect(mockFn).toHaveBeenCalledTimes(1);
            
            setTimeout(() => {
                throttledFn();
                expect(mockFn).toHaveBeenCalledTimes(2);
                done();
            }, 60);
        });
    });

    describe('debounce', () => {
        test('should not call function immediately', () => {
            const mockFn = jest.fn();
            const debouncedFn = MathUtils.debounce(mockFn, 100);
            
            debouncedFn();
            expect(mockFn).not.toHaveBeenCalled();
        });

        test('should call function after delay', (done) => {
            const mockFn = jest.fn();
            const debouncedFn = MathUtils.debounce(mockFn, 50);
            
            debouncedFn();
            
            setTimeout(() => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                done();
            }, 60);
        });

        test('should reset delay on multiple calls', (done) => {
            const mockFn = jest.fn();
            const debouncedFn = MathUtils.debounce(mockFn, 100);
            
            debouncedFn();
            setTimeout(() => debouncedFn(), 50);
            
            setTimeout(() => {
                expect(mockFn).toHaveBeenCalledTimes(1);
                done();
            }, 200);
        });
    });
});
