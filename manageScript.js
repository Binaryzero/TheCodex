document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkForm');
    const linksContainer = document.getElementById('linksContainer');
    const themeSwitch = document.getElementById('checkbox');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    let links = JSON.parse(localStorage.getItem('links')) || [];
    document.body.className = localStorage.getItem('theme') || 'light-mode';
    themeSwitch.checked = document.body.className === 'dark-mode';

    themeSwitch.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark-mode' : 'light-mode';
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
    });

    function renderLinks() {
        linksContainer.innerHTML = '';
        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-item';

            const span = document.createElement('span');
            span.textContent = link.name; // Safely setting text content

            const visitLink = document.createElement('a');
            visitLink.href = link.url; // Using property assignment ensures proper escaping
            visitLink.target = '_blank';
            visitLink.textContent = 'Visit';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editLink(index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteLink(index));

            div.appendChild(span);
            div.appendChild(visitLink);
            div.appendChild(editButton);
            div.appendChild(deleteButton);
            linksContainer.appendChild(div);
        });
    }

    function addLink(name, url) {
        links.push({ name, url });
        saveLinks();
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('siteName').value.trim();
        const url = document.getElementById('siteUrl').value.trim();
        addLink(name, url);
        form.reset();
    });

    window.editLink = function(index) {
        const link = links[index];
        const newName = prompt('Edit site name:', link.name) || link.name;
        const newUrl = prompt('Edit site URL:', link.url) || link.url;
        if (newName && newUrl) {
            links[index] = { name: newName, url: newUrl };
            saveLinks();
        }
    };

    window.deleteLink = function(index) {
        if (confirm('Are you sure you want to delete this site?')) {
            links.splice(index, 1);
            saveLinks();
        }
    };

    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    }

    exportBtn.addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.href = dataStr;
        downloadAnchorNode.download = "links.json";
        document.body.appendChild(downloadAnchorNode); // Temporarily add anchor to body
        downloadAnchorNode.click();
        downloadAnchorNode.remove(); // Clean up after download
    });

    importBtn.addEventListener('click', () => importFile.click());

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
