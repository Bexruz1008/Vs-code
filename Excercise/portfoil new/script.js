// ============================================================
// BDEX GROUP PORTFOLIO JAVASCRIPT
// Modern interactions, data sync, and UI behaviors
// ============================================================
'use strict';

const CONFIG = {
    STORAGE_KEY: 'portfolioData',
    TYPING_SPEED: 90,
    TYPING_DELAY: 2200,
    ANIMATION_THRESHOLD: 0.18,
    PARTICLE_COUNT: 48,
    PARTICLE_SPEED: 0.35,
};

const DEFAULT_DATA = {
    hero: {
        name: 'Bexruz',
        motto: 'Build. Develop. Explore.',
        roles: ['Full Stack Developer', 'Product Engineer', 'UI Systems Builder', 'Problem Solver'],
        description: 'Crafting high performance digital products with rigorous engineering, human centered design, and a taste for bold ideas.'
    },
    about: {
        intro: 'We are a senior focused studio turning ambitious ideas into reliable digital products.',
        body: 'Our work blends strategy, design, and engineering to ship experiences that look sharp and perform even sharper. We love complex problems, fast iterations, and clean systems.',
        extra: 'When we are not shipping, we are exploring new stacks, open sourcing tools, and mentoring the next generation of builders.',
        stats: {
            projects: 50,
            years: 5,
            clients: 30
        }
    },
    skills: [
        {
            category: 'Frontend',
            items: [
                { name: 'React', percent: 90 },
                { name: 'TypeScript', percent: 85 },
                { name: 'Design Systems', percent: 88 },
                { name: 'CSS Architecture', percent: 92 }
            ]
        },
        {
            category: 'Backend',
            items: [
                { name: 'Node.js', percent: 86 },
                { name: 'Python', percent: 82 },
                { name: 'PostgreSQL', percent: 80 },
                { name: 'API Design', percent: 88 }
            ]
        },
        {
            category: 'Tooling',
            tags: ['Git', 'Docker', 'CI/CD', 'Cloud Deploy', 'Figma', 'Testing', 'Analytics', 'Performance']
        }
    ],
    projects: [
        {
            title: 'E-Commerce Platform',
            description: 'A scalable commerce platform with headless architecture, intelligent search, and a fast checkout flow.',
            tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
            viewUrl: '',
            codeUrl: '',
            featured: true
        },
        {
            title: 'Analytics Command Center',
            description: 'A data rich dashboard with real time insights, configurable reports, and fine grained access control.',
            tech: ['Next.js', 'D3.js', 'Python', 'FastAPI'],
            viewUrl: '',
            codeUrl: '',
            featured: true
        },
        {
            title: 'Team Workflow Suite',
            description: 'Collaborative task management with real time updates, automation rules, and integrated knowledge base.',
            tech: ['Vue', 'Node.js', 'PostgreSQL', 'Redis'],
            viewUrl: '',
            codeUrl: '',
            featured: false
        }
    ],
    contact: {
        email: 'hello@bdexgroup.com',
        phone: '+998 90 123 45 67',
        location: 'Tashkent, Uzbekistan',
        description: 'We are ready to talk through your next project, audit an existing product, or co build a new idea.',
        social: {
            github: '',
            linkedin: '',
            twitter: '',
            dribbble: ''
        }
    },
    messages: []
};

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
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
    },
    deepMerge(base, override) {
        if (Array.isArray(base)) return Array.isArray(override) ? override : base;
        if (typeof base !== 'object' || base === null) return override ?? base;
        const output = { ...base };
        Object.keys(override || {}).forEach(key => {
            const baseVal = base[key];
            const overrideVal = override[key];
            output[key] = utils.deepMerge(baseVal, overrideVal);
        });
        return output;
    },
    hexToRgb(hex) {
        if (!hex) return null;
        const clean = hex.replace('#', '').trim();
        if (![3, 6].includes(clean.length)) return null;
        const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
        const num = parseInt(full, 16);
        if (Number.isNaN(num)) return null;
        return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
};

function normalizeData(data) {
    let merged = utils.deepMerge(DEFAULT_DATA, data || {});

    if (merged.about) {
        if (!merged.about.body && merged.about.text1) merged.about.body = merged.about.text1;
        if (!merged.about.extra && merged.about.text2) merged.about.extra = merged.about.text2;
        delete merged.about.text1;
        delete merged.about.text2;
    }

    if (merged.hero && typeof merged.hero.roles === 'string') {
        merged.hero.roles = merged.hero.roles.split(',').map(r => r.trim()).filter(Boolean);
    }

    if (!Array.isArray(merged.skills)) merged.skills = DEFAULT_DATA.skills;
    if (!Array.isArray(merged.projects)) merged.projects = DEFAULT_DATA.projects;
    if (!merged.contact) merged.contact = DEFAULT_DATA.contact;
    if (!merged.contact.social) merged.contact.social = DEFAULT_DATA.contact.social;
    if (!Array.isArray(merged.messages)) merged.messages = [];

    return merged;
}

function getPortfolioData() {
    try {
        const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        return normalizeData(parsed);
    } catch {
        return normalizeData(null);
    }
}

function savePortfolioData(data) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) el.textContent = value;
}

function setLink(id, href, text) {
    const el = document.getElementById(id);
    if (el && text) {
        el.href = href;
        el.textContent = text;
    }
}

function setDataTarget(id, value) {
    const el = document.getElementById(id);
    if (el && value !== undefined && value !== null) {
        el.dataset.target = value;
        el.textContent = '0';
    }
}

function updateSocialLinks(social) {
    document.querySelectorAll('[data-social]').forEach(el => {
        const key = el.dataset.social;
        const url = social && social[key] ? social[key] : '';
        if (url) {
            el.href = url;
            el.classList.remove('is-disabled');
        } else {
            el.removeAttribute('href');
            el.classList.add('is-disabled');
        }
    });
}

function renderSkills(skills) {
    const container = document.getElementById('skillsGrid');
    if (!container) return;

    container.innerHTML = '';
    skills.forEach(category => {
        const card = document.createElement('div');
        card.className = 'skill-category';

        const title = document.createElement('h3');
        title.textContent = category.category || 'Skills';
        card.appendChild(title);

        if (Array.isArray(category.items)) {
            category.items.forEach(item => {
                const wrap = document.createElement('div');
                wrap.className = 'skill-item';

                const name = document.createElement('div');
                name.className = 'skill-name';
                const left = document.createElement('span');
                left.textContent = item.name || 'Skill';
                const right = document.createElement('span');
                right.textContent = `${item.percent || 0}%`;
                name.appendChild(left);
                name.appendChild(right);

                const bar = document.createElement('div');
                bar.className = 'skill-bar';
                const progress = document.createElement('div');
                progress.className = 'skill-progress';
                progress.dataset.width = item.percent || 0;
                bar.appendChild(progress);

                wrap.appendChild(name);
                wrap.appendChild(bar);
                card.appendChild(wrap);
            });
        }

        if (Array.isArray(category.tags)) {
            const tagsWrap = document.createElement('div');
            tagsWrap.className = 'skill-tags';
            category.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'skill-tag';
                tagEl.textContent = tag;
                tagsWrap.appendChild(tagEl);
            });
            card.appendChild(tagsWrap);
        }

        container.appendChild(card);
    });
}

function renderProjects(projects) {
    const container = document.getElementById('projectsGrid');
    if (!container) return;

    container.innerHTML = '';
    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = `project-card${project.featured ? ' featured' : ''}`;

        const title = document.createElement('h3');
        title.className = 'project-title';
        title.textContent = project.title || 'Project';

        const desc = document.createElement('p');
        desc.textContent = project.description || '';

        const tech = document.createElement('div');
        tech.className = 'project-tech';
        const techList = Array.isArray(project.tech)
            ? project.tech
            : (project.tech ? String(project.tech).split(',').map(t => t.trim()).filter(Boolean) : []);
        techList.forEach(t => {
            const tag = document.createElement('span');
            tag.textContent = t;
            tech.appendChild(tag);
        });

        const links = document.createElement('div');
        links.className = 'project-links';
        if (project.viewUrl) {
            const live = document.createElement('a');
            live.href = project.viewUrl;
            live.target = '_blank';
            live.rel = 'noopener';
            live.textContent = 'Live';
            links.appendChild(live);
        }
        if (project.codeUrl) {
            const code = document.createElement('a');
            code.href = project.codeUrl;
            code.target = '_blank';
            code.rel = 'noopener';
            code.textContent = 'Code';
            links.appendChild(code);
        }

        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(tech);
        if (links.children.length) card.appendChild(links);

        container.appendChild(card);
    });
}

function applyPortfolioData(data) {
    setText('heroNameDisplay', data.hero.name);
    setText('heroMottoDisplay', data.hero.motto);
    setText('heroDescDisplay', data.hero.description);
    setText('aboutIntroDisplay', data.about.intro);
    setText('aboutBodyDisplay', data.about.body);
    setText('aboutExtraDisplay', data.about.extra);
    setText('contactDescDisplay', data.contact.description);

    setLink('contactEmailDisplay', `mailto:${data.contact.email}`, data.contact.email);
    setLink('contactPhoneDisplay', `tel:${data.contact.phone}`, data.contact.phone);
    setText('contactLocationDisplay', data.contact.location);

    setDataTarget('statProjects', data.about.stats.projects);
    setDataTarget('statYears', data.about.stats.years);
    setDataTarget('statClients', data.about.stats.clients);

    updateSocialLinks(data.contact.social);

    renderSkills(data.skills);
    renderProjects(data.projects);

    if (Array.isArray(data.hero.roles) && data.hero.roles.length) {
        window._heroRoles = data.hero.roles;
    }
}

class LoadingScreen {
    constructor() {
        this.el = document.getElementById('loadingScreen');
        if (!this.el) return;
        setTimeout(() => this.hide(), 1400);
    }
    hide() {
        this.el.classList.add('hidden');
    }
}

class CustomCursor {
    constructor() {
        this.ring = document.querySelector('.cursor-ring');
        this.dot = document.querySelector('.cursor-dot');
        if (!this.ring || !this.dot) return;
        if (window.matchMedia('(hover: none)').matches || utils.prefersReducedMotion()) return;

        this.rx = 0; this.ry = 0;
        this.dx = 0; this.dy = 0;
        this.scale = 1;
        this.init();
    }
    init() {
        document.addEventListener('mousemove', e => {
            this.dx = e.clientX;
            this.dy = e.clientY;
            this.dot.style.opacity = '1';
            this.ring.style.opacity = '1';
            this.dot.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
        });

        const hoverTargets = 'a, button, .project-card, .skill-category, input, textarea, .btn';
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.scale = 1.6;
                this.ring.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                this.scale = 1;
                this.ring.classList.remove('hovering');
            });
        });

        const animateRing = () => {
            this.rx += (this.dx - this.rx) * 0.12;
            this.ry += (this.dy - this.ry) * 0.12;
            this.ring.style.transform = `translate(calc(${this.rx}px - 50%), calc(${this.ry}px - 50%)) scale(${this.scale})`;
            requestAnimationFrame(animateRing);
        };
        requestAnimationFrame(animateRing);

        document.addEventListener('mouseleave', () => {
            this.ring.style.opacity = '0';
            this.dot.style.opacity = '0';
        });
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas || utils.prefersReducedMotion()) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b88a2b';
        const rgb = utils.hexToRgb(this.color);
        this.rgb = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '184, 138, 43';
        this.resize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', utils.debounce(() => this.resize(), 200));
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                r: Math.random() * 1.6 + 0.4,
                vx: (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
                vy: (Math.random() - 0.5) * CONFIG.PARTICLE_SPEED,
                a: Math.random() * 0.5 + 0.15,
            });
        }
    }
    animate() {
        const { ctx, canvas, particles } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${this.rgb}, ${(1 - dist / 130) * 0.08})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.rgb}, ${p.a})`;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        requestAnimationFrame(() => this.animate());
    }
}

class MagneticButtons {
    constructor() {
        this.items = document.querySelectorAll('.magnetic');
        if (!this.items.length || utils.prefersReducedMotion()) return;
        this.items.forEach(item => this.bind(item));
    }
    bind(item) {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0, 0)';
        });
    }
}

class TiltCards {
    constructor() {
        this.items = document.querySelectorAll('[data-tilt]');
        if (!this.items.length || utils.prefersReducedMotion()) return;
        this.items.forEach(item => this.bind(item));
    }
    bind(item) {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateX = (y * -10).toFixed(2);
            const rotateY = (x * 10).toFixed(2);
            item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    }
}

class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.links');
        this.links = document.querySelectorAll('.links nav a');
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

class HeaderScroll {
    constructor() {
        this.header = document.getElementById('header');
        this.init();
    }
    init() {
        if (!this.header) return;
        window.addEventListener('scroll', utils.throttle(() => {
            this.header.classList.toggle('scrolled', window.scrollY > 40);
        }, 100));
    }
}

class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.links = document.querySelectorAll('.links nav a');
        this.init();
    }
    init() {
        if (!this.sections.length || !this.links.length) return;
        window.addEventListener('scroll', utils.throttle(() => this.update(), 120));
    }
    update() {
        const pos = window.scrollY + 140;
        this.sections.forEach(sec => {
            if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
                this.links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${sec.id}`);
                });
            }
        });
    }
}

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
        const duration = 1600;
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

class SkillBars {
    constructor() {
        this.items = document.querySelectorAll('.skill-item');
        this.bars = document.querySelectorAll('.skill-progress[data-width]');
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

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        this.form.querySelectorAll('input, textarea').forEach(inp => {
            inp.addEventListener('blur', () => this.validateField(inp));
            inp.addEventListener('input', () => this.clearError(inp));
        });
    }
    validateField(field) {
        const val = field.value.trim();
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
        else { field.classList.remove('error'); err.classList.remove('show'); }
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
    saveMessage(data) {
        const saved = getPortfolioData();
        saved.messages = saved.messages || [];
        saved.messages.push({ ...data, date: new Date().toISOString() });
        savePortfolioData(saved);
    }
    async handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm()) return;
        const btn = this.form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('span') || btn;
        const original = btnText.textContent;
        btn.disabled = true;
        btnText.textContent = 'Sending...';

        const data = Object.fromEntries(new FormData(this.form));

        try {
            this.saveMessage(data);
            this.showSuccess('Message saved. We will get back to you soon.');
            this.form.reset();
        } catch {
            this.showSuccess('Message saved locally. We will get back to you soon.');
            this.form.reset();
        } finally {
            btn.disabled = false;
            btnText.textContent = original;
        }
    }
}

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

class App {
    constructor() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.boot());
        } else {
            this.boot();
        }
    }
    boot() {
        document.body.classList.remove('no-js');
        const data = getPortfolioData();
        applyPortfolioData(data);

        new LoadingScreen();
        new CustomCursor();
        new ParticleSystem();
        new MagneticButtons();
        new TiltCards();
        new MobileMenu();
        new HeaderScroll();
        new ActiveNavigation();
        new ScrollReveal();
        new StatCounter();
        new SkillBars();
        new ContactForm();
        new SmoothScroll();

        const typingEl = document.querySelector('.typing-text');
        if (typingEl) {
            const roles = window._heroRoles || DEFAULT_DATA.hero.roles;
            new TypingEffect(typingEl, roles, CONFIG.TYPING_SPEED, CONFIG.TYPING_DELAY);
        }
    }
}

new App();
