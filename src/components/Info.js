import React from 'react';
import './info.css';

const Info = ({ company }) => {
  if (company === null) return
  return (
    <div className="infoPanel">
      <div className="infoPanel-row">Showing details for {company.company_name} </div>
      <div className="infoPanel-row"> Id is {company.altana_canon_id}
        <div className="infoPanel-row"> Countries of Operation are  {company.company_context.countries_of_operation.toString()} </div>
        <div className="infoPanel-row"> Number of records  {company.company_context.number_records} </div>
      </div>
    </div>
  )
}

export default Info;