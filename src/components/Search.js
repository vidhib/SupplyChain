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

  const [info, setInfo] = useState({ data: null, graph: null, company: null })
  const [id, setId] = useState(searchItem);
  const [companyDetails, setCompanyDetails] = useState({});
  const [searchType, setSearchType] = useState("tradingPartners") // Other option is facilities
  const [facilitiesList, setFacilitiesList] = useState({});

  useEffect(() => {
    if (searchItem !== "") {
      if (searchType === "tradingPartners") {
        getTradingPartners(searchItem)
          .then(({ company, tradingPartners }) => {
            let nodes = [{ data: { id: id, label: company.company_name } }];
            const companies = tradingPartners.companies.length > 10 ? tradingPartners.companies.slice(0, 10) : tradingPartners.companies;
            companies.forEach((partner) => {
              nodes.push({ data: { id: partner.altana_canon_id, label: partner.company_name } })
            })

            let edges = []
            companies.forEach((partner) => {
              edges.push({ data: { source: id, target: partner.altana_canon_id } })
            })
            const graphData = { nodes: nodes, edges: edges }
            setInfo({ ...info, data: tradingPartners, graph: graphData, company: company })
          })
      } else {
        getFacilities(searchItem)
          .then(({ company, facilities }) => {
            if (facilities.length > 0) {
              const list = facilities.length > 10 ? facilities.slice(0, 10) : facilities;

              let nodes = [{ data: { id: id, label: company.company_name } }];
              list.forEach((facility) => {
                nodes.push({ data: { id: facility.facility_canon_id, label: facility.address } })
              })

              let edges = []
              list.forEach((facility) => {
                edges.push({ data: { source: id, target: facility.facility_canon_id } })
              })
              const data = { nodes: nodes, edges: edges }
              setInfo({ ...info, data: facilities, graph: data, company: company })
            }
            setInfo({ ...info, data: [], graph: [], company: company })

          })
      }
    }
    return (() => {
      setInfo({ graph: null, company: null })
    })


  }, [searchItem, searchType])

  // useEffect(() => {
  //   if (searchItem !== null && searchItem !== "") {
  //     getCompanyDetails(searchItem)
  //       .then((res) => {
  //         setCompanyDetails(res)
  //       })
  //   }
  // }, [searchItem])


  const searchCallback = (label) => {
    console.log("Search callback called")
    navigate(`/search/${label}`)
  }

  const updateSearch = ({ label }) => {
    navigate(`${location.pathname}/${label}`)
  }

  const updateSearchType = (event) => {
    console.log(event.target.id)
    setSearchType(event.target.id)
  }

  return (
    <>
      <div>
        <input type="text" id="company" style={{ "margin": "30px" }}></input>
        <button onClick={() => {
          navigate(`/search/${document.getElementById("company").value}`)
        }}> Search </button>
        <div className="infoPanel-row" onChange={updateSearchType}>
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
          {info.data !== null && info.data.companies !== null && info.data.companies.length > 10 && <List listItems={info.graph.nodes} searchCallback={searchCallback} />}
          {/* {info.graph !== null && info.graph.length === 0 && <div>No results found</div>} */}
        </div>
        <div> {facilitiesList.facilities && <Facilities facilities={facilitiesList.facilities} />
        }
        </div>
      </div>
    </>
  );
}