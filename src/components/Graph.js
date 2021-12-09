
import React from 'react';
import CytoscapeComponent from "react-cytoscapejs";

export default function Graph({ updateSearch, data, width }) {

  const layout = {
    name: "random",
    fit: true,
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
        backgroundColor: "#CD492D",
        width: 15,
        height: 15,
        label: "data(label)",
        "z-index": "10",
        "text-color": "#CD492D",
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
        width: 25,
        height: 25,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 2
      }
    },
    {
      selector: "node[type='facility']",
      style: {
        backgroundColor: "#CD492D",
        "text-color": "#4a56a6",
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
          style={{ width: width, height: 600 }}
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