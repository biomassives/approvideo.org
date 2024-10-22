const chartContainer = document.getElementById('chart-container');
const switchButton = document.getElementById('switch-mode');

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

        // Animate icons along the path (you can adjust speed and positions as needed)
        setTimeout(() => {
            iconElement.style.transform = `translate(${path.endX - path.startX}px, ${path.endY - path.startY}px)`;
        }, 500 * index); // Delay each animation
    });
}

// Switch between simple and advanced modes
// Switch between simple and advanced modes
switchButton.addEventListener('click', () => {
    // Toggle between simple and advanced modes
    mode = mode === 'simple' ? 'advanced' : 'simple';
    
    // Update button text based on the current mode
    switchButton.textContent = mode === 'simple' ? 'Switch to Advanced Mode' : 'Switch to Simple Mode';
    
    // Refresh icons to match the selected mode
    createIcons(); 
});

/**
 * Function to create and animate icons along the paths
 * Depending on the current mode (simple or advanced), different icons are shown.
 */
function createIcons() {
    chartContainer.innerHTML = ''; // Clear current icons
    
    // Icon set for current mode
    const iconSet = mode === 'simple' ? simpleIcons : advancedIcons;

    // Iterate over paths and place icons
    paths.forEach((path, index) => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('icon');
        iconElement.style.left = `${path.startX}px`;
        iconElement.style.top = `${path.startY}px`;
        iconElement.textContent = iconSet[index % iconSet.length]; // Cycle through icons based on available ones

        chartContainer.appendChild(iconElement);

        // Animate icons along the path (you can adjust speed and positions as needed)
        setTimeout(() => {
            iconElement.style.transform = `translate(${path.endX - path.startX}px, ${path.endY - path.startY}px)`;
        }, 500 * index); // Stagger animations for a smooth flowing effect
    });
}

/**
 * Function to toggle between simple and advanced icon sets
 * This will allow users to switch between different modes.
 */
function toggleMode() {
    mode = mode === 'simple' ? 'advanced' : 'simple';
    switchButton.textContent = mode === 'simple' ? 'Switch to Advanced Mode' : 'Switch to Simple Mode';
    createIcons(); // Refresh icons to match new mode
}

/**
 * Function to reset animations - can be used to restart the animations from the beginning.
 */
function resetAnimations() {
    // Clear any currently visible icons
    chartContainer.innerHTML = '';

    // Re-create icons and restart their animation
    createIcons();
}

/**
 * Function to stage for next steps: Adding advanced controls for customizing speed or icon styles.
 * Allows users to control animation speed or icon movement.
 */
function addAdvancedControls() {
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('flex', 'space-x-4', 'mt-4');

    // Create a speed slider
    const speedControl = document.createElement('input');
    speedControl.type = 'range';
    speedControl.min = '0.5';
    speedControl.max = '2';
    speedControl.step = '0.1';
    speedControl.value = '1'; // Default speed multiplier

    // Label for speed control
    const speedLabel = document.createElement('label');
    speedLabel.textContent = 'Animation Speed';

    // Update animation speed dynamically
    speedControl.addEventListener('input', (e) => {
        const speedMultiplier = e.target.value;
        updateAnimationSpeed(speedMultiplier);
    });

    controlsContainer.appendChild(speedLabel);
    controlsContainer.appendChild(speedControl);

    document.body.appendChild(controlsContainer);
}

/**
 * Function to dynamically update animation speed.
 * Will change the speed of icon movement.
 */
function updateAnimationSpeed(speedMultiplier) {
    const icons = document.querySelectorAll('.icon');
    icons.forEach((icon, index) => {
        // Adjust the speed of the translate animations
        icon.style.transition = `transform ${1 / speedMultiplier}s ease`;
    });
}

/**
 * Function to allow users to switch icon types on click.
 * This provides interactivity where users can change individual icons.
 */
function allowIconSwitching() {
    const icons = document.querySelectorAll('.icon');
    icons.forEach((icon) => {
        icon.addEventListener('click', () => {
            const newIconSet = mode === 'simple' ? advancedIcons : simpleIcons;
            icon.textContent = newIconSet[Math.floor(Math.random() * newIconSet.length)]; // Switch to a random icon from the other set
        });
    });
}

/**
 * Function to initialize everything.
 * Adds advanced controls and sets up the icons initially.
 */
function initialize() {
    createIcons();
    addAdvancedControls();
    allowIconSwitching(); // Activate the feature to switch icons on click
}

// Initialize on load
initialize();
    
    

        

// Initial setup: Create icons in simple mode
    createIcons();