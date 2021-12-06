import React, { useState, useEffect, useRef } from 'react';
import Graph from './Graph';
import Info from './Info';
import getData, { getCompanyDetails } from '../Apis/SearchAPI';
import './search.css'


export default function Search() {

  const [graphData, setGraphData] = useState(null);
  const [info, setInfo] = useState({ graph: {}, company: {} })
  const [id, setId] = useState("");


  useEffect(() => {
    console.log("id updated" + "..." + id)
    //Select here if trading partners or facilities should be searched, and then make the relavant API call.
    if (id !== "") {
      getCompanyDetails(id.trim())
        .then(({ company, data }) => {
          //  console.log(data)
          setGraphData(data)
          //  setInfo({ ...info, graph: data, company: company })
        })
    }
    return (() => {
      setGraphData(null)
      //setInfo({})
    })

  }, [id])


  const search = () => {
    const ele = document.getElementById("company").value
    setId(ele)
  }

  const details = ({ label }) => {
    setId(label)
  }

  return (
    <div className="search">
      <div>
        <input type="text" id="company" style={{ "marginRight": "30px" }}></input>
        <button onClick={search}> Search </button>
      </div>
      {graphData === null && id !== "" && <div className="loader" />}
      <div>
        {graphData !== null &&
          <div><Info /> <Graph data={graphData} getDetails={details} ele={document.getElementById("company").value} key={id} /></div>
        }
      </div>
    </div>
  );
}