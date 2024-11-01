// Enhanced Video App Module
const VideoApp = (function() {
    // State remains the same...
    const state = {
        store: null,
        currentProjects: [],
        currentFilter: 'all',
        searchQuery: '',
        currentSort: 'dateDesc',
        lastVideoLoad: 0,
        favorites: new Set(),
        loadingStates: new Map(),
        initialized: false,
        userReviews: {},
        userRecommendations: new Set(),
        isLoggedIn: false,
    };

    let localforageReady = false;


        // Check if localforage is available
        function checkDependencies() {
            return new Promise((resolve, reject) => {
                if (typeof localforage !== 'undefined') {
                    localforageReady = true;
                    resolve();
                } else {
                    reject(new Error('Required dependencies not loaded'));
                }
            });
        }
    

// Add these functions at the beginning of your VideoApp module
function showLogin() {
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('mainContent');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    if (loginContainer && mainContent && dashboardContainer) {
        loginContainer.classList.remove('hidden');
        mainContent.classList.add('hidden');
        dashboardContainer.classList.add('hidden');
    }
}

function showMainContent() {
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('mainContent');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    if (loginContainer && mainContent && dashboardContainer) {
        loginContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
    }
}


    
    // Initialize function with event handlers setup
    async function initialize() {
        try {
            
            await checkDependencies();
            await initializeStore();

            // Initialize archived state
            const savedArchived = localStorage.getItem('approVideo_archived');
            if (savedArchived) {
                state.archived = new Set(JSON.parse(savedArchived));
            } else {
                state.archived = new Set();
            }

            // Initialize tags
            if (!state.tags) {
                state.tags = new Map();
                const savedTags = localStorage.getItem('approVideo_tags');
                if (savedTags) {
                    const parsedTags = JSON.parse(savedTags);
                    state.tags = new Map(parsedTags);
                }
            }
    
            await initializeData();
            loadSavedFavorites();
            setupUIHandlers();  
            updateLoginUI(); 
            setupGlobalEventHandlers(); 
            state.initialized = true;
            // Check login status on initialization
            checkLoginStatus();
                        // Then proceed with initialization
                        if (!state.initialized) {
                            await initializeStore();
                            await initializeData();
                            loadSavedFavorites();
                            setupUIHandlers();
                            updateLoginUI();
                            state.initialized = true;
                            console.log('Application initialized successfully');
                        }
                        return true;
        } catch (error) {
            console.error('Initialization error:', error);
            showError('Failed to initialize application');
            return false;
        }
    }

    // Add function to setup global event handlers
    function setupGlobalEventHandlers() {
        // Setup login button handler
        const loginBtn = document.querySelector('[data-action="login"]');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => showLogin());
        }

        // Setup logout button handler
        const logoutBtn = document.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => handleLogout());
        }

        // Setup main content click handler if needed
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.addEventListener('click', (e) => {
                if (e.target.matches('[data-action="showDashboard"]')) {
                    e.preventDefault();
                    showDashboard();
                }
            });
        }
    }


    function setupUIHandlers() {
        // Setup logo click handler
        const logo = document.querySelector('.text-blue-600');
        if (logo) {
            logo.onclick = showMainContent;
        }
    
        // Update button visibility based on login state
        updateLoginUI();
    }
    
    function updateLoginUI() {
        const isLoggedIn = !!localStorage.getItem('approVideoToken');
        const loginBtn = document.querySelector('[data-action="login"]');
        const logoutBtn = document.querySelector('[data-action="logout"]');
        const userStatus = document.getElementById('userStatusDisplay');
    
        if (loginBtn) loginBtn.classList.toggle('hidden', isLoggedIn);
        if (logoutBtn) logoutBtn.classList.toggle('hidden', !isLoggedIn);
        if (userStatus) {
            userStatus.textContent = isLoggedIn ? 'Logged In' : 'Guest';
        }
    }




    // Check login status
    function checkLoginStatus() {
        const token = localStorage.getItem('approVideoToken');
        state.isLoggedIn = !!token;
        updateUIForLoginStatus();
    }

    // Update UI based on login status
    function updateUIForLoginStatus() {
        const userStatusDisplay = document.getElementById('userStatusDisplay');
        if (userStatusDisplay) {
            userStatusDisplay.textContent = state.isLoggedIn ? 'Logged In' : 'Guest';
        }

        // Update visibility of login/logout buttons
        document.querySelectorAll('[data-action="login"]').forEach(el => {
            el.style.display = state.isLoggedIn ? 'none' : 'block';
        });
        document.querySelectorAll('[data-action="logout"]').forEach(el => {
            el.style.display = state.isLoggedIn ? 'block' : 'none';
        });
    }

    // Show login form
    function showLogin() {
        const loginContainer = document.getElementById('loginContainer');
        const mainContent = document.getElementById('mainContent');
        const dashboardContainer = document.getElementById('dashboardContainer');
        
        if (loginContainer && mainContent && dashboardContainer) {
            loginContainer.classList.remove('hidden');
            mainContent.classList.add('hidden');
            dashboardContainer.classList.add('hidden');
        }
    }

    // Modified dashboard toggle
    function toggleDashboard(show) {
        const dashboard = document.getElementById('dashboardContainer');
        const main = document.getElementById('mainContent');
        const loginContainer = document.getElementById('loginContainer');
        
        if (dashboard && main && loginContainer) {
            dashboard.classList.toggle('hidden', !show);
            main.classList.toggle('hidden', show);
            loginContainer.classList.add('hidden'); // Always hide login when toggling dashboard
        }
    }

    // Modified handleLogin
    async function handleLogin(credentials) {
        try {
            // Add your authentication logic here
            localStorage.setItem('approVideoToken', 'dummy-token');
            state.isLoggedIn = true;
            updateUIForLoginStatus();
            showDashboard();
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed');
        }
    }

    // Modified handleLogout
    function handleLogout() {
        localStorage.removeItem('approVideoToken');
        state.isLoggedIn = false;
        updateUIForLoginStatus();
        toggleDashboard(false);
    }


    async function initializeStore() {
        if (!localforageReady) {
            throw new Error('LocalForage not ready');
        }
        
        if (!state.store) {
            state.store = localforage.createInstance({
                name: 'approVideo',
                storeName: 'projects'
            });
            console.log('Store initialized');
        }
    }


    // Load saved favorites
    function loadSavedFavorites() {
        const savedFavorites = localStorage.getItem('approVideo_favorites');
        if (savedFavorites) {
            state.favorites = new Set(JSON.parse(savedFavorites));
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
            
            populateCategories(videoData);
            await loadFeed();
            setupEventListeners();
        } catch (error) {
            console.error('Error initializing data:', error);
            showError('Failed to initialize data');
        }
    }


async function loadFeed() {
    showLoading();
    try {
        // Get projects from store
        let projects = await state.store.getItem('projects');
        
        // Ensure projects is an array and filter out any undefined/null values
        projects = Array.isArray(projects) ? projects.filter(p => p != null) : [];
        
        console.log('Loaded projects:', projects.length); // Debug log

        if (projects.length === 0) {
            hideLoading(LoadingStates.EMPTY, 'No videos found');
            return;
        }

        const now = Date.now();
        if (projects.length === 0 || (now - state.lastVideoLoad) > 60000) {
            try {
                const newData = await loadVideoData();
                if (Array.isArray(newData) && newData.length > 0) {
                    projects = newData;
                    await state.store.setItem('projects', newData);
                    state.lastVideoLoad = now;
                }
            } catch (error) {
                console.error('Error loading new video data:', error);
            }
        }

        let filteredProjects = [...projects];
    
        // Apply filters
        if (state.currentFilter !== 'all') {
            filteredProjects = filteredProjects.filter(p => p && p.category === state.currentFilter);
        }

        if (state.searchQuery) {
            const query = state.searchQuery.toLowerCase();
            filteredProjects = filteredProjects.filter(p => 
                p && (
                    (p.title && p.title.toLowerCase().includes(query)) || 
                    (p.description && p.description.toLowerCase().includes(query))
                )
            );
        }

        // Apply sorting
        filteredProjects.sort((a, b) => {
            if (!a || !b) return 0;
            
            switch (state.currentSort) {
                case 'dateAsc': return new Date(a.date || 0) - new Date(b.date || 0);
                case 'dateDesc': return new Date(b.date || 0) - new Date(a.date || 0);
                case 'ratingHigh': return (b.rating || 0) - (a.rating || 0);
                case 'ratingLow': return (a.rating || 0) - (b.rating || 0);
                case 'titleAZ': return (a.title || '').localeCompare(b.title || '');
                case 'titleZA': return (b.title || '').localeCompare(a.title || '');
                default: return 0;
            }
        });

        // Filter out archived projects if the feature is enabled
        if (state.archived) {
            filteredProjects = filteredProjects.filter(p => p && !state.archived.has(p.id));
        }

        if (filteredProjects.length === 0) {
            hideLoading(LoadingStates.EMPTY, 'No videos match your filters');
            return;
        }


        state.currentProjects = filteredProjects;
        console.log('Projects to render:', filteredProjects.length);
        renderProjects(filteredProjects);
        hideLoading(LoadingStates.SUCCESS);
    } catch (error) {
        console.error('Error loading feed:', error);
	hideLoading(LoadingStates.ERROR, 'Failed to load videos');
        showError('Failed to load videos');
    } finally {
        hideLoading();
    }
}



// Helper for managing loading states
const LoadingStates = {
    LOADING: 'loading',
    ERROR: 'error',
    SUCCESS: 'success',
    EMPTY: 'empty'
};

function showLoading() {
    const gridContainer = document.getElementById('videoGrid');
    if (gridContainer) {
        // Save current content in case we need to revert
        state.lastContent = gridContainer.innerHTML;
        
        gridContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p class="text-gray-600">Loading videos...</p>
            </div>
        `;
        
        // Update loading state
        state.loadingState = LoadingStates.LOADING;
    }
}

function hideLoading(status = LoadingStates.SUCCESS, message = '') {
    const gridContainer = document.getElementById('videoGrid');
    if (!gridContainer) return;

    // Clear loading spinner
    if (state.loadingState === LoadingStates.LOADING) {
        switch (status) {
            case LoadingStates.ERROR:
                gridContainer.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <div class="bg-red-50 rounded-lg p-4 max-w-md mx-auto">
                            <svg class="h-6 w-6 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-red-800">${message || 'Error loading videos'}</p>
                            <button onclick="VideoApp.retryLoad()" 
                                class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                                Retry
                            </button>
                        </div>
                    </div>
                `;
                break;

            case LoadingStates.EMPTY:
                gridContainer.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <div class="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                            <svg class="h-6 w-6 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p class="text-gray-600">${message || 'No videos available'}</p>
                        </div>
                    </div>
                `;
                break;

            case LoadingStates.SUCCESS:
                // Don't do anything here as renderProjects will handle the content
                break;
        }
    }

    // Update loading state
    state.loadingState = status;
}

// Add retry functionality
function retryLoad() {
    if (state.loadingState === LoadingStates.ERROR) {
        loadFeed();
    }
}



    // UI Event Handlers
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

    // Category Management
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





// Replace the existing renderProjects function with this version
function renderProjects(projects) {
    const projectsList = document.getElementById('videoGrid');
    if (!projectsList) return;

    // Ensure we have valid data
    if (!Array.isArray(projects) || projects.length === 0) {
        projectsList.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No videos available</div>';
        return;
    }

    try {
        projectsList.innerHTML = projects.map(project => {
            if (!project) return '';  // Skip invalid projects
            
            // Safely get project properties with defaults
            const title = project.title || 'Untitled';
            const description = project.description || 'No description available';
            const thumbnail = project.thumbnail || '/placeholder-image.jpg';
            const rating = project.rating || 0;
            const category = project.category || 'Uncategorized';
            const id = project.id || '';
            const tags = Array.from(state.tags?.get(id) || []);

            return `
                <div class="project-card bg-white rounded-lg shadow-md overflow-hidden">
                    <div class="aspect-w-16 aspect-h-9 bg-gray-100">
                        <img src="${thumbnail}" 
                            alt="${title}" 
                            class="w-full h-48 object-cover"
                            onerror="this.src='/placeholder-image.jpg'"
                        >
                    </div>
                    <div class="p-4">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-semibold text-gray-900">${title}</h3>
                            <button onclick="VideoApp.toggleFavorite('${id}')" 
                                class="text-yellow-500 hover:text-yellow-600">
                                ${state.favorites.has(id) ? '★' : '☆'}
                            </button>
                        </div>
                        <p class="text-gray-600 mb-4">${description.substring(0, 100)}...</p>
                        <div class="mb-2 flex flex-wrap gap-1">
                            ${tags.map(tag => `
                                <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                        <div class="mt-2 flex items-center justify-between text-sm text-gray-500">
                            <span>Rating: ${rating}/5</span>
                            <span>Category: ${category}</span>
                        </div>
                        <div class="mt-3 grid grid-cols-3 gap-2">
                            <button onclick="VideoApp.editVideo('${id}')"
                                class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
                                Edit
                            </button>
                            <button onclick="VideoApp.manageTags('${id}')"
                                class="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm">
                                Tags
                            </button>
                            <button onclick="VideoApp.archiveVideo('${id}')"
                                class="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 text-sm">
                                Archive
                            </button>
                        </div>
                        <button onclick="VideoApp.showProjectDetails(${JSON.stringify(project)})" 
                            class="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error rendering projects:', error);
        projectsList.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">Error displaying videos</div>';
    }
}







    // Modal Management
    function showProjectDetails(project) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-bold">${project.title}</h2>
                        <button onclick="VideoApp.closeProjectModal()" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <img src="${project.thumbnail}" 
                         alt="${project.title}" 
                         class="w-full h-64 object-cover rounded-lg mb-4"
                         onerror="this.src='/placeholder-image.jpg'"
                    >
                    <p class="text-gray-600 mb-4">${project.description}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500">
                        <span>Rating: ${project.rating}/5</span>
                        <span>Category: ${project.category}</span>
                    </div>
                    <button onclick="VideoApp.playVideo('${project.videoUrl}')" 
                            class="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Play Video
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function closeProjectModal() {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) modal.remove();
    }

    // Video Playback
    function playVideo(videoUrl) {
        console.log('Playing video:', videoUrl);
        alert('Video playback will be implemented here');
    }

    // Dashboard Management
    function toggleDashboard(show) {
        const dashboard = document.getElementById('dashboardContainer');
        const main = document.getElementById('mainContent');
        if (dashboard && main) {
            dashboard.classList.toggle('hidden', !show);
            main.classList.toggle('hidden', show);
        }
    }

    function showDashboard() {
        toggleDashboard(true);
        loadFeed();
    }

    // Authentication
    async function handleLogin(credentials) {
        try {
            localStorage.setItem('approVideoToken', 'dummy-token');
            showDashboard();
        } catch (error) {
            console.error('Login error:', error);
            showError('Login failed');
        }
    }

    function handleLogout() {
        localStorage.removeItem('approVideoToken');
        toggleDashboard(false);
    }

    // Utilities
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

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-16 right-4 max-w-sm z-50 p-4 rounded-lg shadow-lg bg-red-100 text-red-800';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    // Favorites Management
    function toggleFavorite(projectId) {
        if (state.favorites.has(projectId)) {
            state.favorites.delete(projectId);
        } else {
            state.favorites.add(projectId);
        }
        localStorage.setItem('approVideo_favorites', JSON.stringify([...state.favorites]));
        loadFeed();
    }

    // Public API
    
    // Video editing functionality
    function editVideo(id) {
        console.log('Editing video:', id);
        // Add your edit video logic here
    }

    // Tag management functionality
    function manageTags(id) {
        console.log('Managing tags for:', id);
        // Add your tag management logic here
    }

    // Archive functionality
    function archiveVideo(id) {
        if (!state.archived) state.archived = new Set();
        state.archived.add(id);
        loadFeed(); // Refresh the display
        localStorage.setItem('approVideo_archived', JSON.stringify([...state.archived]));
    }
    
    return {
        initialize,
        handleLogin,
        handleLogout,
        toggleDashboard,
        showDashboard,
        showLogin,
        showMainContent,
        showProjectDetails,
        closeProjectModal,
        playVideo,
        toggleFavorite,
        retryLoad,
        editVideo,         // Add this
        manageTags,        // Add this
        archiveVideo,      // Add this
        isLoggedIn: () => !!localStorage.getItem('approVideoToken'),
        getState: () => ({...state})
    };
})();

// Modified initialization on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all scripts are loaded
    setTimeout(() => {
        VideoApp.initialize().catch(error => {
            console.error('Failed to initialize app:', error);
            // Show a user-friendly error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed top-16 right-4 max-w-sm z-50 p-4 rounded-lg shadow-lg bg-red-100 text-red-800';
            errorDiv.textContent = 'Failed to initialize application. Please refresh the page.';
            document.body.appendChild(errorDiv);
        });
    }, 100);
});

// Export to window object
window.VideoApp = VideoApp;
