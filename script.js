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

    // --- Internationalization (i18n) ---
    const i18n = {
        en: {
            nav: {
                home: "HOME",
                about: "ABOUT",
                projects: "PROJECTS",
                contact: "CONTACT"
            },
            hero: {
                subtitle: "Bridging the gap between artificial intelligence and physical hardware. We design advanced simulations and implement them into real-world mechanics.",
                est: "EST. 2026",
                scroll: "SCROLL DOWN • SCROLL DOWN •"
            },
            story: {
                step1: { title: "Design", subtitle: "Hardware Design & CAD" },
                step2: { title: "Simulation", subtitle: "RL Policy Training (Isaac Sim / Gazebo)" },
                step3: { title: "Sim-to-Real", subtitle: "Deploying Policies to Hardware" },
                step4: { title: "Validation", subtitle: "Real-World Testing & Data" },
                title: "Our Story",
                p1: "Founded in 2026 at Istinye University in Turkey, NeuroTech is a student research team combining engineering and AI to build research-ready robotic platforms.",
                p2: "Our goal is to work in a disciplined and professional way—from designing and assembling the robot to building accurate simulations, running real hardware tests, and improving performance through experiments and data.",
                p3: "We apply AI methods to model behavior, optimize control policies, and support decision-making across the pipeline, while maintaining clear documentation, version-controlled assets, and reproducible experiments that make our results easy to verify and build upon."
            },
            team: {
                title: "The Minds",
                member1: {
                    title: "Computer Engineering Student",
                    bio: "Specializing in inverse kinematics and real-time control systems."
                },
                member2: {
                    title: "Computer Engineering Student",
                    bio: "Specializing in reinforcement learning environments and physics engines."
                }
            },
            tags: {
                control: "Control",
                simulation: "Simulation",
                physics: "Physics"
            },
            projects: {
                title: "Innovations",
                view: "VIEW PROJECT"
            },
            contact: {
                title: "Get in Touch"
            }
        },
        tr: {
            nav: {
                home: "ANASAYFA",
                about: "HAKKIMIZDA",
                projects: "PROJELER",
                contact: "İLETİŞİM"
            },
            hero: {
                subtitle: "Yapay zeka ve fiziksel donanım arasındaki boşluğu dolduruyoruz. Gelişmiş simülasyonlar tasarlıyor ve bunları gerçek mekaniklere uyguluyoruz.",
                est: "KUR. 2026",
                scroll: "AŞAĞI KAYDIR • AŞAĞI KAYDIR •"
            },
            story: {
                step1: { title: "Tasarım", subtitle: "Donanım Tasarımı & CAD" },
                step2: { title: "Simülasyon", subtitle: "RL Politika Eğitimi (Isaac Sim / Gazebo)" },
                step3: { title: "Simülasyondan Gerçeğe", subtitle: "Politikaların Donanıma Aktarımı" },
                step4: { title: "Doğrulama", subtitle: "Gerçek Dünya Testleri & Veri" },
                title: "Hikayemiz",
                p1: "2026 yılında İstinye Üniversitesi'nde kurulan NeuroTech, araştırma odaklı robotik platformlar inşa etmek için mühendislik ve yapay zekayı birleştiren bir öğrenci araştırma ekibidir.",
                p2: "Amacımız, robot tasarlayıp birleştirmekten, doğru simülasyonlar oluşturmaya, gerçek donanım testleri yapmaya ve deneyler/veri yoluyla performansı artırmaya kadar disiplinli ve profesyonel bir şekilde çalışmaktır.",
                p3: "Davranış modelleme, kontrol politikalarını optimize etme ve süreç boyunca karar vermeyi destekleme konusunda yapay zeka yöntemleri uygularken; sonuçlarımızın doğrulanabilir ve üzerine inşa edilebilir olmasını sağlayan net dokümantasyon ve tekrarlanabilir deneyleri sürdürüyoruz."
            },
            team: {
                title: "Ekip",
                member1: {
                    title: "Bilgisayar Mühendisliği Öğrencisi",
                    bio: "Ters kinematik ve gerçek zamanlı kontrol sistemleri üzerine uzmanlaşıyor."
                },
                member2: {
                    title: "Bilgisayar Mühendisliği Öğrencisi",
                    bio: "Pekiştirmeli öğrenme ortamları ve fizik motorları üzerine uzmanlaşıyor."
                }
            },
            tags: {
                control: "Kontrol",
                simulation: "Simülasyon",
                physics: "Fizik"
            },
            projects: {
                title: "İnovasyonlar",
                view: "PROJEYİ GÖR"
            },
            contact: {
                title: "İletişime Geçin"
            }
        }
    };

    function setLanguage(lang) {
        if (!i18n[lang]) return;

        // Save preference
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;

        // Update active state in switcher
        document.querySelectorAll('.lang-opt').forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
        });

        // Recursively find and update text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const keys = key.split('.');
            let value = i18n[lang];

            for (const k of keys) {
                if (value) value = value[k];
            }

            if (value) {
                // Special handling for textPath to preserve visual spacing if needed, 
                // but just setting textContent is usually fine for these.
                el.textContent = value;
            }
        });
    }

    // Initial Load
    const savedLang = localStorage.getItem('lang');
    const browserLang = navigator.language.startsWith('tr') ? 'tr' : 'en';
    const initialLang = savedLang || browserLang;
    setLanguage(initialLang);

    // Event Listeners
    document.querySelectorAll('.lang-opt').forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // --- Mobile Navbar Hamburger Toggle ---
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const langSwitch = document.querySelector('.lang-switch');

    // Create the hamburger menu button dynamically
    const menuBtn = document.createElement('button');
    menuBtn.className = 'mobile-menu-toggle';
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Toggle Navigation');
    menuBtn.innerHTML = '<i class="ph ph-list"></i>';

    // Insert the button before the language switcher
    if (langSwitch) {
        nav.insertBefore(menuBtn, langSwitch);
    } else {
        nav.appendChild(menuBtn);
    }

    // Handle toggle and close
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');

        // Swap Phosphor icons
        menuBtn.innerHTML = isExpanded
            ? '<i class="ph ph-list"></i>'
            : '<i class="ph ph-x"></i>';
    });

    // Automatically close the menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.innerHTML = '<i class="ph ph-list"></i>';
        });
    });
});
