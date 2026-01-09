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
    const selectedBtn = document.querySelector(`.difficulty-btn[data-difficulty="${difficulty}"]`);
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
    const selectedBtn = document.querySelector(`.edit-difficulty-btn[data-difficulty="${difficulty}"]`);
    if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100)';
        selectedBtn.style.borderColor = '#667eea';
        selectedBtn.style.color = '#ffffff';
    }
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
    
    // Delete project button
    const deleteProjectBtn = document.querySelector('.delete-btn');
    if (deleteProjectBtn) {
        deleteProjectBtn.addEventListener('click', showDeleteConfirmation);
    }
    
    // Delete project confirmation
    const deleteConfirmBtn = document.querySelector('.delete-confirmation .delete-confirm-btn');
    if (deleteConfirmBtn) {
        const projectId = deleteConfirmBtn.dataset.projectId;
        deleteConfirmBtn.addEventListener('click', () => performDelete(projectId));
    }
    
    const deleteCancelBtn = document.querySelector('.delete-confirmation .cancel-btn');
    if (deleteCancelBtn) {
        deleteCancelBtn.addEventListener('click', hideDeleteConfirmation);
    }
    
    // Add task button
    const addTaskBtn = document.querySelector('.add-task-btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', openTaskModal);
    }
    
    // Close add task modal
    const closeAddTaskBtn = document.querySelector('#addTaskModal .close');
    if (closeAddTaskBtn) {
        closeAddTaskBtn.addEventListener('click', closeAddTaskModal);
    }
    
    // Close edit task modal
    const closeEditTaskBtn = document.querySelector('#editTaskModal .close');
    if (closeEditTaskBtn) {
        closeEditTaskBtn.addEventListener('click', closeEditTaskModal);
    }
    
    // Add material button
    const addMaterialBtn = document.querySelector('.add-material-btn');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', openMaterialModal);
    }
    
    // Difficulty buttons
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectDifficulty(this.dataset.difficulty);
        });
    });
    
    // Edit difficulty buttons
    const editDifficultyBtns = document.querySelectorAll('.edit-difficulty-btn');
    editDifficultyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            selectEditDifficulty(this.dataset.difficulty);
        });
    });
    
    // Edit task buttons
    const editTaskBtns = document.querySelectorAll('.edit-task-btn-inline');
    editTaskBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const taskId = this.dataset.taskId;
            const name = this.dataset.taskName;
            const description = this.dataset.taskDescription;
            const isCompleted = this.dataset.taskCompleted === 'true';
            const startDate = this.dataset.taskStartDate;
            const endDate = this.dataset.taskEndDate;
            const difficulty = this.dataset.taskDifficulty;
            const completionPercentage = this.dataset.taskCompletionPercentage;
            openEditTaskModal(taskId, name, description, isCompleted, startDate, endDate, difficulty, completionPercentage);
        });
    });
    
    // Edit material buttons
    const editMaterialBtns = document.querySelectorAll('.edit-material-btn');
    editMaterialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialId = this.dataset.materialId;
            const name = this.dataset.materialName;
            const description = this.dataset.materialDescription;
            const price = this.dataset.materialPrice;
            const link = this.dataset.materialLink;
            const specificationNotes = this.dataset.materialSpecificationNotes;
            const tagIds = JSON.parse(this.dataset.materialTags || '[]');
            openEditMaterialModal(materialId, name, description, price, link, specificationNotes, tagIds);
        });
    });
    
    // Remove material buttons
    const removeMaterialBtns = document.querySelectorAll('.remove-material-btn');
    removeMaterialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialId = this.dataset.materialId;
            showMaterialDeleteConfirmation(materialId);
        });
    });
    
    // Remove material confirm buttons
    const removeMaterialConfirmBtns = document.querySelectorAll('.material-delete-confirmation .delete-confirm-btn');
    removeMaterialConfirmBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.dataset.projectId;
            const materialId = this.dataset.materialId;
            performMaterialDelete(projectId, materialId);
        });
    });
    
    // Remove material cancel buttons
    const removeMaterialCancelBtns = document.querySelectorAll('.material-delete-confirmation .cancel-btn');
    removeMaterialCancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialId = this.dataset.materialId;
            hideMaterialDeleteConfirmation(materialId);
        });
    });
    
    // Modal stop propagation
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(modal => {
        modal.addEventListener('mousedown', function(e) {
            if (e.target === this) {
                if (this.id === 'addTaskModal') closeAddTaskModal();
                if (this.id === 'editTaskModal') closeEditTaskModal();
                if (this.id === 'editMaterialModal') closeEditMaterialModal();
                if (this.id === 'addMaterialModal') closeMaterialModal();
            }
        });
        
        const modalContent = modal.querySelector(':scope > div');
        if (modalContent) {
            modalContent.addEventListener('mousedown', (e) => e.stopPropagation());
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }
    });
    
    // Toggle completed tasks checkbox
    const toggleCompletedCheckbox = document.getElementById('toggleCompletedTasks');
    if (toggleCompletedCheckbox) {
        toggleCompletedCheckbox.addEventListener('change', toggleCompletedTasks);
    }
    
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

