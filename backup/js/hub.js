document.addEventListener('DOMContentLoaded', function() {
    const rawData = window.hubData.root;
    const rootData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
    const root = d3.hierarchy(rootData);

    // Initially collapse all nodes
    root.descendants().forEach(d => {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
    });

    const width = 1200;
    const height = 800;
    const treeLayout = d3.tree().size([height - 200, width - 400]);

    const svg = d3.select('#visualization-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
        .attr('transform', 'translate(100, 0)');

    const diagonal = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

    let activeNode = null; // Track the active node

    function update(source) {
        const duration = 750;
        const nodes = treeLayout(root).descendants();
        const links = treeLayout(root).links();

        // Links
        const link = g.selectAll('.link')
            .data(links, d => d.target.id);

        const linkEnter = link.enter().append('path')
            .attr('class', 'link')
            .attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            })
            .style('opacity', 0);

        link.merge(linkEnter).transition().duration(duration)
            .attr('d', diagonal)
            .style('opacity', 1);

        link.exit().transition().duration(duration)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            })
            .style('opacity', 0)
            .remove();

        // Nodes
        const node = g.selectAll('.node')
            .data(nodes, d => d.id || (d.id = ++i));

        const nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${source.y0},${source.x0})`)
            .on('click', (event, d) => {
                activeNode = d;
                click(event, d);
            });

        nodeEnter.append('circle')
            .attr('r', 0)
            .attr('class', d => d._children ? 'collapsed-node' : 'open-node');

        nodeEnter.append('text')
            .attr('dy', '.35em')
            .attr('x', d => d._children || d.children ? -20 : 20)
            .attr('text-anchor', d => d._children || d.children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('opacity', 0);

        const nodeUpdate = node.merge(nodeEnter).transition().duration(duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle')
            .attr('r', d => isOnActivePath(d) ? 15 : 10) // Larger for active path
            .attr('class', d => d._children ? 'collapsed-node' : 'open-node');

        nodeUpdate.select('text')
            .style('font-size', d => isOnActivePath(d) ? '18px' : '14px') // Larger text for active path
            .style('opacity', 1);

        const nodeExit = node.exit().transition().duration(duration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .style('opacity', 0)
            .remove();

        nodeExit.select('circle').attr('r', 0);
        nodeExit.select('text').style('opacity', 0);

        nodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    function click(event, d) {
        if (d.children) {
            collapse(d); // Recursively collapse all descendants
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse); // Recurse
            d.children = null;
        }
    }

    function isOnActivePath(d) {
        if (!activeNode) return false;
        let current = activeNode;
        while (current) {
            if (current === d) return true;
            current = current.parent;
        }
        return false;
    }

    let i = 0;
    root.x0 = height / 2;
    root.y0 = 0;
    update(root);
});