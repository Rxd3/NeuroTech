document.addEventListener('DOMContentLoaded', () => {
    // --- Global Flashlight Effect ---
    const root = document.documentElement;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        root.style.setProperty('--mouse-x', `${x}px`);
        root.style.setProperty('--mouse-y', `${y}px`);
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Team Portrait & Project Spotlight ---
    const memberPhotos = document.querySelectorAll('.member-photo, .project-thumb');
    memberPhotos.forEach((photo) => {
        const img = photo.querySelector('img');
        if (!img) return;

        photo.style.setProperty('--img-url', `url("${img.currentSrc || img.src}")`);

        const updateSpotlight = (e) => {
            const rect = photo.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            photo.style.setProperty('--spot-x', `${x}%`);
            photo.style.setProperty('--spot-y', `${y}%`);
        };

        photo.addEventListener('mousemove', updateSpotlight);
        photo.addEventListener('mouseenter', updateSpotlight);
        photo.addEventListener('mouseleave', () => {
            photo.style.setProperty('--spot-x', '50%');
            photo.style.setProperty('--spot-y', '50%');
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => scrollObserver.observe(el));

    // --- Particle Network Animation (Hero Section) ---
    const canvas = document.getElementById('neuro-network');
    if (!canvas) return; // Guard clause if canvas is missing

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Configuration
    let particleCount = 100; // Default
    const connectionDistance = 120;
    const mouseInteractionRadius = 150;

    // Resize handling
    function resize() {
        const container = canvas.parentElement;

        // On mobile, if .hero-visual is absolute 100%, it takes parent dimensions
        // We use offsetWidth/Height to get the rendered size including padding/border if any
        width = container.offsetWidth;
        height = container.offsetHeight;

        canvas.width = width;
        canvas.height = height;

        // Dynamic particle count: fewer on mobile
        if (window.innerWidth < 768) {
            particleCount = 40;
        } else {
            particleCount = 100;
        }

        initParticles();
    }

    // Mouse position tracking for canvas
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', function (e) {
        // We need coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Random velocity x
            this.vy = (Math.random() - 0.5) * 0.5; // Random velocity y
            this.size = Math.random() * 2 + 1; // Size between 1 and 3
            this.baseColor = 'rgba(255, 255, 255, 0.2)'; // Faint white/grey
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        // Draw connections
        connectParticles();

        requestAnimationFrame(animate);
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    let opacity = 1 - (distance / connectionDistance);
                    let lineWidth = 1;
                    let strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`; // Base faint line

                    // Mouse Interaction
                    if (mouse.x != null) {
                        let dxMouse = particles[i].x - mouse.x;
                        let dyMouse = particles[i].y - mouse.y;
                        let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                        if (distanceMouse < mouseInteractionRadius) {
                            // "Flashlight" effect: brighten lines near mouse
                            // Increase opacity and maybe slightly colorize towards cream/gold
                            const brightness = 1 - (distanceMouse / mouseInteractionRadius);
                            strokeStyle = `rgba(234, 228, 213, ${opacity * 0.8 * brightness + 0.1})`; // var(--color-flashlight) is #EAE4D5
                            lineWidth = 1 + brightness;
                        }
                    }

                    ctx.strokeStyle = strokeStyle;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Initialize Canvas
    window.addEventListener('resize', resize);
    resize(); // Initial sizing
    animate(); // Start loop
});
