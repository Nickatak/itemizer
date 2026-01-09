function openTaskModal() {
    document.getElementById('addTaskModal').style.display = 'block';
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').style.display = 'none';
}

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

function showDeleteConfirmation() {
    document.getElementById('deleteConfirmation').classList.remove('hidden');
}

function hideDeleteConfirmation() {
    document.getElementById('deleteConfirmation').classList.add('hidden');
}

function performDelete(projectId) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/project/${projectId}/delete`;
    document.body.appendChild(form);
    form.submit();
}

function showMaterialDeleteConfirmation(materialId) {
    document.getElementById(`materialDeleteConfirmation-${materialId}`).classList.remove('hidden');
}

function hideMaterialDeleteConfirmation(materialId) {
    document.getElementById(`materialDeleteConfirmation-${materialId}`).classList.add('hidden');
}

function performMaterialDelete(projectId, materialId) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/project/${projectId}/remove_material/${materialId}`;
    document.body.appendChild(form);
    form.submit();
}

document.addEventListener('DOMContentLoaded', function() {
    // Bind add task modal listeners
    bindAddTaskModalListeners();
    
    // Bind edit task modal listeners
    bindEditTaskModalListeners();
    
    // Bind material modal listeners
    bindMaterialModalListeners();
    
    // Bind edit material modal listeners
    bindEditMaterialModalListeners();
});

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
        selectedBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100)';
        selectedBtn.style.borderColor = '#667eea';
        selectedBtn.style.color = '#ffffff';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Edit task form submission
    const editTaskForm = document.getElementById('editTaskForm');
    if (editTaskForm) {
        editTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditTaskForm();
        });
    }
    
    // Edit task completion checkbox
    const editCompletionCheckbox = document.getElementById('edit_task_is_completed');
    if (editCompletionCheckbox) {
        editCompletionCheckbox.addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('edit_task_completion_percentage').value = '100';
            }
        });
    }
});

function submitEditTaskForm() {
    const taskId = document.getElementById('edit_task_id').value;
    const name = document.getElementById('edit_task_name').value;
    const description = document.getElementById('edit_task_description').value;
    const isCompleted = document.getElementById('edit_task_is_completed').checked;
    const startDate = document.getElementById('edit_task_start_date').value;
    const endDate = document.getElementById('edit_task_end_date').value;
    const difficulty = document.getElementById('edit_task_difficulty').value;
    const completionPercentage = document.getElementById('edit_task_completion_percentage').value;
    
    fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            description: description,
            is_completed: isCompleted,
            start_date: startDate,
            end_date: endDate,
            difficulty: difficulty,
            completion_percentage: completionPercentage ? parseInt(completionPercentage) : 0
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Task updated successfully!');
            closeTaskModal();
            // Reset forms
            document.getElementById('createTaskForm').style.display = 'block';
            document.getElementById('editTaskForm').style.display = 'none';
            document.getElementById('taskModalTitle').textContent = 'Add New Task';
            // Reload page to see updates
            location.reload();
        } else {
            alert('Error updating task: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating task');
    });
}

