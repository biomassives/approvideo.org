// Function to apply playful cat-like motions to icons
function applyCatMotion(iconElement) {
    // Randomly choose a playful motion for each icon
    const motions = ['pounce', 'stretch', 'bounce'];
    const selectedMotion = motions[Math.floor(Math.random() * motions.length)];

    // Apply the selected motion
    switch (selectedMotion) {
        case 'pounce':
            iconElement.style.transition = 'transform 0.5s ease';
            iconElement.style.transform = 'translate(20px, -20px) scale(1.2)';
            break;
        case 'stretch':
            iconElement.style.transition = 'transform 1s ease';
            iconElement.style.transform = 'scaleX(1.5) scaleY(1.2)';
            break;
        case 'bounce':
            iconElement.style.transition = 'transform 0.7s ease';
            iconElement.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                iconElement.style.transform = 'translateY(0px)';
            }, 700);
            break;
    }
}