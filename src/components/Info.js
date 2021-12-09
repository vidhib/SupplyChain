import React from 'react';
import './info.css';

const Info = ({ altanaObj }) => {
  if (altanaObj === null || altanaObj === undefined) return;

  const countries = altanaObj.company_context.countries_of_operation;
  let operationCountries = "";
  if (countries.length > 0) {
    operationCountries = countries.join(', ')
  } else {
    operationCountries = "None";
  }

  return (
    <div className="infoPanel">
      <div>
        {altanaObj.company_name && <div className="infoPanel-row infoPanel-row__title">Name</div>}
        <div className="infoPanel-row infoPanel-row__title">Id</div>
        <div className="infoPanel-row infoPanel-row__title">Countries of Operation</div>
        <div className="infoPanel-row infoPanel-row__title">Number of records</div>
        {altanaObj.address && <div className="infoPanel-row infoPanel-row__title">Address</div>}
      </div>
      <div>
        {altanaObj.company_name && <div className="infoPanel-row infoPanel-row__title">{altanaObj.company_name.toUpperCase()}</div>}
        <div className="infoPanel-row">{altanaObj.altana_canon_id}</div>
        <div className="infoPanel-row"> {operationCountries}</div>
        <div className="infoPanel-row">{altanaObj.company_context.number_records}</div>
        {altanaObj.address && <div className="infoPanel-row">{altanaObj.address}</div>}
      </div>
    </div>
  )
}

export default Info;
