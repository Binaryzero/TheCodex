document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkForm');
    const linksContainer = document.getElementById('linksContainer');
    const themeSwitch = document.getElementById('checkbox');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    // Initialize theme from localStorage or default to 'light-mode'
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = currentTheme;
    themeSwitch.checked = currentTheme === 'dark-mode';

    let links = JSON.parse(localStorage.getItem('links')) || [];

    // Apply theme change and update localStorage
    themeSwitch.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark-mode' : 'light-mode';
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
    });

    // Render links to the page
    function renderLinks() {
        linksContainer.innerHTML = '';
        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-item';

            const span = document.createElement('span');
            span.textContent = link.name;

            const visitLink = document.createElement('a');
            visitLink.setAttribute('href', link.url);
            visitLink.setAttribute('target', '_blank');
            visitLink.textContent = 'Visit';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editLink(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteLink(index);

            div.append(span, visitLink, editButton, deleteButton);
            linksContainer.appendChild(div);
        });
    }

    // Add a new link
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('siteName').value.trim();
        const url = document.getElementById('siteUrl').value.trim();

        links.push({ name, url });
        saveLinks();
        form.reset();
    });

    // Edit a link
    window.editLink = function(index) {
        const name = prompt('Edit site name:', links[index].name);
        const url = prompt('Edit site URL:', links[index].url);

        if (name && url) {
            links[index] = { name, url };
            saveLinks();
        }
    };

    // Delete a link
    window.deleteLink = function(index) {
        if (confirm('Are you sure you want to delete this site?')) {
            links.splice(index, 1);
            saveLinks();
        }
    };

    // Save links to localStorage and re-render the list
    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    }

    // Export links to a file
    exportBtn.addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "links.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Import links from a file
    importBtn.addEventListener('click', function() {
        importFile.click();
    });

    importFile.addEventListener('change', function() {
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const importedLinks = JSON.parse(e.target.result);
                links = importedLinks;
                saveLinks();
            } catch (error) {
                alert('Failed to import links: Invalid file format.');
            }
        };

        reader.readAsText(file);
    });

    renderLinks();
});
