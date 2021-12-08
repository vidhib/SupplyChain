import React, { useState } from "react";
import './list.css';

const List = ({ listItems, searchCallback }) => {
  const [name, setName] = useState("");
  const [filteredItems, setFilteredItems] = useState(listItems)

  const filter = (evt) => {
    const keyword = evt.target.value;
    if (keyword !== "") {
      const foundResults = filteredItems.filter((item) => item.data.label.toLowerCase().startsWith(keyword.toLowerCase()))
      setFilteredItems(foundResults)
    }
    else {
      setFilteredItems(listItems)
    }
    setName(keyword);
  }

  return (<div className="listContainer">
    <input type="search"
      className="filter"
      value={name}
      onChange={filter}
      placeholder="Search..."
    />
    <ul style={{ "listStyleType": "none" }}>
      {filteredItems && filteredItems.length > 0 ?
        filteredItems.map(item => {
          return <li key={item.data.label} onClick={() => searchCallback(item.data.label)}>
            <span className="filteredItem">{item.data.label}</span>
          </li>
        }) : <h2> No results found</h2>
      }
    </ul>
  </div>)
}

export default List;