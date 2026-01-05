/**
 * Add Task Modal Functions
 */

function openTaskModal() {
    document.getElementById('addTaskModal').style.display = 'block';
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
}

function toggleCompletedTasks() {
    const checkbox = document.getElementById('toggleCompletedTasks');
    const completedTasks = document.querySelectorAll('.task-card[data-completed="true"]');
    
    completedTasks.forEach(task => {
        if (checkbox.checked) {
            task.classList.add('show-completed');
        } else {
            task.classList.remove('show-completed');
        }
    });
}

function selectDifficulty(difficulty) {
    // Update hidden input
    document.getElementById('task_difficulty').value = difficulty;
    
    // Remove active state from all buttons
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => {
        btn.style.background = 'rgba(0, 0, 0, 0.3)';
        btn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        btn.style.color = '#ffffff';
    });
    
    // Add active state to selected button
    const selectedBtn = document.querySelector(`[data-difficulty="${difficulty}"]`);
    if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100)';
        selectedBtn.style.borderColor = '#667eea';
        selectedBtn.style.color = '#ffffff';
    }
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
    const selectedBtn = document.querySelector(`[data-difficulty="${difficulty}"].edit-difficulty-btn`);
    if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100)';
        selectedBtn.style.borderColor = '#667eea';
        selectedBtn.style.color = '#ffffff';
    }
}

/**
 * Bind add task modal event listeners.
 */
function bindAddTaskModalListeners() {
    const addTaskModal = document.getElementById('addTaskModal');
    const addTaskModalContent = addTaskModal.querySelector('div[onclick*="stopPropagation"]');
    const toggleCompletedCheckbox = document.getElementById('toggleCompletedTasks');
    
    // Modal overlay close on outside click
    if (addTaskModal) {
        addTaskModal.addEventListener('mousedown', (evt) => {
            if (evt.currentTarget === evt.target) {
                closeAddTaskModal();
            }
        });
    }
    
    // Stop propagation on modal content
    if (addTaskModalContent) {
        addTaskModalContent.addEventListener('mousedown', (evt) => evt.stopPropagation());
        addTaskModalContent.addEventListener('click', (evt) => evt.stopPropagation());
    }
    
    // Toggle completed tasks checkbox
    if (toggleCompletedCheckbox) {
        toggleCompletedCheckbox.addEventListener('change', toggleCompletedTasks);
    }
}
