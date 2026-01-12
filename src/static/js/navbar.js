// Shared Navbar Dropdown Functionality

document.addEventListener('DOMContentLoaded', function() {
    const settingsBtn = document.querySelector('.settings-btn');
    const dropdown = document.querySelector('.settings-dropdown');

    if (!settingsBtn || !dropdown) return;

    // Toggle dropdown on button click
    settingsBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking on a dropdown item
    const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            dropdown.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar-settings')) {
            dropdown.classList.remove('active');
        }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdown.classList.remove('active');
        }
    });
});
