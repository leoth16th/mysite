document.addEventListener('DOMContentLoaded', function() {
    const sections = window.hubData.sections;
    const container = document.getElementById('visualization-container');

    if (sections && container) {
        sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.classList.add('hub-section');

            const header = document.createElement('h2');
            header.textContent = section.name;
            sectionDiv.appendChild(header);

            if (section.links && Array.isArray(section.links)) {
                const list = document.createElement('ul');
                list.classList.add('hub-links');

                section.links.forEach(link => {
                    if (typeof link === 'object' && link !== null && link.url) {
                        const listItem = document.createElement('li');
                        const anchor = document.createElement('a');
                        anchor.href = link.url;
                        anchor.textContent = link.name || link.url;
                        anchor.target = '_blank';
                        listItem.appendChild(anchor);
                        list.appendChild(listItem);
                    } else if (typeof link === 'string') {
                        const listItem = document.createElement('li');
                        const anchor = document.createElement('a');
                        anchor.href = link;
                        anchor.textContent = link;
                        anchor.target = '_blank';
                        listItem.appendChild(anchor);
                        list.appendChild(listItem);
                    }
                });

                sectionDiv.appendChild(list);
            }
            container.appendChild(sectionDiv);
        });
    }
});
