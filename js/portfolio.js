/* ========================================
   PORTFOLIO.JS — Interactions: modals, nav, form
   ======================================== */

let contactDb = null;
function getContactDb() {
    try {
        if (!contactDb && window.firebase && firebase.firestore) {
            contactDb = firebase.firestore();
        }
    } catch (e) {
        // ignore if Firebase isn't available
    }
    return contactDb;
}

const PROJECTS = [
    {
        id: 1,
        icon: '🍕',
        title: 'Food Delivery System',
        desc: 'A smart food delivery platform using Python and MySQL to manage orders, users, and restaurant data efficiently.',
        tech: ['Python', 'MySQL', 'Pandas', 'Matplotlib', 'pyttsx3', 'Speech Recognition'],
        bullets: [
            'Developed a smart food delivery system using Python and MySQL to manage orders, users, and restaurant data efficiently.',
            'Implemented data analysis and visualization using Pandas and Matplotlib to track sales and order trends.',
            'Integrated speech recognition and text-to-speech features to enhance user interaction and accessibility.'
        ]
    },
    {
        id: 2,
        icon: '🎵',
        title: 'Lyrics Animation System',
        desc: 'An interactive lyrics animation system built with Python and Pygame, featuring typewriter effects, neon glow text, and smooth transitions.',
        tech: ['Python', 'Pygame'],
        bullets: [
            'Developed an interactive lyrics animation system using Python and Pygame with typewriter effects, neon glow text, particle animations, and smooth transitions synced with time-based logic.'
        ]
    },
    {
        id: 3,
        icon: '💰',
        title: 'Expense Manager',
        desc: 'A web-based expense tracking application built with Streamlit. Categorizes, tracks, and visualizes daily expenses.',
        tech: ['Python', 'Streamlit'],
        bullets: [
            'Developed a web-based expense management application using Streamlit to track, categorize, and visualize daily expenses with an interactive user interface.',
            'Designed and developed a responsive Motorola product showcase website using HTML, CSS, and JavaScript with smooth navigation and dynamic elements.'
        ]
    },
    {
        id: 4,
        icon: '🗺️',
        title: 'Interactive Tourism Website',
        desc: 'A responsive tourism website featuring a real 3D interactive map using Three.js, Firebase auth, and dynamic animations.',
        tech: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'Firebase'],
        bullets: [
            'Developed a responsive tourism website featuring a real 3D interactive map using Three.js.',
            'Implemented dynamic animations, user authentication, and database-driven content with Firebase to enhance user experience and engagement.'
        ]
    }
];

const CERTIFICATIONS = [
    {
        id: 1,
        name: 'CodePunk v1.0',
        org: 'GLA University',
        color1: '#00c8ff',
        color2: '#0077b6'
    },
    {
        id: 2,
        name: 'GeekVerse V.1',
        org: 'GLA University',
        color1: '#8b5cf6',
        color2: '#5b21b6'
    },
    {
        id: 3,
        name: 'Introduction to Azure Static Web Apps',
        org: 'M.S.L.A.',
        color1: '#0ea5e9',
        color2: '#3b82f6'
    },
    {
        id: 4,
        name: 'SQL Bootcamp',
        org: 'Lets Upgrade',
        color1: '#f59e0b',
        color2: '#d97706'
    }
];

/* ─── Render Projects ─────────────────────── */
function renderProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    grid.innerHTML = PROJECTS.map(p => `
    <div class="project-card" onclick="openProjectModal(${p.id})">
      <div class="project-icon">${p.icon}</div>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-desc">${p.desc}</p>
      <div class="project-tech-stack">
        ${p.tech.map(t => `<span class="tech-pill">${t}</span>`).join('')}
      </div>
      <span class="project-link">View Details <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
    </div>
  `).join('');
}

/* ─── Render Certifications ───────────────── */
function renderCertifications() {
    const grid = document.getElementById('cert-grid');
    if (!grid) return;

    grid.innerHTML = CERTIFICATIONS.map(c => `
    <div class="cert-card" onclick="openCertModal(${c.id})">
      <div class="cert-thumb">
        <canvas id="cert-canvas-${c.id}" width="400" height="225"></canvas>
        <div class="cert-thumb-overlay"></div>
        <div class="cert-thumb-view">👁️</div>
      </div>
      <div class="cert-info">
        <h4 class="cert-name">${c.name}</h4>
        <p class="cert-org">${c.org}</p>
      </div>
    </div>
  `).join('');

    // Draw certificate thumbnails on canvas
    CERTIFICATIONS.forEach(c => {
        drawCertCanvas(`cert-canvas-${c.id}`, c, false);
    });
}

/* ─── Draw Certificate Canvas ─────────────── */
function drawCertCanvas(canvasId, cert, large = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0a0a18');
    grad.addColorStop(1, '#12121f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Accent gradient bar at top
    const barGrad = ctx.createLinearGradient(0, 0, w, 0);
    barGrad.addColorStop(0, cert.color1);
    barGrad.addColorStop(1, cert.color2);
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, 0, w, 4);

    // Decorative circles
    ctx.beginPath();
    ctx.arc(w - 40, 40, 60, 0, Math.PI * 2);
    ctx.fillStyle = `${cert.color1}12`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(40, h - 40, 50, 0, Math.PI * 2);
    ctx.fillStyle = `${cert.color2}10`;
    ctx.fill();

    // Border
    ctx.strokeStyle = `${cert.color1}30`;
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, w - 16, h - 16);

    // Title
    ctx.save();
    const titleSize = large ? 28 : 16;
    ctx.font = `700 ${titleSize}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = '#f0f0f5';
    ctx.textAlign = 'left';

    // Word wrap for title
    const words = cert.name.split(' ');
    const maxW = w - 32;
    let line = '';
    let y = h / 2 - (large ? 20 : 10);
    words.forEach(word => {
        const test = line + word + ' ';
        const metrics = ctx.measureText(test);
        if (metrics.width > maxW && line !== '') {
            ctx.fillText(line.trim(), 16, y);
            line = word + ' ';
            y += titleSize + 4;
        } else {
            line = test;
        }
    });
    ctx.fillText(line.trim(), 16, y);
    ctx.restore();

    // Org name
    const orgSize = large ? 16 : 11;
    ctx.font = `500 ${orgSize}px "Inter", sans-serif`;
    ctx.fillStyle = cert.color1;
    ctx.textAlign = 'left';
    ctx.fillText(cert.org, 16, h - 16);

    // "Certificate" watermark
    ctx.save();
    ctx.font = `300 ${large ? 13 : 9}px "Inter", sans-serif`;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'right';
    ctx.fillText('CERTIFICATE OF COMPLETION', w - 16, h - 16);
    ctx.restore();

    // Star icon
    ctx.font = large ? '32px sans-serif' : '20px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('🏆', w - 16, 36);
}

/* ─── Project Modal ───────────────────────── */
function openProjectModal(id) {
    const p = PROJECTS.find(x => x.id === id);
    if (!p) return;
    const modal = document.getElementById('project-modal');
    document.getElementById('modal-icon').textContent = p.icon;
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-desc').textContent = p.desc;

    // Render bullet points from resume
    const bulletsEl = document.getElementById('modal-bullets');
    if (bulletsEl && p.bullets && p.bullets.length) {
        bulletsEl.innerHTML = p.bullets.map(b => `
            <li style="display:flex;gap:10px;align-items:flex-start;color:rgba(255,255,255,0.62);font-size:0.88rem;line-height:1.7;">
                <span style="color:#00c8ff;margin-top:3px;flex-shrink:0;">◆</span>
                <span>${b}</span>
            </li>`).join('');
    }

    document.getElementById('modal-tech').innerHTML =
        p.tech.map(t => `<span class="tech-pill">${t}</span>`).join('');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    document.getElementById('project-modal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ─── Cert Modal ──────────────────────────── */
function openCertModal(id) {
    const c = CERTIFICATIONS.find(x => x.id === id);
    if (!c) return;
    const modal = document.getElementById('cert-modal');
    document.getElementById('cert-modal-name').textContent = c.name;
    document.getElementById('cert-modal-org').textContent = c.org;

    // Draw large canvas
    const canvas = document.getElementById('cert-modal-canvas');
    canvas.width = 600;
    canvas.height = 337;
    drawCertCanvas('cert-modal-canvas', c, true);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    document.getElementById('cert-modal').classList.remove('active');
    document.body.style.overflow = '';
}

/* ─── Mobile Nav ─────────────────────────── */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => links.classList.remove('open'));
    });
}

/* ─── Smooth Active Nav ──────────────────── */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => obs.observe(s));
}

/* ─── Contact Form ───────────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = form.querySelector('.form-submit');
        const originalText = btn.textContent;
        const originalBg = btn.style.background;

        const name = document.getElementById('cf-name').value.trim();
        const email = document.getElementById('cf-email').value.trim();
        const subject = document.getElementById('cf-subject').value.trim();
        const message = document.getElementById('cf-message').value.trim();

        if (!name || !email || !message) {
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Sending...';
        btn.style.background = 'linear-gradient(135deg, #0ea5e9, #6366f1)';

        const payload = { name, email, subject, message };

        const saveToFirebase = async () => {
            const db = getContactDb();
            if (!db) return;
            await db.collection('contactMessages').add({
                ...payload,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        };

        const sendEmail = async () => {
            try {
                await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                // Network errors: fail silently for email, Firebase still logs
            }
        };

        try {
            await Promise.all([saveToFirebase(), sendEmail()]);

            btn.textContent = 'Message Sent! ✓';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            form.reset();
        } catch (err) {
            btn.textContent = 'Error — try again';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
        } finally {
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = originalBg;
                btn.disabled = false;
            }, 3500);
        }
    });
}

/* ─── Click outside modal to close ─────── */
function initModalClose() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                m.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

/* ─── Init all ───────────────────────────── */
function initPortfolio() {
    renderProjects();
    renderCertifications();
    initMobileNav();
    initActiveNav();
    initContactForm();
    initModalClose();
}

// Expose globals
window.initPortfolio = initPortfolio;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;
