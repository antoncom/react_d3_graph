import React from 'react';
import logo from './logo.svg';
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

class App extends React.Component {
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
      this.setState({ graph: data })
      this.setState({
        nodes: this.state.graph.root.nodes,
        edges: this.state.graph.root.links,
        isLoaded: true
      })
      // console.log(this.state.nodes)
    })
    .catch(console.log)
  }
  render() {
    if (this.state.isLoaded) {
      return (
        <div>
          <NodesList nodes={() => this.state.nodes} />
          <EdgesList edges={() => this.state.edges} />
        </div>
      )
    } else {
      return "Loading.."
    }
    
  }
}

export default App;
