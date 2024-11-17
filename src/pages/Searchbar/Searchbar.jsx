import React, { useState } from "react";

import Filtersearch from "./Filtersearch/Filtersearch";
import docdata from "../../data/docdata";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import "./Searchbar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState(docdata);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = (searchQuery) => {
    const filtered = docdata.filter(
      (item) =>
        item.id.includes(searchQuery) ||
        item.title.includes(searchQuery) ||
        item.description.toLowerCase().includes(searchQuery) ||
        item.department.includes(searchQuery) ||
        item.date.includes(searchQuery) ||
        item.time.includes(searchQuery)
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
      <div className="table-container">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th style={{ backgroundColor: "#FF8539" }}>หมายเลข</th>
                <th style={{ backgroundColor: "#FF8539" }}>
                  <i className="bi bi-envelope"></i>&nbsp; ชื่อเอกสาร
                </th>
                <th style={{ backgroundColor: "#FF8539" }}>เรื่อง</th>
                <th style={{ backgroundColor: "#FF8539" }}>หน่อยงาน</th>
                <th style={{ backgroundColor: "#FF8539" }}>วันที่</th>
                <th style={{ backgroundColor: "#FF8539" }}>เวลา</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredData.length > 0 ? (
                filteredData.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>
                      <strong>{report.title}</strong>
                    </td>
                    <td>{report.description}</td>
                    <td>{report.department}</td>
                    <td>{report.date}</td>
                    <td>{report.time}</td>
                    <td>
                      <button className="list-button" type="button">
                        <i className="bi bi-list"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">ไม่พบผลลัพธ์</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
