function performMaterialDelete(materialId) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/material/${materialId}/delete`;
    document.body.appendChild(form);
    form.submit();
}

function attachDeleteListener() {
    const deleteBtns = document.querySelectorAll('.material-actions-cell .delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const materialId = this.dataset.materialId;
            const actionsCell = this.closest('.material-actions-cell');
            
            // Replace with confirmation buttons
            this.classList.add('hidden');
            const editBtn = actionsCell.querySelector('.edit-btn');
            if (editBtn) editBtn.classList.add('hidden');
            
            // Create confirmation button
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'action-btn confirm-delete-btn';
            confirmBtn.textContent = 'Confirm Delete';
            confirmBtn.dataset.materialId = materialId;
            
            // Create cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'action-btn cancel-delete-btn';
            cancelBtn.textContent = 'Cancel';
            
            actionsCell.appendChild(confirmBtn);
            actionsCell.appendChild(cancelBtn);
            
            // Confirm delete
            confirmBtn.addEventListener('click', function() {
                performMaterialDelete(materialId);
            });
            
            // Cancel delete
            cancelBtn.addEventListener('click', function() {
                confirmBtn.remove();
                cancelBtn.remove();
                btn.classList.remove('hidden');
                if (editBtn) editBtn.classList.remove('hidden');
            });
        });
    });
}

function submitEditMaterialForm(e) {
    e.preventDefault();
    const materialId = document.getElementById('editMaterialId').value;
    const name = document.getElementById('edit_material_name').value;
    const description = document.getElementById('edit_material_description').value;
    const price = document.getElementById('edit_material_price').value;
    const link = document.getElementById('edit_material_link').value;
    const specificationNotes = document.getElementById('edit_material_specification_notes').value;
    
    // Get selected tags
    const tagCheckboxes = document.querySelectorAll('#edit_tags-list input[type="checkbox"]:checked');
    const tags = Array.from(tagCheckboxes).map(cb => parseInt(cb.value));
    
    // Get new tags
    const newTags = Object.values(editNewTags);

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
            new_tags: newTags
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Material updated successfully!');
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

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const materialsTable = document.querySelector('.materials-table tbody');
    const materialRows = document.querySelectorAll('.material-row');

    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    materialRows.forEach(row => {
        const name = row.querySelector('.material-name-cell')?.textContent.toLowerCase() || '';
        const description = row.querySelector('.material-description-cell')?.textContent.toLowerCase() || '';
        const tagsCell = row.querySelector('.material-tags-cell');
        let tagsText = '';
        
        if (tagsCell) {
            const tags = tagsCell.querySelectorAll('.tag');
            tagsText = Array.from(tags).map(tag => tag.textContent.toLowerCase()).join(' ');
        }
        
        if (name.includes(searchTerm) || description.includes(searchTerm) || tagsText.includes(searchTerm)) {
            row.classList.remove('hidden');
            visibleCount++;
        } else {
            row.classList.add('hidden');
        }
    });

    // Show no results message if needed
    if (materialsTable && visibleCount === 0 && searchTerm) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.className = 'no-search-results';
        noResultsRow.innerHTML = '<td colspan="7">No materials match your search.</td>';
        materialsTable.appendChild(noResultsRow);
    } else if (materialsTable && visibleCount > 0 && searchTerm) {
        // Remove no results row if it exists
        const noResultsRow = materialsTable.querySelector('.no-search-results');
        if (noResultsRow) {
            noResultsRow.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Edit material buttons
    const editBtns = document.querySelectorAll('.material-actions-cell .edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialId = this.dataset.materialId;
            const name = this.dataset.materialName;
            const description = this.dataset.materialDescription;
            const price = this.dataset.materialPrice;
            const link = this.dataset.materialLink;
            const specs = this.dataset.materialSpecs;
            const tagIds = JSON.parse(this.dataset.materialTags || '[]');
            
            // Fetch all available tags and populate the modal
            fetch('/api/tags')
                .then(response => response.json())
                .then(data => {
                    if (data.tags) {
                        const tagsList = document.getElementById('edit_tags-list');
                        tagsList.innerHTML = '';
                        
                        if (data.tags.length === 0) {
                            const p = document.createElement('p');
                            p.className = 'no-tags';
                            p.textContent = 'No tags available. Create one below!';
                            tagsList.appendChild(p);
                        } else {
                            data.tags.forEach(tag => {
                                const label = document.createElement('label');
                                const checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.name = 'edit_tags';
                                checkbox.value = tag.id;
                                checkbox.checked = tagIds.includes(tag.id);
                                
                                const span = document.createElement('span');
                                span.className = 'tag-badge';
                                span.textContent = tag.name;
                                span.style.backgroundColor = tag.color;
                                
                                label.appendChild(checkbox);
                                label.appendChild(span);
                                tagsList.appendChild(label);
                            });
                        }
                    }
                    openEditMaterialModal(materialId, name, description, price, link, specs, tagIds);
                })
                .catch(error => {
                    console.error('Error fetching tags:', error);
                    openEditMaterialModal(materialId, name, description, price, link, specs, tagIds);
                });
        });
    });

    // Delete buttons - show confirmation
    attachDeleteListener();

    // Edit modal close button
    const closeBtn = document.querySelector('#editMaterialModal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditMaterialModal);
    }

    // Edit modal cancel button
    const cancelEditBtn = document.querySelector('.cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', closeEditMaterialModal);
    }

    // Edit modal backdrop
    const editModal = document.getElementById('editMaterialModal');
    if (editModal) {
        editModal.addEventListener('mousedown', function(e) {
            if (e.target === this) {
                closeEditMaterialModal();
            }
        });
        
        const modalContent = editModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('mousedown', (e) => e.stopPropagation());
            modalContent.addEventListener('click', (e) => e.stopPropagation());
        }
    }

    // Create tag button
    const createTagBtn = document.querySelector('#edit_create-tag-btn');
    if (createTagBtn) {
        createTagBtn.addEventListener('click', createEditTag);
    }

    // Edit form submission
    const editForm = document.getElementById('editMaterialForm');
    if (editForm) {
        editForm.addEventListener('submit', submitEditMaterialForm);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
});
