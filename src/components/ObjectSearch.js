// Object search functionality
import { CONSTELLATION_DATA, BRIGHT_STARS, DEEP_SKY_OBJECTS } from '../data/ConstellationData.js';

export class ObjectSearch {
    constructor(starMap) {
        this.starMap = starMap;
        this.searchIndex = this.buildSearchIndex();
        this.searchResults = [];
        this.currentQuery = '';
    }

    /**
     * Build search index from all available objects
     * @returns {Array} Search index
     */
    buildSearchIndex() {
        const index = [];
        
        // Index constellation stars
        for (const [constellationName, constellation] of Object.entries(CONSTELLATION_DATA)) {
            for (const star of constellation.stars) {
                index.push({
                    name: star.name,
                    type: 'star',
                    constellation: constellationName,
                    ra: star.ra,
                    dec: star.dec,
                    magnitude: star.mag,
                    id: star.id
                });
            }
        }
        
        // Index bright stars
        for (const star of BRIGHT_STARS) {
            index.push({
                name: star.name,
                type: 'star',
                constellation: star.constellation,
                ra: star.ra,
                dec: star.dec,
                magnitude: star.mag
            });
        }
        
        // Index deep sky objects
        for (const obj of DEEP_SKY_OBJECTS) {
            index.push({
                name: obj.name,
                type: obj.type,
                ra: obj.ra,
                dec: obj.dec,
                magnitude: obj.mag,
                size: obj.size
            });
        }
        
        return index;
    }

    /**
     * Search for objects matching query
     * @param {string} query - Search query
     * @returns {Array} Array of matching objects
     */
    search(query) {
        if (!query || query.trim().length < 2) {
            this.searchResults = [];
            this.currentQuery = '';
            return [];
        }

        const lowerQuery = query.toLowerCase().trim();
        this.currentQuery = lowerQuery;
        
        this.searchResults = this.searchIndex.filter(item => {
            const nameMatch = item.name.toLowerCase().includes(lowerQuery);
            const constellationMatch = item.constellation?.toLowerCase().includes(lowerQuery);
            const typeMatch = item.type.toLowerCase().includes(lowerQuery);
            
            return nameMatch || constellationMatch || typeMatch;
        }).sort((a, b) => {
            // Sort by relevance: exact name matches first, then magnitude
            const aExact = a.name.toLowerCase() === lowerQuery;
            const bExact = b.name.toLowerCase() === lowerQuery;
            
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            
            return a.magnitude - b.magnitude;
        });

        return this.searchResults;
    }

    /**
     * Get search results
     * @returns {Array} Current search results
     */
    getResults() {
        return this.searchResults;
    }

    /**
     * Clear search results
     */
    clearResults() {
        this.searchResults = [];
        this.currentQuery = '';
    }

    /**
     * Find object by exact name
     * @param {string} name - Object name
     * @returns {Object|null} Found object or null
     */
    findByName(name) {
        return this.searchIndex.find(item => 
            item.name.toLowerCase() === name.toLowerCase()
        ) || null;
    }

    /**
     * Get objects by constellation
     * @param {string} constellation - Constellation name
     * @returns {Array} Objects in constellation
     */
    getByConstellation(constellation) {
        return this.searchIndex.filter(item => 
            item.constellation?.toLowerCase() === constellation.toLowerCase()
        );
    }

    /**
     * Get objects by type
     * @param {string} type - Object type
     * @returns {Array} Objects of specified type
     */
    getByType(type) {
        return this.searchIndex.filter(item => 
            item.type.toLowerCase() === type.toLowerCase()
        );
    }

    /**
     * Get bright objects (magnitude < 3)
     * @returns {Array} Bright objects
     */
    getBrightObjects() {
        return this.searchIndex.filter(item => item.magnitude < 3);
    }

    /**
     * Get objects visible in current view
     * @param {Object} viewCenter - Current view center {ra, dec}
     * @param {number} zoom - Current zoom level
     * @returns {Array} Objects in current view
     */
    getVisibleObjects(viewCenter, zoom) {
        // This is a simplified implementation
        // In a real implementation, you'd check if objects are within the view bounds
        return this.searchIndex.filter(item => {
            const raDiff = Math.abs(item.ra - viewCenter.ra);
            const decDiff = Math.abs(item.dec - viewCenter.dec);
            
            // Simple visibility check based on zoom level
            const maxDistance = 180 / zoom; // degrees
            
            return raDiff < maxDistance && decDiff < maxDistance;
        });
    }
}
