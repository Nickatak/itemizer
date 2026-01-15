/**
 * Task Management Functions for Project Detail Page
 * Handles all task-related operations on the project detail view
 */

// Global flag to track if currently dragging a task
let isTaskDragging = false;

// Fetch and render tasks from API
async function loadTasks() {
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                      window.location.pathname.split('/').pop();
    const container = document.getElementById('tasks-container');
    
    try {
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        const result = await response.json();
        
        if (!result.success) {
            container.innerHTML = '<div class="tasks-error">Error loading tasks</div>';
            return;
        }
        
        let tasks = result.data;
        const totalCount = result.total_count;
        
        // Sort tasks so incomplete tasks are first, completed tasks are last
        tasks.sort((a, b) => {
            if (a.is_completed !== b.is_completed) {
                return a.is_completed ? 1 : -1; // false (not completed) comes before true (completed)
            }
            return 0; // maintain order for tasks with same completion status
        });
        
        // Update task count
        document.getElementById('task-count').textContent = totalCount;
        
        // Show/hide drag hint
        const dragHint = document.getElementById('drag-hint');
        if (totalCount > 0) {
            dragHint.style.display = 'block';
        } else {
            dragHint.style.display = 'none';
        }
        
        if (tasks.length === 0) {
            container.innerHTML = '<div class="no-tasks">No tasks yet. Click "Add Task" to create your first task for this project.</div>';
            return;
        }
        
        // Create task cards HTML
        let tasksHTML = '';
        tasks.forEach((task, index) => {
            tasksHTML += generateTaskCardHTML(task, index);
        });
        
        container.innerHTML = tasksHTML;
        
        // Apply show-completed class if checkbox is checked
        const toggleCompletedCheckbox = document.getElementById('toggleCompletedTasks');
        if (toggleCompletedCheckbox && toggleCompletedCheckbox.checked) {
            const completedTasks = document.querySelectorAll('.task-card[data-completed="true"]');
            completedTasks.forEach(task => {
                task.classList.add('show-completed');
            });
        }
        
        // Re-attach event listeners to dynamically created buttons
        attachTaskEventListeners();
        
        // Re-initialize drag and drop
        initializeDragAndDrop();
    } catch (error) {
        console.error('Error loading tasks:', error);
        container.innerHTML = '<div class="tasks-error">Error loading tasks</div>';
    }
}

// Add a new task to the front of the task list
function addTaskToFront(task) {
    console.log('addTaskToFront called with task:', task);
    const container = document.getElementById('tasks-container');
    if (!container) {
        console.error('Task container not found');
        return;
    }
    
    // Generate HTML for the new task
    const newTaskHTML = generateTaskCardHTML(task, 0);
    
    // Create a temporary container to parse the HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = newTaskHTML;
    const newTaskElement = tempContainer.firstElementChild;
    
    if (!newTaskElement) {
        console.error('Failed to create task element');
        return;
    }
    
    // Prepend to the tasks container (insert as first child)
    if (container.firstChild) {
        container.insertBefore(newTaskElement, container.firstChild);
    } else {
        container.appendChild(newTaskElement);
    }
    
    console.log('Task prepended to container');
    
    // Update task count
    const taskCountElement = document.getElementById('task-count');
    if (taskCountElement) {
        const currentCount = parseInt(taskCountElement.textContent) || 0;
        taskCountElement.textContent = currentCount + 1;
    }
    
    // Show drag hint if hidden
    const dragHint = document.getElementById('drag-hint');
    if (dragHint && dragHint.style.display === 'none') {
        dragHint.style.display = 'block';
    }
    
    // Re-attach event listeners to the new task
    attachTaskEventListeners();
    
    // Re-initialize drag and drop with updated task list
    initializeDragAndDrop();
}

// Format date for display
function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const displayHours = date.getHours() % 12 || 12;
    
    return `${month} ${day} ${year} at ${displayHours}:${minutes} ${ampm}`;
}

// Generate HTML for a single task card
function generateTaskCardHTML(task, index) {
    // Build difficulty badge
    const difficultyClass = task.difficulty 
        ? `difficulty-${task.difficulty.toLowerCase().replace(/\s+/g, '-')}`
        : '';
    
    const difficultyBadge = task.difficulty
        ? `<span class="task-difficulty ${difficultyClass}">${task.difficulty}</span>`
        : '';
    
    // Build completion badge
    let completionClass = '';
    if (task.completion_percentage) {
        if (task.completion_percentage >= 90) {
            completionClass = 'completion-very-high';
        } else if (task.completion_percentage >= 70) {
            completionClass = 'completion-high';
        } else if (task.completion_percentage >= 50) {
            completionClass = 'completion-medium';
        } else if (task.completion_percentage >= 25) {
            completionClass = 'completion-low';
        } else {
            completionClass = 'completion-very-low';
        }
    }
    
    const completionBadge = task.completion_percentage
        ? `<span class="task-completion ${completionClass}">${task.completion_percentage}% complete</span>`
        : '';
    
    // Build status badge
    const statusBadge = task.is_completed
        ? '<span class="task-status completed">✓ Completed</span>'
        : '<span class="task-status pending">In Progress</span>';
    
    // Get description text
    const descriptionText = task.description
        ? task.description
        : '<em>No description</em>';
    
    // Build dates HTML
    let datesHTML = '';
    if (task.start_date) {
        const startDate = new Date(task.start_date);
        datesHTML += `<div class="task-date">Start: ${formatDate(startDate)}</div>`;
    }
    if (task.end_date) {
        const endDate = new Date(task.end_date);
        datesHTML += `<div class="task-date">End: ${formatDate(endDate)}</div>`;
    }
    
    // Format created date
    const createdDate = new Date(task.created_at);
    
    return `
        <div class="task-card" data-completed="${task.is_completed.toString().toLowerCase()}" data-task-id="${task.id}" data-task-name="${task.name}" data-task-description="${task.description || ''}" data-task-completed="${task.is_completed.toString().toLowerCase()}" data-task-start-date="${task.start_date ? task.start_date.split('T')[0] : ''}" data-task-end-date="${task.end_date ? task.end_date.split('T')[0] : ''}" data-task-difficulty="${task.difficulty || ''}" data-task-completion-percentage="${task.completion_percentage || 0}">
            <button type="button" class="delete-task-btn" data-task-id="${task.id}" title="Delete task">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
                </svg>
            </button>
            <div class="task-name"><span class="task-order-number">#${task.order}</span>${task.name}</div>
            <div class="task-description">${descriptionText}</div>
            <div class="task-details">
                ${difficultyBadge}
                ${completionBadge}
                ${statusBadge}
            </div>
            <div class="task-dates">${datesHTML}</div>
            <div class="task-meta">Created: ${formatDate(createdDate)}</div>
        </div>
    `;
}

// Attach event listeners to task elements
function attachTaskEventListeners() {
    // Attach task card click listeners for editing
    document.querySelectorAll('.task-card').forEach(card => {
        card.removeEventListener('click', handleTaskCardClick);
        card.addEventListener('click', handleTaskCardClick);
    });
    
    // Attach delete button listeners
    document.querySelectorAll('.delete-task-btn').forEach(button => {
        button.removeEventListener('click', handleDeleteTask);
        button.addEventListener('click', handleDeleteTask);
    });
}

// Handle task card click to open edit modal (but not if delete button was clicked or during drag)
function handleTaskCardClick(event) {
    // Don't open modal if currently dragging
    if (isTaskDragging) {
        return;
    }
    
    // Don't open modal if clicking the delete button
    if (event.target.closest('.delete-task-btn')) {
        return;
    }
    
    const taskCard = event.currentTarget;
    const taskId = taskCard.getAttribute('data-task-id');
    const taskName = taskCard.getAttribute('data-task-name');
    const taskDescription = taskCard.getAttribute('data-task-description');
    const taskCompleted = taskCard.getAttribute('data-task-completed') === 'true';
    const taskStartDate = taskCard.getAttribute('data-task-start-date');
    const taskEndDate = taskCard.getAttribute('data-task-end-date');
    const taskDifficulty = taskCard.getAttribute('data-task-difficulty');
    const taskCompletionPercentage = parseInt(taskCard.getAttribute('data-task-completion-percentage'));
    
    openEditTaskModal(taskId, taskName, taskDescription, taskCompleted, taskStartDate, taskEndDate, taskDifficulty, taskCompletionPercentage);
}

// Handle task delete button click - transforms to confirm state
function handleDeleteTask(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget.closest('.delete-task-btn');
    const taskId = button.getAttribute('data-task-id');
    
    // Check if button is already in confirm state
    if (button.classList.contains('confirm-state')) {
        deleteTask(taskId, button);
    } else {
        // Transform to confirm state
        button.classList.add('confirm-state');
        button.title = 'Click again to confirm deletion';
        button.innerHTML = `
            <div class="confirm-buttons">
                <button class="confirm-icon" title="Confirm delete">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                </button>
                <button class="cancel-icon" title="Cancel">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
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
            resetDeleteTaskButton(button);
        });
        
        // Auto-reset after 5 seconds if not confirmed
        setTimeout(() => {
            if (button.classList.contains('confirm-state')) {
                resetDeleteTaskButton(button);
            }
        }, 5000);
    }
}

// Reset delete task button to trash icon state
function resetDeleteTaskButton(button) {
    button.classList.remove('confirm-state');
    button.title = 'Delete task';
    button.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/>
        </svg>
    `;
}

// Delete a task via API
function deleteTask(taskId, button) {
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                    window.location.pathname.split('/').pop();
    
    fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the task card from the DOM
            const taskCard = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskCard) {
                taskCard.remove();
                // Update order numbers for remaining tasks
                updateTaskOrderNumbers();
                // Reload tasks to get updated count
                loadTasks();
            }
        } else {
            alert('Error deleting task: ' + (data.error || 'Unknown error'));
            if (button) {
                resetDeleteTaskButton(button);
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting task: ' + error.message);
        if (button) {
            resetDeleteTaskButton(button);
        }
    });
}

// Initialize drag and drop functionality for tasks
function initializeDragAndDrop() {
    const tasksList = document.querySelector('.tasks-list');
    if (!tasksList) return;
    
    let draggedElement = null;
    let orderChanged = false;
    
    document.querySelectorAll('.task-card').forEach(taskCard => {
        taskCard.draggable = true;
        
        taskCard.addEventListener('dragstart', (e) => {
            isTaskDragging = true;
            draggedElement = taskCard;
            taskCard.style.opacity = '0.5';
            orderChanged = false;
        });
        
        taskCard.addEventListener('dragend', (e) => {
            taskCard.style.opacity = '1';
            isTaskDragging = false;
            
            // Save new order if dragged element exists
            if (draggedElement && orderChanged) {
                saveTaskOrder(tasksList);
            }
            
            draggedElement = null;
            orderChanged = false;
        });
        
        taskCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (draggedElement && draggedElement !== taskCard) {
                const rect = taskCard.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                
                if (e.clientY < midpoint) {
                    taskCard.parentNode.insertBefore(draggedElement, taskCard);
                } else {
                    taskCard.parentNode.insertBefore(draggedElement, taskCard.nextSibling);
                }
                // Update the order numbers displayed on all task cards
                updateTaskOrderNumbers();
                orderChanged = true;
            }
        });
    });
}

// Update the order numbers displayed on all task cards
function updateTaskOrderNumbers() {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach((card, index) => {
        const orderSpan = card.querySelector('.task-order-number');
        if (orderSpan) {
            orderSpan.textContent = `#${index + 1}`;
        }
    });
}

// Save task order to server
function saveTaskOrder(tasksList) {
    const taskCards = document.querySelectorAll('.task-card');
    const taskOrder = Array.from(taskCards).map((card, index) => ({
        task_id: parseInt(card.getAttribute('data-task-id')),
        order: index + 1
    }));
    
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                    window.location.pathname.split('/').pop();
    
    tasksList.style.opacity = '0.6';
    
    fetch(`/api/projects/${projectId}/reorder-tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task_order: taskOrder })
    })
    .then(response => response.json())
    .then(data => {
        tasksList.style.opacity = '1';
        
        if (!data.success) {
            console.error('Error saving task order:', data.error);
            alert('Error saving task order: ' + (data.error || 'Unknown error') + '\nPlease try again.');
        }
    })
    .catch(error => {
        tasksList.style.opacity = '1';
        console.error('Error:', error);
        alert('Error saving task order: ' + error.message + '\nChanges may not be persisted.');
    });
}

// Initialize tasks module
function initializeTasks() {
    loadTasks();
}
