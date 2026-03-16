// ============================================
// Modern Admin Panel JavaScript - Optimized & Bug-Free
// ============================================

// Admin credentials (in production, use secure backend authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'bdex2026'
};

// State management with proper encapsulation
const adminState = {
    isLoggedIn: false,
    portfolioData: null,
    autoSaveTimeout: null
};

// Configuration
const CONFIG = {
    AUTO_SAVE_DELAY: 1000,
    SUCCESS_MESSAGE_DURATION: 2000,
    STORAGE_KEY: 'portfolioData',
    AUTH_KEY: 'adminAuth'
};

// ============================================
// Utility Functions
// ============================================
const utils = {
    // Safely get element by ID
    getElement: (id) => {
        const element = document.getElementById(id);
        if (!element) console.warn(`Element with id "${id}" not found`);
        return element;
    },

    // Debounce function for performance
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

    // Show temporary success message
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

    // Escape HTML to prevent XSS
    escapeHtml: (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    },

    // Format date nicely
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
    }
};

// ============================================
// Initialize Admin Panel
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeAuth();
        initializeEventListeners();
        loadPortfolioData();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// ============================================
// Authentication Management
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

// Login form handler
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
                errorDiv.classList.remove('show');
                errorDiv.textContent = '';
            }
            
            showDashboard();
        } else {
            if (errorDiv) {
                errorDiv.textContent = '❌ Invalid username or password';
                errorDiv.classList.add('show');
            }
        }
    });
}

// Logout handler
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
function getDefaultPortfolioData() {
    return {
        hero: {
            name: 'Bexruz',
            motto: 'We build, develop and explore',
            roles: ['Full Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'],
            description: 'Crafting digital experiences with cutting-edge technology. Specialized in building scalable web applications and innovative solutions.'
        },
        about: {
            intro: 'I\'m a passionate developer with a love for creating elegant solutions to complex problems.',
            text1: 'With over 5 years of experience in web development, I specialize in building modern, responsive applications using the latest technologies. My approach combines clean code, user-centered design, and performance optimization.',
            text2: 'When I\'m not coding, you\'ll find me exploring new frameworks, contributing to open-source projects, or sharing knowledge with the developer community.',
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
                    { name: 'Vue.js', percent: 80 },
                    { name: 'CSS/SCSS', percent: 95 }
                ]
            },
            {
                category: 'Backend',
                items: [
                    { name: 'Node.js', percent: 88 },
                    { name: 'Python', percent: 82 },
                    { name: 'MongoDB', percent: 85 },
                    { name: 'PostgreSQL', percent: 80 }
                ]
            },
            {
                category: 'Tools & Others',
                tags: ['Git', 'Docker', 'AWS', 'Figma', 'Webpack', 'Jest', 'CI/CD', 'Agile']
            }
        ],
        projects: [
            {
                title: 'E-Commerce Platform',
                description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include payment integration, admin dashboard, and real-time inventory.',
                tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
                viewUrl: '',
                codeUrl: ''
            },
            {
                title: 'Task Management App',
                description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
                tech: ['Vue.js', 'Socket.io', 'PostgreSQL', 'Express'],
                viewUrl: '',
                codeUrl: ''
            },
            {
                title: 'Analytics Dashboard',
                description: 'A comprehensive analytics dashboard with data visualization, custom reports, and real-time metrics tracking.',
                tech: ['React', 'D3.js', 'Python', 'FastAPI'],
                viewUrl: '',
                codeUrl: ''
            },
            {
                title: 'Mobile Banking App',
                description: 'A secure mobile banking application with biometric authentication, transaction history, and budget tracking features.',
                tech: ['React Native', 'Node.js', 'Firebase', 'TypeScript'],
                viewUrl: '',
                codeUrl: ''
            }
        ],
        contact: {
            email: 'hello@example.com',
            phone: '+1 (234) 567-890',
            location: 'San Francisco, CA',
            description: 'I\'m always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Feel free to reach out!',
            social: {
                github: '',
                linkedin: '',
                twitter: '',
                dribbble: ''
            }
        },
        messages: []
    };
}

function loadPortfolioData() {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (savedData) {
            adminState.portfolioData = JSON.parse(savedData);
            // Ensure all required fields exist (for backward compatibility)
            adminState.portfolioData = { ...getDefaultPortfolioData(), ...adminState.portfolioData };
        } else {
            adminState.portfolioData = getDefaultPortfolioData();
            savePortfolioData();
        }
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        adminState.portfolioData = getDefaultPortfolioData();
    }
}

function savePortfolioData() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(adminState.portfolioData));
        syncToMainSite();
        return true;
    } catch (error) {
        console.error('Error saving portfolio data:', error);
        alert('Error saving data. Please try again.');
        return false;
    }
}

function syncToMainSite() {
    // This function ensures the main portfolio site can access the data
    // In a production environment, this would be an API call
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(adminState.portfolioData));
    } catch (error) {
        console.error('Error syncing to main site:', error);
    }
}

// ============================================
// Load Editor Data
// ============================================
function loadEditorData() {
    if (!adminState.portfolioData) {
        console.warn('No portfolio data available');
        return;
    }

    const data = adminState.portfolioData;

    try {
        // Hero section
        const heroName = utils.getElement('heroName');
        const heroMotto = utils.getElement('heroMotto');
        const heroRole = utils.getElement('heroRole');
        const heroDescription = utils.getElement('heroDescription');

        if (heroName) heroName.value = data.hero.name || '';
        if (heroMotto) heroMotto.value = data.hero.motto || '';
        if (heroRole) heroRole.value = Array.isArray(data.hero.roles) ? data.hero.roles.join(',') : '';
        if (heroDescription) heroDescription.value = data.hero.description || '';

        // About section
        const aboutIntro = utils.getElement('aboutIntro');
        const aboutText1 = utils.getElement('aboutText1');
        const aboutText2 = utils.getElement('aboutText2');
        const statProjects = utils.getElement('statProjects');
        const statYears = utils.getElement('statYears');
        const statClients = utils.getElement('statClients');

        if (aboutIntro) aboutIntro.value = data.about.intro || '';
        if (aboutText1) aboutText1.value = data.about.text1 || '';
        if (aboutText2) aboutText2.value = data.about.text2 || '';
        if (statProjects) statProjects.value = data.about.stats.projects || 0;
        if (statYears) statYears.value = data.about.stats.years || 0;
        if (statClients) statClients.value = data.about.stats.clients || 0;

        // Contact section
        const contactEmail = utils.getElement('contactEmail');
        const contactPhone = utils.getElement('contactPhone');
        const contactLocation = utils.getElement('contactLocation');
        const contactDescription = utils.getElement('contactDescription');

        if (contactEmail) contactEmail.value = data.contact.email || '';
        if (contactPhone) contactPhone.value = data.contact.phone || '';
        if (contactLocation) contactLocation.value = data.contact.location || '';
        if (contactDescription) contactDescription.value = data.contact.description || '';

        // Social media
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

        // Load dynamic sections
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
            // Skills with percentage bars
            let itemsHtml = skillCategory.items.map((skill, skillIndex) => `
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
            // Tags-based skills
            categoryDiv.innerHTML = `
                <h4>${utils.escapeHtml(skillCategory.category)}</h4>
                <div class="form-group">
                    <label>Tags (comma-separated)</label>
                    <input type="text" 
                           class="skill-tags-input" 
                           value="${skillCategory.tags.join(', ')}" 
                           data-category="${categoryIndex}">
                </div>
            `;
        }

        container.appendChild(categoryDiv);
    });

    // Add event listeners
    container.querySelectorAll('.skill-name-input, .skill-percent-input').forEach(input => {
        input.addEventListener('input', updateSkill);
    });

    container.querySelectorAll('.skill-tags-input').forEach(input => {
        input.addEventListener('input', updateSkillTags);
    });
}

function updateSkill(e) {
    const categoryIndex = parseInt(e.target.dataset.category);
    const skillIndex = parseInt(e.target.dataset.skill);
    
    if (isNaN(categoryIndex) || isNaN(skillIndex)) return;

    const skill = adminState.portfolioData.skills[categoryIndex].items[skillIndex];

    if (e.target.classList.contains('skill-name-input')) {
        skill.name = e.target.value;
    } else if (e.target.classList.contains('skill-percent-input')) {
        const value = parseInt(e.target.value);
        skill.percent = Math.max(0, Math.min(100, value));
    }

    debouncedSave();
}

function updateSkillTags(e) {
    const categoryIndex = parseInt(e.target.dataset.category);
    
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
                <button type="button" class="delete-project-btn btn-sm btn-danger" data-index="${index}">
                    🗑️ Delete
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
                <label>Technologies (comma-separated)</label>
                <input type="text" 
                       class="project-tech-input" 
                       value="${Array.isArray(project.tech) ? project.tech.join(', ') : ''}" 
                       data-index="${index}"
                       placeholder="React, Node.js, MongoDB">
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
        `;
        container.appendChild(projectDiv);
    });

    // Add event listeners
    container.querySelectorAll('.project-title-input, .project-desc-input, .project-tech-input, .project-view-url, .project-code-url').forEach(input => {
        input.addEventListener('input', updateProject);
    });

    container.querySelectorAll('.delete-project-btn').forEach(btn => {
        btn.addEventListener('click', deleteProject);
    });
}

function updateProject(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (isNaN(index) || !adminState.portfolioData.projects[index]) return;

    const project = adminState.portfolioData.projects[index];

    if (e.target.classList.contains('project-title-input')) {
        project.title = e.target.value;
        // Update header
        const header = e.target.closest('.project-editor').querySelector('.project-editor-header h4');
        if (header) {
            header.textContent = `Project ${index + 1}: ${e.target.value}`;
        }
    } else if (e.target.classList.contains('project-desc-input')) {
        project.description = e.target.value;
    } else if (e.target.classList.contains('project-tech-input')) {
        project.tech = e.target.value.split(',').map(t => t.trim()).filter(t => t);
    } else if (e.target.classList.contains('project-view-url')) {
        project.viewUrl = e.target.value;
    } else if (e.target.classList.contains('project-code-url')) {
        project.codeUrl = e.target.value;
    }

    debouncedSave();
}

function deleteProject(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (isNaN(index)) return;

    if (confirm('⚠️ Are you sure you want to delete this project? This action cannot be undone.')) {
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
            codeUrl: ''
        });
        loadProjectsEditor();
        savePortfolioData();
        
        // Scroll to bottom
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
        // Update hero
        const heroName = utils.getElement('heroName');
        const heroMotto = utils.getElement('heroMotto');
        const heroRole = utils.getElement('heroRole');
        const heroDescription = utils.getElement('heroDescription');

        if (heroName) data.hero.name = heroName.value;
        if (heroMotto) data.hero.motto = heroMotto.value;
        if (heroRole) data.hero.roles = heroRole.value.split(',').map(r => r.trim()).filter(r => r);
        if (heroDescription) data.hero.description = heroDescription.value;

        // Update about
        const aboutIntro = utils.getElement('aboutIntro');
        const aboutText1 = utils.getElement('aboutText1');
        const aboutText2 = utils.getElement('aboutText2');
        const statProjects = utils.getElement('statProjects');
        const statYears = utils.getElement('statYears');
        const statClients = utils.getElement('statClients');

        if (aboutIntro) data.about.intro = aboutIntro.value;
        if (aboutText1) data.about.text1 = aboutText1.value;
        if (aboutText2) data.about.text2 = aboutText2.value;
        if (statProjects) data.about.stats.projects = parseInt(statProjects.value) || 0;
        if (statYears) data.about.stats.years = parseInt(statYears.value) || 0;
        if (statClients) data.about.stats.clients = parseInt(statClients.value) || 0;

        // Update contact
        const contactEmail = utils.getElement('contactEmail');
        const contactPhone = utils.getElement('contactPhone');
        const contactLocation = utils.getElement('contactLocation');
        const contactDescription = utils.getElement('contactDescription');

        if (contactEmail) data.contact.email = contactEmail.value;
        if (contactPhone) data.contact.phone = contactPhone.value;
        if (contactLocation) data.contact.location = contactLocation.value;
        if (contactDescription) data.contact.description = contactDescription.value;

        // Social media URLs
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
            // Show success message
            const btn = utils.getElement('saveAllBtn');
            utils.showSuccessMessage(btn, '✓ Saved Successfully!', 'Save All Changes');
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        alert('❌ Error saving changes. Please try again.');
    }
}

const saveAllBtn = utils.getElement('saveAllBtn');
if (saveAllBtn) {
    saveAllBtn.addEventListener('click', saveAllChanges);
}

// Debounced auto-save
const debouncedSave = utils.debounce(savePortfolioData, CONFIG.AUTO_SAVE_DELAY);

// ============================================
// Messages Management
// ============================================
function loadMessages() {
    const container = utils.getElement('messagesList');
    if (!container || !adminState.portfolioData) return;

    const messages = adminState.portfolioData.messages || [];

    if (messages.length === 0) {
        container.innerHTML = '<p class="empty-state">📭 No messages yet. Messages from the contact form will appear here.</p>';
        return;
    }

    container.innerHTML = '';
    
    // Show newest first
    [...messages].reverse().forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message-item';
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-info">
                    <h4>${utils.escapeHtml(message.name || 'Anonymous')}</h4>
                    <p>📧 ${utils.escapeHtml(message.email || 'No email provided')}</p>
                    ${message.subject ? `<p>📌 Subject: ${utils.escapeHtml(message.subject)}</p>` : ''}
                </div>
                <div class="message-date">
                    📅 ${utils.formatDate(message.date)}
                </div>
            </div>
            <div class="message-content">
                ${utils.escapeHtml(message.message || 'No message content')}
            </div>
        `;
        
        container.appendChild(messageDiv);
    });
}

// ============================================
// Event Listeners
// ============================================
function initializeEventListeners() {
    // Auto-save on input for main form fields
    const autoSaveFields = [
        'heroName', 'heroMotto', 'heroRole', 'heroDescription',
        'aboutIntro', 'aboutText1', 'aboutText2',
        'statProjects', 'statYears', 'statClients',
        'contactEmail', 'contactPhone', 'contactLocation', 'contactDescription',
        'socialGitHub', 'socialLinkedIn', 'socialTwitter', 'socialDribbble'
    ];

    autoSaveFields.forEach(fieldId => {
        const field = utils.getElement(fieldId);
        if (field) {
            field.addEventListener('input', debouncedSave);
        }
    });
}

// ============================================
// Export function for main site to save messages
// ============================================
window.saveContactMessage = function(messageData) {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            if (!data.messages) data.messages = [];
            
            messageData.date = new Date().toISOString();
            data.messages.push(messageData);
            
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error saving contact message:', error);
        return false;
    }
};

// ============================================
// Keyboard Shortcuts
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (adminState.isLoggedIn) {
            saveAllChanges();
        }
    }
    
    // Esc to logout (with confirmation)
    if (e.key === 'Escape' && adminState.isLoggedIn) {
        const logoutBtn = utils.getElement('logoutBtn');
        if (logoutBtn) logoutBtn.click();
    }
});

// ============================================
// Performance Optimization
// ============================================
// Prevent memory leaks by cleaning up on page unload
window.addEventListener('beforeunload', () => {
    if (adminState.autoSaveTimeout) {
        clearTimeout(adminState.autoSaveTimeout);
    }
});

console.log('✅ Admin Panel initialized successfully');