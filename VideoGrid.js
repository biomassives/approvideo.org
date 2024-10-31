// components/VideoGrid.js
export const VideoGrid = {
    thumbnailTypes: {
        YOUTUBE: 'youtube',
        LOCAL: 'local',
        DEFAULT: 'default'
    },

    defaultThumbnail: '/images/placeholder-video.jpg',
    localThumbnailPath: '/images/thumbnails/',
    youtubeQualityOptions: ['maxresdefault', 'hqdefault', 'mqdefault', 'default'],

    async render(videos) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                ${videos.map(video => this.createVideoCard(video)).join('')}
            </div>
        `;
    },

    createVideoCard(video) {
        const thumbnailUrl = this.getThumbnailUrl(video);
        const status = video.syncState || 'synced';
        
        return `
            <div class="video-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                 data-video-id="${video.id}">
                <div class="aspect-w-16 aspect-h-9 relative group">
                    <img 
                        src="${thumbnailUrl}"
                        alt="${this.sanitizeText(video.title)}"
                        class="w-full h-48 object-cover transition-opacity duration-300"
                        onerror="VideoGrid.handleThumbnailError(this, '${video.id}')"
                        loading="lazy"
                    >
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button 
                            class="play-button bg-white bg-opacity-90 rounded-full p-3 transform hover:scale-110 transition-transform duration-300"
                            onclick="VideoGrid.playVideo('${video.youtubeId}')"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                        </button>
                    </div>
                    ${this.getStatusBadge(status)}
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-lg mb-2 line-clamp-2">${this.sanitizeText(video.title)}</h3>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-3">${this.sanitizeText(video.description)}</p>
                    
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${(video.categories || []).map(cat => `
                            <span class="category-badge px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                ${this.sanitizeText(cat)}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span>
                            <svg class="inline-block h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                            </svg>
                            ${video.views || 0} views
                        </span>
                        <span class="flex items-center">
                            ${this.getRatingStars(video.rating)}
                        </span>
                    </div>
                    
                    <div class="mt-4 grid grid-cols-2 gap-2">
                        <button 
                            onclick="VideoGrid.editVideo('${video.id}')"
                            class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                        >
                            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                            Edit
                        </button>
                        <button 
                            onclick="VideoGrid.toggleFavorite('${video.id}')"
                            class="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-300"
                            data-favorite="${video.isFavorite ? 'true' : 'false'}"
                        >
                            ${video.isFavorite ? '★ Favorited' : '☆ Favorite'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    getThumbnailUrl(video) {
        // Try YouTube thumbnail first
        if (video.youtubeId) {
            return this.getYouTubeThumbnail(video.youtubeId);
        }
        
        // Try local thumbnail
        if (video.localThumbnail) {
            return `${this.localThumbnailPath}${video.localThumbnail}`;
        }
        
        // Use default thumbnail
        return this.defaultThumbnail;
    },

    getYouTubeThumbnail(videoId) {
        // Try highest quality first, fallback to lower qualities
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    },

    handleThumbnailError(img, videoId) {
        // Try next quality level or fallback to default
        const currentSrc = img.src;
        const currentQuality = this.getCurrentThumbnailQuality(currentSrc);
        const nextQuality = this.getNextThumbnailQuality(currentQuality);
        
        if (nextQuality) {
            img.src = `https://img.youtube.com/vi/${videoId}/${nextQuality}.jpg`;
        } else {
            img.src = this.defaultThumbnail;
        }
    },

    getCurrentThumbnailQuality(url) {
        return this.youtubeQualityOptions.find(quality => url.includes(quality));
    },

    getNextThumbnailQuality(currentQuality) {
        const currentIndex = this.youtubeQualityOptions.indexOf(currentQuality);
        return this.youtubeQualityOptions[currentIndex + 1];
    },

    getStatusBadge(status) {
        const badges = {
            synced: '',
            pending_sync: `
                <div class="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Pending Sync
                </div>
            `,
            local_only: `
                <div class="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Local Only
                </div>
            `
        };
        return badges[status] || '';
    },

    getRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - Math.ceil(rating);
        
        return `
            ${'★'.repeat(fullStars)}
            ${hasHalfStar ? '½' : ''}
            ${'☆'.repeat(emptyStars)}
        `;
    },

    sanitizeText(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    playVideo(youtubeId) {
        window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
    },

    async editVideo(videoId) {
        if (window.VideoEditor) {
            await VideoEditor.showEditor(videoId);
        }
    },

    async toggleFavorite(videoId) {
        const button = document.querySelector(`button[onclick="VideoGrid.toggleFavorite('${videoId}')"]`);
        const isFavorite = button.dataset.favorite === 'true';
        
        try {
            await VideoApp.toggleFavorite(videoId);
            button.dataset.favorite = (!isFavorite).toString();
            button.innerHTML = !isFavorite ? '★ Favorited' : '☆ Favorite';
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showError('Failed to update favorite status');
        }
    }
};

// Add styles to head
const style = document.createElement('style');
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .video-card {
        transition: transform 0.2s;
    }
    
    .video-card:hover {
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
