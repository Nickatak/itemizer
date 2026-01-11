// Edit Material Modal Functions

// Edit Material Modal - Tag Management
let editNewTags = {};

function openEditMaterialModal(materialId, name, description, price, link, specificationNotes, tagIds) {
    const modal = document.getElementById('editMaterialModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Populate form fields
        document.getElementById('editMaterialId').value = materialId;
        document.getElementById('edit_material_name').value = name;
        document.getElementById('edit_material_description').value = description;
        document.getElementById('edit_material_price').value = price || '';
        document.getElementById('edit_material_link').value = link;
        document.getElementById('edit_material_specification_notes').value = specificationNotes;
        
        // Reset tag checkboxes
        const tagCheckboxes = document.querySelectorAll('#edit_tags-list input[type="checkbox"]');
        tagCheckboxes.forEach(checkbox => {
            checkbox.checked = tagIds.includes(parseInt(checkbox.value));
        });
        
        // Clear new tags container and reset editNewTags
        document.getElementById('edit_new-tags-container').innerHTML = '';
        editNewTags = {};
    }
}

function closeEditMaterialModal() {
    const modal = document.getElementById('editMaterialModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createEditTag() {
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
            return;
        }
    }
    
    // Check if tag already exists in new tags
    for (let tagId in editNewTags) {
        if (editNewTags[tagId].name === tagName) {
            return;
        }
    }
    
    // Create new tag
    const tagId = 'new_' + Object.keys(editNewTags).length;
    editNewTags[tagId] = { name: tagName, color: tagColor };
    
    const container = document.getElementById('edit_new-tags-container');
    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; color: #e0e0e0; cursor: pointer; margin: 0; padding: 10px; background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 5px;';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'edit_tags';
    checkbox.value = tagId;
    checkbox.checked = true;
    checkbox.style.cssText = 'margin-right: 10px; cursor: pointer; width: 18px; height: 18px;';
    
    const span = document.createElement('span');
    span.textContent = tagName;
    span.style.cssText = `padding: 4px 12px; border-radius: 20px; color: white; font-size: 0.9em; background-color: ${tagColor};`;
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = '✕';
    removeBtn.style.cssText = 'margin-left: auto; background: rgba(255, 255, 255, 0.2); color: #ff6b6b; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 14px;';
    removeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        label.remove();
        delete editNewTags[tagId];
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
    
    const tags = [];
    document.querySelectorAll('#edit_tags-list input[type="checkbox"]:checked').forEach(checkbox => {
        tags.push(checkbox.value);
    });
    
    document.querySelectorAll('#editMaterialForm input[type="checkbox"]:checked').forEach(checkbox => {
        if (!tags.includes(checkbox.value)) {
            tags.push(checkbox.value);
        }
    });
    
    // Create array of new tags
    const newTagsArray = Object.keys(editNewTags).map(tagId => ({
        id: tagId,
        name: editNewTags[tagId].name,
        color: editNewTags[tagId].color
    }));
    
    // Send update request
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
            tags: tags,
            new_tags: newTagsArray
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Material updated successfully!');
            closeEditMaterialModal();
            // Reload page to see updates
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

function bindEditMaterialModalListeners() {
    const editModal = document.getElementById('editMaterialModal');
    
    if (editModal) {
        // Handle mousedown on edit modal overlay to close
        editModal.addEventListener('mousedown', function(event) {
            if (event.currentTarget === event.target) {
                closeEditMaterialModal();
            }
        });
        
        // Prevent propagation when clicking inside edit modal content
        const editModalContent = editModal.querySelector('div');
        if (editModalContent) {
            editModalContent.addEventListener('mousedown', function(event) {
                event.stopPropagation();
            });
            
            editModalContent.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
    }
    
    // Bind edit form submission
    const editMaterialForm = document.getElementById('editMaterialForm');
    if (editMaterialForm) {
        editMaterialForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitEditMaterialForm();
        });
    }
    
    // Bind edit create tag button
    const editCreateTagBtn = document.getElementById('edit_create-tag-btn');
    if (editCreateTagBtn) {
        editCreateTagBtn.addEventListener('click', function(event) {
            event.preventDefault();
            createEditTag();
        });
    }
}
