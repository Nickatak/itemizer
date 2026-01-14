// This will be mutated exactly once on page load.  It's a global static reference.
const allProjIds = [];
const projects = {}

window.onload = () => {
    bindListeners();
    // Just keeps a live-list order of ID's and re-renders the projects as needed.

    readProjects(allProjIds, projects);

}

/**
 * Helper function that binds various functions below to the DOM.
 */
const bindListeners = () => {
    // Modal Handlers
    bindModalListeners();

    // Filter/Sort Handlers
    document.getElementById('sort-dropdown').addEventListener('change', changeSortOrder);
    document.getElementById('filter-toggle').addEventListener('change', changeFilter);


}


/**
 * Filter/sorting functions.
 */

const changeSortOrder = (evt) => {
    const sortDropdown = document.getElementById('sort-dropdown');
    const filterToggle = document.getElementById('filter-toggle');
    const sortValue = sortDropdown.value;
    const filterValue = filterToggle.checked ? 'active' : 'all';
    
    // Dynamically fetch and render sorted projects
    fetchAndRenderProjects(sortValue, filterValue);
}

function changeFilter() {
    const sortDropdown = document.getElementById('sort-dropdown');
    const filterToggle = document.getElementById('filter-toggle');
    const sortValue = sortDropdown.value;
    const filterValue = filterToggle.checked ? 'active' : 'all';
    
    // Dynamically fetch and render filtered projects
    fetchAndRenderProjects(sortValue, filterValue);
}

/**
 * Fetch projects from API and render them dynamically
 */
const fetchAndRenderProjects = (sortValue, filterValue) => {
    let url = `/api/projects?sort=${sortValue}`;
    if (filterValue !== 'all') {
        url += `&filter=${filterValue}`;
    }
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear existing projects
                allProjIds.length = 0;
                Object.keys(projects).forEach(key => delete projects[key]);
                
                // Rebuild DOM with sorted/filtered projects
                const display = document.getElementById('projects-display');
                
                if (data.data.length === 0) {
                    display.innerHTML = '<div class="no-projects"><p>No projects yet. Create your first project to get started!</p></div>';
                } else {
                    display.innerHTML = data.data.map(project => {
                        const statusBadge = project.is_complete 
                            ? '<span class="status-badge completed">✓ Completed</span>' 
                            : '<span class="status-badge active">In Progress</span>';
                        
                        const endDateHtml = project.end_date 
                            ? `<div>End: ${new Date(project.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}</div>` 
                            : '';
                        
                        const startDateDisplay = project.start_date 
                            ? new Date(project.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
                            : 'TBD';
                        
                        const createdAtDisplay = new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) + 
                                              ' at ' + new Date(project.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        
                        const updatedAtDisplay = new Date(project.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) + 
                                              ' at ' + new Date(project.updated_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                        
                        return `
                            <a href="/project/${project.id}" class="project-card" data-proj-id="${project.id}">
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
                        `;
                    }).join('');
                }
            } else {
                console.error('Error fetching projects:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
 * Utility functions to control the projects display.
 */
const readProjects = (allProjIds, projects) => {
    // Initial read of all projects and their ID's. WARNING: Mutates both arguments.
    Array.from(document.getElementsByClassName('project-card')).forEach(projCard => {
        projects[projCard.dataset.projId] = projCard;
        allProjIds.push(projCard.dataset.projId);
    });
}

const writeProjects = (order, projects) => {
    // Effectively empties the display and redraws.
    const display = document.getElementById('projects-display');
    
    display.replaceChildren(
        ...order.map(projId => projects[projId])
    );
};
