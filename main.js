// ===========================
// State Management
// ===========================
let allProjects = [];
let activeCard = null;
let currentTag = 'All';
let currentSearch = '';

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadProjects();
    initializeCardInteractions();
    initializeSearch();
    initializeFilterToggle();
    trackPageView('/projects');
});

// ===========================
// Analytics helpers
// ===========================
function trackPageView(path) {
    window.mjtAnalytics?.pageView?.({ path });
}

function trackProjectClick(project, buttonLabel, via) {
    if (!project) return;
    const state = { button: buttonLabel };
    if (via) state.via = via;
    window.mjtAnalytics?.track?.(project.name, { state });
}

function initializeFilterToggle() {
    const toggle = document.getElementById('filter-toggle');
    const panel = document.getElementById('filter-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        const next = !expanded;
        toggle.setAttribute('aria-expanded', next);
        if (next) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', '');
        }
    });
}

// ===========================
// Tab Navigation
// ===========================
function initializeTabs() {
    const tabs = document.querySelectorAll('button[role="tab"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab);
        });
    });
}

function switchTab(selectedTab) {
    const allTabs = document.querySelectorAll('button[role="tab"]');
    const allPanels = document.querySelectorAll('section[role="tabpanel"]');
    
    // Update tabs
    allTabs.forEach(tab => {
        const isSelected = tab === selectedTab;
        tab.setAttribute('aria-selected', isSelected);
    });
    
    // Update panels
    const panelId = selectedTab.getAttribute('aria-controls');
    allPanels.forEach(panel => {
        if (panel.getAttribute('id') === panelId) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', '');
        }
    });

    trackPageView(panelId === 'about-panel' ? '/about' : '/projects');
}

// ===========================
// Data Loading
// ===========================
async function loadProjects() {
    const gridContainer = document.getElementById('projects-grid');
    
    try {
        const response = await fetch('projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        allProjects = projects;
        initializeTagFilters();
        renderProjects(projects);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showError(gridContainer);
    }
}

function showError(container) {
    container.innerHTML = `
        <div class="empty-state">
            <p class="empty-state-message">Unable to load projects. Please refresh the page.</p>
            <button class="empty-state-action" onclick="location.reload()">Refresh</button>
        </div>
    `;
}

// ===========================
// Project Card HTML Generation
// ===========================
function getPrimaryUrl(project) {
    return Object.values(project.buttons)[0];
}

function createCardHTML(project) {
    const screenshotPath = project.screenshot 
        ? `screenshots/${project.screenshot}` 
        : `screenshots/default-project.png`;
    
    const tagsHTML = project.tags
        .map(tag => `<span class="project-card-tag">${tag}</span>`)
        .join('');
    
    const buttonsHTML = Object.entries(project.buttons)
        .map(([label, url], index) => {
            const buttonClass = index === 0 ? 'project-card-button' : 'project-card-button secondary';
            return `<a href="${url}"
                       class="${buttonClass}"
                       target="_blank"
                       rel="noopener"
                       onclick="event.stopPropagation()">${label}</a>`;
        })
        .join('');

    return `
        <article class="project-card" data-project-id="${project.id}">
            <div class="project-card-screenshot-container">
                <img 
                    src="${screenshotPath}" 
                    alt="${project.name} screenshot" 
                    class="project-card-screenshot"
                    onerror="this.src='screenshots/default-project.png'">
            </div>
            
            <div class="project-card-content">
                <h3 class="project-card-title">${project.name}</h3>
                <p class="project-card-date">Est. ${project.established}</p>
                <div class="project-card-tags">${tagsHTML}</div>
            </div>
            
            <div class="project-card-overlay">
                <p class="project-card-description">${project.description}</p>
                <div class="project-card-buttons">
                    ${buttonsHTML}
                </div>
            </div>
        </article>
    `;
}

// ===========================
// Card Interactions (Mobile)
// ===========================
function initializeCardInteractions() {
    const gridContainer = document.getElementById('projects-grid');

    // Capture-phase listener so we see button clicks before their inline
    // stopPropagation() runs (also fires before navigation begins).
    gridContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.project-card-button');
        if (!button) return;
        const card = button.closest('.project-card');
        const project = card && allProjects.find(p => p.id === card.dataset.projectId);
        trackProjectClick(project, button.textContent.trim());
    }, true);

    // Card click handler
    gridContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.project-card');

        if (!card) return;

        // Don't handle if clicking on a button/link (they have stopPropagation)
        if (event.target.closest('.project-card-button')) return;
        
        // Check if device is touch-based (mobile/tablet)
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        
        if (isTouchDevice) {
            // Mobile: toggle overlay
            if (card.classList.contains('card--active')) {
                // Second tap: navigate to site
                const projectId = card.dataset.projectId;
                const project = allProjects.find(p => p.id === projectId);
                if (project) {
                    trackProjectClick(project, Object.keys(project.buttons)[0], 'card');
                    window.open(getPrimaryUrl(project), '_blank', 'noopener');
                }
            } else {
                // First tap: show overlay
                removeActiveCard();
                card.classList.add('card--active');
                activeCard = card;
                addDismissListeners();
                
                // Scroll card into view to ensure overlay is visible
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 50);
            }
        } else {
            // Desktop: navigate immediately
            const projectId = card.dataset.projectId;
            const project = allProjects.find(p => p.id === projectId);
            if (project) {
                trackProjectClick(project, Object.keys(project.buttons)[0], 'card');
                window.open(getPrimaryUrl(project), '_blank', 'noopener');
            }
        }
    });
}

function removeActiveCard() {
    if (activeCard) {
        activeCard.classList.remove('card--active');
        activeCard = null;
        removeDismissListeners();
    }
}

// ===========================
// Overlay Dismiss Handlers
// ===========================
let dismissClickHandler = null;
let dismissScrollHandler = null;

function addDismissListeners() {
    // Dismiss on tap outside card
    dismissClickHandler = (event) => {
        if (activeCard && !activeCard.contains(event.target)) {
            removeActiveCard();
        }
    };
    
    // Dismiss on scroll
    dismissScrollHandler = debounce(() => {
        removeActiveCard();
    }, 50);
    
    // Add listeners
    setTimeout(() => {
        document.addEventListener('click', dismissClickHandler);
        window.addEventListener('scroll', dismissScrollHandler);
    }, 100); // Delay to avoid immediate dismissal from the activating click
}

function removeDismissListeners() {
    if (dismissClickHandler) {
        document.removeEventListener('click', dismissClickHandler);
        dismissClickHandler = null;
    }
    if (dismissScrollHandler) {
        window.removeEventListener('scroll', dismissScrollHandler);
        dismissScrollHandler = null;
    }
}

// ===========================
// Utility Functions
// ===========================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===========================
// Tag Filters
// ===========================
function initializeTagFilters() {
    const tagFiltersContainer = document.getElementById('tag-filters');
    
    // Extract unique tags from all projects
    const uniqueTags = new Set();
    allProjects.forEach(project => {
        project.tags.forEach(tag => uniqueTags.add(tag));
    });
    
    // Define tag order (manual ordering as specified)
    const tagOrder = [
        'game', 'webapp', 'tool', 'chrome-extension', 'desktop-app', 'content-generator',
        'html-css-js', 'python', 'django', 'drf', 'tkinter', 'chrome-api', 'react',
        'static-site', 'api-backed', 'full-stack',
        'prototype', 'production', 'playground'
    ];
    
    // Sort tags by predefined order
    const sortedTags = Array.from(uniqueTags).sort((a, b) => {
        const indexA = tagOrder.indexOf(a);
        const indexB = tagOrder.indexOf(b);
        if (indexA === -1) return 1; // Unknown tags to end
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
    
    // Create chips: "All" first, then sorted tags
    const allChips = ['All', ...sortedTags];
    
    tagFiltersContainer.innerHTML = allChips
        .map(tag => `
            <button 
                class="tag-chip ${tag === 'All' ? 'active' : ''}" 
                data-tag="${tag}"
                aria-pressed="${tag === 'All' ? 'true' : 'false'}">
                ${tag}
            </button>
        `)
        .join('');
    
    // Add click listeners
    tagFiltersContainer.addEventListener('click', (event) => {
        const chip = event.target.closest('.tag-chip');
        if (!chip) return;
        
        const tag = chip.dataset.tag;
        handleTagFilter(tag);
    });
}

function handleTagFilter(tag) {
    currentTag = tag;
    
    // Update chip visual states
    const allChips = document.querySelectorAll('.tag-chip');
    allChips.forEach(chip => {
        const isActive = chip.dataset.tag === tag;
        chip.classList.toggle('active', isActive);
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    
    // Apply filters and re-render
    applyFilters();
}

// ===========================
// Search
// ===========================
function initializeSearch() {
    const searchInput = document.getElementById('search-bar');
    const clearButton = document.getElementById('clear-filters-btn');
    
    searchInput.addEventListener('input', debounce((event) => {
        currentSearch = event.target.value.trim();
        applyFilters();
    }, 300));
    
    clearButton.addEventListener('click', () => {
        clearAllFilters();
    });
}

// ===========================
// Filter Logic
// ===========================
function applyFilters() {
    let filtered = allProjects;
    
    // Apply tag filter
    if (currentTag !== 'All') {
        filtered = filtered.filter(project => 
            project.tags.includes(currentTag)
        );
    }
    
    // Apply search filter
    if (currentSearch !== '') {
        const searchLower = currentSearch.toLowerCase();
        filtered = filtered.filter(project => 
            project.name.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower)
        );
    }
    
    renderProjects(filtered);
}

function clearAllFilters() {
    // Reset state
    currentTag = 'All';
    currentSearch = '';
    
    // Reset UI
    const searchInput = document.getElementById('search-bar');
    searchInput.value = '';
    
    // Update tag chips
    handleTagFilter('All');
}

// ===========================
// Enhanced Rendering with Empty State
// ===========================
function renderProjects(projects) {
    const gridContainer = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <p class="empty-state-message">No projects match your filters.</p>
                <button class="empty-state-action" onclick="clearAllFilters()">Show all projects</button>
            </div>
        `;
        return;
    }
    
    // Build all cards HTML
    const cardsHTML = projects.map(project => createCardHTML(project)).join('');
    gridContainer.innerHTML = cardsHTML;
}