// ===================================
// THEME TOGGLE (DARK MODE)
// ===================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
}

themeToggle?.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save theme preference
    const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// ===================================
// LAZY LOADING IMAGES
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===================================
// PRELOAD AUDIO FILES
// ===================================
window.addEventListener('load', () => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.preload = 'metadata'; // Only preload metadata to save bandwidth
    });
});

// ===================================
// PREVENT RIGHT CLICK ON IMAGES (Optional - for protection)
// ===================================
// Uncomment if you want to prevent right-click downloads
/*
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});
*/

// ===================================
// ADD SMOOTH ENTRANCE TO HERO
// ===================================
window.addEventListener('load', () => {
    document.querySelector('.hero-content')?.classList.add('loaded');
});

// ===================================
// EASTER EGG: KONAMI CODE
// ===================================
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create heart explosion effect
    const heartCount = 50;
    for (let i = 0; i < heartCount; i++) {
        createFallingHeart();
    }
    
    // Show a sweet message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 157, 0.95);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: scaleIn 0.5s ease;
    `;
    message.textContent = 'You found the secret! I love you! ❤️';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function createFallingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.cssText = `
        position: fixed;
        top: -50px;
        left: ${Math.random() * 100}%;
        font-size: ${Math.random() * 30 + 20}px;
        z-index: 9999;
        pointer-events: none;
        animation: fall ${Math.random() * 3 + 2}s linear;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Add falling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Debounce function for scroll events
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

// ===================================
// MOBILE MENU (If you add navigation later)
// ===================================
// This is a placeholder for future navigation menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('active');
});

// ===================================
// ANALYTICS (Optional - Add later if needed)
// ===================================
// Track how long she stays on the page
let startTime = Date.now();

window.addEventListener('beforeunload', () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Time spent on site: ${timeSpent} seconds`);
    // You could send this to an analytics service if you want
});

// ===================================
// CONSOLE MESSAGE (Easter Egg)
// ===================================
console.log('%c💝 Made with Love 💝', 'color: #ff6b9d; font-size: 24px; font-weight: bold;');
console.log('%cHey there! If you\'re reading this, you must be pretty special. This website was built with love, just for her. ❤️', 'color: #667eea; font-size: 14px;');
console.log('%cP.S. - There\'s a secret code hidden in this website. Can you find it? 😉', 'color: #4facfe; font-size: 12px; font-style: italic;');
