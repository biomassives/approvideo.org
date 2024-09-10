document.addEventListener('DOMContentLoaded', () => {
    const videoPlayerBtn = document.getElementById('video-player-btn');
    const videoPlayerPopup = document.createElement('div');
    videoPlayerPopup.id = 'video-player-popup';
    document.body.appendChild(videoPlayerPopup);

    let currentVideoIndex = 0;

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
    }

    function openVideoPlayerPopup() {
        videoPlayerPopup.style.display = 'flex';
        playVideo(currentVideoIndex);
    }

    function closeVideoPlayerPopup() {
        videoPlayerPopup.style.display = 'none';
        document.getElementById('video-container').innerHTML = '';
    }

    function playVideo(index) {
        if (!window.videoData || index >= window.videoData.length) {
            console.error('Invalid video data or index');
            return;
        }

        const video = window.videoData[index];
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = `
            <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media" 
                allowfullscreen>
            </iframe>
        `;

        document.getElementById('video-title').textContent = video.title;
        currentVideoIndex = index;
        updateNavigationButtons();
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

    // Create the popup structure
    createVideoPlayerPopup();

    // Add styles
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
});

