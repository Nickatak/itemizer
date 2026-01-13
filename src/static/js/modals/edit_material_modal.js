// Edit Material Modal Functions

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
    }
}

function closeEditMaterialModal() {
    const modal = document.getElementById('editMaterialModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function submitEditMaterialForm() {
    const materialId = document.getElementById('editMaterialId').value;
    const name = document.getElementById('edit_material_name').value;
    const description = document.getElementById('edit_material_description').value;
    const price = document.getElementById('edit_material_price').value;
    const link = document.getElementById('edit_material_link').value;
    const specificationNotes = document.getElementById('edit_material_specification_notes').value;
    
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
            specification_notes: specificationNotes
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
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
}
