import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { getCompanyFacilities, getCompanyTradingPartners, getFacilityTradingPartners } from '../Apis/SearchAPI';

import Graph from './Graph';
import Info from './Info';
import List from './List';

import './search.css'

export default function Search() {

  let navigate = useNavigate();
  let location = useLocation();

  const path = location.pathname.split('/')
  const searchItem = path[path.length - 1]

  const [info, setInfo] = useState({ data: null, graph: null, altanaObj: null })
  const [searchType, setSearchType] = useState("tradingPartners")
  const [resultType, setResultType] = useState("partner") // Other option is facility

  useEffect(() => {
    if (searchItem !== "") {
      if (resultType === "facility") {
        getFacilityTradingPartners(searchItem)
          .then((facilities) => {
            let nodes = [{ data: { id: searchItem, label: searchItem } }];
            const facilitiesList = facilities.length > 10 ? facilities.slice(0, 10) : facilities;
            facilitiesList.forEach((facility) => {
              nodes.push({ data: { id: facility.facility_canon_id, label: facility.company_name, type: 'facility' } })
            })

            let edges = []
            facilitiesList.forEach((facility) => {
              edges.push({ data: { source: searchItem, target: facility.facility_canon_id } })
            })
            const graphData = { nodes: nodes, edges: edges }
            setInfo({ ...info, data: facilities, graph: graphData })
          })
      } else {
        if (searchType === "tradingPartners") {
          getCompanyTradingPartners(searchItem)
            .then(({ altanaObj, tradingPartners }) => {
              const graphData = getTradingPartnersGraphData(altanaObj, tradingPartners)
              setInfo({ ...info, data: tradingPartners, graph: graphData, altanaObj: altanaObj })
            })
        } else {
          // search type is facilities
          getCompanyFacilities(searchItem)
            .then(({ altanaObj, facilities }) => {
              const id = altanaObj.altana_canon_id;
              let nodes = [{ data: { id: id, label: altanaObj.company_name, type: "partner" } }];
              const companyFacilities = facilities.length > 10 ? facilities.slice(0, 10) : facilities;
              companyFacilities.forEach((facility) => {
                nodes.push({ data: { id: facility.facility_canon_id, label: facility.facility_canon_id, type: 'facility' } })
              })

              let edges = []
              companyFacilities.forEach((facility) => {
                edges.push({ data: { source: id, target: facility.facility_canon_id } })
              })
              const graphData = { nodes: nodes, edges: edges }
              setInfo({ ...info, data: facilities, graph: graphData, altanaObj: altanaObj })
            })
        }
      }
    }

    return (() => {
      setInfo({ ...info, data: null, graph: null, altanaObj: null })
    })
  }, [searchItem, searchType])

  const getTradingPartnersGraphData = (altanaObj, tradingPartners) => {

    const id = altanaObj.altana_canon_id;
    let nodes = [{ data: { id: id, label: altanaObj.company_name } }];
    const partners = tradingPartners.companies.length > 10 ? tradingPartners.companies.slice(0, 10) : tradingPartners.companies;
    partners.forEach((partner) => {
      nodes.push({ data: { id: partner.altana_canon_id, label: partner.company_name, type: 'partner' } })
    })

    let edges = []
    partners.forEach((partner) => {
      edges.push({ data: { source: id, target: partner.altana_canon_id } })
    })
    const graphData = { nodes: nodes, edges: edges }
    return graphData
  }

  /// Change it to apppend to path and then navigate
  const listSearchCallback = (label) => {
    console.log("Search callback called")
    navigate(`/search/${label}`)
  }

  const updateSearch = ({ label, id, type }) => {
    setResultType(type);
    navigate(`${location.pathname}/${label}`)
  }

  const updateSearchType = (event) => {
    console.log(event.target.id)
    setSearchType(event.target.id)
  }

  return (
    <>
      <div className="searchPanel">
        <div><p className="searchPanel__input-label">Search for   </p>
          <input className="searchPanel__input" type="text" id="searchInput"></input>
        </div>

        <div className="search-row" onChange={updateSearchType}>
          By <input type="radio"
            defaultChecked={searchType === "tradingPartners"}
            id="tradingPartners"
            name="details" />
          <label htmlFor="tradingPartners">Trading Partners   </label>
          <input type="radio" id="facilities" name="details" defaultChecked={searchType === "facilities"} />
          <label htmlFor="facilities">Facilities</label>
        </div>
        <button
          className="searchPanel__btn" onClick={() => {
            navigate(`/search/${document.getElementById("searchInput").value}`)
          }}> Search </button>
      </div>


      <div className="search">
        {info.graph === null && searchItem !== "" && <div className="loader" />}
        <div className="searchResultsPanel">
          {info.graph !== null &&
            <div className="searchResults__graph">
              <Info altanaObj={info.altanaObj} />
              <Graph
                data={info.graph}
                updateSearch={updateSearch}
                ele={document.getElementById("searchInput").value}
                width={"800"}
              />
            </div>
          }
          {info.graph !== null && info.graph.nodes !== null && info.graph.nodes.length > 10 && <List listItems={info.graph.nodes} searchCallback={listSearchCallback} />}
          {info.graph !== null && info.graph.length === 0 && <div>No results found</div>}
        </div>
      </div>
    </>
  );
}