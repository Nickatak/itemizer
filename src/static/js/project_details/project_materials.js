/**
 * Material Management Functions for Project Detail Page
 * Handles all material-related operations on the project detail view
 */

// Show/hide material delete confirmation
function showMaterialDeleteConfirmation(materialId) {
    document.getElementById(`materialDeleteConfirmation-${materialId}`).classList.remove('hidden');
}

function hideMaterialDeleteConfirmation(materialId) {
    document.getElementById(`materialDeleteConfirmation-${materialId}`).classList.add('hidden');
}

// Delete material from project
function performMaterialDelete(projectId, materialId) {
    // Remove the material from the project via API
    fetch(`/api/projects/${projectId}/remove-material/${materialId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload materials display
            if (window.loadMaterials) {
                loadMaterials();
            }
            
            // Reload available materials in modal if it's open
            if (window.reloadAvailableMaterials) {
                reloadAvailableMaterials();
            }
        } else {
            throw new Error(data.error || 'Failed to remove material from project');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}

// Fetch and render materials from API
async function loadMaterials() {
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                      window.location.pathname.split('/').pop();
    const container = document.getElementById('materials-container');
    
    try {
        const response = await fetch(`/api/projects/${projectId}/materials`);
        const result = await response.json();
        
        if (!result.success) {
            container.innerHTML = '<div class="materials-error">Error loading materials</div>';
            return;
        }
        
        const materials = result.data;
        const totalCount = result.total_count;
        const totalCost = result.total_cost;
        
        // Update material count
        document.getElementById('material-count').textContent = totalCount;
        
        if (materials.length === 0) {
            container.innerHTML = '<div class="no-materials"><p>No materials assigned to this project yet.</p></div>';
            return;
        }
        
        // Create table HTML
        let tableHTML = `
            <table class="materials-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        materials.forEach(material => {
            const categoryHTML = material.category 
                ? `<span class="category-badge" style="background: linear-gradient(135deg, ${material.category.color}33 0%, ${material.category.color}22 100%); color: ${material.category.color}; border-color: ${material.category.color}66;">${material.category.name}</span>`
                : '<em class="no-category">Uncategorized</em>';
            
            const descriptionText = material.description 
                ? material.description.substring(0, 60) + (material.description.length > 60 ? '...' : '')
                : '<em>No description</em>';
            
            const priceText = material.price !== null 
                ? `$${material.price.toFixed(2)}`
                : '<em>N/A</em>';
            
            tableHTML += `
                <tr class="material-row" data-material-id="${material.id}">
                    <td class="material-name-cell">
                        <a href="/material/${material.id}" class="material-link">${material.name}</a>
                    </td>
                    <td class="material-category-cell">
                        ${categoryHTML}
                    </td>
                    <td class="material-description-cell">
                        ${descriptionText}
                    </td>
                    <td class="material-price-cell">
                        ${priceText}
                    </td>
                    <td class="material-action-cell">
                        <button type="button" class="edit-material-btn" data-material-id="${material.id}" data-material-name="${material.name}" data-material-description="${material.description || ''}" data-material-price="${material.price || 'null'}" data-material-link="${material.link || ''}" data-material-specification-notes="${material.specification_notes || ''}" data-material-category-id="${material.category?.id || ''}">Edit</button>
                        <button type="button" class="remove-material-btn" data-material-id="${material.id}">Remove</button>
                        <div id="materialDeleteConfirmation-${material.id}" class="material-delete-confirmation hidden">
                            <span class="confirmation-text">Remove this material?</span>
                            <button class="action-btn delete-confirm-btn" data-project-id="${projectId}" data-material-id="${material.id}">Yes</button>
                            <button class="action-btn cancel-btn" data-material-id="${material.id}">Cancel</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
            <div class="materials-summary">
                <div class="materials-summary-row">
                    <span class="materials-summary-label">Material Count:</span>
                    <span class="materials-summary-value">${totalCount}</span>
                </div>
                <div class="materials-summary-row">
                    <span class="materials-summary-total-label">Total Materials Cost:</span>
                    <span class="materials-summary-total-value">$${totalCost.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        container.innerHTML = tableHTML;
        
        // Re-attach event listeners to dynamically created buttons
        attachMaterialEventListeners();
    } catch (error) {
        console.error('Error loading materials:', error);
        container.innerHTML = '<div class="materials-error">Error loading materials</div>';
    }
}

// Attach event listeners to material buttons
function attachMaterialEventListeners() {
    // Attach edit button listeners
    document.querySelectorAll('.edit-material-btn').forEach(button => {
        button.removeEventListener('click', handleEditMaterial);
        button.addEventListener('click', handleEditMaterial);
    });
    
    // Attach remove button listeners
    document.querySelectorAll('.remove-material-btn').forEach(button => {
        button.removeEventListener('click', handleRemoveMaterial);
        button.addEventListener('click', handleRemoveMaterial);
    });
    
    // Attach delete confirmation listeners
    document.querySelectorAll('.delete-confirm-btn').forEach(button => {
        button.removeEventListener('click', handleConfirmDelete);
        button.addEventListener('click', handleConfirmDelete);
    });
    
    document.querySelectorAll('.material-delete-confirmation .cancel-btn').forEach(button => {
        button.removeEventListener('click', handleCancelDelete);
        button.addEventListener('click', handleCancelDelete);
    });
}

// Handle edit material button click
function handleEditMaterial(event) {
    const button = event.target;
    const materialId = button.getAttribute('data-material-id');
    const materialName = button.getAttribute('data-material-name');
    const materialDescription = button.getAttribute('data-material-description');
    const materialPrice = button.getAttribute('data-material-price');
    const materialLink = button.getAttribute('data-material-link');
    const materialSpecNotes = button.getAttribute('data-material-specification-notes');
    const materialCategoryId = button.getAttribute('data-material-category-id');
    
    openEditMaterialModal(materialId, materialName, materialDescription, materialPrice, materialLink, materialSpecNotes, materialCategoryId);
}

// Handle remove material button click
function handleRemoveMaterial(event) {
    const button = event.target;
    const materialId = button.getAttribute('data-material-id');
    const confirmationDiv = document.getElementById(`materialDeleteConfirmation-${materialId}`);
    if (confirmationDiv) {
        confirmationDiv.classList.toggle('hidden');
    }
}

// Handle cancel delete
function handleCancelDelete(event) {
    const button = event.target;
    const materialId = button.getAttribute('data-material-id');
    const confirmationDiv = document.getElementById(`materialDeleteConfirmation-${materialId}`);
    if (confirmationDiv) {
        confirmationDiv.classList.add('hidden');
    }
}

// Handle confirm delete
function handleConfirmDelete(event) {
    const button = event.target;
    const projectId = button.getAttribute('data-project-id');
    const materialId = button.getAttribute('data-material-id');
    
    performMaterialDelete(projectId, materialId);
}

// Initialize materials on page load
function initializeMaterials() {
    loadMaterials();
    
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
}
