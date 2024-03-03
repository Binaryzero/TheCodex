document.addEventListener('DOMContentLoaded', function() {
    const linksContainer = document.getElementById('linksContainer');
    let links = JSON.parse(localStorage.getItem('links')) || [];

    // Check and apply the saved theme preference.
    function applyTheme() {
        const currentTheme = localStorage.getItem('theme');
        // Ensure the class matches what's in your CSS: 'light-mode' or 'dark-mode'.
        if (currentTheme) {
            document.body.className = currentTheme;
        }
    }

    function renderLinks() {
        linksContainer.innerHTML = ''; // Clear existing links
        links.forEach(link => {
            const div = document.createElement('div');
            div.className = 'link-item';

            const a = document.createElement('a');
            a.textContent = link.name; // Safely set link text
            a.setAttribute('href', link.url);
            a.setAttribute('target', '_blank');

            div.appendChild(a);
            linksContainer.appendChild(div);
        });
    }

    applyTheme(); // Apply theme on page load
    renderLinks();
});
