// Add Material Modal Functions (Add/Search/Create Materials)

function openMaterialModal() {
    const modal = document.getElementById('materialModal');
    if (modal) {
        modal.style.display = 'block';
        resetMaterialModal();
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
}
