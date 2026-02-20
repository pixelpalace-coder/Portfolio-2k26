/* ========================================
   ANIMATIONS.JS — Full Glitch & GSAP Suite
   ======================================== */

function initAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out' });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  CURSOR
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
        const xDot = gsap.quickTo(dot, 'x', { duration: 0.07 });
        const yDot = gsap.quickTo(dot, 'y', { duration: 0.07 });
        const xRing = gsap.quickTo(ring, 'x', { duration: 0.25 });
        const yRing = gsap.quickTo(ring, 'y', { duration: 0.25 });

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function renderCursor() {
            xDot(mouseX);
            yDot(mouseY);
            xRing(mouseX);
            yRing(mouseY);
            requestAnimationFrame(renderCursor);
        }
        requestAnimationFrame(renderCursor);

        document.querySelectorAll('a, button, .project-card, .cert-card, .skill-category-card').forEach(el => {
            el.addEventListener('mouseenter', () => gsap.to(ring, { scale: 2, borderColor: 'rgba(139,92,246,0.8)', duration: 0.3 }));
            el.addEventListener('mouseleave', () => gsap.to(ring, { scale: 1, borderColor: 'rgba(0,200,255,0.5)', duration: 0.3 }));
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  PAGE TRANSITION OVERLAY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    document.body.appendChild(overlay);
    gsap.fromTo(overlay,
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 0.7, ease: 'expo.inOut', delay: 0.1 }
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  GLITCH FLASH UTILITY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function glitchFlash(el, repeat = 3) {
        if (!el) return;
        let count = 0;
        const step = () => {
            if (count >= repeat) return;
            count++;
            gsap.timeline()
                .to(el, { x: gsap.utils.random(-4, 4), skewX: gsap.utils.random(-3, 3), filter: 'brightness(1.6) hue-rotate(60deg)', duration: 0.05 })
                .to(el, { x: gsap.utils.random(-3, 3), skewX: 0, filter: 'brightness(1)', duration: 0.05 })
                .to(el, { x: 0, duration: 0.05, onComplete: () => setTimeout(step, gsap.utils.random(80, 300)) });
        };
        step();
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  LETTER SCRAMBLE UTILITY
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    function scrambleText(el, finalText, duration = 800) {
        let frame = 0;
        const total = Math.floor(duration / 40);
        const interval = setInterval(() => {
            el.textContent = finalText.split('').map((ch, i) => {
                if (i < Math.floor((frame / total) * finalText.length)) return ch;
                return ch === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');
            frame++;
            if (frame >= total) {
                clearInterval(interval);
                el.textContent = finalText;
            }
        }, 40);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  NAVBAR — 3D tilt + scroll state
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });

        const rX = gsap.quickTo(navbar, 'rotateX', { duration: 0.5, ease: 'power2.out' });
        const rY = gsap.quickTo(navbar, 'rotateY', { duration: 0.5, ease: 'power2.out' });
        navbar.addEventListener('mousemove', e => {
            const r = navbar.getBoundingClientRect();
            rY((e.clientX - r.left - r.width / 2) / r.width * 7);
            rX(-((e.clientY - r.top - r.height / 2) / r.height * 4));
        });
        navbar.addEventListener('mouseleave', () => { rX(0); rY(0); });

        // Set data-text for CSS glitch ::before/::after on brand
        const brand = navbar.querySelector('.nav-brand');
        if (brand) brand.setAttribute('data-text', brand.textContent);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  3D CARD TILT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function initCardTilt(selector) {
        document.querySelectorAll(selector).forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                gsap.to(card, {
                    rotateX: -((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 8,
                    rotateY: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8,
                    transformPerspective: 700,
                    duration: 0.3, ease: 'power2.out', overwrite: true
                });
            });
            card.addEventListener('mouseleave', () =>
                gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out', overwrite: true })
            );
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  REVEAL HELPER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    function reveal(targets, vars, triggerEl, start = 'top 85%') {
        const els = document.querySelectorAll(targets);
        if (!els.length) return;
        gsap.set(els, { opacity: 0, y: vars.y ?? 0, x: vars.x ?? 0, scale: vars.scale ?? 1 });
        gsap.to(els, {
            opacity: 1, y: 0, x: 0, scale: 1,
            duration: vars.duration ?? 0.7,
            stagger: vars.stagger ?? 0,
            ease: vars.ease ?? 'power3.out',
            scrollTrigger: { trigger: triggerEl || els[0], start, once: true }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  SECTION DIVIDER LINES + LABEL SCRAMBLE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ['#about', '#skills', '#projects', '#experience', '#certifications', '#contact'].forEach(id => {
        const sec = document.querySelector(id);
        const label = sec?.querySelector('.section-label');
        if (!label) return;

        // Inject glowing divider line
        const line = document.createElement('div');
        line.className = 'section-divider-line';
        label.parentNode.insertBefore(line, label);

        const originalText = label.textContent.trim();

        ScrollTrigger.create({
            trigger: sec,
            start: 'top 82%',
            once: true,
            onEnter: () => {
                // 1) Divider sweeps in
                gsap.to(line, { width: '60px', duration: 0.5, ease: 'power3.out' });
                // 2) Label scrambles into place
                setTimeout(() => scrambleText(label, originalText, 700), 200);
                // 3) Section title glitch-flashes
                const title = sec.querySelector('.section-title');
                if (title) setTimeout(() => glitchFlash(title, 4), 600);
            }
        });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  HERO
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    gsap.set('.hero-eyebrow', { opacity: 0, y: 24 });
    gsap.set('.hero-title .word', { opacity: 0, y: 70 });
    gsap.set('.hero-tagline', { opacity: 0, y: 28 });
    gsap.set('.hero-actions > *', { opacity: 0, y: 20 });
    gsap.set('.hero-scroll', { opacity: 0 });

    // Apply glitch class + data-text to hero highlight words
    document.querySelectorAll('.hero-title .highlight').forEach(el => {
        el.classList.add('glitch');
        el.setAttribute('data-text', el.textContent);
    });

    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
        .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.65 })
        .to('.hero-title .word', {
            opacity: 1, y: 0, stagger: 0.08, duration: 0.75,
            ease: 'back.out(1.2)'
        }, '-=0.3')
        .add(() => {
            // glitch-flash the hero title on load
            glitchFlash(document.querySelector('.hero-title'), 5);
        }, '-=0.2')
        .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
        .to('.hero-actions > *', { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, '-=0.35')
        .to('.hero-scroll', { opacity: 0.45, duration: 0.6 }, '-=0.2');

    // Parallax glow blobs
    gsap.to('.hero-glow-1', { y: -120, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-glow-2', { y: -70, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });

    // Typing cursor on tagline
    const tagline = document.querySelector('.hero-tagline');
    if (tagline) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        tagline.appendChild(cursor);
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  ABOUT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    gsap.set('.about-image-placeholder', { opacity: 0, x: -60, rotateY: -20 });
    gsap.to('.about-image-placeholder', {
        opacity: 1, x: 0, rotateY: 0, duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 78%', once: true }
    });
    gsap.set(['.about-badge-1', '.about-badge-2'], { opacity: 0, x: 30, scale: 0.8 });
    gsap.to('.about-badge-1', { opacity: 1, x: 0, scale: 1, duration: 0.6, delay: 0.4, ease: 'back.out(1.5)', scrollTrigger: { trigger: '#about', start: 'top 72%', once: true } });
    gsap.to('.about-badge-2', { opacity: 1, x: 0, scale: 1, duration: 0.6, delay: 0.6, ease: 'back.out(1.5)', scrollTrigger: { trigger: '#about', start: 'top 72%', once: true } });

    reveal('#about .section-title, #about .about-text', { y: 35, stagger: 0.12, duration: 0.7 }, '#about', 'top 72%');

    // Animated stat counters
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const finalVal = el.textContent.replace(/\D/g, '');
        const suffix = el.textContent.replace(/[0-9]/g, '');
        if (!finalVal) return;
        gsap.set(el, { opacity: 0, y: 20 });
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.to(el, { opacity: 1, y: 0, duration: 0.5 });
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: parseInt(finalVal),
                    duration: 1.4, ease: 'power2.out',
                    onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; },
                    onComplete: () => el.classList.add('counted')
                });
            }
        });
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  SKILLS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    reveal('#skills .section-title, #skills .section-subtitle', { y: 30, stagger: 0.1 }, '#skills', 'top 80%');

    const skillCards = document.querySelectorAll('.skill-category-card');
    if (skillCards.length) {
        gsap.set(skillCards, { opacity: 0, y: 60, scale: 0.92 });
        gsap.to(skillCards, {
            opacity: 1, y: 0, scale: 1,
            stagger: { each: 0.1, from: 'start' },
            duration: 0.7,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: '.skills-categories', start: 'top 82%', once: true }
        });
    }

    // Skill tag pop-in
    const skillTags = document.querySelectorAll('.skill-tag');
    if (skillTags.length) {
        gsap.set(skillTags, { opacity: 0, scale: 0.6 });
        gsap.to(skillTags, {
            opacity: 1, scale: 1,
            stagger: 0.03,
            duration: 0.35,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: '.skills-categories', start: 'top 75%', once: true }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  PROJECTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    reveal('#projects .section-title, #projects .section-subtitle', { y: 30, stagger: 0.1 }, '#projects', 'top 80%');

    const projCards = document.querySelectorAll('.project-card');
    if (projCards.length) {
        gsap.set(projCards, { opacity: 0, y: 80, rotateX: 15 });
        gsap.to(projCards, {
            opacity: 1, y: 0, rotateX: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.projects-grid', start: 'top 82%', once: true }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  EXPERIENCE
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    reveal('#experience .section-title', { y: 30 }, '#experience', 'top 80%');

    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length) {
        gsap.set(timelineItems, { opacity: 0, x: -60 });
        gsap.to(timelineItems, {
            opacity: 1, x: 0,
            stagger: 0.2,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.timeline', start: 'top 78%', once: true }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  CERTIFICATIONS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    reveal('#certifications .section-title, #certifications .section-subtitle', { y: 30, stagger: 0.1 }, '#certifications', 'top 80%');

    const certCards = document.querySelectorAll('.cert-card');
    if (certCards.length) {
        gsap.set(certCards, { opacity: 0, y: 50, scale: 0.92 });
        gsap.to(certCards, {
            opacity: 1, y: 0, scale: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: 'back.out(1.3)',
            scrollTrigger: { trigger: '.cert-grid', start: 'top 82%', once: true }
        });
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  CONTACT
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    reveal('#contact .section-title, #contact .section-subtitle', { y: 30, stagger: 0.1 }, '#contact', 'top 80%');

    gsap.set('.contact-info > *', { opacity: 0, x: -40 });
    gsap.to('.contact-info > *', {
        opacity: 1, x: 0, stagger: 0.1, duration: 0.65,
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', once: true }
    });

    gsap.set('.contact-form', { opacity: 0, x: 50, rotateY: 5 });
    gsap.to('.contact-form', {
        opacity: 1, x: 0, rotateY: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%', once: true }
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  INIT CARD TILTS
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    initCardTilt('.skill-category-card');
    initCardTilt('.project-card');
    initCardTilt('.cert-card');

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  FOOTER
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    gsap.set('footer', { opacity: 0, y: 30 });
    gsap.to('footer', {
        opacity: 1, y: 0, duration: 0.7,
        scrollTrigger: { trigger: 'footer', start: 'top 92%', once: true }
    });

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    //  REFRESH
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    window.addEventListener('load', () => ScrollTrigger.refresh());
}

window.initAnimations = initAnimations;
