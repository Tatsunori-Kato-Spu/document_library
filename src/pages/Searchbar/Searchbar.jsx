import React, { useState } from "react";
import { docdata } from "../../data/docdata";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../Searchbar/Searchbar.css";
import Filtersearch from "./Filtersearch/Filtersearch";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(docdata);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    const filtered = docdata.filter(
      (item) =>
        item.หมายเลข.includes(searchQuery) ||
        item.ชื่อเอกสาร.includes(searchQuery) ||
        item.เรื่อง.toLowerCase().includes(searchQuery) ||
        item.หน่วยงาน.includes(searchQuery) ||
        item.วันที่.includes(searchQuery) ||
        item.เวลา.includes(searchQuery)
    );
    setFilteredData(filtered);
    onSearch(filtered);
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
    <div className="container">
      <Form className="search-form" role="search" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleEnter}
          style={{ flexGrow: 1 }}
        />
        <button className="search-button" type="submit" title="Search">
          <span className="search-icon">
            <i className="bi bi-search"></i>
          </span>
        </button>
        <button
          className="Slider-button"
          type="button"
          onClick={() => setDialogOpen(true)}
        >
          <span className="slider-icon">
            <i className="bi bi-sliders2"></i>
          </span>
        </button>
      </Form>
      <Filtersearch
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onApply={(filtered) => {
          setFilteredData(filtered);
          onSearch(filtered);
        }}
      />
      {/* <Button className="upload-button">
        <span className="upload-icon">
          <i className="bi bi-plus"></i>
        </span>
        อัปโหลด
      </Button> */}
    </div>
  );
}

export default SearchBar;
