import React, { useState } from 'react';

// company.company_context.countries_of_operation
//company.altana_canon_id
//company.company_name
//company.company_context.number_records
const Info = ({ company, searchCallback }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const updateOptions = (evt) => {
    setSelectedOption(evt.target.id)
  }



  return (
    <div>
      <h3>Showing details for {company.company_name} </h3>
      <div> Id is {company.altana_canon_id} </div>
      <div> Countries of Operation are  {company.company_context.countries_of_operation.toString()} </div>
      <div> Number of records  {company.company_context.number_records} </div>
      <div onChange={updateOptions}>
        <input type="radio"
          defaultChecked={selectedOption === "tradingPartners"}
          id="tradingPartners"
          name="details" />
        <label htmlFor="tradingPartners">Trading Partners</label>
        <input type="radio" id="facilities" name="details" defaultChecked={selectedOption === "facilities"} />
        <label htmlFor="facilities">Facilities</label>
      </div>
      <button onClick={() => searchCallback(selectedOption)}> Submit </button>
    </div>
  )
}

export default Info;