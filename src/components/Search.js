import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useNavigate, useLocation } from "react-router-dom";
import Graph from './Graph';
import Info from './Info';
import { getCompanyDetails, getFacilities } from '../Apis/SearchAPI';
import './search.css'
import Facilities from './Facilities';


export default function Search() {

  //const [graphData, setGraphData] = useState(null);
  //let { company } = useParams();
  let navigate = useNavigate();
  let location = useLocation();
  console.log(location)
  const path = location.pathname.split('/')
  const company = path[path.length - 1]
  //const history = useHistory();

  const [info, setInfo] = useState({ graph: null, company: null })
  const [id, setId] = useState(company);
  const [facilitiesList, setFacilitiesList] = useState({});

  useEffect(() => {
    //  console.log("id updated" + "..." + id)
    //Select here if trading partners or facilities should be searched, and then make the relavant API call.
    if (company !== "") {
      getCompanyDetails(company)
        .then(({ company, data }) => {
          setInfo({ ...info, graph: data, company: company })
        })
    }
    return (() => {
      setInfo({ graph: null, company: null })
    })

  }, [company])


  const searchCallback = (option) => {
    console.log("Search callback called")
    if (option === "facilities") {
      getFacilities(info.company.altana_canon_id, info.company.name)
        .then((res) => {
          setFacilitiesList(res)
        })
    }
  }


  const updateSearch = ({ label }) => {
    navigate(`${location.pathname}/${label}`)
  }

  return (
    <div className="search">
      {info.graph === null && id !== "" && <div className="loader" />}
      <div>
        {info.graph !== null &&
          <div><Info company={info.company} searchCallback={searchCallback} /> <Graph data={info.graph} updateSearch={updateSearch} ele={document.getElementById("company").value} key={id} /></div>
        }
      </div>
      <div> {facilitiesList.facilities && <Facilities facilities={facilitiesList.facilities} />
      }
      </div>
    </div>
  );
}