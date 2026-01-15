/**
 * Load and render projects from API with sorting and filtering
 */
const fetchAndRenderProjects = (sortValue = 'created_at', filterValue = 'active') => {
    let url = `/api/projects?sort=${sortValue}`;
    if (filterValue !== 'all') {
        url += `&filter=${filterValue}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const display = document.getElementById('projects-display');
                
                if (data.data.length === 0) {
                    display.innerHTML = '<div class="no-projects"><p>No projects yet. Create your first project to get started!</p></div>';
                } else {
                    display.innerHTML = data.data.map(project => renderProjectCard(project)).join('');
                    bindDeleteButtons();
                }
            } else {
                console.error('Error fetching projects:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
};

/**
 * Generate project card HTML template
 */
const projectCardTemplate = (project, statusBadge, endDateHtml, startDateDisplay, createdAtDisplay, updatedAtDisplay) => {
    return `
        <div class="project-card-wrapper" data-proj-id="${project.id}">
            <a href="/project/${project.id}" class="project-card">
                <div class="project-card-container">
                    <div>
                        <div class="project-title">${project.name}</div>
                        ${statusBadge}
                        <div class="project-description">${project.description || 'No description provided.'}</div>
                        <div class="project-info">
                            <div>Start: ${startDateDisplay}</div>
                            ${endDateHtml}
                        </div>
                    </div>
                    <div class="project-meta">
                        Created: ${createdAtDisplay}<br>
                        Updated: ${updatedAtDisplay}<br>
                    </div>
                </div>
            </a>
            <button class="project-delete-btn" title="Delete project" data-proj-id="${project.id}">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </div>
    `;
};

/**
 * Render a single project card
 */
const renderProjectCard = (project) => {
    const statusBadge = project.is_complete 
        ? '<span class="status-badge completed">✓ Completed</span>' 
        : '<span class="status-badge active">In Progress</span>';
    
    const endDateHtml = project.end_date 
        ? `<div>End: ${formatDate(project.end_date)}</div>` 
        : '';
    
    const startDateDisplay = project.start_date 
        ? formatDate(project.start_date)
        : 'TBD';
    
    const createdAtDisplay = formatDateTime(project.created_at);
    const updatedAtDisplay = formatDateTime(project.updated_at);
    
    return projectCardTemplate(project, statusBadge, endDateHtml, startDateDisplay, createdAtDisplay, updatedAtDisplay);
};

/**
 * Format ISO date string to readable date (e.g., "Jan 13 2026")
 * Equivalent strftime: %b %d %Y
 */
const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
    });
};

/**
 * Format ISO date string to readable datetime (e.g., "Jan 13 2026 at 2:30 PM")
 * Equivalent strftime: %b %d %Y at %I:%M %p
 */
const formatDateTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) + 
           ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Handle sort order changes - fetch projects with new sort order and re-render
 */
const changeSortOrder = () => {
    const sortValue = document.getElementById('sort-dropdown').value;
    const filterValue = document.getElementById('filter-toggle').checked ? 'all' : 'active';
    fetchAndRenderProjects(sortValue, filterValue);
};

/**
 * Bind event listeners
 */
const bindListeners = () => {
    // Modal handlers
    bindModalListeners();
    
    // Sort/filter handlers
    document.getElementById('sort-dropdown').addEventListener('change', changeSortOrder);
    document.getElementById('filter-toggle').addEventListener('change', changeSortOrder);
    
    // Delete button handlers
    bindDeleteButtons();
};

/**
 * Bind delete button event listeners
 */
const bindDeleteButtons = () => {
    document.querySelectorAll('.project-delete-btn').forEach(button => {
        button.removeEventListener('click', handleDeleteProject);
        button.addEventListener('click', handleDeleteProject);
    });
};

/**
 * Handle project deletion - transforms trash icon to confirm state
 */
const handleDeleteProject = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const projectId = button.getAttribute('data-proj-id');
    
    // Check if button is already in confirm state
    if (button.classList.contains('confirm-state')) {
        const wrapper = document.querySelector(`[data-proj-id="${projectId}"]`);
        
        fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                wrapper.style.opacity = '0';
                wrapper.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    wrapper.remove();
                }, 300);
            } else {
                alert('Error deleting project: ' + (data.error || 'Unknown error'));
                resetDeleteButton(button);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting project: ' + error.message);
            resetDeleteButton(button);
        });
    } else {
        // Transform to confirm state
        button.classList.add('confirm-state');
        button.title = 'Click again to confirm deletion';
        button.innerHTML = `
            <div class="confirm-buttons">
                <button class="confirm-icon" title="Confirm delete">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </button>
                <button class="cancel-icon" title="Cancel">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </svg>
                </button>
            </div>
        `;
        
        // Add event listener for cancel button
        const cancelBtn = button.querySelector('.cancel-icon');
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            resetDeleteButton(button);
        });
        
        // Auto-reset after 5 seconds if not confirmed
        setTimeout(() => {
            if (button.classList.contains('confirm-state')) {
                resetDeleteButton(button);
            }
        }, 5000);
    }
};

/**
 * Reset delete button to trash icon state
 */
const resetDeleteButton = (button) => {
    button.classList.remove('confirm-state');
    button.title = 'Delete project';
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
        </svg>
    `;
};

/**
 * Initialize on page load
 */
window.addEventListener('DOMContentLoaded', () => {
    bindListeners();
    fetchAndRenderProjects();
});
