import React, { useState } from "react";
import "./history.css";
import { userdata } from "../../data/userdata";
import { useNavigate } from "react-router-dom";
import { docdata } from "../../data/docdata";
import Header from "../../Layout/Header/Header";
import Searchbar from "../Searchbar/Searchbar";

function History() {
  const [users, setUsers] = useState(userdata);
  const [filteredData, setFilteredData] = useState(docdata);
  const navigate = useNavigate();

  const handleSearch = (filtered) => {
    setFilteredData(filtered);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="profile-container2">
          <div className="profile-content-1">
            <div>
              <img
                src= "/document_library/profile1.png" 
                alt="รูปโปรไฟล์"
                className="photo"
              />
            </div>
            <button
              className="button-style"
              onClick={() => navigate("/profile")}
            >
              ข้อมูลพื้นฐาน
            </button>
            <button className="button-style">ประวัติ</button>
            <button
              className="button-style"
              onClick={() => navigate("/permission")}
            >
              กำหนดสิทธิ
            </button>
            <button className="button-style" onClick={() => navigate("/stats")}>
              สถิติ
            </button>
          </div>
          <div className="profile-content-2">
            <div className="searchbar-box">
              <Searchbar onSearch={handleSearch} searchType="documents" />
            </div>
            <div className="table-wrapper2">
              <table className="table-contenner">
                <thead className="table-th">
                  <tr>
                    <th>หมายเลข</th>
                    <th>ชื่อเอกสาร</th>
                    <th>เรื่อง</th>
                    <th>หน่วยงาน</th>
                    <th>วันที่</th>
                    <th>เวลา</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{item["หมายเลข"]}</td>
                      <td>{item["ชื่อเอกสาร"]}</td>
                      <td>{item["เรื่อง"]}</td>
                      <td>{item["หน่วยงาน"]}</td>
                      <td>{item["วันที่"]}</td>
                      <td>{item["เวลา"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
