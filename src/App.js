import React from 'react';
import * as d3 from "d3";
import './App.css';


function ListItem(props) {
  return <li><b>{props.type}</b> {props.value}</li>;
}

function NodesList(props) {
  const nodes = props.nodes();
  const listItems = nodes.map(function(node, id) {
      var title = node["title"] || node["name"] || node["_date"] || node["number"] || node["amount"] || node["_key"]
    return <ListItem key={node["_key"]} value={title} type={node["_collection"]} />
  }
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

function EdgesList(props) {
  const edges = props.edges();
  const listItems = edges.map((edge, id) =>
    // Правильно! Ключ нужно определять внутри массива:
    <ListItem key={id} value={edge["source"] + " " + edge["label"] + " " + edge["target"]} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      graph: {},
      nodes: {},
      edges: {},
      isLoaded: false
    };
  }

  componentDidMount() {
    fetch('http://192.168.0.2:9005/jurexpert/graph')
    .then(res => res.json())
    .then((data) => {
      this.setState({ 
        nodes: data["graph"]["nodes"],
        edges: data["graph"]["links"],
        isLoaded: true
      })
    })
    .catch(console.log)
  }
  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <Graph nodes={this.state.nodes} edges={this.state.edges} />
          <a name="nodes"></a>
          <h2>Список узлов графа</h2>
          <NodesList nodes={() => this.state.nodes} />
          <a name="edges"></a>
          <h2>Список рёбер графа</h2>
          <EdgesList edges={() => this.state.edges} />
        </div>
      )
    } else {
      return "Loading.."
    }
    
  }
}

export class Graph extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(width / 2, height / 2));

    var graph = {
      "links": this.props.edges,
      "nodes": this.props.nodes
    }
    

    var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 7)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

    }

    function dragstarted(d) {
      // simulation.alphaTarget(0.8).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = null //d3.event.x;
      d.fy = null //d3.event.y;
    }

    function dragended(d) {
      simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  render() {
    return (
      <svg width="960" height="800"></svg>
    )
  }
}

