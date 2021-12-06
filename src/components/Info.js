import React from 'react';
import getData, { getCompanyDetails } from '../Apis/SearchAPI';


const Info = ({ node }) => {
  const details = ({ label }) => {
    debugger;
    //  setId(label)
    getCompanyDetails(label)
      .then((data) => {
        console.log(data)
        //  setId(id)
        //  setGraphData({ ...data })

      })
  }


  return (
    <div> Showing details for </div>
  )
}

export default Info;