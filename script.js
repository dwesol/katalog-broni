// Updated script.js

// Fix for scope issues and adding click handler for showing details

// Example code to demonstrate the scope fix
const items = document.querySelectorAll('.item');

items.forEach(item => {
    item.addEventListener('click', function() {
        showDetails(this);
    });
});

function showDetails(item) {
    const details = item.querySelector('.details');
    details.style.display = 'block'; // Show the details
}