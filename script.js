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
    const memberPhotos = document.querySelectorAll('.member-photo, .project-thumb, .image-slot');
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
    if (canvas) {
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
            width = container.offsetWidth;
            height = container.offsetHeight;
            canvas.width = width;
            canvas.height = height;

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
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.baseColor = 'rgba(255, 255, 255, 0.2)';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
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
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
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
                        let strokeStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;

                        if (mouse.x != null) {
                            let dxMouse = particles[i].x - mouse.x;
                            let dyMouse = particles[i].y - mouse.y;
                            let distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                            if (distanceMouse < mouseInteractionRadius) {
                                const brightness = 1 - (distanceMouse / mouseInteractionRadius);
                                strokeStyle = `rgba(234, 228, 213, ${opacity * 0.8 * brightness + 0.1})`;
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
        resize();
        animate();
    } // end if (canvas)

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
                scroll: "SPOTMICRO • SPOTMICRO • "
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
            spotmicro: {
                nav: { back: "← BACK TO HOME", back_mobile: "← BACK" },
                hero: {
                    status: "UNDER DEVELOPMENT",
                    tagline: "\"Simulation-First Quadruped Robotics — ROS 2 Digital Twin, SLAM/Navigation, and Reinforcement Learning for Locomotion\"",
                    intro: "Spot Micro is a research-oriented quadruped platform built with a simulation-first methodology. Our core goal is to develop a high-fidelity digital twin (URDF/Xacro + physics) and a disciplined ROS 2 software stack, then leverage reinforcement learning (RL) to optimize locomotion policies in simulation before transferring them safely to real hardware. The roadmap is structured around three pillars: (1) accurate simulation and reproducible experiments, (2) ROS 2 integration for modular robotics software, and (3) AI/RL for improving stability, tracking, and efficiency under real-world constraints.",
                    facts: {
                        platform_lbl: "Platform:", platform_val: "12-DoF quadruped (3D-printed)",
                        compute_lbl: "Compute:", compute_val: "Raspberry Pi 5 (8GB)",
                        actuation_lbl: "Actuation:", actuation_val: "12× MG996R + PCA9685",
                        sensing_lbl: "Sensing:", sensing_val: "MPU-6050 IMU (LiDAR planned)",
                        focus_lbl: "Core Focus:", focus_val: "Simulation • ROS 2 • RL Locomotion"
                    },
                    img: "Spot Micro — Project Visual (CAD / Simulation / Hardware)"
                },
                slam: {
                    desc: "With a correct ROS 2 model and TF setup, LiDAR-based SLAM is introduced to produce a 2D occupancy grid map. The navigation stage uses ROS 2 Nav2 to reach goal poses and avoid obstacles using costmaps and local planning. The process is incremental: teleop mapping first, then navigation tuning and robustness tests.",
                    img: "SLAM Map"
                },
                titles: {
                    s1: "Executive Summary", s2: "Problem Statement", s3: "Research Question", s4: "Related Work (status)",
                    s5: "Project Objectives", s5_1: "Core Objectives (Phase 1)", s5_2: "Advanced Objectives (Phases 2–4)",
                    s6: "Methodology & Simulation-First Development Path", s7: "Mechanical Design & 3D Printing",
                    s8: "Key Dimensions (Reference + CAD Finalization)", s9: "Power, Safety, and Real-World Constraints",
                    s10: "Baseline Control (IK + Joystick) for Benchmarking", s11: "Digital Twin & ROS 2 Modeling (URDF/Xacro)",
                    s12: "ROS 2 Integration (Modular Robotics Software)", s13: "SLAM & Navigation (LiDAR + Nav2)",
                    s14: "Reinforcement Learning for Locomotion (Simulation → Real)", s15: "System Components (Current Build)",
                    s16: "Technical Architecture (High-Level)", s17: "Early-Phase Acceptance Criteria",
                    s18: "Roadmap & Timeline Estimates", s19: "Risk Management (Key Risks and Mitigations)"
                },
                body: {
                    s1_p: "This project presents a cost-efficient quadruped robot platform designed for AI-driven robotics research with strong emphasis on simulation accuracy and reproducibility. The system is developed in stages: first validating safe actuation and stable basic motion, then building a CAD-matched URDF/Xacro digital twin for ROS 2 integration and simulation benchmarking. With a reliable simulation baseline, the project introduces SLAM and navigation using LiDAR within ROS 2, and finally applies reinforcement learning to optimize locomotion behavior while reducing simulation-to-real mismatch through careful modeling and staged deployment.",
                    s2_p: "Quadruped robots can operate in complex terrain and confined environments, but they require coordinated multi-joint control, stability under dynamic motion, and careful deployment practices. Advanced autonomy and learning-based control often face the simulation-to-real gap, and many commercial platforms are expensive. This project addresses these constraints by prioritizing an accurate digital twin, ROS 2 modularity, and a simulation-first RL workflow that enables repeatable evaluation before real hardware deployment.",
                    s3_p: "How can we build a cost-efficient quadruped platform where a high-fidelity simulation and ROS 2 digital twin enable reproducible locomotion experiments, SLAM/navigation integration, and reinforcement learning policy optimization, while minimizing simulation-to-real error for safe and reliable deployment on physical hardware?",
                    s4_p: "The project aligns with modern research in simulation-based robotics development, ROS 2 modular architectures, SLAM/navigation pipelines, and reinforcement learning for locomotion. The team has initiated a focused literature review and is actively reading multiple research papers spanning these domains. Because the work intersects simulation fidelity, ROS 2 integration, SLAM, and RL locomotion, we synthesize insights across multiple publications to justify design choices and position the project within the state of the art.",
                    s5_li1: "Establish a stable simulation baseline and a reproducible experiment setup (configs, logs, versioned assets).",
                    s5_li2: "Servo bring-up, calibration, and safe standing posture (Stand) aligned with simulation joint limits.",
                    s5_li3: "Implement inverse kinematics per leg and execute joystick/controller commands as a controlled baseline.",
                    s5_li4: "Implement a stable initial gait (Crawl) and achieve repeatable walking trials.",
                    s5_li5: "Use IMU feedback for basic posture and stability compensation (pitch/roll).",
                    s5_li6: "Build a CAD-matched URDF/Xacro digital twin to support ROS 2 visualization, TF correctness, and simulation benchmarking.",
                    s5_li7: "Integrate with ROS 2 (nodes, topics, TF, RViz) for modular control and testing workflows.",
                    s5_li8: "Add LiDAR and perform SLAM/mapping, then navigation with obstacle avoidance (Nav2).",
                    s5_li9: "Train and deploy reinforcement learning locomotion policies: simulation training first, then staged real transfer with safety constraints.",
                    s6_p: "The methodology is simulation-first: we treat the digital twin as the foundation for reproducible testing, controller benchmarking, and RL training. Hardware experiments are introduced gradually and only after simulation baselines are validated. This reduces risk, improves safety, and supports repeatable scientific evaluation across design, simulation, deployment, and validation.",
                    s7_p: "The chassis and leg structures are designed as a complete CAD assembly and manufactured using 3D printing for rapid iteration. CAD is treated as the single source of truth to ensure link dimensions and joint placements match the URDF/Xacro model, directly improving simulation fidelity and ROS 2 consistency.",
                    s8_p: "Because the mechanical layout follows the SpotMicro family closely, this proposal includes widely adopted open-source reference dimensions for core body size and leg link lengths. The final envelope (overall L/W/H) will be confirmed from Fusion 360 using Inspect → Measure prior to fabrication and URDF export.",
                    s9_p: "Real hardware introduces strict constraints: current draw, voltage drops, servo backlash, and mechanical stress. Power integrity is treated as a first-class requirement, using a dedicated high-current 5V servo rail separate from the Raspberry Pi supply with a common ground. Software safety limits (joint limits, soft-start, conservative gait timing) protect hardware during early experiments and staged policy deployment.",
                    s10_p: "The baseline controller is intentionally simple and measurable: inverse kinematics converts desired foot targets into joint angles, while a conservative gait generator (Crawl) provides stable stepping. Joystick teleoperation is used as a controlled input source to benchmark stability and tracking in both simulation and real hardware, forming the foundation for later ROS 2 integration and RL optimization.",
                    s11_p: "A CAD-matched URDF/Xacro model is created to serve as a digital twin. Joint limits, coordinate frames, and inertial approximations are aligned to the physical robot so that TF trees and RViz visualization remain consistent. This digital twin enables simulation benchmarking, faster debugging, and reproducible experiments, and it reduces sim-to-real mismatch before RL policies are deployed.",
                    s12_p: "ROS 2 is used to structure the software stack into modular components: control nodes, sensor interfaces, TF publishers, RViz visualization, and test tools. By standardizing the pipeline in ROS 2, the project supports repeatable validation, easier collaboration, and clean transitions from simulation to real hardware.",
                    s14_p: "Reinforcement learning is used as an optimization layer for locomotion rather than raw servo-level control. Policies optimize gait parameters (step length, step height, timing, posture offsets) and stability objectives. Training begins in simulation using the digital twin, supported by domain randomization (noise, friction, mass variations) to reduce sim-to-real gap. Deployment to hardware is staged with conservative limits and strict safety constraints.",
                    s15_list: {
                        i1: "Raspberry Pi 5 (8GB) with active cooler", i2: "microSD Card (64GB, Class 10)", i3: "12x MG996R metal gear servo motors",
                        i4: "PCA9685 16-channel I2C servo driver", i5: "MPU-6050 (GY-521) IMU module", i6: "Raspberry Pi Camera Module (v2 or v3)",
                        i7: "OLED SSD1306 (128x64, I2C)", i8: "LED power button and rocker power switch", i9: "7.4V (2S) Li-Po battery",
                        i10: "DC-DC buck converter (5V, >= 5A)", i11: "Mechanical hardware: bearings (F625zz), screws/nuts (M3/M4/M5)"
                    },
                    s15_planned: "Planned addition:", s15_li_plan: "2D LiDAR sensor (required for SLAM and navigation).",
                    s16_p: "Simulation & Digital Twin: URDF/Xacro + physics simulation used for benchmarking and RL training. Actuation: PCA9685 PWM output to servos. Kinematics: IK transforms foot trajectories into joint angles. Gait planning: Crawl baseline with conservative timing. Stability: IMU-based posture compensation (pitch/roll). ROS 2 layer: nodes, topics, TF, RViz, Nav2. Perception: LiDAR (SLAM) and camera (optional). Learning: RL policies optimize locomotion parameters for stability and efficiency.",
                    s17_p: "To ensure objective evaluation, early milestones are defined with measurable pass/fail criteria:",
                    s17_list: {
                        i1: "ROS 2 readiness: URDF/Xacro visualizes correct joint motion in RViz and TF frames are consistent.",
                        i2: "Walk (Crawl): walk forward for >= 3 meters under joystick control with at least 2 repeatable successful trials.",
                        i3: "Stand: maintain a stable standing posture for >= 60 seconds without a fall and without violating joint limits."
                    },
                    s18_p: "The following timeline estimates assume 1-2 hours of work per day. With more time, durations shrink proportionally.",
                    s19_list: {
                        i1: "Simulation-to-real gap: CAD-matched digital twin, domain randomization, staged deployment with strict safety constraints.",
                        i2: "High current draw / voltage drop: Dedicated high-current 5V servo buck, separate from Pi; common ground; soft-start.",
                        i3: "Servo inaccuracy/backlash: Crawl baseline first, calibration, joint limits, conservative timing.",
                        i4: "SLAM and TF inconsistencies: Accurate URDF/Xacro frames, validate TF tree in RViz, teleop mapping first.",
                        i5: "Mechanical stress: reinforce mounts, iterate prints at high-stress points, reduce sudden motions."
                    }
                },
                table_dim: {
                    th1: "Parameter", th2: "Symbol", th3: "Value (mm)",
                    note: "Final dimensions will be locked from Fusion 360 prior to fabrication and URDF export.",
                    r1: ["Body length (chassis only)", "Lb", "207.5"],
                    r2: ["Body width (chassis only)", "Wb", "78.0"],
                    r3: ["Coxa (hip) link length", "l0", "60.5"],
                    r4: ["Hip-to-knee link length (femur)", "l1", "111.2"],
                    r5: ["Knee-to-foot link length (tibia)", "l2", "118.5"],
                    r6: ["Max leg reach", "Rmax", "219.7"],
                    r7: ["Body height range (IK feasible)", "Hb", "98.9–197.7"]
                },
                table_time: {
                    th1: "Stage", th2: "Scope and Deliverable", th3: "Estimated Duration",
                    r0: ["Stage 0", "Simulation baseline + power and wiring validation", "3-7 days"],
                    r1: ["Stage 1", "Mechanical assembly (mount servos, bearings, chassis, cable management)", "7-14 days"],
                    r2: ["Stage 2", "Servo bring-up, calibration, Stand posture", "7-14 days"],
                    r3: ["Stage 3", "IK + joystick teleoperation (baseline benchmarking)", "14-21 days"],
                    r4: ["Stage 4", "Crawl gait + IMU compensation (repeatable walk trials)", "14-28 days"],
                    r5: ["Stage 5", "URDF/Xacro digital twin (RViz + TF correctness)", "7-14 days"],
                    r6: ["Stage 6", "ROS 2 integration (nodes, topics, testing pipeline)", "14-21 days"],
                    r7: ["Stage 7", "LiDAR SLAM/mapping (produce and save a 2D map)", "14-28 days"],
                    r8: ["Stage 8", "Navigation + obstacle avoidance (Nav2 tuning, go-to-goal)", "21-42 days"],
                    r9: ["Stage 9", "RL locomotion optimization (sim training → staged real transfer)", "28-56 days"]
                },
                footer: "More updates coming soon."
            },
            projects: {
                title: "Innovations",
                view: "READ MORE",
                status: "Under Development",
                desc: "Spot Micro is our quadruped robotics platform for locomotion, control, and sim-to-real experiments. We're building the mechanical design, a digital twin, and a robust testing pipeline.",
                focus_lbl: "Focus:",
                focus_val: "RL • Simulation • Control",
                stack_lbl: "Stack:",
                stack_val: "ROS • Isaac Sim / Gazebo",
                footer: "More projects are coming soon."
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
                scroll: "SPOTMICRO • SPOTMICRO • "
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
            spotmicro: {
                nav: { back: "← ANASAYFAYA DÖN", back_mobile: "← GERİ" },
                hero: {
                    status: "YAPIM AŞAMASINDA",
                    tagline: "\"Simülasyon Öncelikli Dört Ayaklı Robotik — ROS 2 Dijital İkiz, SLAM/Navigasyon ve Hareket için Pekiştirmeli Öğrenme\"",
                    intro: "Spot Micro, simülasyon öncelikli bir metodoloji ile oluşturulmuş, araştırma odaklı dört ayaklı bir platformdur. Temel hedefimiz, yüksek sadakatli bir dijital ikiz (URDF/Xacro + fizik) ve disiplinli bir ROS 2 yazılım yığını geliştirmek, ardından hareket politikalarını fiziksel donanıma güvenle aktarmadan önce simülasyonda optimize etmek için pekiştirmeli öğrenmeyi (RL) kullanmaktır. Yol haritası üç sütun etrafında yapılandırılmıştır: (1) doğru simülasyon ve tekrarlanabilir deneyler, (2) modüler robotik yazılımı için ROS 2 entegrasyonu ve (3) gerçek dünya kısıtlamaları altında kararlılığı, takibi ve verimliliği artırmak için AI/RL.",
                    facts: {
                        platform_lbl: "Platform:", platform_val: "12-DoF dört ayaklı (3B baskı)",
                        compute_lbl: "İşlemci:", compute_val: "Raspberry Pi 5 (8GB)",
                        actuation_lbl: "Eyleyici:", actuation_val: "12× MG996R + PCA9685",
                        sensing_lbl: "Sensör:", sensing_val: "MPU-6050 IMU (LiDAR planlanıyor)",
                        focus_lbl: "Odak Alanı:", focus_val: "Simülasyon • ROS 2 • RL Hareketi"
                    },
                    img: "Spot Micro — Proje Görseli (CAD / Simülasyon / Donanım)"
                },
                slam: {
                    desc: "Doğru bir ROS 2 modeli ve TF kurulumu ile LiDAR tabanlı SLAM, 2B doluluk ızgara haritası üretmek için devreye alınır. Navigasyon aşaması, hedef pozlara ulaşmak ve maliyet haritaları ile yerel planlama kullanarak engellerden kaçınmak için ROS 2 Nav2 kullanır. Süreç kademeli olarak ilerler: önce teleop ile haritalama, ardından navigasyon ayarı ve dayanıklılık testleri.",
                    img: "SLAM Haritası"
                },
                titles: {
                    s1: "Yönetici Özeti", s2: "Problem Tanımı", s3: "Araştırma Sorusu", s4: "İlgili Çalışmalar (Mevcut Durum)",
                    s5: "Proje Hedefleri", s5_1: "Temel Hedefler (Aşama 1)", s5_2: "Gelişmiş Hedefler (Aşama 2–4)",
                    s6: "Metodoloji ve Simülasyon Öncelikli Geliştirme Yolu", s7: "Mekanik Tasarım ve 3B Baskı",
                    s8: "Önemli Boyutlar (Referans + CAD Sonlandırması)", s9: "Güç, Güvenlik ve Gerçek Dünya Kısıtlamaları",
                    s10: "Kıyaslama İçin Temel Kontrol (IK + Joystick)", s11: "Dijital İkiz ve ROS 2 Modellemesi (URDF/Xacro)",
                    s12: "ROS 2 Entegrasyonu (Modüler Robotik Yazılımı)", s13: "SLAM ve Navigasyon (LiDAR + Nav2)",
                    s14: "Hareket İçin Pekiştirmeli Öğrenme (Simülasyon → Gerçek)", s15: "Sistem Bileşenleri (Mevcut Yapı)",
                    s16: "Teknik Mimari (Üst Düzey)", s17: "Erken Aşama Kabul Kriterleri",
                    s18: "Yol Haritası ve Zaman Çizelgesi Tahminleri", s19: "Risk Yönetimi (Temel Riskler ve Azaltma Stratejileri)"
                },
                body: {
                    s1_p: "Bu proje, simülasyon doğruluğu ve tekrarlanabilirliğe güçlü bir vurgu yaparak yapay zeka odaklı robotik araştırmaları için tasarlanmış uygun maliyetli bir dört ayaklı robot platformu sunmaktadır. Sistem aşamalar halinde geliştirilir: önce güvenli eyleme ve temel hareketliliği doğrulama, ardından ROS 2 entegrasyonu ve simülasyon kıyaslaması için CAD uyumlu bir URDF/Xacro dijital ikizi oluşturma. Güvenilir bir simülasyon temelinin ardından proje, ROS 2 içinde LiDAR kullanarak SLAM ve navigasyonu tanıtır ve son olarak simülasyondan gerçeğe uyumsuzluğu dikkatli modelleme ve aşamalı dağıtım yoluyla azaltırken hareket davranışını optimize etmek için pekiştirmeli öğrenme uygular.",
                    s2_p: "Dört ayaklı robotlar karmaşık arazilerde ve dar ortamlarda çalışabilir, ancak koordineli çoklu eklem kontrolü, dinamik hareket altında denge ve dikkatli dağıtım uygulamaları gerektirir. Gelişmiş otonomi ve öğrenmeye dayalı kontrol genellikle simülasyon-gerçeklik boşluğu ile karşı karşıya kalır ve birçok ticari platform pahalıdır. Bu proje, doğru bir dijital ikizi, ROS 2 modülerliğini ve gerçek donanım dağıtımından önce tekrarlanabilir değerlendirmeye olanak tanıyan simülasyon öncelikli bir RL iş akışını önceliklendirerek bu kısıtlamaları ele almaktadır.",
                    s3_p: "Fiziksel donanımda güvenli ve güvenilir dağıtım için simülasyon-gerçeklik hatasını en aza indirirken, yüksek sadakatli bir simülasyon ve ROS 2 dijital ikizinin tekrarlanabilir hareket deneyleri, SLAM/navigasyon entegrasyonu ve pekiştirmeli öğrenme politikası optimizasyonunu sağladığı uygun maliyetli bir dört ayaklı platformu nasıl inşa edebiliriz?",
                    s4_p: "Proje, simülasyon tabanlı robotik geliştirme, ROS 2 modüler mimarileri, SLAM/navigasyon ardışık düzenleri ve hareket için pekiştirmeli öğrenme alanlarındaki modern araştırmalarla uyumludur. Ekip odaklı bir literatür taraması başlatmış olup bu alanları kapsayan çok sayıda araştırma makalesini aktif olarak okumaktadır. Çalışma simülasyon sadakati, ROS 2 entegrasyonu, SLAM ve RL hareketliliğini kesiştirdiği için, tasarım seçimlerini gerekçelendirmek ve projeyi mevcut teknolojinin geldiği noktada konumlandırmak amacıyla birden çok yayından elde edilen içgörüleri sentezliyoruz.",
                    s5_li1: "Kararlı bir simülasyon temeli ve tekrarlanabilir bir deney düzeneği (yapılandırmalar, günlükler, sürümlendirilmiş varlıklar) oluşturun.",
                    s5_li2: "Simülasyon eklem sınırlarıyla hizalanmış servo devreye alma, kalibrasyon ve güvenli duruş pozisyonu (Stand).",
                    s5_li3: "Bacak başına ters kinematik (IK) uygulayın ve kontrollü bir temel olarak joystick/kontrolör komutlarını yürütün.",
                    s5_li4: "Kararlı bir başlangıç yürüyüşü (Crawl) uygulayın ve tekrarlanabilir yürüme denemeleri elde edin.",
                    s5_li5: "Temel duruş ve denge telafisi (pitch/roll) için IMU geri bildirimini kullanın.",
                    s5_li6: "ROS 2 görselleştirmesini, TF doğruluğunu ve simülasyon kıyaslamasını desteklemek için CAD uyumlu bir URDF/Xacro dijital ikizi oluşturun.",
                    s5_li7: "Modüler kontrol ve test iş akışları için ROS 2 (düğümler, konular, TF, RViz) ile entegre edin.",
                    s5_li8: "LiDAR ekleyin ve SLAM/haritalama gerçekleştirin, ardından engellerden kaçınma ile navigasyon yapın (Nav2).",
                    s5_li9: "Pekiştirmeli öğrenme hareket politikalarını eğitin ve dağıtın: önce simülasyon eğitimi, ardından güvenlik kısıtlamaları ile aşamalı gerçek transfer.",
                    s6_p: "Metodoloji simülasyon önceliklidir: dijital ikizi tekrarlanabilir testler, kontrolör kıyaslaması ve RL eğitimi için temel olarak ele alıyoruz. Donanım deneyleri aşamalı olarak ve ancak simülasyon temelleri doğrulandıktan sonra başlatılır. Bu, riski azaltır, güvenliği artırır ve tasarım, simülasyon, dağıtım ve doğrulama süreçlerinde tekrarlanabilir bilimsel değerlendirmeyi destekler.",
                    s7_p: "Şasi ve bacak yapıları tam bir CAD montajı olarak tasarlanmış ve hızlı yineleme için 3B baskı kullanılarak üretilmiştir. CAD, bağlantı boyutlarının ve eklem yerleşimlerinin URDF/Xacro modeliyle eşleşmesini sağlamak, simülasyon sadakatini ve ROS 2 tutarlılığını doğrudan artırmak için tek gerçek kaynak olarak kabul edilir.",
                    s8_p: "Mekanik düzen SpotMicro ailesini yakından takip ettiğinden, bu teklif çekirdek gövde boyutu ve bacak bağlantı uzunlukları için yaygın olarak benimsenen açık kaynaklı referans boyutları içerir. Nihai zarf (toplam U/G/Y), imalat ve URDF dışa aktarımından önce Inspect → Measure kullanılarak Fusion 360'tan doğrulanacaktır.",
                    s9_p: "Gerçek donanım kesin kısıtlamalar getirir: akım çekişi, voltaj düşüşleri, servo boşluğu ve mekanik stres. Güç bütünlüğü, Raspberry Pi kaynağından ayrı, ortak topraklamalı, yüksek akımlı özel bir 5V servo rayı kullanılarak birinci sınıf bir gereksinim olarak ele alınır. Yazılım güvenlik sınırları (eklem sınırları, yavaş başlama, korumacı yürüyüş zamanlaması), erken deneyler ve aşamalı politika dağıtımı sırasında donanımı korur.",
                    s10_p: "Temel kontrolör kasıtlı olarak basit ve ölçülebilirdir: ters kinematik (IK), istenen ayak hedeflerini eklem açılarına dönüştürürken, tutucu bir yürüyüş üreteci (Crawl) kararlı bir adımlama sağlar. Joystick ile uzaktan kumanda(teleoperasyon), hem simülasyonda hem de gerçek donanımda kararlılığı ve takibi kıyaslamak için kontrollü bir giriş kaynağı olarak kullanılır ve daha sonraki ROS 2 entegrasyonu ile RL optimizasyonunun temelini oluşturur.",
                    s11_p: "Dijital ikiz olarak hizmet etmek üzere CAD uyumlu bir URDF/Xacro modeli oluşturulur. Eklem sınırları, koordinat çerçeveleri ve eylemsizlik yaklaşımları fiziksel robotla hizalanır, böylece TF ağaçları ve RViz görselleştirmesi tutarlı kalır. Bu dijital ikiz, simülasyon kıyaslamasını, daha hızlı hata ayıklamayı ve tekrarlanabilir deneyleri mümkün kılar ve RL politikaları dağıtılmadan önce simülasyondan gerçeğe uyumsuzluğu azaltır.",
                    s12_p: "ROS 2, yazılım yığınını modüler bileşenler halinde yapılandırmak için kullanılır: kontrol düğümleri, sensör arayüzleri, TF yayıncıları, RViz görselleştirmesi ve test araçları. Proje, ardışık düzeni ROS 2'de standartlaştırarak tekrarlanabilir doğrulamayı, daha kolay işbirliğini ve simülasyondan gerçek donanıma temiz geçişleri destekler.",
                    s14_p: "Pekiştirmeli öğrenme, ham servo seviyesindeki kontrolden ziyade hareket için bir optimizasyon katmanı olarak kullanılır. Politikalar yürüyüş parametrelerini (adım uzunluğu, adım yüksekliği, zamanlama, duruş ofsetleri) ve denge hedeflerini optimize eder. Eğitim, simülasyondan gerçeğe boşluğunu azaltmak için alan rastgeleleştirmesi (domain randomization - gürültü, sürtünme, kütle varyasyonları) ile desteklenen dijital ikiz kullanılarak simülasyonda başlar. Donanıma dağıtım, korumacı sınırlar ve sıkı güvenlik kısıtlamaları ile aşamalı olarak yapılır.",
                    s15_list: {
                        i1: "Raspberry Pi 5 (8GB) aktif soğutuculu", i2: "microSD Kart (64GB, Sınıf 10)", i3: "12x MG996R metal dişli servo motor",
                        i4: "PCA9685 16 kanallı I2C servo sürücü", i5: "MPU-6050 (GY-521) IMU modülü", i6: "Raspberry Pi Kamera Modülü (v2 veya v3)",
                        i7: "OLED SSD1306 (128x64, I2C)", i8: "LED güç düğmesi ve basmalı güç anahtarı", i9: "7.4V (2S) Li-Po batarya",
                        i10: "DC-DC düşürücü dönüştürücü (5V, >= 5A)", i11: "Mekanik donanım: rulmanlar (F625zz), vidalar/somunlar (M3/M4/M5)"
                    },
                    s15_planned: "Planlanan eklenti:", s15_li_plan: "2B LiDAR sensörü (SLAM ve navigasyon için gereklidir).",
                    s16_p: "Simülasyon ve Dijital İkiz: Kıyaslama ve RL eğitimi için kullanılan URDF/Xacro + fizik simülasyonu. Eyleyici: Servolara PCA9685 PWM çıkışı. Kinematik: IK, ayak yörüngelerini eklem açılarına dönüştürür. Yürüyüş planlaması: Korumacı zamanlamalı Crawl temeli. Denge: IMU tabanlı duruş telafisi (pitch/roll). ROS 2 katmanı: düğümler, konular, TF, RViz, Nav2. Algılama: LiDAR (SLAM) ve kamera (isteğe bağlı). Öğrenme: RL politikaları, kararlılık ve verimlilik için hareket parametrelerini optimize eder.",
                    s17_p: "Nesnel değerlendirmeyi sağlamak için erken aşama kilometre taşları ölçülebilir geçme/kalma kriterleriyle tanımlanır:",
                    s17_list: {
                        i1: "ROS 2 hazırlığı: URDF/Xacro, RViz'de doğru eklem hareketini görselleştirir ve TF çerçeveleri tutarlıdır.",
                        i2: "Yürüyüş (Crawl): En az 2 tekrarlanabilir başarılı deneme ile joystick kontrolü altında >= 3 metre ileri yürüyün.",
                        i3: "Duruş (Stand): Eklem sınırlarını ihlal etmeden ve düşmeden >= 60 saniye boyunca kararlı bir duruş pozisyonunu koruyun."
                    },
                    s18_p: "Aşağıdaki zaman çizelgesi tahminleri günde 1-2 saatlik çalışmaya dayanmaktadır. Daha fazla zaman ayrıldığında süreler orantılı olarak kısalır.",
                    s19_list: {
                        i1: "Simülasyon-gerçeklik boşluğu: CAD uyumlu dijital ikiz, alan rastgeleleştirmesi, sıkı güvenlik kısıtlamalarıyla aşamalı dağıtım.",
                        i2: "Yüksek akım çekişi / voltaj düşüşü: Pi'den ayrı, özel yüksek akımlı 5V servo dönüştürücü; ortak toprak; yavaş başlangıç(soft-start).",
                        i3: "Servo yanlışlığı/boşluğu: Önce Crawl temeli, kalibrasyon, eklem sınırları, korumacı zamanlama.",
                        i4: "SLAM ve TF tutarsızlıkları: Doğru URDF/Xacro çerçeveleri, RViz'de TF ağacını doğrulama, önce teleop haritalama.",
                        i5: "Mekanik stres: Bağlantıları güçlendirin, yüksek stresli noktalarda baskıları yineleyin, ani hareketleri azaltın."
                    }
                },
                table_dim: {
                    th1: "Parametre", th2: "Sembol", th3: "Değer (mm)",
                    note: "Nihai boyutlar, üretime ve URDF dışa aktarımına geçmeden önce Fusion 360'tan onaylanacaktır.",
                    r1: ["Gövde uzunluğu (sadece şasi)", "Lb", "207.5"],
                    r2: ["Gövde genişliği (sadece şasi)", "Wb", "78.0"],
                    r3: ["Koksa (kalça) bağlantı uzunluğu", "l0", "60.5"],
                    r4: ["Kalça-diz bağlantı uzunluğu (femur)", "l1", "111.2"],
                    r5: ["Diz-ayak bağlantı uzunluğu (tibia)", "l2", "118.5"],
                    r6: ["Maksimum bacak erişimi", "Rmax", "219.7"],
                    r7: ["Gövde yükseklik aralığı (IK uygun)", "Hb", "98.9–197.7"]
                },
                table_time: {
                    th1: "Aşama", th2: "Kapsam ve Çıktı", th3: "Tahmini Süre",
                    r0: ["Aşama 0", "Simülasyon temeli + güç ve kablo doğrulaması", "3-7 gün"],
                    r1: ["Aşama 1", "Mekanik montaj (servolar, rulmanlar, şasi, kablo yönetimi)", "7-14 gün"],
                    r2: ["Aşama 2", "Servo başlatma, kalibrasyon, Stand (duruş) pozisyonu", "7-14 gün"],
                    r3: ["Aşama 3", "IK + joystick teleoperasyon (temel kıyaslama)", "14-21 gün"],
                    r4: ["Aşama 4", "Crawl yürüyüşü + IMU telafisi (tekrarlanabilir yürüme denemeleri)", "14-28 gün"],
                    r5: ["Aşama 5", "URDF/Xacro dijital ikiz (RViz + TF doğruluğu)", "7-14 gün"],
                    r6: ["Aşama 6", "ROS 2 entegrasyonu (düğümler, konular, test boru hattı)", "14-21 gün"],
                    r7: ["Aşama 7", "LiDAR SLAM/haritalama (2B bir harita oluşturma ve kaydetme)", "14-28 gün"],
                    r8: ["Aşama 8", "Navigasyon + engellerden kaçınma (Nav2 ayarı, hedefe gitme)", "21-42 gün"],
                    r9: ["Aşama 9", "RL hareket optimizasyonu (sim eğitimi → aşamalı gerçek transfer)", "28-56 gün"]
                },
                footer: "Yakında daha fazla güncelleme eklenecek."
            },
            projects: {
                title: "İnovasyonlar",
                view: "PROJEYİ GÖR",
                status: "Yapım Aşamasında",
                desc: "Spot Micro, hareket, kontrol ve simülasyondan gerçeğe deneyler için dört ayaklı robotik platformumuzdur. Mekanik tasarımı, dijital ikizi ve güçlü bir test hattını oluşturuyoruz.",
                focus_lbl: "Odak:",
                focus_val: "RL • Simülasyon • Kontrol",
                stack_lbl: "Teknoloji:",
                stack_val: "ROS • Isaac Sim / Gazebo",
                footer: "Daha fazla proje yakında eklenecek."
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

        // Handle table rows stored as arrays: data-i18n-row="spotmicro.table_dim.r1" => ["col1","col2","col3"]
        document.querySelectorAll('[data-i18n-row]').forEach(tr => {
            const key = tr.getAttribute('data-i18n-row');
            const keys = key.split('.');
            let value = i18n[lang];
            for (const k of keys) {
                if (value) value = value[k];
            }
            if (Array.isArray(value)) {
                const cells = tr.querySelectorAll('td');
                value.forEach((text, idx) => {
                    if (cells[idx]) cells[idx].textContent = text;
                });
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

    // --- Mobile Rail Scroll Highlighting ---
    const railLinks = document.querySelectorAll('.rail-text');
    const sections = document.querySelectorAll('section');

    const railObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth <= 768) {
                const id = entry.target.getAttribute('id');
                railLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => railObserver.observe(section));
});
