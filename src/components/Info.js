import React from 'react';
import './info.css';

const Info = ({ company }) => {
  if (company === null) return;

  const countries = company.company_context.countries_of_operation;
  let operations = "";
  if (countries.length > 0) {
    operations = countries.join(', ')
  } else {
    operations = "None";
  }

  return (
    <div className="infoPanel">
      <div className="infoPanel__header">
        <div className="infoPanel-row infoPanel-row__title">Name</div>
        <div className="infoPanel-row infoPanel-row__title">Id</div>
        <div className="infoPanel-row infoPanel-row__title">Countries of Operation</div>
        <div className="infoPanel-row infoPanel-row__title">Number of records</div>
      </div>
      <div className="infoPanel__values">
        <div className="infoPanel-row">{company.company_name}</div>
        <div className="infoPanel-row">{company.altana_canon_id}</div>
        <div className="infoPanel-row"> {operations}</div>
        <div className="infoPanel-row">{company.company_context.number_records}</div>
      </div>
    </div>
  )
}

export default Info;
