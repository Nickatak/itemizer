let allMaterials = [];
let categoriesCache = [];

// Fetch all categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to load categories');
        const data = await response.json();
        categoriesCache = data.data || [];
        populateCategorySelect();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Populate the category select dropdown
function populateCategorySelect() {
    const select = document.getElementById('edit_material_category');
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Add categories
    categoriesCache.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
    
    // Add create new category option
    const newOption = document.createElement('option');
    newOption.value = '__new__';
    newOption.textContent = '+ Create New Category';
    select.appendChild(newOption);
}

// Fetch all materials
async function loadMaterials() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    
    try {
        const response = await fetch('/api/materials');
        if (!response.ok) throw new Error('Failed to load materials');
        const data = await response.json();
        allMaterials = data.data || [];
        renderMaterials(allMaterials);
    } catch (error) {
        console.error('Error loading materials:', error);
        const display = document.getElementById('materials-display');
        if (display) {
            display.innerHTML = '<div class="error-message">Failed to load materials. Please try again.</div>';
        }
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// Render materials in table format
function renderMaterials(materials) {
    const display = document.getElementById('materials-display');
    
    if (!materials || materials.length === 0) {
        display.innerHTML = `
            <div class="no-materials">
                <p>No materials yet. Add materials to your projects to see them here.</p>
            </div>
        `;
        return;
    }
    
    const tableHTML = `
        <table class="materials-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Last Used</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${materials.map(material => `
                    <tr class="material-row" id="material-row-${material.id}">
                        <td class="material-name-cell">${escapeHtml(material.name)}</td>
                        <td class="material-description-cell">
                            ${material.description 
                                ? (material.description.length > 60 
                                    ? escapeHtml(material.description.substring(0, 60)) + '...' 
                                    : escapeHtml(material.description))
                                : '<em>No description</em>'
                            }
                        </td>
                        <td class="material-price-cell">
                            ${material.price 
                                ? '$' + parseFloat(material.price).toFixed(2)
                                : '<em>N/A</em>'
                            }
                        </td>
                        <td class="material-category-cell">
                            ${material.category 
                                ? `<span class="category-badge" style="background: linear-gradient(135deg, ${material.category.color}33 0%, ${material.category.color}22 100%); color: ${material.category.color}; border-color: ${material.category.color}66;">${escapeHtml(material.category.name)}</span>`
                                : '<em>None</em>'
                            }
                        </td>
                        <td class="material-created-cell">
                            ${material.last_used 
                                ? new Date(material.last_used).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
                                : '<em>Never</em>'
                            }
                        </td>
                        <td class="material-actions-cell">
                            <button class="action-btn edit-btn" title="Edit" data-material-id="${material.id}">Edit</button>
                            <button class="action-btn delete-btn" title="Delete" data-material-id="${material.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    display.innerHTML = tableHTML;
    attachEditListeners();
    attachDeleteListeners();
}

// Attach edit button listeners
function attachEditListeners() {
    const editBtns = document.querySelectorAll('.material-actions-cell .edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const materialId = parseInt(this.dataset.materialId);
            const material = allMaterials.find(m => m.id === materialId);
            if (material) {
                openEditMaterialModal(material);
            }
        });
    });
}

// Attach delete button listeners
function attachDeleteListeners() {
    const deleteBtns = document.querySelectorAll('.material-actions-cell .delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const materialId = parseInt(this.dataset.materialId);
            const actionsCell = this.closest('.material-actions-cell');
            
            // Hide edit and delete buttons
            this.classList.add('hidden');
            const editBtn = actionsCell.querySelector('.edit-btn');
            if (editBtn) editBtn.classList.add('hidden');
            
            // Create confirmation button
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'action-btn confirm-delete-btn';
            confirmBtn.textContent = 'Confirm Delete';
            
            // Create cancel button
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'action-btn cancel-delete-btn';
            cancelBtn.textContent = 'Cancel';
            
            actionsCell.appendChild(confirmBtn);
            actionsCell.appendChild(cancelBtn);
            
            // Confirm delete
            confirmBtn.addEventListener('click', async function() {
                try {
                    const response = await fetch(`/api/materials/${materialId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    
                    if (!response.ok) throw new Error('Failed to delete material');
                    
                    allMaterials = allMaterials.filter(m => m.id !== materialId);
                    performSearch(); // Re-render with search applied
                } catch (error) {
                    console.error('Error deleting material:', error);
                    alert('Failed to delete material');
                    confirmBtn.remove();
                    cancelBtn.remove();
                    btn.classList.remove('hidden');
                    if (editBtn) editBtn.classList.remove('hidden');
                }
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

// Open edit material modal
function openEditMaterialModal(material) {
    const modal = document.getElementById('editMaterialModal');
    document.getElementById('editMaterialId').value = material.id;
    document.getElementById('edit_material_name').value = material.name || '';
    document.getElementById('edit_material_description').value = material.description || '';
    document.getElementById('edit_material_price').value = material.price || '';
    document.getElementById('edit_material_link').value = material.link || '';
    document.getElementById('edit_material_specification_notes').value = material.specification_notes || '';
    document.getElementById('edit_material_category').value = material.category_id || '';
    
    modal.style.display = 'block';
}

// Close edit material modal
function closeEditMaterialModal() {
    const modal = document.getElementById('editMaterialModal');
    modal.style.display = 'none';
}

// Handle edit form submission
async function handleEditMaterialSubmit(e) {
    e.preventDefault();
    
    const materialId = parseInt(document.getElementById('editMaterialId').value);
    const formData = {
        name: document.getElementById('edit_material_name').value,
        description: document.getElementById('edit_material_description').value,
        price: document.getElementById('edit_material_price').value || null,
        link: document.getElementById('edit_material_link').value,
        specification_notes: document.getElementById('edit_material_specification_notes').value,
        category_id: document.getElementById('edit_material_category').value || null
    };
    
    try {
        const response = await fetch(`/api/materials/${materialId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Failed to update material');
        
        // Reload materials to reflect changes
        await loadMaterials();
        closeEditMaterialModal();
    } catch (error) {
        console.error('Error updating material:', error);
        alert('Failed to update material');
    }
}

// Search and filter materials
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderMaterials(allMaterials);
        return;
    }
    
    const filtered = allMaterials.filter(material => {
        const name = material.name.toLowerCase();
        const description = (material.description || '').toLowerCase();
        return name.includes(searchTerm) || description.includes(searchTerm);
    });
    
    renderMaterials(filtered);
}

// Utility: Escape HTML characters to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    // Load materials and categories
    await Promise.all([loadMaterials(), loadCategories()]);
    
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
    
    // Edit form submission
    const editForm = document.getElementById('editMaterialForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditMaterialSubmit);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
});
