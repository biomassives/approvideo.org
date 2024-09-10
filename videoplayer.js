let player;
let videoPlayerPopup;
let currentVideoIndex = 0;

function initializeVideoPlayer() {
    const videoPlayerBtn = document.getElementById('video-player-btn');
    if (!videoPlayerBtn) {
        console.error('Video player button not found');
        return;
    }

    videoPlayerPopup = document.createElement('div');
    videoPlayerPopup.id = 'video-player-popup';
    document.body.appendChild(videoPlayerPopup);

    createVideoPlayerPopup();

    videoPlayerBtn.addEventListener('click', toggleVideoPlayerPopup);
}

function createVideoPlayerPopup() {
    videoPlayerPopup.innerHTML = `
        <div class="video-player-content">
            <button id="close-video-player" aria-label="Close video player">&times;</button>
            <div id="video-container"></div>
            <div class="video-controls">
                <button id="prev-video" aria-label="Previous video">&#8592; Previous</button>
                <button id="next-video" aria-label="Next video">Next &#8594;</button>
            </div>
            <div id="video-title"></div>
        </div>
    `;
    
    document.getElementById('close-video-player').addEventListener('click', closeVideoPlayerPopup);
    document.getElementById('prev-video').addEventListener('click', playPreviousVideo);
    document.getElementById('next-video').addEventListener('click', playNextVideo);
    
    videoPlayerPopup.style.display = 'none';

    addStyles();
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #video-player-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .video-player-content {
            position: relative;
            width: 90%;
            max-width: 800px;
            background: white;
            padding: 20px;
            border-radius: 10px;
        }
        #close-video-player {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        #video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
            overflow: hidden;
        }
        #video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .video-controls {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
        }
        #video-title {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
        }
        @media (max-width: 600px) {
            .video-player-content {
                width: 95%;
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

function toggleVideoPlayerPopup() {
    if (videoPlayerPopup.style.display === 'none') {
        openVideoPlayerPopup();
    } else {
        closeVideoPlayerPopup();
    }
}

function openVideoPlayerPopup() {
    videoPlayerPopup.style.display = 'flex';
    playVideo(currentVideoIndex);
}

function closeVideoPlayerPopup() {
    videoPlayerPopup.style.display = 'none';
    if (player && player.destroy) {
        player.destroy();
    }
}

function playVideo(index) {
    if (!window.videoData || index >= window.videoData.length) {
        console.error('Invalid video data or index');
        return;
    }

    const video = window.videoData[index];
    const videoContainer = document.getElementById('video-container');
    videoContainer.innerHTML = ''; // Clear previous video

    if (player && player.destroy) {
        player.destroy();
    }

    player = new YT.Player('video-container', {
        height: '100%',
        width: '100%',
        videoId: video.youtubeId,
        playerVars: {
            'origin': window.location.origin,
            'enablejsapi': 1,
            'modestbranding': 1,
            'rel': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
        }
    });

    document.getElementById('video-title').textContent = video.title;
    currentVideoIndex = index;
    updateNavigationButtons();
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    document.getElementById('video-container').innerHTML = `
        <p>Sorry, there was an error playing this video. Please try another one.</p>
    `;
}

function playNextVideo() {
    if (currentVideoIndex < window.videoData.length - 1) {
        playVideo(currentVideoIndex + 1);
    }
}

function playPreviousVideo() {
    if (currentVideoIndex > 0) {
        playVideo(currentVideoIndex - 1);
    }
}

function updateNavigationButtons() {
    document.getElementById('prev-video').disabled = currentVideoIndex === 0;
    document.getElementById('next-video').disabled = currentVideoIndex === window.videoData.length - 1;
}

// Load YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// This function will be called by the YouTube API when it's ready
window.onYouTubeIframeAPIReady = initializeVideoPlayer;

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeAPI();
});
