document.getElementById('love-button').addEventListener('click', function() {
    const message = document.getElementById('message');
    
    // Show text message
    message.style.opacity = '1';

    // Create heart burst
    for (let i = 0; i < 15; i++) {
        createHeart();
    }
});

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    
    heart.style.left = '50%';
    heart.style.top = '50%';
    
    // Randomize the horizontal spread
    const randomX = (Math.random() - 0.5) * 300; 
    heart.style.setProperty('--dx', `${randomX}px`);

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1500);
}