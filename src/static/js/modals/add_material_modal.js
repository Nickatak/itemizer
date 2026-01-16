// Add Material Modal Functions (Add/Search/Create Materials)

async function reloadAvailableMaterials() {
    // Fetch and reload available materials in the modal's search tab
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                      window.location.pathname.split('/').pop();
    
    try {
        const response = await fetch(`/api/projects/${projectId}/available-materials`);
        const result = await response.json();
        
        if (!result.success) {
            console.error('Error loading available materials:', result.error);
            return;
        }
        
        const materialsList = document.getElementById('materialsList');
        if (!materialsList) {
            return;
        }
        
        const materials = result.data;
        
        if (materials.length === 0) {
            materialsList.innerHTML = '<p class="no-materials">No materials available to add.</p>';
            return;
        }
        
        // Rebuild the materials list HTML
        let html = '';
        materials.forEach(material => {
            const categoryHtml = material.category 
                ? `<span class="material-item-category" style="background: linear-gradient(135deg, ${material.category.color}33 0%, ${material.category.color}22 100%); color: ${material.category.color}; border-color: ${material.category.color}66;">${material.category.name}</span>`
                : '';
            
            html += `
                <div class="material-item" data-name="${material.name.toLowerCase()}" data-description="${material.description ? material.description.toLowerCase() : ''}" data-material-id="${material.id}">
                    <div>
                        <div class="material-item-name">${material.name}</div>
                        <div class="material-item-description">
                            ${material.description ? material.description : 'No description'}
                        </div>
                        ${categoryHtml}
                    </div>
                    <button type="button" class="add-material-btn" data-material-id="${material.id}" data-project-id="${projectId}">Add</button>
                </div>
            `;
        });
        
        materialsList.innerHTML = html;
        
        // Rebind event listeners for the new buttons
        const addMaterialButtons = materialsList.querySelectorAll('.add-material-btn');
        addMaterialButtons.forEach(button => {
            button.addEventListener('click', handleAddExistingMaterial);
        });
    } catch (error) {
        console.error('Error reloading available materials:', error);
    }
}

function openMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) {
        modal.style.display = 'block';
        resetMaterialModal();
        // Fetch and display available materials dynamically
        reloadAvailableMaterials();
    }
}

function closeMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function resetMaterialModal() {
    // Reset to search tab
    showMaterialTab('search');
    
    // Clear search input
    const searchInput = document.getElementById('materialSearch');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset form if present
    const createForm = document.querySelector('#createContent form');
    if (createForm) {
        createForm.reset();
    }
    
    // Hide new category container
    const newCategoryContainer = document.getElementById('new_category_container');
    if (newCategoryContainer) {
        newCategoryContainer.style.display = 'none';
        document.getElementById('new_category_name').value = '';
    }
}

function showMaterialTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName + 'Content');
    if (selectedContent) {
        selectedContent.style.display = 'block';
        selectedContent.classList.add('active');
    }
    
    // Add active class to clicked button
    const selectedButton = document.getElementById(tabName + 'Tab');
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

function filterMaterials() {
    const searchInput = document.getElementById('materialSearch');
    const searchTerm = searchInput.value.toLowerCase();
    const materials = document.querySelectorAll('.material-item');
    
    materials.forEach(material => {
        const name = material.getAttribute('data-name');
        const description = material.getAttribute('data-description');
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            material.style.display = 'block';
        } else {
            material.style.display = 'none';
        }
    });
}

function handleContactOption() {
    const option = document.getElementById('contact_option').value;
    const selectDiv = document.getElementById('select_contact_div');
    const createDiv = document.getElementById('create_contact_div');
    
    // Hide both by default
    selectDiv.style.display = 'none';
    createDiv.style.display = 'none';
    
    // Show appropriate div based on selection
    if (option === 'select') {
        selectDiv.style.display = 'block';
    } else if (option === 'create') {
        createDiv.style.display = 'block';
    }
}

function bindMaterialModalListeners() {
    const modal = document.getElementById('materialModal');
    
    if (modal) {
        // Handle mousedown on modal overlay to close
        modal.addEventListener('mousedown', function(event) {
            if (event.target.id === 'materialModal') {
                closeMaterialModal();
            }
        });
        
        // Prevent propagation when clicking inside modal content
        const modalContent = modal.querySelector('div');
        if (modalContent) {
            modalContent.addEventListener('mousedown', function(event) {
                event.stopPropagation();
            });
            
            modalContent.addEventListener('click', function(event) {
                event.stopPropagation();
            });
        }
    }
    
    // Bind search tab click to fetch available materials
    const searchTab = document.getElementById('searchTab');
    if (searchTab) {
        searchTab.addEventListener('click', function() {
            reloadAvailableMaterials();
        });
    }
    
    // Bind material search functionality
    const searchInput = document.getElementById('materialSearch');
    if (searchInput) {
        searchInput.addEventListener('keyup', filterMaterials);
    }
    
    // Bind contact option handlers
    const contactOption = document.getElementById('contact_option');
    if (contactOption) {
        contactOption.addEventListener('change', handleContactOption);
    }
    
    // Bind category dropdown change
    const categorySelect = document.getElementById('material_category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function(event) {
            const newCategoryContainer = document.getElementById('new_category_container');
            if (newCategoryContainer) {
                if (event.target.value === '__new__') {
                    newCategoryContainer.style.display = 'block';
                    document.getElementById('new_category_name').focus();
                } else {
                    newCategoryContainer.style.display = 'none';
                    document.getElementById('new_category_name').value = '';
                }
            }
        });
    } else {
        console.warn('Category select element not found');
    }
    
    // Handle create category button
    const createCategoryBtn = document.getElementById('create_category_btn');
    if (createCategoryBtn) {
        createCategoryBtn.addEventListener('click', function() {
            const categoryName = document.getElementById('new_category_name').value.trim();
            
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
                    
                    const selectElement = document.getElementById('material_category');
                    const newCategoryOption = selectElement.querySelector('option[value="__new__"]');
                    selectElement.insertBefore(option, newCategoryOption);
                    
                    // Select the new category
                    selectElement.value = data.category.id;
                    
                    // Hide the creation form
                    document.getElementById('new_category_container').style.display = 'none';
                    document.getElementById('new_category_name').value = '';
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
    const cancelCategoryBtn = document.getElementById('cancel_new_category_btn');
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', function() {
            document.getElementById('material_category').value = '';
            document.getElementById('new_category_container').style.display = 'none';
            document.getElementById('new_category_name').value = '';
        });
    }
    
    // Handle create material form submission
    const createMaterialForm = document.getElementById('createMaterialForm');
    if (createMaterialForm) {
        createMaterialForm.addEventListener('submit', handleCreateMaterialSubmit);
    }
    
    // Handle add existing material buttons (from search tab)
    if (modal) {
        const addMaterialButtons = modal.querySelectorAll('.add-material-btn[data-material-id]');
        addMaterialButtons.forEach(button => {
            button.addEventListener('click', handleAddExistingMaterial);
        });
    }
}

function handleCreateMaterialSubmit(event) {
    event.preventDefault();
    
    const projectId = new URLSearchParams(window.location.search).get('id') || 
                      window.location.pathname.split('/').pop();
    
    const materialData = {
        name: document.getElementById('material_name').value,
        description: document.getElementById('material_description').value || null,
        price: parseFloat(document.getElementById('material_price').value) || null,
        link: document.getElementById('material_link').value || null,
        specification_notes: document.getElementById('material_specification_notes').value || null,
        category_id: document.getElementById('material_category').value || null
    };
    
    // Remove null category_id if empty
    if (!materialData.category_id || materialData.category_id === '') {
        delete materialData.category_id;
    }
    
    // Create the material via API
    fetch('/api/materials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(materialData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const materialId = data.id;
            
            // Now add the material to the project via API
            return fetch(`/api/projects/${projectId}/add-material/${materialId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } else {
            throw new Error(data.error || 'Failed to create material');
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeMaterialModal();
            // Reload materials display
            if (window.loadMaterials) {
                loadMaterials();
            }
        } else {
            throw new Error(data.error || 'Failed to add material to project');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}

function handleAddExistingMaterial(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const materialId = button.getAttribute('data-material-id');
    const projectId = button.getAttribute('data-project-id');
    
    if (!materialId || !projectId) {
        console.error('Missing material or project ID');
        alert('Error: Missing material or project ID');
        return;
    }
    
    // Add the material to the project via API
    fetch(`/api/projects/${projectId}/add-material/${materialId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the material item from the search tab display
            const materialItem = button.closest('.material-item');
            if (materialItem) {
                materialItem.remove();
            }
            
            // Reload materials display on project page
            if (window.loadMaterials) {
                loadMaterials();
            }
        } else {
            throw new Error(data.error || 'Failed to add material to project');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}
