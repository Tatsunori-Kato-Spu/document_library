import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import "../Pagedoc/page.css";  // ใช้ CSS ของคุณ
import { docdata } from "../../data/docdata";  

const Pagedoc = ({ userRole }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    console.log("User Role in Pagedoc:", userRole);  // ตรวจสอบค่าบทบาทที่ได้รับจาก props
    if (userRole) {
      const dataByRole = docdata.filter((doc) => doc.roles.includes(userRole));
      console.log("Filtered Data:", dataByRole);  // ตรวจสอบข้อมูลที่กรอง
      setFilteredData(dataByRole);
    }
  }, [userRole]);
  

  const handleRowClick = (rowData) => {
    alert(`ข้อมูลที่เลือก: ${JSON.stringify(rowData)}`);
  };

  return (
    <div className="table-wrapper">
      <table className="table-contenner">
        <thead className="table-th">
          <tr className="trxr">
            <th>ลำดับ</th>
            <th>หมายเลข</th>
            <th>ชื่อเอกสาร</th>
            <th>เรื่อง</th>
            <th>หน่วยงาน</th>
            <th>วันที่</th>
            <th>เวลา</th>
            {/* <th></th> */}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
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
              <td colSpan="8">ไม่พบผลลัพธ์</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pagedoc;
