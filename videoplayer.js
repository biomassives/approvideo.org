document.addEventListener('DOMContentLoaded', () => {
    const videoPlayerBtn = document.getElementById('video-player-btn');
    if (!videoPlayerBtn) {
        console.error('Video player button not found');
        return;
    }

    const videoPlayerPopup = document.createElement('div');
    videoPlayerPopup.id = 'video-player-popup';
    document.body.appendChild(videoPlayerPopup);
    let currentVideoIndex = 0;
    let player;

    function createVideoPlayerPopup() {
        videoPlayerPopup.innerHTML = `
            <div class="video-player-content">
                <button id="close-video-player">&times;</button>
                <div id="video-container"></div>
                <div class="video-controls">
                    <button id="prev-video">Previous</button>
                    <button id="next-video">Next</button>
                </div>
                <div id="video-title"></div>
            </div>
        `;
        
        document.getElementById('close-video-player').addEventListener('click', closeVideoPlayerPopup);
        document.getElementById('prev-video').addEventListener('click', playPreviousVideo);
        document.getElementById('next-video').addEventListener('click', playNextVideo);
        
        videoPlayerPopup.style.display = 'none';
    }

    function openVideoPlayerPopup() {
        videoPlayerPopup.style.display = 'block';
        playVideo(currentVideoIndex);
    }

    function closeVideoPlayerPopup() {
        videoPlayerPopup.style.display = 'none';
        if (player && typeof player.destroy === 'function') {
            player.destroy();
        }
    }

    function playVideo(index) {
        const video = window.videoData[index];
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = ''; // Clear previous video

        if (player && typeof player.destroy === 'function') {
            player.destroy();
        }

        player = new YT.Player('video-container', {
            height: '315',
            width: '560',
            videoId: video.youtubeId,
            events: {
                'onReady': onPlayerReady
            }
        });

        document.getElementById('video-title').textContent = video.title;
        currentVideoIndex = index;
        updateNavigationButtons();
    }

    function onPlayerReady(event) {
        event.target.playVideo();
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

    videoPlayerBtn.addEventListener('click', () => {
        if (videoPlayerPopup.style.display === 'none') {
            openVideoPlayerPopup();
        } else {
            closeVideoPlayerPopup();
        }
    });

    // Load YouTube API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Call this function to set up the popup
    createVideoPlayerPopup();

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #video-player-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 1000;
        }
        #close-video-player {
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
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
    `;
    document.head.appendChild(style);
});
