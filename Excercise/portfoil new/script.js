// ============================================================
//  BDEX GROUP — PORTFOLIO JAVASCRIPT  v2.0
//  Loading Screen · Custom Cursor · Particles · Admin Sync
// ============================================================
'use strict';

const CONFIG = {
    API_BASE_URL:         'http://localhost:8080/api',
    TYPING_SPEED:         90,
    TYPING_DELAY:         2200,
    ANIMATION_THRESHOLD:  0.18,
    STORAGE_KEY:          'portfolioData',
    PARTICLE_COUNT:       55,
    PARTICLE_SPEED:       0.35,
};

// ── Utility helpers ─────────────────────────────────────────
const utils = {
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
    debounce(fn, ms) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    },
    throttle(fn, limit) {
        let busy = false;
        return (...args) => {
            if (busy) return;
            fn(...args);
            busy = true;
            setTimeout(() => busy = false, limit);
        };
    },
    smoothScrollTo(el) {
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
    },
    // Load portfolio data saved by the admin panel
    loadPortfolioData() {
        try {
            const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch { return null; }
    },
};

// ── Loading Screen ──────────────────────────────────────────
class LoadingScreen {
    constructor() {
        this.el = document.getElementById('loadingScreen');
        if (!this.el) return;
        // Hide after 1.6 s (just after loader bar animation ends)
        setTimeout(() => this.hide(), 1600);
    }
    hide() {
        this.el.classList.add('hidden');
    }
}

// ── Custom Cursor ───────────────────────────────────────────
class CustomCursor {
    constructor() {
        this.ring = document.querySelector('.cursor-ring');
        this.dot  = document.querySelector('.cursor-dot');
        if (!this.ring || !this.dot) return;
        // Skip on touch devices
        if (window.matchMedia('(hover: none)').matches) return;

        this.rx = 0; this.ry = 0; // ring position
        this.dx = 0; this.dy = 0; // dot position
        this.init();
    }
    init() {
        document.addEventListener('mousemove', e => {
            this.dx = e.clientX;
            this.dy = e.clientY;
            // Dot follows instantly
            this.dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        });

        // Ring lags slightly for elegance
        const animateRing = () => {
            this.rx += (this.dx - this.rx) * 0.12;
            this.ry += (this.dy - this.ry) * 0.12;
            this.ring.style.transform = `translate(calc(${this.rx}px - 50%), calc(${this.ry}px - 50%))`;
            requestAnimationFrame(animateRing);
        };
        requestAnimationFrame(animateRing);

        // Expand ring on interactive elements
        const hoverTargets = 'a, button, .project-card, .skill-category, input, textarea, .btn';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => this.ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => this.ring.classList.remove('hovering'));
        });

        document.addEventListener('mouseleave', () => {
            this.ring.style.opacity = '0';
            this.dot.style.opacity  = '0';
        });
        document.addEventListener('mouseenter', () => {
            this.ring.style.opacity = '';
            this.dot.style.opacity  = '';
        });
    }
}

// ── Particle System ─────────────────────────────────────────
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas || utils.prefersReducedMotion()) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', utils.debounce(() => this.resize(), 200));
    }
    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            this.particles.push({
                x:   Math.random() * this.canvas.width,
                y:   Math.random() * this.canvas.height,
                r:   Math.random() * 1.4 + 0.4,
                vx:  (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
                vy:  (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
                a:   Math.random() * 0.5 + 0.15,
            });
        }
    }
    animate() {
        const { ctx, canvas, particles } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${(1 - dist / 120) * 0.07})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        // Draw and move particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${p.a})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ── Mobile Menu ──────────────────────────────────────────────
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu   = document.querySelector('.links');
        this.links  = document.querySelectorAll('.links nav a');
        this.init();
    }
    init() {
        if (!this.toggle || !this.menu) return;
        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.links.forEach(l => l.addEventListener('click', () => this.closeMenu()));
        document.addEventListener('click', e => {
            if (!this.toggle.contains(e.target) && !this.menu.contains(e.target)) this.closeMenu();
        });
    }
    toggleMenu() {
        const open = this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active', open);
        this.toggle.setAttribute('aria-expanded', open);
    }
    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        this.toggle.setAttribute('aria-expanded', 'false');
    }
}

// ── Header Scroll ────────────────────────────────────────────
class HeaderScroll {
    constructor() {
        this.header = document.getElementById('header');
        this.init();
    }
    init() {
        if (!this.header) return;
        window.addEventListener('scroll', utils.throttle(() => {
            this.header.classList.toggle('scrolled', window.scrollY > 50);
        }, 100));
    }
}

// ── Active Navigation ────────────────────────────────────────
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.links    = document.querySelectorAll('.links nav a');
        this.init();
    }
    init() {
        if (!this.sections.length || !this.links.length) return;
        window.addEventListener('scroll', utils.throttle(() => this.update(), 100));
    }
    update() {
        const pos = window.scrollY + 120;
        this.sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                this.links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${sec.id}`);
                });
            }
        });
    }
}

// ── Typing Effect ─────────────────────────────────────────────
class TypingEffect {
    constructor(el, texts, speed = 90, delay = 2200) {
        this.el = el;
        this.texts = texts;
        this.speed = speed;
        this.delay = delay;
        this.idx = 0;
        this.char = 0;
        this.deleting = false;
        if (!el) return;
        if (utils.prefersReducedMotion()) { el.textContent = texts[0]; return; }
        this.type();
    }
    type() {
        const cur = this.texts[this.idx];
        if (this.deleting) {
            this.el.textContent = cur.substring(0, --this.char);
        } else {
            this.el.textContent = cur.substring(0, ++this.char);
        }
        let speed = this.deleting ? this.speed / 2 : this.speed;
        if (!this.deleting && this.char === cur.length) {
            speed = this.delay;
            this.deleting = true;
        } else if (this.deleting && this.char === 0) {
            this.deleting = false;
            this.idx = (this.idx + 1) % this.texts.length;
            speed = 500;
        }
        setTimeout(() => this.type(), speed);
    }
}

// ── Scroll Reveal ─────────────────────────────────────────────
class ScrollReveal {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.init();
    }
    init() {
        if (utils.prefersReducedMotion()) {
            this.sections.forEach(s => s.classList.add('visible'));
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: CONFIG.ANIMATION_THRESHOLD, rootMargin: '0px 0px -60px 0px' });
        this.sections.forEach(s => observer.observe(s));
    }
}

// ── Stat Counter ──────────────────────────────────────────────
class StatCounter {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number[data-target]');
        this.init();
    }
    init() {
        if (!this.counters.length) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    this.animate(e.target);
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        this.counters.forEach(c => observer.observe(c));
    }
    animate(el) {
        const target = +el.dataset.target;
        const duration = 1800;
        const step = 16;
        const steps = duration / step;
        const inc = target / steps;
        let cur = 0;
        const timer = setInterval(() => {
            cur = Math.min(cur + inc, target);
            el.textContent = Math.round(cur);
            if (cur >= target) clearInterval(timer);
        }, step);
    }
}

// ── Skill Bars ────────────────────────────────────────────────
class SkillBars {
    constructor() {
        this.items = document.querySelectorAll('.skill-item');
        this.bars  = document.querySelectorAll('.skill-progress[data-width]');
        this.init();
    }
    init() {
        if (!this.bars.length) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const section = e.target;
                section.querySelectorAll('.skill-item').forEach((item, i) => {
                    setTimeout(() => item.classList.add('animate'), i * 80);
                });
                section.querySelectorAll('.skill-progress[data-width]').forEach((bar, i) => {
                    setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 80 + 200);
                });
                observer.unobserve(section);
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('.skill-category').forEach(c => observer.observe(c));
    }
}

// ── Contact Form ──────────────────────────────────────────────
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        this.form.querySelectorAll('input, textarea').forEach(inp => {
            inp.addEventListener('blur',  () => this.validateField(inp));
            inp.addEventListener('input', () => this.clearError(inp));
        });
    }
    validateField(field) {
        const val  = field.value.trim();
        const name = field.name;
        let msg = '';
        if (field.required && !val) msg = 'This field is required.';
        else if (name === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email address.';
        else if (name === 'name' && val && val.length < 2) msg = 'Name must be at least 2 characters.';
        else if (name === 'message' && val && val.length < 10) msg = 'Message must be at least 10 characters.';
        this.showError(field, msg || null);
        return !msg;
    }
    validateForm() {
        let valid = true;
        this.form.querySelectorAll('input, textarea').forEach(inp => {
            if (!this.validateField(inp)) valid = false;
        });
        return valid;
    }
    showError(field, msg) {
        const group = field.closest('.form-group');
        let err = group.querySelector('.form-error');
        if (!err) { err = document.createElement('div'); err.className = 'form-error'; group.appendChild(err); }
        if (msg) { field.classList.add('error'); err.textContent = msg; err.classList.add('show'); }
        else     { field.classList.remove('error'); err.classList.remove('show'); }
    }
    clearError(field) {
        field.classList.remove('error');
        const err = field.closest('.form-group')?.querySelector('.form-error');
        if (err) err.classList.remove('show');
    }
    showSuccess(msg) {
        const el = document.getElementById('formSuccess');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        setTimeout(() => el.classList.remove('show'), 5000);
    }
    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) return;
        const btn = this.form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('span') || btn;
        const original = btnText.textContent;
        btn.disabled = true;
        btnText.textContent = 'Sending…';

        const data = Object.fromEntries(new FormData(this.form));

        try {
            const res = await fetch(`${CONFIG.API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Network error');
            this.showSuccess('✓ Message sent successfully! We\'ll get back to you soon.');
            this.form.reset();
        } catch {
            // Save locally as fallback
            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push({ ...data, date: new Date().toISOString() });
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            this.showSuccess('✓ Message saved! We\'ll get back to you soon.');
            this.form.reset();
        } finally {
            btn.disabled = false;
            btnText.textContent = original;
        }
    }
}

// ── Smooth Scroll ─────────────────────────────────────────────
class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (!href || href === '#') return;
                e.preventDefault();
                utils.smoothScrollTo(document.querySelector(href));
            });
        });
    }
}

// ── Admin Data Sync ───────────────────────────────────────────
// Reads data saved by admin.html → localStorage and populates the portfolio
class AdminDataSync {
    constructor() {
        this.data = utils.loadPortfolioData();
        if (this.data) this.apply();
    }
    apply() {
        const d = this.data;
        this.set('heroNameDisplay',    d.hero?.name);
        this.set('heroMottoDisplay',   d.hero?.motto);
        this.set('heroDescDisplay',    d.hero?.description);
        this.set('aboutIntroDisplay',  d.about?.intro);
        this.set('aboutBodyDisplay',   d.about?.body);
        this.set('contactDescDisplay', d.contact?.description);
        this.setLink('contactEmailDisplay', `mailto:${d.contact?.email}`, d.contact?.email);
        this.setLink('contactPhoneDisplay', `tel:${d.contact?.phone}`,  d.contact?.phone);
        this.setText('contactLocationDisplay', d.contact?.location);

        // Social links
        ['GitHub', 'LinkedIn', 'Twitter', 'Dribbble'].forEach(name => {
            const url = d.contact?.social?.[name.toLowerCase()];
            const el  = document.getElementById(`social${name}Display`);
            if (el && url) el.href = url;
        });

        // Stats
        this.setData('statProjects', d.about?.stats?.projects);
        this.setData('statYears',    d.about?.stats?.years);
        this.setData('statClients',  d.about?.stats?.clients);

        // Typing roles
        if (d.hero?.roles) {
            const roles = d.hero.roles.split(',').map(r => r.trim()).filter(Boolean);
            if (roles.length) window._heroRoles = roles;
        }
    }
    set(id, val) {
        const el = document.getElementById(id);
        if (el && val) el.textContent = val;
    }
    setText(id, val) { this.set(id, val); }
    setLink(id, href, text) {
        const el = document.getElementById(id);
        if (el && text) { el.href = href; el.textContent = text; }
    }
    setData(id, val) {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== '') {
            el.dataset.target = val;
            el.textContent = '0';
        }
    }
}

// ── App Bootstrap ─────────────────────────────────────────────
class App {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.boot());
        } else {
            this.boot();
        }
    }
    boot() {
        // Sync admin data first (before typing effect picks up roles)
        new AdminDataSync();

        // UI modules
        new LoadingScreen();
        new CustomCursor();
        if (!utils.prefersReducedMotion()) new ParticleSystem();
        new MobileMenu();
        new HeaderScroll();
        new ActiveNavigation();
        new ScrollReveal();
        new StatCounter();
        new SkillBars();
        new ContactForm();
        new SmoothScroll();

        // Typing effect
        const typingEl = document.querySelector('.typing-text');
        if (typingEl) {
            const roles = window._heroRoles || [
                'Full Stack Developer',
                'UI/UX Enthusiast',
                'Problem Solver',
                'Tech Explorer',
            ];
            new TypingEffect(typingEl, roles, CONFIG.TYPING_SPEED, CONFIG.TYPING_DELAY);
        }

        console.log('%c✦ BDex Group Portfolio v2.0', 'color:#d4af37;font-weight:700;font-size:14px;');
    }
}

// ── Start ─────────────────────────────────────────────────────
new App();
