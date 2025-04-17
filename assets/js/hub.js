document.addEventListener('DOMContentLoaded', function() {
    const data = window.hubData.sections;
    const width = 960;
    const height = 500;

    // Create an SVG element and append it to the container
    const svg = d3.select("#visualization-container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .call(d3.zoom().on("zoom", function(event) {
            svg.attr("transform", event.transform)
        }))
        .append("g");

    // Convert the data into a hierarchical structure
    const root = d3.hierarchy({ name: "Resources", children: data })
        .sum(d => 1) // Size of each node (you might adjust this based on your data)
        .sort((a, b) => b.value - a.value);

    // Define the tree layout
    const treeLayout = d3.tree().size([height - 100, width - 200]); // Adjusted size
    treeLayout(root);

    // Create nodes
    const nodes = root.descendants();
    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")
        .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
        .attr("transform", d => `translate(${d.y + 50},${d.x + 50})`) // Adjusted positioning
        .on("click", click);

    // Add circles to nodes
    node.append("circle")
        .attr("r", 5);

    // Add labels to nodes
    node.append("text")
        .attr("dy", 3)
        .attr("x", d => d.children ? -10 : 10)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name);

    // Create links between nodes
    const links = root.links();
    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .selectAll("path")
        .data(links)
        .enter().append("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y + 50) // Adjusted positioning
            .y(d => d.x + 50));

    // Click event handler for nodes
    function click(event, d) {
        if (d.data.url) {
            window.open(d.data.url, '_blank');
        } else {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }

    // Update function to redraw the tree
    function update(source) {
        const duration = 500;

        // Compute the new tree layout.
        treeLayout(root);
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = (d.depth * 180) });

        // Update the nodes…
        const node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", click);

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.data.name; })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        const nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 5)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        const link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                const o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        linkEnter.merge(link).transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                const o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Diagonal function for drawing links
    function diagonal(d) {
        return "M" + d.source.y + "," + d.source.x
            + "H" + d.target.y
            + "V" + d.target.x + "h0";
    }

    let i = 0;
    root.x0 = height / 2;
    root.y0 = 0;

    // Toggle children on click.
    function click(event, d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    update(root);
});
