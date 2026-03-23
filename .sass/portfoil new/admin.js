// ============================================
// BDEX GROUP ADMIN PANEL JAVASCRIPT
// ============================================

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'bdex2026'
};

const adminState = {
    isLoggedIn: false,
    portfolioData: null
};

const CONFIG = {
    AUTO_SAVE_DELAY: 1000,
    SUCCESS_MESSAGE_DURATION: 2000,
    STORAGE_KEY: 'portfolioData',
    AUTH_KEY: 'adminAuth'
};

const utils = {
    getElement: (id) => document.getElementById(id),
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    showSuccessMessage: (element, message, originalText) => {
        if (!element) return;
        const originalBg = element.style.background;
        element.textContent = message;
        element.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
            element.textContent = originalText;
            element.style.background = originalBg;
        }, CONFIG.SUCCESS_MESSAGE_DURATION);
    },
    escapeHtml: (text = '') => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    },
    formatDate: (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    },
    deepMerge: (base, override) => {
        if (Array.isArray(base)) return Array.isArray(override) ? override : base;
        if (typeof base !== 'object' || base === null) return override ?? base;
        const output = { ...base };
        Object.keys(override || {}).forEach(key => {
            output[key] = utils.deepMerge(base[key], override[key]);
        });
        return output;
    }
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

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadPortfolioData();
        initializeAuth();
        initializeEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ============================================
// Authentication
// ============================================

function initializeAuth() {
    const authToken = localStorage.getItem(CONFIG.AUTH_KEY);
    adminState.isLoggedIn = authToken === 'authenticated';

    if (adminState.isLoggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    const loginScreen = utils.getElement('loginScreen');
    const dashboard = utils.getElement('dashboard');

    if (loginScreen) loginScreen.classList.remove('hidden');
    if (dashboard) dashboard.classList.add('hidden');
}

function showDashboard() {
    const loginScreen = utils.getElement('loginScreen');
    const dashboard = utils.getElement('dashboard');

    if (loginScreen) loginScreen.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');

    loadEditorData();
}

const loginForm = utils.getElement('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = utils.getElement('username')?.value || '';
        const password = utils.getElement('password')?.value || '';
        const errorDiv = utils.getElement('loginError');

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem(CONFIG.AUTH_KEY, 'authenticated');
            adminState.isLoggedIn = true;

            if (errorDiv) {
                errorDiv.textContent = '';
            }

            showDashboard();
        } else if (errorDiv) {
            errorDiv.textContent = 'Invalid username or password';
        }
    });
}

const logoutBtn = utils.getElement('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem(CONFIG.AUTH_KEY);
            adminState.isLoggedIn = false;
            showLogin();

            const loginFormElement = utils.getElement('loginForm');
            if (loginFormElement) loginFormElement.reset();
        }
    });
}

// ============================================
// Portfolio Data Management
// ============================================

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

    const legacyMessages = (() => {
        try { return JSON.parse(localStorage.getItem('contactMessages') || '[]'); }
        catch { return []; }
    })();

    if (merged.messages.length === 0 && legacyMessages.length) {
        merged.messages = legacyMessages;
        localStorage.removeItem('contactMessages');
    }

    return merged;
}

function loadPortfolioData() {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        adminState.portfolioData = normalizeData(savedData ? JSON.parse(savedData) : null);
        if (!savedData) savePortfolioData();
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        adminState.portfolioData = normalizeData(null);
        savePortfolioData();
    }
}

function savePortfolioData() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(adminState.portfolioData));
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
        return false;
    }
}

// ============================================
// Load Editor Data
// ============================================

function loadEditorData() {
    if (!adminState.portfolioData) return;

    const data = adminState.portfolioData;

    try {
        const heroName = utils.getElement('heroName');
        const heroMotto = utils.getElement('heroMotto');
        const heroRole = utils.getElement('heroRole');
        const heroDescription = utils.getElement('heroDescription');

        if (heroName) heroName.value = data.hero.name || '';
        if (heroMotto) heroMotto.value = data.hero.motto || '';
        if (heroRole) heroRole.value = Array.isArray(data.hero.roles) ? data.hero.roles.join(', ') : '';
        if (heroDescription) heroDescription.value = data.hero.description || '';

        const aboutIntro = utils.getElement('aboutIntro');
        const aboutBody = utils.getElement('aboutBody');
        const aboutExtra = utils.getElement('aboutExtra');
        const statProjects = utils.getElement('statProjects');
        const statYears = utils.getElement('statYears');
        const statClients = utils.getElement('statClients');

        if (aboutIntro) aboutIntro.value = data.about.intro || '';
        if (aboutBody) aboutBody.value = data.about.body || '';
        if (aboutExtra) aboutExtra.value = data.about.extra || '';
        if (statProjects) statProjects.value = data.about.stats.projects || 0;
        if (statYears) statYears.value = data.about.stats.years || 0;
        if (statClients) statClients.value = data.about.stats.clients || 0;

        const contactEmail = utils.getElement('contactEmail');
        const contactPhone = utils.getElement('contactPhone');
        const contactLocation = utils.getElement('contactLocation');
        const contactDescription = utils.getElement('contactDescription');

        if (contactEmail) contactEmail.value = data.contact.email || '';
        if (contactPhone) contactPhone.value = data.contact.phone || '';
        if (contactLocation) contactLocation.value = data.contact.location || '';
        if (contactDescription) contactDescription.value = data.contact.description || '';

        const socialGitHub = utils.getElement('socialGitHub');
        const socialLinkedIn = utils.getElement('socialLinkedIn');
        const socialTwitter = utils.getElement('socialTwitter');
        const socialDribbble = utils.getElement('socialDribbble');

        if (data.contact.social) {
            if (socialGitHub) socialGitHub.value = data.contact.social.github || '';
            if (socialLinkedIn) socialLinkedIn.value = data.contact.social.linkedin || '';
            if (socialTwitter) socialTwitter.value = data.contact.social.twitter || '';
            if (socialDribbble) socialDribbble.value = data.contact.social.dribbble || '';
        }

        loadSkillsEditor();
        loadProjectsEditor();
        loadMessages();
    } catch (error) {
        console.error('Error loading editor data:', error);
    }
}

// ============================================
// Skills Editor
// ============================================

function loadSkillsEditor() {
    const container = utils.getElement('skillsEditor');
    if (!container || !adminState.portfolioData) return;

    container.innerHTML = '';

    adminState.portfolioData.skills.forEach((skillCategory, categoryIndex) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category-editor';

        if (skillCategory.items) {
            const itemsHtml = skillCategory.items.map((skill, skillIndex) => `
                <div class="skill-item-editor">
                    <div class="form-group">
                        <label>Skill Name</label>
                        <input type="text"
                               class="skill-name-input"
                               value="${utils.escapeHtml(skill.name)}"
                               data-category="${categoryIndex}"
                               data-skill="${skillIndex}">
                    </div>
                    <div class="form-group">
                        <label>Percentage (0-100)</label>
                        <input type="number"
                               class="skill-percent-input"
                               value="${skill.percent}"
                               min="0"
                               max="100"
                               data-category="${categoryIndex}"
                               data-skill="${skillIndex}">
                    </div>
                </div>
            `).join('');

            categoryDiv.innerHTML = `
                <h4>${utils.escapeHtml(skillCategory.category)}</h4>
                ${itemsHtml}
            `;
        } else if (skillCategory.tags) {
            categoryDiv.innerHTML = `
                <h4>${utils.escapeHtml(skillCategory.category)}</h4>
                <div class="form-group">
                    <label>Tags (comma separated)</label>
                    <input type="text"
                           class="skill-tags-input"
                           value="${skillCategory.tags.join(', ')}"
                           data-category="${categoryIndex}">
                </div>
            `;
        }

        container.appendChild(categoryDiv);
    });

    container.querySelectorAll('.skill-name-input, .skill-percent-input').forEach(input => {
        input.addEventListener('input', updateSkill);
    });

    container.querySelectorAll('.skill-tags-input').forEach(input => {
        input.addEventListener('input', updateSkillTags);
    });
}

function updateSkill(e) {
    const categoryIndex = parseInt(e.target.dataset.category, 10);
    const skillIndex = parseInt(e.target.dataset.skill, 10);

    if (isNaN(categoryIndex) || isNaN(skillIndex)) return;

    const skill = adminState.portfolioData.skills[categoryIndex].items[skillIndex];

    if (e.target.classList.contains('skill-name-input')) {
        skill.name = e.target.value;
    } else if (e.target.classList.contains('skill-percent-input')) {
        const value = parseInt(e.target.value, 10);
        skill.percent = Math.max(0, Math.min(100, value));
    }

    debouncedSave();
}

function updateSkillTags(e) {
    const categoryIndex = parseInt(e.target.dataset.category, 10);
    if (isNaN(categoryIndex)) return;

    adminState.portfolioData.skills[categoryIndex].tags =
        e.target.value.split(',').map(t => t.trim()).filter(t => t);

    debouncedSave();
}

// ============================================
// Projects Editor
// ============================================

function loadProjectsEditor() {
    const container = utils.getElement('projectsEditor');
    if (!container || !adminState.portfolioData) return;

    container.innerHTML = '';

    adminState.portfolioData.projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-editor';
        projectDiv.innerHTML = `
            <div class="project-editor-header">
                <h4>Project ${index + 1}: ${utils.escapeHtml(project.title)}</h4>
                <button type="button" class="delete-project-btn btn btn-danger btn-sm" data-index="${index}">
                    Delete
                </button>
            </div>
            <div class="form-group">
                <label>Title</label>
                <input type="text"
                       class="project-title-input"
                       value="${utils.escapeHtml(project.title)}"
                       data-index="${index}"
                       placeholder="Project title">
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="project-desc-input"
                          rows="3"
                          data-index="${index}"
                          placeholder="Describe your project...">${utils.escapeHtml(project.description)}</textarea>
            </div>
            <div class="form-group">
                <label>Technologies (comma separated)</label>
                <input type="text"
                       class="project-tech-input"
                       value="${Array.isArray(project.tech) ? project.tech.join(', ') : ''}"
                       data-index="${index}"
                       placeholder="React, Node.js, PostgreSQL">
            </div>
            <div class="form-group">
                <label>Live Demo URL</label>
                <input type="url"
                       class="project-view-url"
                       value="${project.viewUrl || ''}"
                       placeholder="https://yourproject.com"
                       data-index="${index}">
            </div>
            <div class="form-group">
                <label>Code Repository URL</label>
                <input type="url"
                       class="project-code-url"
                       value="${project.codeUrl || ''}"
                       placeholder="https://github.com/username/project"
                       data-index="${index}">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" class="project-featured" data-index="${index}" ${project.featured ? 'checked' : ''}>
                    Featured project
                </label>
            </div>
        `;
        container.appendChild(projectDiv);
    });

    container.querySelectorAll('.project-title-input, .project-desc-input, .project-tech-input, .project-view-url, .project-code-url, .project-featured').forEach(input => {
        input.addEventListener('input', updateProject);
        input.addEventListener('change', updateProject);
    });

    container.querySelectorAll('.delete-project-btn').forEach(btn => {
        btn.addEventListener('click', deleteProject);
    });
}

function updateProject(e) {
    const index = parseInt(e.target.dataset.index, 10);
    if (isNaN(index) || !adminState.portfolioData.projects[index]) return;

    const project = adminState.portfolioData.projects[index];

    if (e.target.classList.contains('project-title-input')) {
        project.title = e.target.value;
        const header = e.target.closest('.project-editor').querySelector('.project-editor-header h4');
        if (header) header.textContent = `Project ${index + 1}: ${e.target.value}`;
    } else if (e.target.classList.contains('project-desc-input')) {
        project.description = e.target.value;
    } else if (e.target.classList.contains('project-tech-input')) {
        project.tech = e.target.value.split(',').map(t => t.trim()).filter(t => t);
    } else if (e.target.classList.contains('project-view-url')) {
        project.viewUrl = e.target.value;
    } else if (e.target.classList.contains('project-code-url')) {
        project.codeUrl = e.target.value;
    } else if (e.target.classList.contains('project-featured')) {
        project.featured = e.target.checked;
    }

    debouncedSave();
}

function deleteProject(e) {
    const index = parseInt(e.target.dataset.index, 10);
    if (isNaN(index)) return;

    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        adminState.portfolioData.projects.splice(index, 1);
        loadProjectsEditor();
        savePortfolioData();
    }
}

const addProjectBtn = utils.getElement('addProjectBtn');
if (addProjectBtn) {
    addProjectBtn.addEventListener('click', () => {
        adminState.portfolioData.projects.push({
            title: 'New Project',
            description: 'Project description here...',
            tech: ['React', 'Node.js'],
            viewUrl: '',
            codeUrl: '',
            featured: false
        });
        loadProjectsEditor();
        savePortfolioData();

        const projectsEditor = utils.getElement('projectsEditor');
        if (projectsEditor) {
            setTimeout(() => {
                projectsEditor.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
}

// ============================================
// Save All Changes
// ============================================

function saveAllChanges() {
    if (!adminState.portfolioData) return;

    const data = adminState.portfolioData;

    try {
        const heroName = utils.getElement('heroName');
        const heroMotto = utils.getElement('heroMotto');
        const heroRole = utils.getElement('heroRole');
        const heroDescription = utils.getElement('heroDescription');

        if (heroName) data.hero.name = heroName.value;
        if (heroMotto) data.hero.motto = heroMotto.value;
        if (heroRole) data.hero.roles = heroRole.value.split(',').map(r => r.trim()).filter(r => r);
        if (heroDescription) data.hero.description = heroDescription.value;

        const aboutIntro = utils.getElement('aboutIntro');
        const aboutBody = utils.getElement('aboutBody');
        const aboutExtra = utils.getElement('aboutExtra');
        const statProjects = utils.getElement('statProjects');
        const statYears = utils.getElement('statYears');
        const statClients = utils.getElement('statClients');

        if (aboutIntro) data.about.intro = aboutIntro.value;
        if (aboutBody) data.about.body = aboutBody.value;
        if (aboutExtra) data.about.extra = aboutExtra.value;
        if (statProjects) data.about.stats.projects = parseInt(statProjects.value, 10) || 0;
        if (statYears) data.about.stats.years = parseInt(statYears.value, 10) || 0;
        if (statClients) data.about.stats.clients = parseInt(statClients.value, 10) || 0;

        const contactEmail = utils.getElement('contactEmail');
        const contactPhone = utils.getElement('contactPhone');
        const contactLocation = utils.getElement('contactLocation');
        const contactDescription = utils.getElement('contactDescription');

        if (contactEmail) data.contact.email = contactEmail.value;
        if (contactPhone) data.contact.phone = contactPhone.value;
        if (contactLocation) data.contact.location = contactLocation.value;
        if (contactDescription) data.contact.description = contactDescription.value;

        if (!data.contact.social) data.contact.social = {};

        const socialGitHub = utils.getElement('socialGitHub');
        const socialLinkedIn = utils.getElement('socialLinkedIn');
        const socialTwitter = utils.getElement('socialTwitter');
        const socialDribbble = utils.getElement('socialDribbble');

        if (socialGitHub) data.contact.social.github = socialGitHub.value;
        if (socialLinkedIn) data.contact.social.linkedin = socialLinkedIn.value;
        if (socialTwitter) data.contact.social.twitter = socialTwitter.value;
        if (socialDribbble) data.contact.social.dribbble = socialDribbble.value;

        if (savePortfolioData()) {
            const btn = utils.getElement('saveAllBtn');
            const btnSecondary = utils.getElement('saveAllBtnSecondary');
            utils.showSuccessMessage(btn, 'Saved', 'Save All');
            if (btnSecondary) utils.showSuccessMessage(btnSecondary, 'Saved', 'Save Now');
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please try again.');
    }
}

const saveAllBtn = utils.getElement('saveAllBtn');
if (saveAllBtn) {
    saveAllBtn.addEventListener('click', saveAllChanges);
}

const saveAllBtnSecondary = utils.getElement('saveAllBtnSecondary');
if (saveAllBtnSecondary) {
    saveAllBtnSecondary.addEventListener('click', saveAllChanges);
}

const debouncedSave = utils.debounce(savePortfolioData, CONFIG.AUTO_SAVE_DELAY);

// ============================================
// Messages
// ============================================

function loadMessages() {
    const container = utils.getElement('messagesList');
    if (!container || !adminState.portfolioData) return;

    const messages = adminState.portfolioData.messages || [];

    if (messages.length === 0) {
        container.innerHTML = '<p class="empty-state">No messages yet. Messages from the contact form will appear here.</p>';
        return;
    }

    container.innerHTML = '';

    [...messages].reverse().forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';

        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-info">
                    <h4>${utils.escapeHtml(message.name || 'Anonymous')}</h4>
                    <p>${utils.escapeHtml(message.email || 'No email provided')}</p>
                    ${message.subject ? `<p>Subject: ${utils.escapeHtml(message.subject)}</p>` : ''}
                </div>
                <div class="message-date">${utils.formatDate(message.date)}</div>
            </div>
            <div class="message-content">${utils.escapeHtml(message.message || 'No message content')}</div>
        `;

        container.appendChild(messageDiv);
    });
}

// ============================================
// Event Listeners
// ============================================

function initializeEventListeners() {
    const autoSaveFields = [
        'heroName', 'heroMotto', 'heroRole', 'heroDescription',
        'aboutIntro', 'aboutBody', 'aboutExtra',
        'statProjects', 'statYears', 'statClients',
        'contactEmail', 'contactPhone', 'contactLocation', 'contactDescription',
        'socialGitHub', 'socialLinkedIn', 'socialTwitter', 'socialDribbble'
    ];

    autoSaveFields.forEach(fieldId => {
        const field = utils.getElement(fieldId);
        if (field) field.addEventListener('input', debouncedSave);
    });
}

// ============================================
// Export for main site
// ============================================

window.saveContactMessage = function(messageData) {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        const data = normalizeData(savedData ? JSON.parse(savedData) : null);
        if (!Array.isArray(data.messages)) data.messages = [];
        messageData.date = new Date().toISOString();
        data.messages.push(messageData);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving contact message:', error);
        return false;
    }
};

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (adminState.isLoggedIn) saveAllChanges();
    }

    if (e.key === 'Escape' && adminState.isLoggedIn) {
        const logoutBtnEl = utils.getElement('logoutBtn');
        if (logoutBtnEl) logoutBtnEl.click();
    }
});

console.log('Admin panel initialized');
