/**
 * Modal utility functions.
 */

const openModal = () => {
    document.getElementById('createModal').style.display = 'block';
}

const closeModal = () => {
    document.getElementById('createModal').style.display = 'none';
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
    const modal = document.getElementById('createModal');
    const modalContent = document.querySelector('.modal-content');
    const createProjBtn = document.getElementById('create-proj');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Modal overlay close on outside click
    modal.addEventListener('mousedown', handleModalMouseDown);
    
    // Stop propagation on modal content
    modalContent.addEventListener('mousedown', handleModalContentEvents);
    modalContent.addEventListener('click', handleModalContentEvents);
    
    // Button handlers
    createProjBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
}
