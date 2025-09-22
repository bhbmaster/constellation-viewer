// Main entry point for the Interactive Star Map
import { StarMap } from './components/StarMap.js';
import { ObjectSearch } from './components/ObjectSearch.js';

class App {
    constructor() {
        this.starMap = null;
        this.search = null;
        this.isLoading = true;
        
        this.init();
    }

    async init() {
        try {
            this.showLoadingIndicator();
            await this.loadData();
            this.initializeStarMap();
            this.setupSearch();
            this.hideLoadingIndicator();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load star map. Please refresh the page.');
        }
    }

    showLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        this.isLoading = false;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 1002;
            font-family: 'Courier New', monospace;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }

    async loadData() {
        // Simulate data loading (in a real app, this might load from external APIs)
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    initializeStarMap() {
        try {
            this.starMap = new StarMap();
            console.log('Star map initialized successfully');
        } catch (error) {
            console.error('Failed to initialize star map:', error);
            throw error;
        }
    }

    setupSearch() {
        this.search = new ObjectSearch(this.starMap);
        this.setupSearchUI();
    }

    setupSearchUI() {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        
        if (!searchInput || !searchResults) return;

        let searchTimeout;
        let selectedIndex = -1;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            searchTimeout = setTimeout(() => {
                const results = this.search.search(query);
                this.displaySearchResults(results, searchResults);
                selectedIndex = -1;
            }, 300);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (searchResults.style.display === 'none') return;

            const resultItems = searchResults.querySelectorAll('.search-result-item');
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, resultItems.length - 1);
                    this.updateSelection(resultItems, selectedIndex);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    this.updateSelection(resultItems, selectedIndex);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && resultItems[selectedIndex]) {
                        this.selectSearchResult(resultItems[selectedIndex]);
                    }
                    break;
                case 'Escape':
                    searchResults.style.display = 'none';
                    searchInput.blur();
                    break;
            }
        });

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-result-item">No objects found</div>';
            container.style.display = 'block';
            return;
        }

        container.innerHTML = results.map((result, index) => {
            const typeIcon = this.getTypeIcon(result.type);
            const magnitude = result.magnitude ? ` (mag ${result.magnitude.toFixed(1)})` : '';
            const constellation = result.constellation ? ` - ${result.constellation}` : '';
            
            return `
                <div class="search-result-item" data-index="${index}" data-object='${JSON.stringify(result)}'>
                    ${typeIcon} ${result.name}${magnitude}${constellation}
                </div>
            `;
        }).join('');

        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => this.selectSearchResult(item));
        });

        container.style.display = 'block';
    }

    updateSelection(items, selectedIndex) {
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    }

    selectSearchResult(item) {
        const objectData = JSON.parse(item.dataset.object);
        this.followObject(objectData);
        
        // Hide search results
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        
        // Clear search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    followObject(objectData) {
        if (this.starMap) {
            this.starMap.followObject(objectData);
        }
    }

    getTypeIcon(type) {
        const icons = {
            'star': '★',
            'sun': '☉',
            'moon': '☽',
            'planet': '●',
            'galaxy': '◯',
            'nebula': '◯',
            'globular': '●',
            'open': '∴',
            'dark': '◯',
            'deepsky': '◯'
        };
        return icons[type] || '★';
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            frameRate: 0,
            renderTime: 0,
            memoryUsage: 0
        };
        
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            this.updateMetrics();
            this.displayMetrics();
        }, 1000);
    }

    updateMetrics() {
        // Get performance metrics from star map if available
        if (window.app && window.app.starMap) {
            const starMapMetrics = window.app.starMap.getPerformanceMetrics();
            this.metrics = { ...this.metrics, ...starMapMetrics };
        }
    }

    displayMetrics() {
        const performanceInfo = document.getElementById('performanceInfo');
        if (performanceInfo && this.metrics.frameRate > 0) {
            performanceInfo.innerHTML = `
                FPS: ${this.metrics.frameRate.toFixed(1)} | 
                Render: ${this.metrics.renderTime.toFixed(1)}ms | 
                Cache: ${this.metrics.cacheSize} | 
                Memory: ${(this.metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
            `;
        }
    }
}

// Initialize the application when the page loads
window.addEventListener('load', () => {
    try {
        window.app = new App();
        window.performanceMonitor = new PerformanceMonitor();
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.9);
                color: white;
                padding: 20px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                text-align: center;
            ">
                <h2>Error Loading Star Map</h2>
                <p>Failed to initialize the application.</p>
                <p>Please refresh the page or check the console for details.</p>
                <button onclick="location.reload()" style="
                    background: #333;
                    color: white;
                    border: 1px solid #666;
                    padding: 10px 20px;
                    border-radius: 3px;
                    cursor: pointer;
                    margin-top: 10px;
                ">Reload Page</button>
            </div>
        `;
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (window.app && window.app.starMap) {
        if (document.hidden) {
            // Page is hidden, reduce performance
            window.app.starMap.stopPlayback();
        } else {
            // Page is visible, resume normal operation
            window.app.starMap.updateDisplay();
        }
    }
});

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.app && window.app.starMap) {
            window.app.starMap.resizeCanvas();
        }
    }, 250);
});

// Export for debugging
window.StarMap = StarMap;
window.ObjectSearch = ObjectSearch;
