// Tests for SolarSystem
import { SolarSystem } from '../components/SolarSystem.js';

describe('SolarSystem', () => {
    let solarSystem;

    beforeEach(() => {
        solarSystem = new SolarSystem();
    });

    describe('getSunPosition', () => {
        test('should calculate Sun position for valid date', () => {
            const testDate = new Date('2024-01-01T12:00:00Z');
            const sunPos = solarSystem.getSunPosition(testDate);
            
            expect(sunPos).toHaveProperty('ra');
            expect(sunPos).toHaveProperty('dec');
            expect(sunPos).toHaveProperty('name', 'Sun');
            expect(typeof sunPos.ra).toBe('number');
            expect(typeof sunPos.dec).toBe('number');
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const sunPos = solarSystem.getSunPosition(invalidDate);
            
            expect(sunPos).toHaveProperty('ra', 0);
            expect(sunPos).toHaveProperty('dec', 0);
            expect(sunPos).toHaveProperty('name', 'Sun');
        });
    });

    describe('getMoonPosition', () => {
        test('should calculate Moon position for valid date', () => {
            const testDate = new Date('2024-01-01T12:00:00Z');
            const moonPos = solarSystem.getMoonPosition(testDate);
            
            expect(moonPos).toHaveProperty('ra');
            expect(moonPos).toHaveProperty('dec');
            expect(moonPos).toHaveProperty('name', 'Moon');
            expect(typeof moonPos.ra).toBe('number');
            expect(typeof moonPos.dec).toBe('number');
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const moonPos = solarSystem.getMoonPosition(invalidDate);
            
            expect(moonPos).toHaveProperty('ra', 0);
            expect(moonPos).toHaveProperty('dec', 0);
            expect(moonPos).toHaveProperty('name', 'Moon');
        });
    });

    describe('getPlanetPosition', () => {
        test('should calculate planet position for valid planet and date', () => {
            const testDate = new Date('2024-01-01T12:00:00Z');
            const planetPos = solarSystem.getPlanetPosition('Mars', testDate);
            
            expect(planetPos).toHaveProperty('ra');
            expect(planetPos).toHaveProperty('dec');
            expect(planetPos).toHaveProperty('name', 'Mars');
            expect(typeof planetPos.ra).toBe('number');
            expect(typeof planetPos.dec).toBe('number');
        });

        test('should return null for invalid planet', () => {
            const testDate = new Date('2024-01-01T12:00:00Z');
            const planetPos = solarSystem.getPlanetPosition('InvalidPlanet', testDate);
            
            expect(planetPos).toBeNull();
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const planetPos = solarSystem.getPlanetPosition('Mars', invalidDate);
            
            expect(planetPos).toBeNull();
        });
    });

    describe('getAllObjects', () => {
        test('should return array of solar system objects', () => {
            const testDate = new Date('2024-01-01T12:00:00Z');
            const objects = solarSystem.getAllObjects(testDate);
            
            expect(Array.isArray(objects)).toBe(true);
            expect(objects.length).toBeGreaterThan(0);
            
            // Check that we have Sun and Moon
            const sun = objects.find(obj => obj.name === 'Sun');
            const moon = objects.find(obj => obj.name === 'Moon');
            
            expect(sun).toBeDefined();
            expect(moon).toBeDefined();
            expect(sun.type).toBe('sun');
            expect(moon.type).toBe('moon');
        });

        test('should handle invalid date gracefully', () => {
            const invalidDate = new Date('invalid');
            const objects = solarSystem.getAllObjects(invalidDate);
            
            expect(Array.isArray(objects)).toBe(true);
            expect(objects.length).toBe(0);
        });
    });

    describe('planet data', () => {
        test('should have all required planets with orbital data', () => {
            const requiredPlanets = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
            
            requiredPlanets.forEach(planetName => {
                const planet = solarSystem.planets[planetName];
                expect(planet).toBeDefined();
                expect(planet).toHaveProperty('period');
                expect(planet).toHaveProperty('semiMajorAxis');
                expect(planet).toHaveProperty('eccentricity');
                expect(planet).toHaveProperty('inclination');
                expect(planet).toHaveProperty('color');
                expect(planet).toHaveProperty('size');
                expect(planet).toHaveProperty('symbol');
            });
        });

        test('should have Sun and Moon data', () => {
            expect(solarSystem.planets.Sun).toBeDefined();
            expect(solarSystem.planets.Moon).toBeDefined();
            expect(solarSystem.planets.Sun).toHaveProperty('color');
            expect(solarSystem.planets.Sun).toHaveProperty('size');
            expect(solarSystem.planets.Sun).toHaveProperty('symbol');
            expect(solarSystem.planets.Moon).toHaveProperty('color');
            expect(solarSystem.planets.Moon).toHaveProperty('size');
            expect(solarSystem.planets.Moon).toHaveProperty('symbol');
        });
    });
});
