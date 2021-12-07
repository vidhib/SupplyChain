import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Graph from './Graph';
import Info from './Info';
import getCompanyDetails, { getTradingPartners, getFacilities } from '../Apis/SearchAPI';
import './search.css'
import Facilities from './Facilities';
import List from './List';


export default function Search() {

  //const [graphData, setGraphData] = useState(null);
  //let { company } = useParams();
  let navigate = useNavigate();
  let location = useLocation();
  //console.log(location)
  const path = location.pathname.split('/')
  const searchItem = path[path.length - 1]

  const [info, setInfo] = useState({ graph: null, company: null })
  const [id, setId] = useState(searchItem);
  const [companyDetails, setCompanyDetails] = useState({});
  const [searchType, setSearchType] = useState("tradingPartners") // Other option is facilities
  const [facilitiesList, setFacilitiesList] = useState({});

  useEffect(() => {
    //  console.log("id updated" + "..." + id)
    //Select here if trading partners or facilities should be searched, and then make the relavant API call.
    if (searchItem !== "") {
      if (searchType === "tradingPartners") {
        getTradingPartners(searchItem)
          .then(({ company, data }) => {
            setInfo({ ...info, graph: data, company: company })
          })
      } else {
        getFacilities(searchItem)
          .then(() => {
            console.log("Searched for facilities")
          })
      }
    }
    return (() => {
      setInfo({ graph: null, company: null })
    })

  }, [searchItem])

  useEffect(() => {
    if (searchItem !== "") {
      getCompanyDetails(searchItem)
        .then((res) => {
          setCompanyDetails(res)
        })
    }
  }, [])


  const searchCallback = (option) => {
    console.log("Search callback called")
    if (option === "facilities") {
      getFacilities(info.company.altana_canon_id, info.company.name)
        .then((res) => {
          setFacilitiesList(res)
        })
    } else {

    }
  }

  const updateSearch = ({ label }) => {
    navigate(`${location.pathname}/${label}`)
  }

  return (
    <>
      <div>
        <input type="text" id="company" style={{ "margin": "30px" }}></input>
        <button onClick={() => {
          navigate(`/search/${document.getElementById("company").value}`)
        }}> Search </button>
        <div className="infoPanel-row" onChange={setSearchType}>
          <input type="radio"
            defaultChecked={searchType === "tradingPartners"}
            id="tradingPartners"
            name="details" />
          <label htmlFor="tradingPartners">Trading Partners</label>
          <input type="radio" id="facilities" name="details" defaultChecked={searchType === "facilities"} />
          <label htmlFor="facilities">Facilities</label>
        </div>
      </div>


      <div className="search">
        {info.graph === null && searchItem !== "" && <div className="loader" />}
        <div className="searchResultsPanel">
          {info.graph !== null &&
            <div className="searchResults__graph">
              <Info company={info.company} selectedOption={searchType} setSearchType={setSearchType} />
              <Graph
                data={info.graph}
                updateSearch={updateSearch}
                ele={document.getElementById("company").value}
                key={id}
                width="1000px"
              />
            </div>
          }
          {info.graph !== null && <List listItems={info.graph.nodes} searchCallback={searchCallback} />}
        </div>
        <div> {facilitiesList.facilities && <Facilities facilities={facilitiesList.facilities} />
        }
        </div>
      </div>
    </>
  );
}