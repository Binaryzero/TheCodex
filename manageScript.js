document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkForm');
    const linksContainer = document.getElementById('linksContainer');
    const themeSwitch = document.getElementById('checkbox');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    // Load and apply theme
    const currentTheme = localStorage.getItem('theme') || 'light-mode';
    document.body.className = currentTheme;
    themeSwitch.checked = currentTheme === 'dark-mode';

    // Toggle theme
    themeSwitch.addEventListener('change', function() {
        const theme = this.checked ? 'dark-mode' : 'light-mode';
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    });

    let links = JSON.parse(localStorage.getItem('links')) || [];

    function renderLinks() {
        linksContainer.textContent = ''; // Safely clear the container
        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-item';

            const span = document.createElement('span');
            span.textContent = link.name;

            const visitLink = document.createElement('a');
            visitLink.href = link.url;
            visitLink.target = '_blank';
            visitLink.textContent = 'Visit';

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editLink(index);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteLink(index);

            div.appendChild(span);
            div.appendChild(visitLink);
            div.appendChild(editButton);
            div.appendChild(deleteButton);
            linksContainer.appendChild(div);
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('siteName').value.trim();
        const url = document.getElementById('siteUrl').value.trim();
        links.push({ name, url });
        saveLinks();
        form.reset();
    });

    window.editLink = function(index) {
        const newName = prompt('Edit site name:', links[index].name);
        const newUrl = prompt('Edit site URL:', links[index].url);
        if (newName !== null && newUrl !== null) { // Check for null to allow for cancellation
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
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    importBtn.addEventListener('click', function() {
        importFile.click();
    });

    importFile.addEventListener('change', function() {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            try {
                const importedLinks = JSON.parse(e.target.result);
                links = importedLinks;
                saveLinks();
            } catch (error) {
                alert('Failed to import links: Invalid file format.');
            }
        };
        fileReader.readAsText(this.files[0]);
    });

    renderLinks();
});
