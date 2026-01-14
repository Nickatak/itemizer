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



function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const materialsTable = document.querySelector('.materials-table tbody');
    const materialRows = document.querySelectorAll('.material-row');

    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    materialRows.forEach(row => {
        const name = row.querySelector('.material-name-cell')?.textContent.toLowerCase() || '';
        const description = row.querySelector('.material-description-cell')?.textContent.toLowerCase() || '';
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
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
            const categoryId = this.dataset.materialCategoryId;
            
            openEditMaterialModal(materialId, name, description, price, link, specs, categoryId);
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

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', performSearch);
    }
});
