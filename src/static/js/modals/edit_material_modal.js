// Edit Material Modal Functions

function openEditMaterialModal(materialId, name, description, price, link, specificationNotes, categoryId) {
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
        document.getElementById('edit_material_category').value = categoryId || '';
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
    const categoryId = document.getElementById('edit_material_category').value;
    
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
            category_id: categoryId ? parseInt(categoryId) : null
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeEditMaterialModal();
            // Dynamically reload materials list without refreshing page
            if (window.loadMaterials) {
                loadMaterials();
            }
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
    
    // Handle category dropdown change
    const categorySelect = document.getElementById('edit_material_category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function(event) {
            const newCategoryContainer = document.getElementById('edit_new_category_container');
            if (event.target.value === '__new__') {
                newCategoryContainer.style.display = 'block';
                document.getElementById('edit_new_category_name').focus();
            } else {
                newCategoryContainer.style.display = 'none';
                document.getElementById('edit_new_category_name').value = '';
            }
        });
    }
    
    // Handle create category button
    const createCategoryBtn = document.getElementById('edit_create_category_btn');
    if (createCategoryBtn) {
        createCategoryBtn.addEventListener('click', function() {
            const categoryName = document.getElementById('edit_new_category_name').value.trim();
            
            if (!categoryName) {
                alert('Please enter a category name');
                return;
            }
            
            // Create the category via API
            fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: categoryName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.category) {
                    // Add new option to select and select it
                    const option = document.createElement('option');
                    option.value = data.category.id;
                    option.textContent = data.category.name;
                    
                    const selectElement = document.getElementById('edit_material_category');
                    const newCategoryOption = selectElement.querySelector('option[value="__new__"]');
                    selectElement.insertBefore(option, newCategoryOption);
                    
                    // Select the new category
                    selectElement.value = data.category.id;
                    
                    // Hide the creation form
                    document.getElementById('edit_new_category_container').style.display = 'none';
                    document.getElementById('edit_new_category_name').value = '';
                } else {
                    alert('Error creating category: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error creating category');
            });
        });
    }
    
    // Handle cancel button
    const cancelCategoryBtn = document.getElementById('edit_cancel_new_category_btn');
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', function() {
            document.getElementById('edit_material_category').value = '';
            document.getElementById('edit_new_category_container').style.display = 'none';
            document.getElementById('edit_new_category_name').value = '';
        });
    }
}
