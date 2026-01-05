// This will be mutated exactly once on page load.  It's a global static reference.
const allProjIds = [];
const projects = {}

window.onload = () => {
    bindListeners();
    // Just keeps a live-list order of ID's and re-renders the projects as needed.

    readProjects(allProjIds, projects);

    console.log(allProjIds, projects);

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

    const sortDropdown = document.getlementById('sort-dropdown');
    const filterToggle = document.getElementById('filter-toggle');
    const sortValue = sortDropdown.value;
    const filterValue = filterToggle.checked ? 'active' : 'all';
    
    let url = `?sort=${sortValue}`;
    if (filterValue !== 'all') {
        url += `&filter=${filterValue}`;
    }
    window.location.href = url;
}

function changeFilter() {
    const sortDropdown = document.getElementById('sort-dropdown');
    const filterToggle = document.getElementById('filter-toggle');
    const sortValue = sortDropdown.value;
    const filterValue = filterToggle.checked ? 'active' : 'all';
    
    let url = `?filter=${filterValue}`;
    if (sortValue !== 'created_at') {
        url += `&sort=${sortValue}`;
    }
    window.location.href = url;
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

