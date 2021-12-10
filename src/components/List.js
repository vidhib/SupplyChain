import React, { useState } from "react";
import './list.css';

const List = ({ listItems, searchCallback }) => {
  const [name, setName] = useState("");
  const [filteredItems, setFilteredItems] = useState(listItems)

  const filter = (evt) => {
    const keyword = evt.target.value;
    if (keyword !== "") {
      const foundResults = filteredItems.filter((item) => item.company_name.toLowerCase().startsWith(keyword.toLowerCase()))
      setFilteredItems(foundResults)
    }
    else {
      setFilteredItems(listItems)
    }
    setName(keyword);
  }

  //filteredItems.companies[0].company_name
  return (<div className="listContainer">
    <input type="search"
      className="list-filter"
      value={name}
      onChange={filter}
      placeholder="Search more items..."
    />
    <ul>
      {filteredItems && filteredItems.length > 0 ?
        filteredItems.map(item => {
          return <li key={item.company_name.toUpperCase()} onClick={() => searchCallback(item.company_name)}>
            <span className="list-filteredItem">{item.company_name}</span>
          </li>
        }) : <h2> No results found</h2>
      }
    </ul>
  </div>)
}

export default List;