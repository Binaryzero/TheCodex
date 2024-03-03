document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('linkForm');
    const linksContainer = document.getElementById('linksContainer');
    const themeSwitch = document.getElementById('checkbox');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    let links = JSON.parse(localStorage.getItem('links')) || [];
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.body.className = currentTheme;
    }

    themeSwitch.checked = currentTheme === 'dark-mode';

    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links));
        renderLinks();
    }

    function renderLinks() {
        linksContainer.innerHTML = links.map((link, index) => `
            <div class="link-item">
                <span>${link.name}</span> <a href="${link.url}" target="_blank">Visit</a>
                <button onclick="editLink(${index})">Edit</button>
                <button onclick="deleteLink(${index})">Delete</button>
            </div>
        `).join('');
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('siteName').value.trim();
        const url = document.getElementById('siteUrl').value.trim();

        links.push({ name, url });
        saveLinks();
        form.reset();
    });

    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.className = 'dark-mode';
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.className = 'light-mode';
            localStorage.setItem('theme', 'light-mode');
        }
    });

    window.editLink = function(index) {
        const link = links[index];
        const newName = prompt('Edit the site name:', link.name);
        const newUrl = prompt('Edit the site URL:', link.url);
        if (newName && newUrl) {
            links[index] = { name: newName, url: newUrl };
            saveLinks();
        }
    };

    window.deleteLink = function(index) {
        if (confirm('Are you sure you want to delete this link?')) {
            links.splice(index, 1);
            saveLinks();
        }
    };

    exportBtn.addEventListener('click', function() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(links));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "myLinks.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    importBtn.addEventListener('click', function() {
        importFile.click();
    });

    importFile.addEventListener('change', function() {
        const fileReader = new FileReader();
        fileReader.readAsText(this.files[0]);
        fileReader.onload = function() {
            const importedLinks = JSON.parse(fileReader.result);
            links = importedLinks;
            saveLinks();
        }
    });

    renderLinks();
});
