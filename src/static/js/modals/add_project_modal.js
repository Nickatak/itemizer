/**
 * Handle project creation form submission
 */
const handleCreateProjectSubmit = async (evt) => {
    evt.preventDefault();
    
    const form = document.getElementById('createProjectForm');
    const formData = new FormData(form);
    
    const projectData = {
        name: formData.get('name'),
        description: formData.get('description'),
        start_date: formData.get('start_date') || null,
        end_date: formData.get('end_date') || null
    };
    
    try {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            form.reset();
            closeModal();
            // Reload projects
            fetchAndRenderProjects();
        } else {
            alert('Error creating project: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating project: ' + error.message);
    }
};

/**
 * Modal utility functions.
 */

const openModal = () => {
    document.getElementById('createProjectModal').style.display = 'block';
}

const closeModal = () => {
    document.getElementById('createProjectModal').style.display = 'none';
}

/**
 * Handle mousedown on modal overlay to close on outside click.
 */
const handleModalMouseDown = (evt) => {
    if (evt.currentTarget === evt.target) {
        closeModal();
    }
}

/**
 * Stop propagation of mousedown and click events on modal content.
 */
const handleModalContentEvents = (evt) => {
    evt.stopPropagation();
}

/**
 * Bind modal event listeners.
 */
const bindModalListeners = () => {
    const modal = document.getElementById('createProjectModal');
    const modalContent = document.querySelector('.modal-content');
    const createProjBtn = document.getElementById('create-proj');
    const closeModalBtn = document.getElementById('close-modal');
    const createProjectForm = document.getElementById('createProjectForm');
    
    // Modal overlay close on outside click
    modal.addEventListener('mousedown', handleModalMouseDown);
    
    // Stop propagation on modal content
    modalContent.addEventListener('mousedown', handleModalContentEvents);
    modalContent.addEventListener('click', handleModalContentEvents);
    
    // Button handlers
    createProjBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Form submission
    if (createProjectForm) {
        createProjectForm.addEventListener('submit', handleCreateProjectSubmit);
    }
}
