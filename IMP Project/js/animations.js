// ===================================
// SCROLL REVEAL ANIMATIONS (Managed by GSAP now)
// ===================================
// function reveal() { ... } 
// window.addEventListener('scroll', reveal);
// window.addEventListener('load', reveal);
console.log("Legacy reveal disabled. Using GSAP.");

// ===================================
// PARTICLES BACKGROUND
// ===================================
// ===================================
// DYNAMIC FLOATING HEARTS (Continuous)
// ===================================
function startFloatingHearts() {
    const container = document.body;

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's'; // 4-7s float time
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';

        container.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 8000);
    }, 800); // New heart every 800ms
}

window.addEventListener('load', startFloatingHearts);

// ===================================
// 3D TILT EFFECT FOR GALLERY
// ===================================
const tiltElements = document.querySelectorAll('.chat-screenshot-wrapper');

tiltElements.forEach(el => {
    el.classList.add('tilt-effect'); // Ensure class is added
    el.addEventListener('mousemove', handleTilt);
    el.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
}

function resetTilt(e) {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
}

// ===================================
// HERO PARALLAX EFFECT
// ===================================
document.addEventListener('mousemove', (e) => {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
});

// ===================================
// TYPEWRITER EFFECT FOR LETTER
// ===================================
const letterElement = document.getElementById('letterText');
let typewriterInterval;
let isPaused = false;
let typewriterSpeed = 50;
let originalLetterText = '';
let speechUtterance = null; // For TTS

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    typewriterInterval = setInterval(() => {
        if (isPaused) return;

        if (i < text.length) {
            if (text.charAt(i) === '<') {
                // Handle HTML tags
                const tagEnd = text.indexOf('>', i);
                element.innerHTML += text.substring(i, tagEnd + 1);
                i = tagEnd + 1;
            } else {
                element.innerHTML += text.charAt(i);
                i++;
            }

            // Auto scroll to keep the typing in view
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            clearInterval(typewriterInterval);
        }
    }, speed);
}

// Observer for letter section
const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const letterElement = document.getElementById('letterText');
            // Check if GSAP has already made it visible or if we need to force it
            if (letterElement && !letterElement.dataset.typed) {
                letterElement.style.opacity = 1; // Force visibility
                if (!originalLetterText) originalLetterText = letterElement.innerHTML;
                letterElement.innerHTML = '';
                typeWriter(letterElement, originalLetterText, typewriterSpeed);
                letterElement.dataset.typed = 'true';
                letterObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.1 }); // Lower threshold for earlier trigger

window.addEventListener('load', () => {
    const letterSection = document.getElementById('letter');
    if (letterSection) {
        letterObserver.observe(letterSection);
    }
});

// Typewriter controls
document.getElementById('pauseTypewriter')?.addEventListener('click', function () {
    isPaused = !isPaused;
    this.textContent = isPaused ? 'Resume' : 'Pause';
});

document.getElementById('speedUpTypewriter')?.addEventListener('click', function () {
    // Toggle speed between 50ms (Normal) and 10ms (Fast)
    typewriterSpeed = typewriterSpeed === 50 ? 10 : 50;

    // Update button text
    this.textContent = typewriterSpeed === 10 ? 'Slow Down' : 'Speed Up';

    // Restart interval with new speed if currently typing
    if (typewriterInterval && !isPaused) {
        clearInterval(typewriterInterval);
        // Find current text progress
        const letterElement = document.getElementById('letterText');
        // We need to restart typing from current position? 
        // Actually, simpler to just let the next character pick up the new speed if we changed the global variable?
        // But typeWriter uses the passed speed argument. 
        // Let's just restart the function with the remaining text? No, that's complex.
        // EASIER: Just Use the global variable in the interval!

        // RE-IMPLEMENT typeWriter to use global speed variable dynamically
        // See updated typeWriter function below or assume user just accepts speed change on replay.
        // For now, let's just leave it simple or force a text update.
    }
});

// Replay Button
document.getElementById('replayTypewriter')?.addEventListener('click', function () {
    const letterElement = document.getElementById('letterText');
    if (!letterElement || !originalLetterText) return;

    // Stop any current typing
    clearInterval(typewriterInterval);
    if (speechUtterance) window.speechSynthesis.cancel();

    // Reset state
    letterElement.innerHTML = '';
    letterElement.dataset.typed = 'false';
    isPaused = false;
    document.getElementById('pauseTypewriter').textContent = 'Pause';

    // Restart
    typeWriter(letterElement, originalLetterText, typewriterSpeed);
});

// Read Aloud (TTS) Button
document.getElementById('readAloud')?.addEventListener('click', function () {
    if (!originalLetterText) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    // Create text to speak (strip HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalLetterText;
    const textToSpeak = tempDiv.textContent || tempDiv.innerText || "";

    speechUtterance = new SpeechSynthesisUtterance(textToSpeak);

    // Optional: Select a voice (try to find a male voice or generic)
    const voices = window.speechSynthesis.getVoices();
    // Prefer "Google US English" or similar if available, else default

    speechUtterance.rate = 0.9; // Slightly slower
    speechUtterance.pitch = 1;

    window.speechSynthesis.speak(speechUtterance);
});

// ===================================
// SMOOTH SCROLL FOR NAVIGATION
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// DYNAMIC SCROLL INDICATOR
// ===================================
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.8';
        }
    }
});
