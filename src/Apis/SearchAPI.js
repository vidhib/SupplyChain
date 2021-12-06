import tradingPartners from './tradingPartners.json';

const headers = {
  Accept: 'application/json',
  'X-Api-Key': 'MTpJbnRlcnZpZXclMjAyMDIxLTA5LTIyOjE2MzIzNTk2NTU6NWNhMzViYjk.ZmEwZWI5OTdmYWJjYWFlZWJmY2YyNGYyN2FkMmQ5YzkwODQ4NWNiYg'
}

async function getData() {
  const response = await fetch('https://api.altana.ai/atlas/v1/company/id/e978b84b-13c8-598c-b02a-0400d53b7a7f', {
    headers: headers
  })

  const companies = await response.json();
  return companies;
}

export async function getCompanyDetails(name) {
  const response = await fetch(`https://api.altana.ai/atlas/v1/company/match/${name}`, {
    headers: headers
  })
  const company = await response.json();
  const id = company.altana_canon_id;
  console.log(id)
  ///company/id/{company_id}/trading-partners
  const partners = await fetch(`https://api.altana.ai/atlas/v1/company/id/${id}/trading-partners`, {
    headers: {
      Accept: 'application/json',
      'X-Api-Key': 'MTpJbnRlcnZpZXclMjAyMDIxLTA5LTIyOjE2MzIzNTk2NTU6NWNhMzViYjk.ZmEwZWI5OTdmYWJjYWFlZWJmY2YyNGYyN2FkMmQ5YzkwODQ4NWNiYg'
    }
  })
  const tradingPartners = await partners.json()
  //console.log(tradingPartners)
  let nodes = [{ data: { id: id, label: name } }];
  tradingPartners.companies.slice(0, 10).forEach((company) => {
    nodes.push({ data: { id: company.altana_canon_id, label: company.company_name } })
  })

  let edges = []
  tradingPartners.companies.slice(0, 10).forEach((data) => {
    edges.push({ data: { source: id, target: data.altana_canon_id } })
  })
  const data = { nodes: nodes, edges: edges }
  return ({ company, data })

}

export async function getFacilities(id, name) {

  ///company/id/{company_id}/trading-partners
  const facilities = await fetch(`https://api.altana.ai/atlas/v1/company/id/${id}/facilities`, {
    headers: headers
  })
  const facilitiesList = await facilities.json()
  //console.log(tradingPartners)
  let nodes = [{ data: { id: id, label: name } }];
  facilitiesList.slice(0, 10).forEach((facility) => {
    nodes.push({ data: { id: facility.facility_canon_id, label: facility.address } })
  })

  let edges = []
  facilitiesList.slice(0, 10).forEach((data) => {
    edges.push({ data: { source: id, target: data.facility_canon_id } })
  })

  return ({ nodes: nodes, edges: edges })

}

export default getData;