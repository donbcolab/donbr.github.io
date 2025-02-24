document.addEventListener('DOMContentLoaded', async function() {
    // Load the graph data
    const response = await fetch('/data/situational-awareness-graph.json');
    const graphData = await response.json();

    // Convert nodes and edges to ECharts format
    const nodes = graphData.nodes.map(node => ({
        id: node.id,
        name: node.id,
        symbolSize: getNodeSize(node),
        itemStyle: { color: getNodeColor(node.id) },
        value: node // Store full node data for tooltips
    }));
    
    const edges = graphData.edges.map(edge => ({
        source: edge.source,
        target: edge.target
    }));

    function getNodeSize(node) {
        const scaleFactor = 50;
        let metric = 40;
        if (node['Incident Response Time']) metric = node['Incident Response Time'] / 4;
        else if (node['Detection Rate']) metric = node['Detection Rate'] * scaleFactor;
        else if (node['Disruption Impact']) metric = node['Disruption Impact'] * scaleFactor;
        else if (node['Anomaly Accuracy']) metric = node['Anomaly Accuracy'] * scaleFactor;
        else if (node['Decision Accuracy']) metric = node['Decision Accuracy'] * scaleFactor;
        return Math.min(Math.max(metric, 20), 100);
    }

    function getNodeColor(id) {
        const colorMap = {
            'Disaster Response': '#1f77b4',
            'Cybersecurity Threat Propagation': '#ff7f0e',
            'Supply Chain Disruption': '#2ca02c',
            'Public Safety Real-Time Anomaly Detection': '#d62728',
            'Military Operations Causal Reasoning': '#9467bd'
        };
        return colorMap[id] || '#7f7f7f';
    }

    // Initialize ECharts
    const chart = echarts.init(document.getElementById('graph-container'));
    const option = {
        title: {
            text: 'Situational Awareness Graph',
            left: 'center'
        },
        tooltip: {
            formatter: function(params) {
                if (params.dataType === 'node') {
                    const data = params.data.value;
                    let tooltipContent = `<b>${params.name}</b><br>`;
                    Object.keys(data).forEach(key => {
                        if (key !== 'id') {
                            tooltipContent += `${key}: ${data[key].toFixed(2)}<br>`;
                        }
                    });
                    return tooltipContent;
                }
            }
        },
        series: [{
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: edges,
            roam: true,
            label: {
                show: true
            },
            force: {
                repulsion: 200,
                edgeLength: 100
            }
        }]
    };
    chart.setOption(option);

    // Zoom Controls
    document.getElementById('zoomIn').addEventListener('click', () => {
        chart.dispatchAction({ type: 'dataZoom', zoom: 1.2 });
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        chart.dispatchAction({ type: 'dataZoom', zoom: 0.8 });
    });

    document.getElementById('resetView').addEventListener('click', () => {
        chart.dispatchAction({ type: 'restore' });
    });
});
