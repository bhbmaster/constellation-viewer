// Solar system object calculations and orbital mechanics
import { TimeUtils } from '../utils/TimeUtils.js';
import { CONSTANTS } from '../utils/Constants.js';

export class SolarSystem {
    constructor() {
        // Orbital elements for planets (simplified Keplerian elements)
        this.planets = {
            Sun: {
                color: '#FFFF00',
                size: 8,
                symbol: '☉'
            },
            Moon: {
                color: '#CCCCCC',
                size: 4,
                symbol: '☽',
                // Lunar orbital elements
                period: 27.321661, // days
                inclination: 5.145, // degrees
                eccentricity: 0.0549
            },
            Mercury: {
                color: '#8C7853',
                size: 2,
                symbol: '☿',
                period: 87.969, // days
                semiMajorAxis: 0.387, // AU
                eccentricity: 0.2056,
                inclination: 7.005, // degrees
                longitudeAscendingNode: 48.331, // degrees
                argumentPeriapsis: 29.124, // degrees
                meanAnomalyEpoch: 174.796 // degrees at J2000
            },
            Venus: {
                color: '#FFC649',
                size: 3,
                symbol: '♀',
                period: 224.701,
                semiMajorAxis: 0.723,
                eccentricity: 0.0067,
                inclination: 3.395,
                longitudeAscendingNode: 76.680,
                argumentPeriapsis: 54.884,
                meanAnomalyEpoch: 50.115
            },
            Mars: {
                color: '#CD5C5C',
                size: 3,
                symbol: '♂',
                period: 686.980,
                semiMajorAxis: 1.524,
                eccentricity: 0.0934,
                inclination: 1.850,
                longitudeAscendingNode: 49.558,
                argumentPeriapsis: 286.502,
                meanAnomalyEpoch: 19.373
            },
            Jupiter: {
                color: '#D8CA9D',
                size: 6,
                symbol: '♃',
                period: 4332.590,
                semiMajorAxis: 5.204,
                eccentricity: 0.0489,
                inclination: 1.303,
                longitudeAscendingNode: 100.464,
                argumentPeriapsis: 273.867,
                meanAnomalyEpoch: 20.020
            },
            Saturn: {
                color: '#FFF8DC',
                size: 5,
                symbol: '♄',
                period: 10759.22,
                semiMajorAxis: 9.537,
                eccentricity: 0.0565,
                inclination: 2.485,
                longitudeAscendingNode: 113.665,
                argumentPeriapsis: 339.392,
                meanAnomalyEpoch: 317.020
            },
            Uranus: {
                color: '#4FD0E3',
                size: 4,
                symbol: '♅',
                period: 30688.5,
                semiMajorAxis: 19.2,
                eccentricity: 0.0457,
                inclination: 0.772,
                longitudeAscendingNode: 74.006,
                argumentPeriapsis: 96.998857,
                meanAnomalyEpoch: 142.2386
            },
            Neptune: {
                color: '#4169E1',
                size: 4,
                symbol: '♆',
                period: 60182,
                semiMajorAxis: 30.05,
                eccentricity: 0.0113,
                inclination: 1.767,
                longitudeAscendingNode: 131.784,
                argumentPeriapsis: 276.336,
                meanAnomalyEpoch: 256.228
            }
        };
    }

    /**
     * Calculate Sun's position (simplified)
     * @param {Date} date - Date for calculation
     * @returns {Object} Position object with ra, dec, and name
     */
    getSunPosition(date) {
        try {
            if (!TimeUtils.isValidDate(date)) {
                throw new Error('Invalid date provided');
            }

            const d = TimeUtils.getDaysSinceJ2000(date);

            // Mean longitude of Sun
            const L = (280.460 + 0.9856474 * d) % 360;

            // Mean anomaly of Sun
            const g = (357.528 + 0.9856003 * d) % 360;
            const gRad = g * Math.PI / 180;

            // Ecliptic longitude
            const lambda = (L + 1.915 * Math.sin(gRad) + 0.020 * Math.sin(2 * gRad)) % 360;
            const lambdaRad = lambda * Math.PI / 180;

            // Convert to equatorial coordinates
            const epsilon = 23.439 * Math.PI / 180; // obliquity of ecliptic

            const ra = Math.atan2(Math.cos(epsilon) * Math.sin(lambdaRad), Math.cos(lambdaRad));
            const dec = Math.asin(Math.sin(epsilon) * Math.sin(lambdaRad));

            return {
                ra: ((ra * 180 / Math.PI) + 360) % 360 / 15, // convert to hours
                dec: dec * 180 / Math.PI,
                name: 'Sun'
            };
        } catch (error) {
            console.error('Error calculating Sun position:', error);
            return { ra: 0, dec: 0, name: 'Sun' };
        }
    }

    /**
     * Calculate Moon's position (simplified)
     * @param {Date} date - Date for calculation
     * @returns {Object} Position object with ra, dec, and name
     */
    getMoonPosition(date) {
        try {
            if (!TimeUtils.isValidDate(date)) {
                throw new Error('Invalid date provided');
            }

            const d = TimeUtils.getDaysSinceJ2000(date);

            // Lunar mean longitude
            const L = (218.316 + 13.176396 * d) % 360;

            // Mean anomaly of Moon
            const M = (134.963 + 13.064993 * d) % 360;
            const MRad = M * Math.PI / 180;

            // Mean anomaly of Sun
            const Msun = (357.528 + 0.9856003 * d) % 360;
            const MsunRad = Msun * Math.PI / 180;

            // Moon's argument of latitude
            const F = (93.272 + 13.229350 * d) % 360;
            const FRad = F * Math.PI / 180;

            // Longitude correction
            const deltaL = 6.289 * Math.sin(MRad) - 2.056 * Math.sin(MRad - 2 * FRad) +
                          1.273 * Math.sin(2 * FRad - MRad) - 0.186 * Math.sin(MsunRad);

            // Latitude correction
            const deltaB = 5.128 * Math.sin(FRad) + 0.281 * Math.sin(MRad + FRad);

            const lambda = (L + deltaL) % 360;
            const beta = deltaB;

            const lambdaRad = lambda * Math.PI / 180;
            const betaRad = beta * Math.PI / 180;

            // Convert to equatorial coordinates
            const epsilon = 23.439 * Math.PI / 180;

            const ra = Math.atan2(
                Math.cos(betaRad) * Math.sin(lambdaRad) * Math.cos(epsilon) -
                Math.sin(betaRad) * Math.sin(epsilon),
                Math.cos(betaRad) * Math.cos(lambdaRad)
            );

            const dec = Math.asin(
                Math.sin(betaRad) * Math.cos(epsilon) +
                Math.cos(betaRad) * Math.sin(lambdaRad) * Math.sin(epsilon)
            );

            return {
                ra: ((ra * 180 / Math.PI) + 360) % 360 / 15,
                dec: dec * 180 / Math.PI,
                name: 'Moon'
            };
        } catch (error) {
            console.error('Error calculating Moon position:', error);
            return { ra: 0, dec: 0, name: 'Moon' };
        }
    }

    /**
     * Calculate planet position (simplified)
     * @param {string} planetName - Name of the planet
     * @param {Date} date - Date for calculation
     * @returns {Object|null} Position object with ra, dec, and name, or null if error
     */
    getPlanetPosition(planetName, date) {
        try {
            if (!TimeUtils.isValidDate(date)) {
                throw new Error('Invalid date provided');
            }

            const planet = this.planets[planetName];
            if (!planet || !planet.period) {
                console.warn(`Planet ${planetName} not found or has no orbital data`);
                return null;
            }

            const d = TimeUtils.getDaysSinceJ2000(date);

            // Mean anomaly
            const M = (planet.meanAnomalyEpoch + 360 * d / planet.period) % 360;
            const MRad = M * Math.PI / 180;

            // True anomaly (simplified)
            const nu = M + planet.eccentricity * Math.sin(MRad) * 180 / Math.PI;
            const nuRad = nu * Math.PI / 180;

            // Distance from Sun
            const r = planet.semiMajorAxis * (1 - planet.eccentricity * planet.eccentricity) /
                     (1 + planet.eccentricity * Math.cos(nuRad));

            // Heliocentric longitude
            const lon = (planet.argumentPeriapsis + nu) % 360;
            const lonRad = lon * Math.PI / 180;

            // Convert to geocentric coordinates (simplified)
            const x = r * Math.cos(lonRad);
            const y = r * Math.sin(lonRad) * Math.cos(planet.inclination * Math.PI / 180);
            const z = r * Math.sin(lonRad) * Math.sin(planet.inclination * Math.PI / 180);

            // Earth's position (simplified)
            const earthL = (280.460 + 0.9856474 * d) % 360;
            const earthLRad = earthL * Math.PI / 180;
            const earthX = Math.cos(earthLRad);
            const earthY = Math.sin(earthLRad);

            // Geocentric coordinates
            const deltaX = x - earthX;
            const deltaY = y - earthY;
            const deltaZ = z;

            // Convert to RA/Dec
            const ra = Math.atan2(deltaY, deltaX);
            const dec = Math.atan2(deltaZ, Math.sqrt(deltaX * deltaX + deltaY * deltaY));

            return {
                ra: ((ra * 180 / Math.PI) + 360) % 360 / 15,
                dec: dec * 180 / Math.PI,
                name: planetName
            };
        } catch (error) {
            console.error(`Error calculating position for ${planetName}:`, error);
            return null;
        }
    }

    /**
     * Get all visible solar system objects for a given date
     * @param {Date} date - Date for calculation
     * @returns {Array} Array of solar system objects
     */
    getAllObjects(date) {
        try {
            if (!TimeUtils.isValidDate(date)) {
                throw new Error('Invalid date provided');
            }

            const objects = [];

            // Add Sun
            objects.push({
                ...this.getSunPosition(date),
                ...this.planets.Sun,
                type: 'sun'
            });

            // Add Moon
            objects.push({
                ...this.getMoonPosition(date),
                ...this.planets.Moon,
                type: 'moon'
            });

            // Add planets
            for (const planetName of ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']) {
                const pos = this.getPlanetPosition(planetName, date);
                if (pos) {
                    objects.push({
                        ...pos,
                        ...this.planets[planetName],
                        type: 'planet'
                    });
                }
            }

            return objects;
        } catch (error) {
            console.error('Error getting all solar system objects:', error);
            return [];
        }
    }
}
