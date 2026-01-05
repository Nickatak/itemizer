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
}
