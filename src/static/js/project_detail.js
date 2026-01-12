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
    const selectedBtn = document.querySelector(`.edit-difficulty-btn[data-difficulty="${difficulty}"]`);
    if (selectedBtn) {
        selectedBtn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100)';
        selectedBtn.style.borderColor = '#00ff88';
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
    
    // Close edit task modal cancel button
    const closeEditTaskCancelBtn = document.querySelector('#editTaskModal .cancel-btn');
    if (closeEditTaskCancelBtn) {
        closeEditTaskCancelBtn.addEventListener('click', closeEditTaskModal);
    }
    
    // Close edit task modal close button
    const closeEditTaskBtn = document.querySelector('#editTaskModal .close');
    if (closeEditTaskBtn) {
        closeEditTaskBtn.addEventListener('click', closeEditTaskModal);
    }
    
    // Edit task modal click outside to close
    const editTaskModal = document.getElementById('editTaskModal');
    if (editTaskModal) {
        editTaskModal.addEventListener('mousedown', function(e) {
            if (e.target === this) {
                closeEditTaskModal();
            }
        });
        
        const modalContent = editTaskModal.querySelector(':scope > div');
        if (modalContent) {
            modalContent.addEventListener('mousedown', (e) => e.stopPropagation());
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }
    }
    
    // Add material button
    const addMaterialBtn = document.querySelector('.add-material-btn');
    if (addMaterialBtn) {
        addMaterialBtn.addEventListener('click', openMaterialModal);
    }
    
    // Material modal close button
    const closeMaterialBtn = document.querySelector('#materialModal .close');
    if (closeMaterialBtn) {
        closeMaterialBtn.addEventListener('click', closeMaterialModal);
    }
    
    // Edit material modal close button
    const closeEditMaterialBtn = document.querySelector('#editMaterialModal .close');
    if (closeEditMaterialBtn) {
        closeEditMaterialBtn.addEventListener('click', closeEditMaterialModal);
    }
    
    // Edit material modal cancel button
    const editMaterialCancelBtn = document.querySelector('#editMaterialModal .material-button-group button:last-of-type');
    if (editMaterialCancelBtn) {
        editMaterialCancelBtn.addEventListener('click', closeEditMaterialModal);
    }
    
    // Material modal tab buttons
    const tabButtons = document.querySelectorAll('#materialModal .tab-button');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showMaterialTab(this.dataset.tab);
        });
    });
    
    // Material modal click outside to close
    const materialModal = document.getElementById('materialModal');
    if (materialModal) {
        materialModal.addEventListener('mousedown', function(e) {
            if (e.target === this) {
                closeMaterialModal();
            }
        });
        
        const modalContent = materialModal.querySelector(':scope > div');
        if (modalContent) {
            modalContent.addEventListener('mousedown', (e) => e.stopPropagation());
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }
    }
    
    // Edit material modal click outside to close
    const editMaterialModal = document.getElementById('editMaterialModal');
    if (editMaterialModal) {
        editMaterialModal.addEventListener('mousedown', function(e) {
            if (e.target === this) {
                closeEditMaterialModal();
            }
        });
        
        const modalContent = editMaterialModal.querySelector(':scope > div');
        if (modalContent) {
            modalContent.addEventListener('mousedown', (e) => e.stopPropagation());
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }
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
    
    // Toggle completed tasks checkbox
    const toggleCompletedCheckbox = document.getElementById('toggleCompletedTasks');
    if (toggleCompletedCheckbox) {
        toggleCompletedCheckbox.addEventListener('change', toggleCompletedTasks);
    }
    
    // Initialize drag and drop for tasks
    initializeTaskDragAndDrop();
    
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
    
    // Tag creation button
    const createTagBtn = document.getElementById('create-tag-btn');
    if (createTagBtn) {
        createTagBtn.addEventListener('click', createNewTag);
    }
    
    // Material form submission for new tags
    const materialForm = document.querySelector('form[action="/materials"]');
    if (materialForm) {
        materialForm.addEventListener('submit', handleMaterialFormSubmission);
    }
    
    // Contact option select
    const contactOption = document.getElementById('contact_option');
    if (contactOption) {
        contactOption.addEventListener('change', handleContactOption);
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
            closeEditTaskModal();
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

// Tag management variables and handlers
let newTags = {};

function createNewTag() {
    const tagName = document.getElementById('new_tag_name').value.trim();
    const tagColor = document.getElementById('new_tag_color').value;
    
    if (!tagName) {
        alert('Please enter a tag name');
        return;
    }
    
    // Check if tag already exists in the existing tags list
    const existingCheckboxes = document.querySelectorAll('#tags-list input[type="checkbox"]');
    for (let checkbox of existingCheckboxes) {
        const label = checkbox.closest('label');
        const tagSpan = label.querySelector('span');
        if (tagSpan.textContent === tagName) {
            // Tag exists, just check it
            checkbox.checked = true;
            document.getElementById('new_tag_name').value = '';
            document.getElementById('new_tag_color').value = '#00ff88';
            alert(`Tag "${tagName}" already exists and has been selected.`);
            return;
        }
    }
    
    // Check if tag already exists in new tags
    for (let tagId in newTags) {
        if (newTags[tagId].name === tagName) {
            alert(`Tag "${tagName}" has already been created in this form.`);
            return;
        }
    }
    
    // Create new tag
    const tagId = 'new_' + Object.keys(newTags).length;
    newTags[tagId] = { name: tagName, color: tagColor };
    
    const container = document.getElementById('new-tags-container');
    const label = document.createElement('label');
    label.className = 'new-tag-label';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'tags';
    checkbox.value = tagId;
    checkbox.checked = true;
    checkbox.className = 'new-tag-checkbox';
    
    const span = document.createElement('span');
    span.textContent = tagName;
    span.className = 'new-tag-badge';
    span.style.backgroundColor = tagColor;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.className = 'new-tag-remove-btn';
    removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        label.remove();
        delete newTags[tagId];
    });
    
    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(removeBtn);
    container.appendChild(label);
    
    document.getElementById('new_tag_name').value = '';
    document.getElementById('new_tag_color').value = '#00ff88';
}

function handleMaterialFormSubmission(e) {
    // Add hidden inputs for new tags
    Object.keys(newTags).forEach((tagId) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'new_tags[]';
        input.value = JSON.stringify({id: tagId, name: newTags[tagId].name, color: newTags[tagId].color});
        e.target.appendChild(input);
    });
}

// Material Modal Functions
function openMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) modal.style.display = 'block';
    showMaterialTab('search');
}

function closeMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) modal.style.display = 'none';
}

function showMaterialTab(tabName) {
    // Get the material modal
    const materialModal = document.getElementById('materialModal');
    if (!materialModal) return;
    
    // Hide all tab contents within the material modal
    const tabContents = materialModal.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Remove active state from all tabs within the material modal
    const tabButtons = materialModal.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab and mark as active
    const selectedContent = document.getElementById(tabName + 'Content');
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

// Edit Material Modal Functions
function openEditMaterialModal(materialId, name, description, price, link, specificationNotes, tagIds) {
    const modal = document.getElementById('editMaterialModal');
    if (modal) modal.style.display = 'block';
    
    // Populate form fields
    document.getElementById('editMaterialId').value = materialId;
    document.getElementById('edit_material_name').value = name;
    document.getElementById('edit_material_description').value = description;
    document.getElementById('edit_material_price').value = price;
    document.getElementById('edit_material_link').value = link;
    document.getElementById('edit_material_specification_notes').value = specificationNotes;
    
    // Set tag checkboxes
    const tagCheckboxes = document.querySelectorAll('#edit_tags-list input[type="checkbox"]');
    tagCheckboxes.forEach(checkbox => {
        checkbox.checked = tagIds.includes(parseInt(checkbox.value));
    });
}

function closeEditMaterialModal() {
    const modal = document.getElementById('editMaterialModal');
    if (modal) modal.style.display = 'none';
}

// Contact Option Handler
function handleContactOption() {
    const option = document.getElementById('contact_option').value;
    const selectDiv = document.getElementById('select_contact_div');
    const createDiv = document.getElementById('create_contact_div');
    
    if (selectDiv) selectDiv.style.display = option === 'select' ? 'block' : 'none';
    if (createDiv) createDiv.style.display = option === 'create' ? 'block' : 'none';
}


function bindEditTaskModalListeners() {
    // Already handled in DOMContentLoaded
}

function bindMaterialModalListeners() {
    const searchInput = document.getElementById('materialSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const materials = document.querySelectorAll('.material-item');
            materials.forEach(material => {
                const name = material.dataset.name || '';
                const description = material.dataset.description || '';
                const matches = name.includes(searchTerm) || description.includes(searchTerm);
                material.style.display = matches ? 'block' : 'none';
            });
        });
    }
}

function bindEditMaterialModalListeners() {
    const editCreateTagBtn = document.getElementById('edit_create-tag-btn');
    if (editCreateTagBtn) {
        editCreateTagBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createEditNewTag();
        });
    }
    
    const editForm = document.getElementById('editMaterialForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditMaterialForm();
        });
    }
}

function createEditNewTag() {
    const tagName = document.getElementById('edit_new_tag_name').value.trim();
    const tagColor = document.getElementById('edit_new_tag_color').value;
    
    if (!tagName) {
        alert('Please enter a tag name');
        return;
    }
    
    // Check if tag already exists in the existing tags list
    const existingCheckboxes = document.querySelectorAll('#edit_tags-list input[type="checkbox"]');
    for (let checkbox of existingCheckboxes) {
        const label = checkbox.closest('label');
        const tagSpan = label.querySelector('span');
        if (tagSpan.textContent === tagName) {
            checkbox.checked = true;
            document.getElementById('edit_new_tag_name').value = '';
            document.getElementById('edit_new_tag_color').value = '#00ff88';
            alert(`Tag "${tagName}" already exists and has been selected.`);
            return;
        }
    }
    
    // Check if tag already exists in new tags
    for (let tagId in newTags) {
        if (newTags[tagId].name === tagName) {
            alert(`Tag "${tagName}" has already been created in this form.`);
            return;
        }
    }
    
    // Create new tag
    const tagId = 'edit_new_' + Object.keys(newTags).length;
    newTags[tagId] = { name: tagName, color: tagColor };
    
    const container = document.getElementById('edit_new-tags-container');
    const label = document.createElement('label');
    label.className = 'new-tag-label';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'edit_tags';
    checkbox.value = tagId;
    checkbox.checked = true;
    checkbox.className = 'new-tag-checkbox';
    
    const span = document.createElement('span');
    span.textContent = tagName;
    span.className = 'new-tag-badge';
    span.style.backgroundColor = tagColor;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.className = 'new-tag-remove-btn';
    removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        label.remove();
        delete newTags[tagId];
    });
    
    label.appendChild(checkbox);
    label.appendChild(span);
    label.appendChild(removeBtn);
    container.appendChild(label);
    
    document.getElementById('edit_new_tag_name').value = '';
    document.getElementById('edit_new_tag_color').value = '#00ff88';
}

function submitEditMaterialForm() {
    const materialId = document.getElementById('editMaterialId').value;
    const name = document.getElementById('edit_material_name').value;
    const description = document.getElementById('edit_material_description').value;
    const price = document.getElementById('edit_material_price').value;
    const link = document.getElementById('edit_material_link').value;
    const specificationNotes = document.getElementById('edit_material_specification_notes').value;
    
    // Get selected tag IDs
    const tagCheckboxes = document.querySelectorAll('#editMaterialForm input[name="edit_tags"]:checked');
    const tagIds = Array.from(tagCheckboxes).map(cb => cb.value);
    
    fetch(`/api/materials/${materialId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            description: description,
            price: price ? parseFloat(price) : null,
            link: link,
            specification_notes: specificationNotes,
            tags: tagIds
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeEditMaterialModal();
            location.reload();
        } else {
            alert('Error updating material: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating material');
    });
}

// Description edit functionality
document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('editDescriptionBtn');
    const cancelBtn = document.getElementById('cancelDescriptionBtn');
    const saveBtn = document.getElementById('saveDescriptionBtn');
    const descriptionView = document.getElementById('descriptionView');
    const descriptionEdit = document.getElementById('descriptionEdit');
    const descriptionTextarea = document.getElementById('descriptionTextarea');

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            descriptionView.style.display = 'none';
            descriptionEdit.style.display = 'block';
            descriptionTextarea.focus();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            descriptionEdit.style.display = 'none';
            descriptionView.style.display = 'block';
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveField('description', descriptionTextarea.value, descriptionView, descriptionEdit);
        });
    }

    // Name edit functionality
    const editNameBtn = document.getElementById('editNameBtn');
    const cancelNameBtn = document.getElementById('cancelNameBtn');
    const saveNameBtn = document.getElementById('saveNameBtn');
    const nameView = document.getElementById('nameView');
    const nameEdit = document.getElementById('nameEdit');
    const nameInput = document.getElementById('nameInput');

    if (editNameBtn) {
        editNameBtn.addEventListener('click', function() {
            nameView.style.display = 'none';
            nameEdit.style.display = 'block';
            nameInput.focus();
        });
    }

    if (cancelNameBtn) {
        cancelNameBtn.addEventListener('click', function() {
            nameEdit.style.display = 'none';
            nameView.style.display = 'block';
        });
    }

    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', function() {
            saveField('name', nameInput.value, nameView, nameEdit);
        });
    }

    // Start Date edit functionality
    const editStartDateBtn = document.getElementById('editStartDateBtn');
    const cancelStartDateBtn = document.getElementById('cancelStartDateBtn');
    const saveStartDateBtn = document.getElementById('saveStartDateBtn');
    const startDateView = document.getElementById('startDateView');
    const startDateEdit = document.getElementById('startDateEdit');
    const startDateInput = document.getElementById('startDateInput');

    if (editStartDateBtn) {
        editStartDateBtn.addEventListener('click', function() {
            startDateView.style.display = 'none';
            startDateEdit.style.display = 'block';
            startDateInput.focus();
        });
    }

    if (cancelStartDateBtn) {
        cancelStartDateBtn.addEventListener('click', function() {
            startDateEdit.style.display = 'none';
            startDateView.style.display = 'block';
        });
    }

    if (saveStartDateBtn) {
        saveStartDateBtn.addEventListener('click', function() {
            saveField('start_date', startDateInput.value, startDateView, startDateEdit);
        });
    }

    // End Date edit functionality
    const editEndDateBtn = document.getElementById('editEndDateBtn');
    const cancelEndDateBtn = document.getElementById('cancelEndDateBtn');
    const saveEndDateBtn = document.getElementById('saveEndDateBtn');
    const endDateView = document.getElementById('endDateView');
    const endDateEdit = document.getElementById('endDateEdit');
    const endDateInput = document.getElementById('endDateInput');

    if (editEndDateBtn) {
        editEndDateBtn.addEventListener('click', function() {
            endDateView.style.display = 'none';
            endDateEdit.style.display = 'block';
            endDateInput.focus();
        });
    }

    if (cancelEndDateBtn) {
        cancelEndDateBtn.addEventListener('click', function() {
            endDateEdit.style.display = 'none';
            endDateView.style.display = 'block';
        });
    }

    if (saveEndDateBtn) {
        saveEndDateBtn.addEventListener('click', function() {
            saveField('end_date', endDateInput.value, endDateView, endDateEdit);
        });
    }

    // Status edit functionality
    const editStatusBtn = document.getElementById('editStatusBtn');
    const cancelStatusBtn = document.getElementById('cancelStatusBtn');
    const saveStatusBtn = document.getElementById('saveStatusBtn');
    const statusView = document.getElementById('statusView');
    const statusEdit = document.getElementById('statusEdit');
    const statusCheckbox = document.getElementById('statusCheckbox');

    if (editStatusBtn) {
        editStatusBtn.addEventListener('click', function() {
            statusView.style.display = 'none';
            statusEdit.style.display = 'block';
            statusCheckbox.focus();
        });
    }

    if (cancelStatusBtn) {
        cancelStatusBtn.addEventListener('click', function() {
            statusEdit.style.display = 'none';
            statusView.style.display = 'block';
        });
    }

    if (saveStatusBtn) {
        saveStatusBtn.addEventListener('click', function() {
            saveField('is_complete', statusCheckbox.checked, statusView, statusEdit);
        });
    }

    // Generic save field function
    function saveField(fieldName, value, viewElement, editElement) {
        const projectId = window.location.pathname.split('/').pop();

        const payload = {};
        payload[fieldName] = value;

        fetch(`/api/projects/${projectId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the display
                updateFieldDisplay(fieldName, value, viewElement);
                editElement.style.display = 'none';
                viewElement.style.display = 'block';
            } else {
                alert('Error updating field: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating field');
        });
    }

    // Update field display based on field type
    function updateFieldDisplay(fieldName, value, viewElement) {
        if (fieldName === 'name') {
            viewElement.innerHTML = `<div class="name-text">${value || 'Unnamed'}</div>`;
        } else if (fieldName === 'description') {
            if (value.trim()) {
                viewElement.innerHTML = `<div class="description-text">${value}</div>`;
            } else {
                viewElement.innerHTML = `<div class="no-description">No description provided.</div>`;
            }
        } else if (fieldName === 'start_date' || fieldName === 'end_date') {
            if (value) {
                const date = new Date(value);
                const formatted = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }) + 
                                ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                viewElement.innerHTML = `<div class="date-text">${formatted}</div>`;
            } else {
                const label = fieldName === 'start_date' ? 'Start Date' : 'End Date';
                viewElement.innerHTML = `<div class="date-text"><em>${label} Undetermined</em></div>`;
            }
        } else if (fieldName === 'is_complete') {
            if (value) {
                viewElement.innerHTML = `<span class="status-badge completed">✓ Completed</span>`;
            } else {
                viewElement.innerHTML = `<span class="status-badge active">In Progress</span>`;
            }
        }
    }
});

// ============================================================
// DRAG AND DROP FUNCTIONALITY FOR TASKS
// ============================================================

function initializeTaskDragAndDrop() {
    const tasksList = document.querySelector('.tasks-list');
    if (!tasksList) return;
    
    const tasks = document.querySelectorAll('.task-card');
    
    tasks.forEach((task, index) => {
        task.draggable = true;
        
        task.addEventListener('dragstart', handleTaskDragStart);
        task.addEventListener('dragend', handleTaskDragEnd);
        task.addEventListener('dragover', handleTaskDragOver);
        task.addEventListener('drop', handleTaskDrop);
        task.addEventListener('dragenter', handleTaskDragEnter);
        task.addEventListener('dragleave', handleTaskDragLeave);
    });
}

let draggedTask = null;

function handleTaskDragStart(e) {
    draggedTask = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleTaskDragEnd(e) {
    this.classList.remove('dragging');
    
    // Remove drag-over class from all tasks
    document.querySelectorAll('.task-card').forEach(task => {
        task.classList.remove('drag-over');
    });
    
    draggedTask = null;
}

function handleTaskDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleTaskDragEnter(e) {
    if (this !== draggedTask) {
        this.classList.add('drag-over');
    }
}

function handleTaskDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleTaskDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedTask !== this && draggedTask) {
        // Swap positions
        const tasksList = document.querySelector('.tasks-list');
        const allTasks = Array.from(tasksList.querySelectorAll('.task-card'));
        
        const draggedIndex = allTasks.indexOf(draggedTask);
        const targetIndex = allTasks.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            this.parentNode.insertBefore(draggedTask, this.nextSibling);
        } else {
            this.parentNode.insertBefore(draggedTask, this);
        }
        
        // Update the order numbers and save the new order
        updateTaskOrderDisplay();
        saveTaskOrder();
    }
    
    this.classList.remove('drag-over');
    return false;
}

function updateTaskOrderDisplay() {
    const tasks = document.querySelectorAll('.task-card');
    tasks.forEach((task, index) => {
        const orderSpan = task.querySelector('.task-order-number');
        if (orderSpan) {
            orderSpan.textContent = `#${index + 1}`;
        }
    });
}

function saveTaskOrder() {
    const tasks = document.querySelectorAll('.task-card');
    const taskOrder = Array.from(tasks).map((task, index) => {
        // Extract task ID from data attributes or from edit button
        const editBtn = task.querySelector('.edit-task-btn-inline');
        if (editBtn) {
            return {
                task_id: parseInt(editBtn.dataset.taskId),
                new_order: index + 1
            };
        }
    }).filter(item => item !== undefined);
    
    if (taskOrder.length === 0) {
        console.warn('No tasks found to reorder');
        return;
    }
    
    // Get project ID from URL or data attribute
    const projectId = window.location.pathname.split('/').pop();
    
    // Add visual feedback while saving
    const tasksList = document.querySelector('.tasks-list');
    if (tasksList) {
        tasksList.style.opacity = '0.7';
    }
    
    fetch(`/api/projects/${projectId}/reorder-tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            task_order: taskOrder
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Restore visual feedback
        if (tasksList) {
            tasksList.style.opacity = '1';
        }
        
        if (data.success) {
            console.log('Task order saved successfully to database');
        } else {
            console.error('Error saving task order:', data.error);
            alert('Error saving task order: ' + (data.error || 'Unknown error') + '\nPlease try again.');
        }
    })
    .catch(error => {
        // Restore visual feedback
        if (tasksList) {
            tasksList.style.opacity = '1';
        }
        
        console.error('Error:', error);
        alert('Error saving task order: ' + error.message + '\nChanges may not be persisted.');
    });
}

