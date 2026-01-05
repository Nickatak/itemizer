function openContactModal() {
    document.getElementById('contactModal').style.display = 'block';
    document.getElementById('createContactForm').style.display = 'block';
    document.getElementById('editContactForm').style.display = 'none';
    document.getElementById('contactModalTitle').textContent = 'Add Contact';
    document.getElementById('createContactForm').reset();
}

function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
}

function openEditContactModal(contactId, name, email, phone, website, notes, isStore) {
    document.getElementById('contactModal').style.display = 'block';
    
    // Populate form fields
    document.getElementById('edit_contact_id').value = contactId;
    document.getElementById('edit_contact_name').value = name;
    document.getElementById('edit_contact_email').value = email;
    document.getElementById('edit_contact_phone').value = phone;
    document.getElementById('edit_contact_website').value = website;
    document.getElementById('edit_contact_notes').value = notes;
    document.getElementById('edit_contact_is_store').checked = isStore;
    
    // Show edit contact form
    document.getElementById('createContactForm').style.display = 'none';
    document.getElementById('editContactForm').style.display = 'block';
    document.getElementById('contactModalTitle').textContent = 'Edit Contact';
}

document.addEventListener('DOMContentLoaded', function() {
    // Edit contact form submission
    const editForm = document.getElementById('editContactForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitEditContactForm();
        });
    }

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchContacts(this.value);
        });
    }

    // Filter toggle
    const filterToggle = document.getElementById('filter-toggle');
    if (filterToggle) {
        filterToggle.addEventListener('change', function() {
            filterContacts(this.checked);
        });
    }
});

function submitEditContactForm() {
    const contactId = document.getElementById('edit_contact_id').value;
    const name = document.getElementById('edit_contact_name').value;
    const email = document.getElementById('edit_contact_email').value;
    const phone = document.getElementById('edit_contact_phone').value;
    const website = document.getElementById('edit_contact_website').value;
    const notes = document.getElementById('edit_contact_notes').value;
    const isStore = document.getElementById('edit_contact_is_store').checked;
    
    fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            website: website,
            notes: notes,
            is_store: isStore
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Contact updated successfully!');
            closeContactModal();
            // Reload page to see updates
            location.reload();
        } else {
            alert('Error updating contact: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating contact');
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const contactModal = document.getElementById('contactModal');
    if (event.target === contactModal) {
        contactModal.style.display = 'none';
    }
}

function filterContacts(storesOnly) {
    const table = document.querySelector('.contacts-table tbody');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const typeCell = row.querySelector('.contact-type-cell');
        const hasBadge = typeCell.querySelector('.store-badge');
        
        if (storesOnly) {
            row.style.display = hasBadge ? 'table-row' : 'none';
        } else {
            row.style.display = 'table-row';
        }
    });
}

function searchContacts(searchTerm) {
    const table = document.querySelector('.contacts-table tbody');
    if (!table) return;
    
    const rows = table.querySelectorAll('tr');
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const name = row.querySelector('.contact-name-cell').textContent.toLowerCase();
        const email = row.querySelector('.contact-email-cell').textContent.toLowerCase();
        const phone = row.querySelector('.contact-phone-cell').textContent.toLowerCase();
        
        const matches = name.includes(lowerSearchTerm) || 
                       email.includes(lowerSearchTerm) || 
                       phone.includes(lowerSearchTerm);
        
        row.style.display = matches ? 'table-row' : 'none';
    });
}
