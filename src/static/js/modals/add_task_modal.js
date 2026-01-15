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
        selectedBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100)';
        selectedBtn.style.borderColor = '#00ff88';
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
        selectedBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100)';
        selectedBtn.style.borderColor = '#00ff88';
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
    
    // Handle create task form submission
    const createTaskForm = document.getElementById('createTaskForm');
    if (createTaskForm) {
        createTaskForm.removeEventListener('submit', handleCreateTaskSubmit);
        createTaskForm.addEventListener('submit', handleCreateTaskSubmit);
    }
}

/**
 * Handle create task form submission
 */
function handleCreateTaskSubmit(event) {
    event.preventDefault();
    
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                      window.location.pathname.split('/').pop();
    
    const taskData = {
        name: document.getElementById('task_name').value,
        description: document.getElementById('task_description').value || null,
        project_id: parseInt(projectId),
        is_completed: document.getElementById('task_is_completed').checked,
        start_date: document.getElementById('task_start_date').value || null,
        end_date: document.getElementById('task_end_date').value || null,
        difficulty: document.getElementById('task_difficulty').value || null,
        completion_percentage: parseInt(document.getElementById('task_completion_percentage').value) || 0
    };
    
    // Remove null values
    if (!taskData.description) delete taskData.description;
    if (!taskData.start_date) delete taskData.start_date;
    if (!taskData.end_date) delete taskData.end_date;
    if (!taskData.difficulty) delete taskData.difficulty;
    
    // Create the task via API
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeAddTaskModal();
            // Reset form
            document.getElementById('createTaskForm').reset();
            document.getElementById('task_difficulty').value = '';
            // Add new task to the front of the list without reloading
            try {
                // Always add new task to front if we have the data
                if (data.data) {
                    if (typeof addTaskToFront === 'function') {
                        addTaskToFront(data.data);
                    } else {
                        console.warn('addTaskToFront function not available, reloading tasks');
                        if (typeof loadTasks === 'function') {
                            loadTasks();
                        }
                    }
                } else {
                    console.warn('No task data in response, reloading tasks');
                    if (typeof loadTasks === 'function') {
                        loadTasks();
                    }
                }
            } catch (error) {
                console.error('Error adding task:', error);
                // Fallback to reload on error
                if (typeof loadTasks === 'function') {
                    loadTasks();
                }
            }
        } else {
            throw new Error(data.error || 'Failed to create task');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}
