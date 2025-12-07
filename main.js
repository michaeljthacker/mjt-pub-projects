// ===========================
// State Management
// ===========================
let allProjects = [];
let activeCard = null;

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadProjects();
    initializeCardInteractions();
});

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
    allPanels.forEach(panel => {
        const tabId = selectedTab.getAttribute('id');
        const panelId = selectedTab.getAttribute('aria-controls');
        
        if (panel.getAttribute('id') === panelId) {
            panel.removeAttribute('hidden');
        } else {
            panel.setAttribute('hidden', '');
        }
    });
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
// Project Rendering
// ===========================
function renderProjects(projects) {
    const gridContainer = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-state">
                <p class="empty-state-message">No projects found.</p>
            </div>
        `;
        return;
    }
    
    // Build all cards HTML
    const cardsHTML = projects.map(project => createCardHTML(project)).join('');
    gridContainer.innerHTML = cardsHTML;
}

function createCardHTML(project) {
    const screenshotPath = project.screenshot 
        ? `screenshots/${project.screenshot}` 
        : `screenshots/default-project.png`;
    
    const tagsHTML = project.tags
        .map(tag => `<span class="project-card-tag">${tag}</span>`)
        .join('');
    
    const githubButtonHTML = project.githubUrl
        ? `<a href="${project.githubUrl}" 
              class="project-card-button secondary" 
              target="_blank" 
              rel="noopener noreferrer"
              onclick="event.stopPropagation()">GitHub</a>`
        : '';
    
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
                    <a href="${project.siteUrl}" 
                       class="project-card-button" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       onclick="event.stopPropagation()">View Site</a>
                    ${githubButtonHTML}
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
    
    // Card click handler
    gridContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.project-card');
        
        if (!card) return;
        
        // Don't handle if clicking on a button/link (they have stopPropagation)
        if (event.target.closest('.project-card-button')) return;
        
        // Check if device supports hover (desktop)
        const hasHover = window.matchMedia('(hover: hover)').matches;
        
        if (!hasHover) {
            // Mobile: toggle overlay
            if (card.classList.contains('card--active')) {
                // Second tap: navigate to site
                const projectId = card.dataset.projectId;
                const project = allProjects.find(p => p.id === projectId);
                if (project) {
                    window.open(project.siteUrl, '_blank', 'noopener,noreferrer');
                }
            } else {
                // First tap: show overlay
                removeActiveCard();
                card.classList.add('card--active');
                activeCard = card;
                addDismissListeners();
            }
        } else {
            // Desktop: navigate immediately
            const projectId = card.dataset.projectId;
            const project = allProjects.find(p => p.id === projectId);
            if (project) {
                window.open(project.siteUrl, '_blank', 'noopener,noreferrer');
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