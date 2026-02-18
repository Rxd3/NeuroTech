document.addEventListener('DOMContentLoaded', () => {
    // Flashlight Effect
    const root = document.documentElement;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        root.style.setProperty('--mouse-x', `${x}px`);
        root.style.setProperty('--mouse-y', `${y}px`);

        // Hero Tilt Effect
        handleTilt(e);
    });

    // 3D Tilt Logic for Hero Section
    const heroSection = document.querySelector('.hero');
    const robotContainer = document.querySelector('.robot-container');

    function handleTilt(e) {
        if (!heroSection || !robotContainer) return;

        // Check if mouse is within hero section (optional, global feels more immersive)
        // const rect = heroSection.getBoundingClientRect();
        // if (e.clientY < rect.top || e.clientY > rect.bottom) return;

        const { innerWidth, innerHeight } = window;
        const x = e.clientX;
        const y = e.clientY;

        // Calculate rotation based on center of screen
        // Range: -20deg to 20deg
        const rotateY = ((x / innerWidth) - 0.5) * 40;
        const rotateX = ((y / innerHeight) - 0.5) * -40;

        robotContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Team portrait spotlight reveal
    const memberPhotos = document.querySelectorAll('.member-photo');
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

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});
