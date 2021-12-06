import React, { useState, useEffect, useRef, useCallback } from 'react';
import Graph from './Graph';
import Info from './Info';
import getData, { getCompanyDetails } from '../Apis/SearchAPI';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';

export default function SearchCytoscape() {

  const [graphData, setGraphData] = useState(null);
  const [id, setId] = useState("")
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [info, setInfo] = useState({})
  let cy = useRef < cytoscape | null > (null);
  const setCytoscape = useCallback(
    (ref) => {
      cy = ref;
    },
    [cy],
  );

  useEffect(() => {
    return () => {
      if (cy.current) {
        cy.current.removeAllListeners()
        cy.current = null;
      }
    };
  }, []);

  const cyCallback = useCallback(
    (cy) => {
      // this is called each render of the component, don't add more listeners
      if (cy.current) return;

      cy.current = cy;
      cy.on("click", "node", evt => {

        //  cy.removeAllListeners()
        var node = evt.target;
        console.log("TARGET", node.data());
        getDetails(node.data())

        //   cy.removeListener('tap')
      });
      cy.ready(() => {
        cy.layout(layout).run()

      })

    },
    [],
  );

  const getDetails = ({ id, label }) => {
    getCompanyDetails(label.trim())
      .then((data) => {
        console.log(data)
        setGraphData(data)
        //  cy.current.layout(layout).run()
        //  cy.layout(layout).run()

      })
  }

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
        width: 20,
        height: 20,
        label: "data(label)",

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "2px",
        color: "white",
        fontSize: 20
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

  const search = () => {
    const ele = document.getElementById("company").value
    //  setId(ele)
    getCompanyDetails(ele.trim())
      .then((data) => {
        console.log(data)
        setGraphData(data)

      })
  }

  return (
    <div>

      <input type="text" id="company"></input>
      <button onClick={search}> Search </button>
      {
        graphData !== null && <CytoscapeComponent
          elements={CytoscapeComponent.normalizeElements(graphData)}
          style={{ width: window.innerWidth, height: window.innerHeight }}
          zoomingEnabled={true}
          maxZoom={3}
          minZoom={0.1}
          autounselectify={false}
          boxSelectionEnabled={true}
          layout={layout}
          stylesheet={styleSheet}
          cy={cyCallback}
        />
      }

    </div>
  );
}