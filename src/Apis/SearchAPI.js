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

//Making 2 calls here since this will cause setState to be called only once which is better for UI,
export async function getTradingPartners(name) {
  const response = await fetch(`https://api.altana.ai/atlas/v1/company/match/${name}`, {
    headers: headers
  })
  const company = await response.json();
  const id = company.altana_canon_id;

  ///company/id/{company_id}/trading-partners
  const partners = await fetch(`https://api.altana.ai/atlas/v1/company/id/${id}/trading-partners`, {
    headers: {
      Accept: 'application/json',
      'X-Api-Key': 'MTpJbnRlcnZpZXclMjAyMDIxLTA5LTIyOjE2MzIzNTk2NTU6NWNhMzViYjk.ZmEwZWI5OTdmYWJjYWFlZWJmY2YyNGYyN2FkMmQ5YzkwODQ4NWNiYg'
    }
  })
  const tradingPartners = await partners.json()
  //console.log(tradingPartners)
  // let nodes = [{ data: { id: id, label: name } }];
  // tradingPartners.companies.forEach((partner) => {
  //   nodes.push({ data: { id: partner.altana_canon_id, label: partner.company_name } })
  // })

  // let edges = []
  // tradingPartners.companies.forEach((partner) => {
  //   edges.push({ data: { source: id, target: partner.altana_canon_id } })
  // })
  // const data = { nodes: nodes, edges: edges }
  return ({ company, tradingPartners })

}

export async function getFacilities(name) {

  const response = await fetch(`https://api.altana.ai/atlas/v1/company/match/${name}`, {
    headers: headers
  })
  const company = await response.json();
  const id = company.altana_canon_id;

  const facilitiesList = await fetch(`https://api.altana.ai/atlas/v1/company/id/${id}/facilities`, {
    headers: headers
  })
  const list = await facilitiesList.json();
  const facilities = list.facilities;

  //console.log(tradingPartners)


  return ({ company, facilities });

}

export default getCompanyDetails;