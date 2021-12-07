import React from "react";

const Facilities = ({ facilities }) => {
  if (facilities === null || facilities.length === 0) {
    return <div> No facilities found</div>
  }
  <>
    {
      facilities.map((facility) => {
        return (<div>
          <div> Address : {facility.address} </div>
        </div>)
      })
    }
  </>
}

export default Facilities;