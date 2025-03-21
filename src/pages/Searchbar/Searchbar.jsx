import React, { useState } from "react";
import { userdata } from "../../data/userdata";
import { docdata } from "../../data/docdata";
import Form from "react-bootstrap/Form";
import "./Searchbar.css";
import Filtersearch from "./Filtersearch/Filtersearch";

function SearchBar({ onSearch, searchType }) {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState({users: userdata,
    documents: docdata});
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      if (searchType === "users") {
        onSearch(userdata); 
      } else if (searchType === "documents") {
        onSearch(docdata); 
      }
      return;
    }

    // กรองข้อมูลผู้ใช้
    if (searchType === "users") {
      // ค้นหาผู้ใช้
      const filteredUsers = userdata.filter(
        (user) =>
          user.ชื่อ.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.รหัสประจำตัว.includes(searchQuery) ||
          user.หน่วยงาน.toLowerCase().includes(searchQuery.toLowerCase())
      );
      onSearch(filteredUsers); 

    // กรองข้อมูลเอกสาร
  } else if (searchType === "documents") {
    // ค้นหาเอกสาร
    const filteredDocuments = docdata.filter(
      (doc) =>
        doc.หมายเลข.includes(searchQuery) ||
        doc.ชื่อเอกสาร.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.เรื่อง.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.หน่วยงาน.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.วันที่.includes(searchQuery) ||
        doc.เวลา.includes(searchQuery)
    );
    onSearch(filteredDocuments); 
  }
};

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(query);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };


  return (
    <div>
      <div className="container">
        <Form className="search-form" role="search" onSubmit={handleSubmit}>
          <input
            className="search-input"
            // type="search"
            placeholder="Search"
            aria-label="Search"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleEnter}
            style={{ flexGrow: 1 }}
          />
          <div className="search-button">

          <button className="search-button" type="submit" title="Search">
            <span className="search-icon">
              <i className="bi bi-search"></i>
            </span>
          </button>
          <button
            className="Slider-button"
            type="button"
            onClick={() => setDialogOpen(true)}>
            <span className="slider-icon">
              <i className="bi bi-sliders2"></i>
            </span>
          </button>
              </div>
        </Form>
        <Filtersearch
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onApply={(filtered) => {
            setFilteredData(filtered);
            onSearch(filtered);
          }}
        />
      </div>  
      </div>
  );
}

export default SearchBar;
