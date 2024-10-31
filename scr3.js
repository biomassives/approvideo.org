// Enhanced Video App Module
if (typeof VideoApp === 'undefined') {
    const VideoApp = (function() {
        // Enhanced state combining both implementations
        const state = {
            store: null,
            currentProjects: [],
            currentFilter: 'all',
            searchQuery: '',
            currentSort: 'dateDesc', // Changed to match the select options
            lastVideoLoad: 0,
            favorites: new Set(),
            loadingStates: new Map(),
            initialized: false,
            userReviews: {}, // Added from VideoManager
            userRecommendations: new Set() // Added from VideoManager
        };

        // Initialize store (keeping original implementation)
        async function initializeStore() {
            if (!state.store) {
                state.store = localforage.createInstance({
                    name: 'approVideo',
                    storeName: 'projects'
                });
            }
        }

        // Enhanced video data loading
        async function loadVideoData() {
            try {
                if (typeof videoData !== 'undefined') {
                    console.log('Loading from videoData variable');
                    return videoData;
                }
                
                console.log('Loading from file');
                const response = await fetch('./videoData2b.js');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const text = await response.text();
                const cleanedText = text.replace(/^(?:var|const|let)\s+\w+\s*=\s*/, '').replace(/;$/, '');
                return JSON.parse(cleanedText);
            } catch (error) {
                console.error('Error loading video data:', error);
                showError('Failed to load video data');
                return [];
            }
        }

        // Enhanced initialize data function
        async function initializeData() {
            try {
                const videoData = await loadVideoData();
                console.log('Loaded video data:', videoData);
                
                const existingData = await state.store.getItem('projects');
                if (!existingData && videoData) {
                    await state.store.setItem('projects', videoData);
                }
                
                populateCategories(videoData); // Added category population
                await loadFeed();
                setupEventListeners();
            } catch (error) {
                console.error('Error initializing data:', error);
                showError('Failed to initialize data');
            }
        }

        // Added category population from VideoManager
        function populateCategories(videos) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (!categoryFilter || !videos.length) return;

            const categories = new Set();
            videos.forEach(video => {
                if (video.category) categories.add(video.category);
            });

            categoryFilter.innerHTML = '<option value="all">All Categories</option>';
            [...categories].sort().forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        }

        // Enhanced event listeners
        function setupEventListeners() {
            const searchInput = document.getElementById('searchInput');
            const sortSelect = document.getElementById('sortSelect');
            const categoryFilter = document.getElementById('categoryFilter');

            if (searchInput) {
                searchInput.addEventListener('input', debounce((e) => {
                    state.searchQuery = e.target.value;
                    loadFeed();
                }, 300));
            }

            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    state.currentSort = e.target.value;
                    loadFeed();
                });
            }

            if (categoryFilter) {
                categoryFilter.addEventListener('change', (e) => {
                    state.currentFilter = e.target.value;
                    loadFeed();
                });
            }
        }

        // Enhanced project rendering
        function renderProjects(projects) {
            const projectsList = document.getElementById('videoGrid'); // Changed to match HTML
            if (!projectsList) return;
            
            projectsList.innerHTML = projects.map(project => `
                <div class="project-card bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                        <img src="${project.thumbnail}" 
                            alt="${project.title}" 
                            class="w-full h-48 object-cover"
                            onerror="this.src='/placeholder-image.jpg'"
                        >
                    </div>
                    <div class="p-4">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-semibold text-gray-900">${project.title}</h3>
                            <button onclick="VideoApp.toggleFavorite('${project.id}')" 
                                class="text-yellow-500 hover:text-yellow-600">
                                ${state.favorites.has(project.id) ? '★' : '☆'}
                            </button>
                        </div>
                        <p class="text-gray-600 mb-4">${project.description.substring(0, 100)}...</p>
                        <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
                            <span>Rating: ${project.rating}/5</span>
                            <span>Category: ${project.category}</span>
                        </div>
                        <button onclick="VideoApp.showProjectDetails(${JSON.stringify(project)})" 
                            class="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            View Details
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Added debounce utility
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Enhanced error display
        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed top-16 right-4 max-w-sm z-50 p-4 rounded-lg shadow-lg bg-red-100 text-red-800';
            errorDiv.textContent = message;
            document.body.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        }

        // Added favorite toggle functionality
        function toggleFavorite(projectId) {
            if (state.favorites.has(projectId)) {
                state.favorites.delete(projectId);
            } else {
                state.favorites.add(projectId);
            }
            localStorage.setItem('approVideo_favorites', JSON.stringify([...state.favorites]));
            loadFeed(); // Refresh display
        }

        // Keep existing functions unchanged
        // initialize, loadFeed, showLoading, showProjectDetails, playVideo, 
        // closeProjectModal, handleLogin, handleLogout, showLogin, showDashboard

        // Return enhanced public API
        return {
            initialize,
            handleLogin,
            handleLogout,
            showProjectDetails,
            playVideo,
            closeProjectModal,
            toggleFavorite,
            isLoggedIn: () => !!localStorage.getItem('approVideoToken'),
            getState: () => ({...state}) // Added for debugging
        };
    })();

    window.VideoApp = VideoApp;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (window.VideoApp) {
        VideoApp.initialize().catch(error => {
            console.error('Failed to initialize app:', error);
        });
    }
});