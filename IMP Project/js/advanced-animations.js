// ===================================
// ADVANCED ANIMATIONS (GSAP + CANVAS)
// ===================================

console.log("Advanced animations script loaded!");

// Safety check for GSAP
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGsapAnimations();
} else {
    console.warn("GSAP or ScrollTrigger not found. Animations disabled.");
}

// ===================================
// 1. PARTICLE SYSTEM (CANVAS)
// ===================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    console.log("Canvas found, initializing particles...");
    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    // Set canvas to full screen
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // Increased size checking
            this.speedX = Math.random() * 1 - 0.5; // Faster speed
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`; // White/Bright for visibility
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around screen
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < 100; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
} else {
    console.error("Canvas element 'particleCanvas' not found!");
}


// ===================================
// 2. GSAP SCROLL ANIMATIONS
// ===================================
function initGsapAnimations() {
    console.log("Initializing GSAP animations...");

    // Hero Section: Parallax & Fade
    gsap.to(".hero-content", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        y: 200,
        opacity: 0
    });

    // GENERIC REVEAL FOR OLD ELEMENTS
    gsap.utils.toArray('.reveal').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                // toggleActions: "play none none reverse" // Optional: Re-animate on scroll up?
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Story Section: Slide in from sides
    gsap.from(".story-content", {
        scrollTrigger: {
            trigger: ".story-begins",
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    });

    // Distance Markers: Pop in with Bounce
    gsap.utils.toArray(".point-marker").forEach(marker => {
        gsap.from(marker, {
            scrollTrigger: {
                trigger: marker,
                start: "top 85%",
            },
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    });

    // Gallery Images: Staggered 3D Reveal
    gsap.from(".chat-item", {
        scrollTrigger: {
            trigger: ".chat-gallery",
            start: "top 75%",
        },
        y: 100,
        opacity: 0,
        rotateX: 45,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out"
    });

    // Letter Container
    gsap.from(".letter-container", {
        scrollTrigger: {
            trigger: ".letter-section",
            start: "top 70%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
}


// ===================================
// 3. AUDIO VISUALIZER (Simulation)
// ===================================
function createVisualizer(audioId) {
    const playerContainer = document.querySelector(`[data-audio="${audioId}"]`)?.closest('.custom-audio-player');
    if (!playerContainer) return;

    // Check if visualizer already exists
    if (playerContainer.querySelector('.audio-visualizer')) return;

    // Create container
    let visualizer = document.createElement('div');
    visualizer.className = 'audio-visualizer';
    visualizer.style.display = 'flex';
    visualizer.style.alignItems = 'flex-end';
    visualizer.style.height = '30px';
    visualizer.style.gap = '2px';
    visualizer.style.marginLeft = '15px';

    // Add bars
    for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'visualizer-bar';
        bar.style.width = '3px';
        bar.style.backgroundColor = 'var(--primary-color)';
        bar.style.height = '5px';
        bar.style.transition = 'height 0.1s ease';
        visualizer.appendChild(bar);
    }

    // Insert after play button or wherever fits
    const progressBar = playerContainer.querySelector('.audio-progress');
    if (progressBar) {
        playerContainer.insertBefore(visualizer, progressBar);
    } else {
        playerContainer.appendChild(visualizer);
    }

    const audioElement = document.getElementById(audioId);
    let isAnimating = false;

    function animateBars() {
        if (!isAnimating) return;

        const bars = visualizer.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => {
            const height = Math.random() * 20 + 5; // Simulating wave
            bar.style.height = `${height}px`;
        });

        requestAnimationFrame(animateBars);
    }

    audioElement.addEventListener('play', () => {
        isAnimating = true;
        animateBars();
    });

    audioElement.addEventListener('pause', () => {
        isAnimating = false;
        const bars = visualizer.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => bar.style.height = '5px');
    });

    audioElement.addEventListener('ended', () => {
        isAnimating = false;
        const bars = visualizer.querySelectorAll('.visualizer-bar');
        bars.forEach(bar => bar.style.height = '5px');
    });
}

// Init visualizers
window.addEventListener('load', () => {
    ['audio1', 'audio2', 'audio3', 'audioFinal'].forEach(id => {
        if (document.getElementById(id)) createVisualizer(id);
    });
});

// ===================================
// 4. CUSTOM CURSOR
// ===================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .chat-item, .reason-card, .audio-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
        });
    });
}

// ===================================
// 5. SCROLL PROGRESS BAR
// ===================================
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop === 0) {
            scrollProgress.style.width = '0%';
            return;
        }
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    }
});

// ===================================
// 6. HEART POP ON CLICK
// ===================================
document.addEventListener('click', (e) => {
    // Create heart element
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.innerHTML = '❤️';
    heart.style.left = `${e.clientX}px`;
    heart.style.top = `${e.clientY}px`;

    // Random size & rotation
    const size = Math.random() * 20 + 20; // 20-40px
    const rotation = Math.random() * 60 - 30; // -30 to 30 deg

    heart.style.fontSize = `${size}px`;
    heart.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;

    document.body.appendChild(heart);

    // Remove after animation (CSS animation handles scale/opacity)
    setTimeout(() => {
        heart.remove();
    }, 800);
});
