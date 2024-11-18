import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./page.css";
import { docdata } from "../../data/docdata";
import Searchbar from "../Searchbar/Searchbar";
import Dropdown from "../Dropdown/Dropdown";

const Pagedoc = () => {
  const [filteredData, setFilteredData] = useState(docdata); // กำหนดค่าเริ่มต้นจาก docdata
  const [activeDropdown, setActiveDropdown] = useState(null);
  //search
  const handleSearch = (filtered) => {
    setFilteredData(filtered); // อัพเดตข้อมูลที่กรองแล้ว
  };

  // ฟังก์ชันคลิกที่แถวในตาราง
  const handleRowClick = (rowData) => {
    alert(`ข้อมูลที่เลือก: ${JSON.stringify(rowData)}`);
  };

  //ปุ่มลิส
  const handleDropdownToggle = (e,index) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index); 
  };
  
  return (
    <>
      <div>
        <Searchbar onSearch={handleSearch} />

        <div className="table-wrapper">
          <table className="table-contenner">
            <thead className="table-th">
              <tr>
                <th>ลำดับ</th>
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
                <th>วันที่</th>
                <th>เวลา</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index} onClick={() => handleRowClick(item)}>
                    <td>{index + 1}</td>
                    <td>{item["หมายเลข"]}</td>
                    <td>{item["ชื่อเอกสาร"]}</td>
                    <td>{item["เรื่อง"]}</td>
                    <td>{item["หน่วยงาน"]}</td>
                    <td>{item["วันที่"]}</td>
                    <td>{item["เวลา"]}</td>
                    <td>
                    <div style={{ position: "relative" }}>
                      <button
                        className="list-button"
                        type="button"
                        onClick={(e) => handleDropdownToggle(e, index)}
                      >
                        <i className="bi bi-list"></i>
                      </button>
                      {activeDropdown === index && (
                        <Dropdown
                          isOpen={activeDropdown === index}
                          onClose={() => setActiveDropdown(null)}
                        />
                      )}
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
