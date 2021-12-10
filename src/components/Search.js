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
            let nodes = [{ data: { id: searchItem, label: searchItem, type: 'facility', total: facilities.length } }];
            const facilitiesList = facilities.length > 10 ? facilities.slice(0, 10) : facilities;
            facilitiesList.forEach((facility) => {
              nodes.push({ data: { id: facility.facility_canon_id, label: facility.company_name, type: 'company', total: facilities.length } })
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
              let nodes = [{ data: { id: id, label: altanaObj.company_name, type: 'partner', total: facilities.length } }];
              const companyFacilities = facilities.length > 10 ? facilities.slice(0, 10) : facilities;
              companyFacilities.forEach((facility) => {
                nodes.push({ data: { id: facility.facility_canon_id, label: facility.facility_canon_id, type: 'facility', total: facilities.length } })
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
    }) // eslint-disable-next-line 
  }, [searchItem, searchType])

  const getTradingPartnersGraphData = (altanaObj, tradingPartners) => {

    const id = altanaObj.altana_canon_id;
    let nodes = [{ data: { id: id, label: altanaObj.company_name, type: 'partner', total: tradingPartners.companies.length } }];
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
    navigate(`${location.pathname}/${label}`)
  }

  const updateSearchCallback = ({ label, type }) => {
    setResultType(type);
    navigate(`${location.pathname}/${label}`)
  }

  const updateSearchType = (event) => {
    setSearchType(event.target.id)
  }

  const getListComponent = () => {
    if (info.graph.nodes[0].data.type === "partner") {
      return <List listItems={info.data.companies} searchCallback={listSearchCallback} />
    } else {
      return <List listItems={info.data} searchCallback={listSearchCallback} />
    }
  }

  return (
    <>
      <div className="searchPanel">
        <div>
          <p className="searchPanel__input-label">Search for   </p>
          <input
            className="searchPanel__input"
            type="text"
            id="searchInput"
            placeholder={searchItem ? searchItem.replace(/%20/g, " ") : " "}>
          </input>
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
              {info.graph !== null && info.graph.nodes !== null && info.graph.nodes.length > 10 &&
                <div>{info.graph.nodes[0].data.total && <b>Showing 10 out of {info.graph.nodes[0].data.total}</b>}</div>
              }
              <Graph
                data={info.graph}
                updateSearch={updateSearchCallback}
                ele={document.getElementById("searchInput").value}
                width={"800"}
              />
            </div>
          }
          {info.graph !== null && info.graph.nodes !== null && info.graph.nodes[0].data.total > 10
            && getListComponent()
          }
        </div>
      </div>
    </>
  );
}