
import React from 'react';
import CytoscapeComponent from "react-cytoscapejs";


export default function Graph({ updateSearch, data }) {


  const layout = {
    name: "random",
    fit: true,
    // circle: true,
    directed: true,
    padding: 50,
    // spacingFactor: 1.5,
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: false
  };

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 10,
        height: 10,
        label: "data(label)",

        "z-index": "10",
        "text-color": "#4a56a6",
        "font-size": 15
      }
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 50,
        height: 50,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle"
      }
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier"
      }
    }
  ];

  return (
    <div>

      <div
        style={{
          border: "1px solid",
          backgroundColor: "#f5f6fe"
        }}
      >
        <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(data)}
          // pan={{ x: 200, y: 200 }}
          style={{ width: window.innerWidth, height: 500 }}
          zoomingEnabled={true}
          maxZoom={3}
          minZoom={0.1}
          autounselectify={false}
          boxSelectionEnabled={true}
          layout={layout}
          stylesheet={styleSheet}
          cy={cy => {
            cy.on("click", "node", evt => {
              cy.removeAllListeners()
              var node = evt.target;
              updateSearch(node.data())
            });
          }}
        />
      </div>
    </div>
  );
}