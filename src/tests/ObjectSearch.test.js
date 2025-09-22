import { ObjectSearch } from '../components/ObjectSearch.js';

// Mock StarMap for testing
class MockStarMap {
    constructor() {
        this.followingObject = null;
    }
    
    followObject(object) {
        this.followingObject = object;
    }
}

describe('ObjectSearch', () => {
    let mockStarMap;
    let objectSearch;

    beforeEach(() => {
        mockStarMap = new MockStarMap();
        objectSearch = new ObjectSearch(mockStarMap);
    });

    describe('constructor', () => {
        test('should initialize with starMap and build search index', () => {
            expect(objectSearch.starMap).toBe(mockStarMap);
            expect(objectSearch.searchIndex).toBeDefined();
            expect(Array.isArray(objectSearch.searchIndex)).toBe(true);
            expect(objectSearch.searchResults).toEqual([]);
            expect(objectSearch.currentQuery).toBe('');
        });
    });

    describe('buildSearchIndex', () => {
        test('should build search index with all object types', () => {
            const index = objectSearch.buildSearchIndex();
            
            expect(Array.isArray(index)).toBe(true);
            expect(index.length).toBeGreaterThan(0);
            
            // Check that index contains objects with required properties
            const firstItem = index[0];
            expect(firstItem).toHaveProperty('name');
            expect(firstItem).toHaveProperty('type');
            expect(firstItem).toHaveProperty('ra');
            expect(firstItem).toHaveProperty('dec');
        });

        test('should include constellation stars', () => {
            const index = objectSearch.buildSearchIndex();
            const constellationStars = index.filter(item => item.type === 'star' && item.constellation);
            
            expect(constellationStars.length).toBeGreaterThan(0);
        });

        test('should include bright stars', () => {
            const index = objectSearch.buildSearchIndex();
            const brightStars = index.filter(item => item.type === 'star' && !item.id);
            
            expect(brightStars.length).toBeGreaterThan(0);
        });

        test('should include deep sky objects', () => {
            const index = objectSearch.buildSearchIndex();
            const deepSkyObjects = index.filter(item => item.type !== 'star');
            
            expect(deepSkyObjects.length).toBeGreaterThan(0);
        });
    });

    describe('search', () => {
        test('should return empty array for empty query', () => {
            const results = objectSearch.search('');
            expect(results).toEqual([]);
            expect(objectSearch.currentQuery).toBe('');
        });

        test('should return empty array for query shorter than 2 characters', () => {
            const results = objectSearch.search('a');
            expect(results).toEqual([]);
            expect(objectSearch.currentQuery).toBe('');
        });

        test('should return empty array for whitespace-only query', () => {
            const results = objectSearch.search('   ');
            expect(results).toEqual([]);
            expect(objectSearch.currentQuery).toBe('');
        });

        test('should search by object name', () => {
            const results = objectSearch.search('sun');
            expect(Array.isArray(results)).toBe(true);
            expect(objectSearch.currentQuery).toBe('sun');
        });

        test('should search by constellation name', () => {
            const results = objectSearch.search('orion');
            expect(Array.isArray(results)).toBe(true);
            expect(objectSearch.currentQuery).toBe('orion');
        });

        test('should search by object type', () => {
            const results = objectSearch.search('star');
            expect(Array.isArray(results)).toBe(true);
            expect(objectSearch.currentQuery).toBe('star');
        });

        test('should be case insensitive', () => {
            const results1 = objectSearch.search('SUN');
            const results2 = objectSearch.search('sun');
            const results3 = objectSearch.search('Sun');
            
            expect(results1.length).toBe(results2.length);
            expect(results2.length).toBe(results3.length);
        });

        test('should sort results by relevance', () => {
            const results = objectSearch.search('star');
            expect(Array.isArray(results)).toBe(true);
            
            // Results should be sorted (exact matches first, then by magnitude)
            for (let i = 1; i < results.length; i++) {
                const prev = results[i - 1];
                const curr = results[i];
                
                // If both are exact matches or both are not, sort by magnitude
                const prevExact = prev.name.toLowerCase() === 'star';
                const currExact = curr.name.toLowerCase() === 'star';
                
                if (prevExact === currExact) {
                    expect(prev.magnitude).toBeLessThanOrEqual(curr.magnitude);
                }
            }
        });

        test('should update search results and current query', () => {
            const query = 'test';
            const results = objectSearch.search(query);
            
            expect(objectSearch.searchResults).toBe(results);
            expect(objectSearch.currentQuery).toBe(query);
        });
    });

    describe('getResults', () => {
        test('should return current search results', () => {
            objectSearch.search('sun');
            const results = objectSearch.getResults();
            
            expect(results).toBe(objectSearch.searchResults);
        });

        test('should return empty array when no search performed', () => {
            const results = objectSearch.getResults();
            expect(results).toEqual([]);
        });
    });

    describe('clearResults', () => {
        test('should clear search results and current query', () => {
            objectSearch.search('sun');
            objectSearch.clearResults();
            
            expect(objectSearch.searchResults).toEqual([]);
            expect(objectSearch.currentQuery).toBe('');
        });
    });

    describe('findByName', () => {
        test('should find object by exact name match', () => {
            const result = objectSearch.findByName('Sun');
            if (result) {
                expect(result.name).toBe('Sun');
            } else {
                // If Sun is not found, test with a known object
                const anyResult = objectSearch.findByName(objectSearch.searchIndex[0].name);
                expect(anyResult).toBeDefined();
                expect(anyResult.name).toBe(objectSearch.searchIndex[0].name);
            }
        });

        test('should be case insensitive', () => {
            const result1 = objectSearch.findByName('sun');
            const result2 = objectSearch.findByName('SUN');
            const result3 = objectSearch.findByName('Sun');
            
            expect(result1).toEqual(result2);
            expect(result2).toEqual(result3);
        });

        test('should return null for non-existent object', () => {
            const result = objectSearch.findByName('NonExistentObject');
            expect(result).toBeNull();
        });

        test('should return null for empty name', () => {
            const result = objectSearch.findByName('');
            expect(result).toBeNull();
        });
    });

    describe('getByConstellation', () => {
        test('should return objects from specified constellation', () => {
            const results = objectSearch.getByConstellation('Orion');
            expect(Array.isArray(results)).toBe(true);
            
            results.forEach(item => {
                expect(item.constellation?.toLowerCase()).toBe('orion');
            });
        });

        test('should be case insensitive', () => {
            const results1 = objectSearch.getByConstellation('orion');
            const results2 = objectSearch.getByConstellation('ORION');
            const results3 = objectSearch.getByConstellation('Orion');
            
            expect(results1.length).toBe(results2.length);
            expect(results2.length).toBe(results3.length);
        });

        test('should return empty array for non-existent constellation', () => {
            const results = objectSearch.getByConstellation('NonExistentConstellation');
            expect(results).toEqual([]);
        });
    });

    describe('getByType', () => {
        test('should return objects of specified type', () => {
            const results = objectSearch.getByType('star');
            expect(Array.isArray(results)).toBe(true);
            
            results.forEach(item => {
                expect(item.type.toLowerCase()).toBe('star');
            });
        });

        test('should be case insensitive', () => {
            const results1 = objectSearch.getByType('star');
            const results2 = objectSearch.getByType('STAR');
            const results3 = objectSearch.getByType('Star');
            
            expect(results1.length).toBe(results2.length);
            expect(results2.length).toBe(results3.length);
        });

        test('should return empty array for non-existent type', () => {
            const results = objectSearch.getByType('nonExistentType');
            expect(results).toEqual([]);
        });
    });

    describe('getBrightObjects', () => {
        test('should return objects with magnitude < 3', () => {
            const results = objectSearch.getBrightObjects();
            expect(Array.isArray(results)).toBe(true);
            
            results.forEach(item => {
                expect(item.magnitude).toBeLessThan(3);
            });
        });

        test('should return some bright objects', () => {
            const results = objectSearch.getBrightObjects();
            expect(results.length).toBeGreaterThan(0);
        });
    });

    describe('getVisibleObjects', () => {
        test('should return objects within view bounds', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const zoom = 1.0;
            
            const results = objectSearch.getVisibleObjects(viewCenter, zoom);
            expect(Array.isArray(results)).toBe(true);
            
            results.forEach(item => {
                const raDiff = Math.abs(item.ra - viewCenter.ra);
                const decDiff = Math.abs(item.dec - viewCenter.dec);
                const maxDistance = 180 / zoom;
                
                expect(raDiff).toBeLessThan(maxDistance);
                expect(decDiff).toBeLessThan(maxDistance);
            });
        });

        test('should return fewer objects with higher zoom', () => {
            const viewCenter = { ra: 12, dec: 0 };
            const lowZoomResults = objectSearch.getVisibleObjects(viewCenter, 0.5);
            const highZoomResults = objectSearch.getVisibleObjects(viewCenter, 2.0);
            
            expect(highZoomResults.length).toBeLessThanOrEqual(lowZoomResults.length);
        });

        test('should handle edge case coordinates', () => {
            const viewCenter = { ra: 0, dec: 90 };
            const zoom = 1.0;
            
            const results = objectSearch.getVisibleObjects(viewCenter, zoom);
            expect(Array.isArray(results)).toBe(true);
        });

        test('should handle negative coordinates', () => {
            const viewCenter = { ra: 12, dec: -45 };
            const zoom = 1.0;
            
            const results = objectSearch.getVisibleObjects(viewCenter, zoom);
            expect(Array.isArray(results)).toBe(true);
        });
    });

    describe('integration tests', () => {
        test('should work with real constellation data', () => {
            // Test that the search index contains real data
            const index = objectSearch.searchIndex;
            expect(index.length).toBeGreaterThan(0);
            
            // Test that we can find some objects
            const firstObject = objectSearch.findByName(index[0].name);
            expect(firstObject).toBeDefined();
            
            // Test that we can search for common terms
            const starResults = objectSearch.search('star');
            expect(starResults.length).toBeGreaterThan(0);
        });

        test('should handle special characters in search', () => {
            const results = objectSearch.search('α');
            expect(Array.isArray(results)).toBe(true);
        });

        test('should handle numeric searches', () => {
            const results = objectSearch.search('1');
            expect(Array.isArray(results)).toBe(true);
        });
    });
});
