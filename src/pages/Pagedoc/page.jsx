import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons"; // นำเข้า faRegStar จากชุด regular
import "./page.css";
import { docdata } from "../../data/docdata";
import Searchbar from "../Searchbar/Searchbar";
import Dropdown from "react-bootstrap/Dropdown";

const Pagedoc = () => {
  const [filteredData, setFilteredData] = useState(docdata.map(item => ({ ...item, isFavorite: false }))); // เพิ่ม isFavorite เริ่มต้นเป็น false
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSearch = (filtered) => {
    setFilteredData(filtered);
  };

  const handleRowClick = (rowData) => {
    alert(`ข้อมูลที่เลือก: ${JSON.stringify(rowData)}`);
  };

  const handleDropdownToggle = (e, index) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleSortByDate = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a["วันที่"].split("/").reverse().join("-"));
      const dateB = new Date(b["วันที่"].split("/").reverse().join("-"));
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const handleSortByOrder = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const orderA = parseInt(a["หมายเลข"]);
      const orderB = parseInt(b["หมายเลข"]);
      return sortOrder === "desc" ? orderB - orderA : orderA - orderB;
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const handleStarClick = (index) => {
    const newData = [...filteredData];
    newData[index].isFavorite = !newData[index].isFavorite; // สลับสถานะของดาว
    setFilteredData(newData); // อัพเดตข้อมูลที่กรองแล้ว
  };

  return (
    <>
      <div className="page-container">
        <div className="searchbar-container">
          <Searchbar onSearch={handleSearch} />
        </div>

        <div className="table-wrapper">
          <table className="table-contenner">
            <thead className="table-th">
              <tr>
                <th></th>
                <th>
                  ลำดับ
                  <button className="icon-button" onClick={handleSortByOrder}>
                    {sortOrder === "desc" ? "🔽" : "🔼"}
                  </button>
                </th>
                <th>หมายเลข</th>
                <th>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                  ชื่อเอกสาร
                </th>
                <th>เรื่อง</th>
                <th>หน่วยงาน</th>
                <th>
                  วันที่
                  <button className="icon-button" onClick={handleSortByDate}>
                    {sortOrder === "desc" ? "🔽" : "🔼"}
                  </button>
                </th>
                <th>เวลา</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} onClick={() => handleRowClick(item)}>
                    <td>
                      <FontAwesomeIcon
                        icon={item.isFavorite ? faStar : faRegStar}
                        style={{
                          cursor: "pointer",
                          color: item.isFavorite ? "#FF8539" : "#ccc",
                        }}
                        onClick={() => handleStarClick(index)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{item["หมายเลข"]}</td>
                    <td>{item["ชื่อเอกสาร"]}</td>
                    <td>{item["เรื่อง"]}</td>
                    <td>{item["หน่วยงาน"]}</td>
                    <td>{item["วันที่"]}</td>
                    <td>{item["เวลา"]}</td>
                    <td>
                      <div className="dropdown">
                        <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                            <i className="bi bi-list"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">ไม่พบผลลัพธ์</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Pagedoc;
