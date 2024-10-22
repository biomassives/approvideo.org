// Assuming we have included the new script file in the HTML:
// <script src="catMotion.js"></script>

const chartContainer = document.getElementById('chart-container');
const switchButton = document.getElementById('switch-mode');
const speedControl = document.getElementById('speed-control');

let mode = 'simple'; // Start with simple mode

// Define the positions for the icons along the paths
const paths = [
    { startX: 50, startY: 100, endX: 150, endY: 50 },
    { startX: 150, startY: 50, endX: 250, endY: 100 },
    { startX: 250, startY: 100, endX: 350, endY: 200 },
    { startX: 350, startY: 200, endX: 250, endY: 300 },
    { startX: 250, startY: 300, endX: 150, endY: 350 },
    { startX: 150, startY: 350, endX: 50, endY: 250 },
];

// Simple and advanced icons
const simpleIcons = ['🐢', '🐍', '🦢'];
const advancedIcons = ['🦁', '🦅', '🐉', '🐺', '🐬'];

// Function to create and animate icons along paths
function createIcons() {
    chartContainer.innerHTML = ''; // Clear current icons
    const iconSet = mode === 'simple' ? simpleIcons : advancedIcons;

    paths.forEach((path, index) => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('icon');
        iconElement.style.left = `${path.startX}px`;
        iconElement.style.top = `${path.startY}px`;
        iconElement.textContent = iconSet[index % iconSet.length]; // Cycle through icons

        chartContainer.appendChild(iconElement);

        // Animate icons along the path
        setTimeout(() => {
            iconElement.style.transform = `translate(${path.endX - path.startX}px, ${path.endY - path.startY}px)`;

            // After the initial animation, apply playful cat-like motion
            applyCatMotion(iconElement); // Call the cat motion function from catMotion.js
        }, 500 * index); // Delay each animation
    });
}

// Switch between simple and advanced modes
switchButton.addEventListener('click', () => {
    mode = mode === 'simple' ? 'advanced' : 'simple';
    switchButton.textContent = mode === 'simple' ? 'Switch to Advanced Mode' : 'Switch to Simple Mode';
    createIcons(); // Refresh icons to match new mode
});

// Adjust the animation speed
speedControl.addEventListener('input', (e) => {
    const speedMultiplier = e.target.value;
    updateAnimationSpeed(speedMultiplier);
});

// Function to update animation speed dynamically
function updateAnimationSpeed(speedMultiplier) {
    const icons = document.querySelectorAll('.icon');
    icons.forEach((icon) => {
        icon.style.transition = `transform ${1 / speedMultiplier}s ease`;
    });
}

// Initial setup
createIcons();