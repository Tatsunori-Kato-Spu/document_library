import React, { useState } from "react";
import { docdata } from "../../data/docdata";  
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // ใช้ไอคอนจาก FontAwesome
import "../Searchbar/Searchbar.css";
import Filtersearch from "./Filtersearch/Filtersearch";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(docdata);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (searchQuery) => {
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

  // ฟังก์ชันคลิกที่แถวในตาราง
  const handleRowClick = (rowData) => {
    alert(`ข้อมูลที่เลือก: ${JSON.stringify(rowData)}`);

  };

  return (
    <>
      <div className="container">
      <div
          className="search-bar-container"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Form className="search-form" role="search" onSubmit={handleSubmit}>
            <input
              className="search-input"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={query}
              onChange={handleInputChange}
              // onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleEnter}
              style={{ flexGrow: 1 }}
            />

            <button className="search-button" type="button" title="Search">
              <span className="search-icon">
                <i className="bi bi-search"></i>
              </span>
            </button>

            <div>
              <button
                className="Slider-button"
                type="button"
                onClick={() => setDialogOpen(true)}
              >
                <span className="slider-icon">
                  <i className="bi bi-sliders2"></i>
                </span>
              </button>
              <Filtersearch
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onApply={(filtered) => setFilteredData(filtered)}
              />
            </div>
          </Form>

          <Button className="upload-button">
            <span className="upload-icon">
              <i className="bi bi-plus"></i>
            </span>
            อัปโหลด
          </Button>
        </div>
      </div>

      
    </>
  );
}

export default SearchBar;