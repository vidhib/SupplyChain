
// API calls to backend

const headers = {
  Accept: 'application/json',
  'X-Api-Key': 'MTpJbnRlcnZpZXclMjAyMDIxLTA5LTIyOjE2MzIzNTk2NTU6NWNhMzViYjk.ZmEwZWI5OTdmYWJjYWFlZWJmY2YyNGYyN2FkMmQ5YzkwODQ4NWNiYg'
}

export async function getCompanyDetails(name) {
  const res = await fetch(`https://api.altana.ai/atlas/v1/company/match/${name}`, {
    headers: headers
  })
  const companyDetails = res.json()
  return companyDetails;
}

export async function getCompanyTradingPartners(name) {
  const response = await fetch(`https://api.altana.ai/atlas/v1/company/match/${name}`, {
    headers: headers
  })
  const altanaObj = await response.json();
  const id = altanaObj.altana_canon_id;

  const partners = await fetch(`https://api.altana.ai/atlas/v1/company/id/${id}/trading-partners`, {
    headers: {
      Accept: 'application/json',
      'X-Api-Key': 'MTpJbnRlcnZpZXclMjAyMDIxLTA5LTIyOjE2MzIzNTk2NTU6NWNhMzViYjk.ZmEwZWI5OTdmYWJjYWFlZWJmY2YyNGYyN2FkMmQ5YzkwODQ4NWNiYg'
    }
  })
  const tradingPartners = await partners.json()
  return ({ altanaObj, tradingPartners })
}

export async function getCompanyFacilities(name) {
  const response = await fetch(`https://api.altana.ai/atlas/v1/company/match/${name}`, {
    headers: headers
  })
  const altanaObj = await response.json();
  const company_id = altanaObj.altana_canon_id;

  const facilitiesList = await fetch(`https://api.altana.ai/atlas/v1/company/id/${company_id}/facilities `, {
    headers: headers
  })
  const list = await facilitiesList.json();
  const facilities = list.facilities;
  return ({ altanaObj, facilities });

}

export async function getFacilityTradingPartners(id) {
  const res = await fetch(`https://api.altana.ai/atlas/v1/facility/id/${id}/trading-partners`, {
    headers: headers
  })

  const partners = await res.json();
  return (partners.facilities);
}


export default getCompanyDetails;