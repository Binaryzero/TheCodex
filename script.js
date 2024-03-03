document.addEventListener('DOMContentLoaded', function() {
    
    const linksContainer = document.getElementById('linksContainer');
    let links = JSON.parse(localStorage.getItem('links')) || [];
    
    // Theme handling
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.className = currentTheme;
    }

    function renderLinks() {
        linksContainer.innerHTML = links.map(link => `
            <div class="link-item">
                <a href="${link.url}" target="_blank">${link.name}</a>
            </div>
        `).join('');
    }

    renderLinks();
});
