const settingsButton = document.getElementById('settings-button');
const dropupMenu = document.getElementById('dropup-menu');
settingsButton.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default anchor behavior
    dropupMenu.style.display = dropupMenu.style.display === 'block' ? 'none' : 'block';
});
// Optionally, you can close the drop-up menu if clicked outside
window.addEventListener('click', function (e) {
    if (!settingsButton.contains(e.target) && !dropupMenu.contains(e.target)) {
        dropupMenu.style.display = 'none';
    }
});