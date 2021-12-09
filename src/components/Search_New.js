import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import getCompanyDetails, { getCompanyFacilities, getCompanyTradingPartners, getFacilityTradingPartners } from '../Apis/SearchAPI';

import Graph from './Graph';
import Info from './Info';
import List from './List';

import './search.css'

export default function Search() {

  let navigate = useNavigate();
  let location = useLocation();

  const path = location.pathname.split('/')
  const searchItem = path[path.length - 1]

  //  const isFirstRender = useRef(true);
  const [altanaObj, setAltanaObj] = useState(null);
  const [searchStates, setSearchStates] = new ({
    altanaObj: null,
    graphData: null,
    searchType: "tradingPartners",
    resultType: "partner",
    shouldCall: false
  })

  const [searchType, setSearchType] = useState("tradingPartners")
  const [resultType, setResultType] = useState("partner") // Other option is facility

  const [graphData, setGraphData] = useState(null);

  const [shouldCall, setShouldCall] = useState(false);
  const isFirstRun = useRef(true);


  useEffect(() => {

    if (altanaObj !== null && isFirstRun.current === true) {
      isFirstRun.current = false;
      if (searchType === "facilities") {
        getCompanyFacilities(altanaObj.altana_canon_id)
          .then((facilities) => {
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
            setGraphData(graphData)
          })
      } else {
        getCompanyTradingPartners(altanaObj.altana_canon_id)
          .then(({ tradingPartners }) => {
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
            setGraphData(graphData)
          })
      }

    }
  }, [altanaObj])



  useEffect(() => {
    if (altanaObj !== null) {
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
            setGraphData(graphData)
          })
      } else {
        if (searchType === "tradingPartners") {
          getCompanyTradingPartners(searchItem)
            .then(({ altanaObj, tradingPartners }) => {
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
              setGraphData(graphData)
            })
        } else {
          //search type is facilities
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
              setGraphData(graphData)
            })
        }
      }
      getCompanyTradingPartners(altanaObj.altana_canon_id)
        .then(({ tradingPartners }) => {
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
          setGraphData(graphData)
        })
    }
    return (() => {
      setGraphData(null)
      setShouldCall(false)
    })
  }, [shouldCall])


  // Get compnay details

  const searchDetails = () => {
    // Get company details

    // IF there is already altanaObj, we don't really want to call search again.
    const val = document.getElementById("searchInput").value
    if (altanaObj === null) {
      getCompanyDetails(val)
        .then((res) => setAltanaObj(res))
    } else {
      // MAke a call to update set to make a search call.
      setShouldCall(true)
    }
    navigate(`/search/${val}`)
  }

  //Update the details. Don't want to make a call yet.
  const graphCallback = ({ id, type }) => {
    getCompanyDetails(id)
      .then((res) => {
        setAltanaObj(res)
        setResultType(type);
      })

  }

  /// Change it to apppend to path and then navigate
  const listSearchCallback = (id, label) => {
    console.log("Search callback called")
    getCompanyDetails(id)
      .then((res) => setAltanaObj(res))
    navigate(`/search/${label}`)
  }


  const updateSearchType = (event) => {
    console.log(event.target.id)
    setSearchType(event.target.id)
  }

  return (
    <>
      <div className="searchPanel">
        <div><p className="searchPanel__input-label">Search for   </p>
          <input className="searchPanel__input" type="text" id="searchInput" placeholder="Discover .."></input>
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
          className="searchPanel__btn" onClick={searchDetails}> Search </button>
      </div>

      {graphData !== null &&
        <div className="searchResults__graph">
          <Info altanaObj={altanaObj} />
          Showing 10 out of 20
          <Graph
            data={graphData}
            updateSearch={graphCallback}
            ele={document.getElementById("searchInput").value}
            width={"800"}
          />
        </div>
      }
    </>
  );
}