/**
 * Edit Task Modal Functions
 */

function openEditTaskModal(taskId, name, description, isCompleted, startDate, endDate, difficulty, completionPercentage) {
    document.getElementById('editTaskModal').style.display = 'block';
    
    // Populate form fields
    document.getElementById('edit_task_id').value = taskId;
    document.getElementById('edit_task_name').value = name;
    document.getElementById('edit_task_description').value = description;
    document.getElementById('edit_task_is_completed').checked = isCompleted;
    document.getElementById('edit_task_start_date').value = startDate;
    document.getElementById('edit_task_end_date').value = endDate;
    document.getElementById('edit_task_difficulty').value = difficulty;
    document.getElementById('edit_task_completion_percentage').value = completionPercentage;
}

function closeEditTaskModal() {
    document.getElementById('editTaskModal').style.display = 'none';
}

function selectEditDifficulty(difficulty) {
    // Update hidden input
    document.getElementById('edit_task_difficulty').value = difficulty;
    
    // Remove active state from all buttons
    const buttons = document.querySelectorAll('.edit-difficulty-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(0, 0, 0, 0.3)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        btn.style.color = '#ffffff';
    });
    
    // Add active state to selected button
    const selectedBtn = document.querySelector(`.edit-difficulty-btn[data-difficulty="${difficulty}"]`);
    if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100)';
        selectedBtn.style.borderColor = '#00ff88';
        selectedBtn.style.color = '#ffffff';
    }
}

/**
 * Bind edit task modal event listeners.
 */
function bindEditTaskModalListeners() {
    const editTaskModal = document.getElementById('editTaskModal');
    const editTaskModalContent = editTaskModal.querySelector('div[onclick*="stopPropagation"]');
    
    // Modal overlay close on outside click
    if (editTaskModal) {
        editTaskModal.addEventListener('mousedown', (evt) => {
            if (evt.currentTarget === evt.target) {
                closeEditTaskModal();
            }
        });
    }
    
    // Stop propagation on modal content
    if (editTaskModalContent) {
        editTaskModalContent.addEventListener('mousedown', (evt) => evt.stopPropagation());
        editTaskModalContent.addEventListener('click', (evt) => evt.stopPropagation());
    }
}
