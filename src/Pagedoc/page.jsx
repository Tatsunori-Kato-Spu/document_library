import React, { useState } from "react";
import { docdata } from "../../data/docdata";  
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // ใช้ไอคอนจาก FontAwesome
import "../Pagedoc/page.css";


  

  // ฟังก์ชันคลิกที่แถวในตาราง
  const handleRowClick = (rowData) => {
    alert(`ข้อมูลที่เลือก: ${JSON.stringify(rowData)}`);

  };

  return (
    <>
      

      <div className="table-wrapper">
        {/* ตาราง */}
        <table className="table-contenner">
          <thead className="table-th">
            <tr>
              <th>ลำดับ</th>
              <th>หมายเลข</th>
              <th>
                <FontAwesomeIcon
                  icon={faEnvelope} 
                  style={{ cursor: 'pointer', marginRight: '10px' }}
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
                    <button className="list-button" type="button">
                      <i className="bi bi-list"></i>
                    </button>
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
    </>
  );


export default SearchBar;