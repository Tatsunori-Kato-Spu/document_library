import React, { useState, useEffect } from "react";
import "./history.css";
import { userdata } from "../../data/userdata";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import Searchbar from "../Searchbar/Searchbar";

function History() {
  const [user, setUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      const currentUser = userdata.find((u) => u.token === token);
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, [token]);

  useEffect(() => {
    fetch("http://localhost:3001/api/documents")
      .then((response) => response.json())
      .then((data) => {
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching documents:", error));
  }, []);

  if (!user) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

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
                src="/document_library/profile1.png"
                alt="รูปโปรไฟล์"
                className="photo"
              />
            </div>
            <button className="button-style" onClick={() => navigate("/document_library/profile")}>
              ข้อมูลพื้นฐาน
            </button>
            {/* แสดงปุ่ม "ประวัติ" เฉพาะถ้าผู้ใช้ไม่ใช่ worker */}
            {user.role !== "worker" && (
              <button className="button-style">ประวัติ</button>
            )}
            {user.role === "admin" && (
              <>
                <div>
                  <button onClick={() => navigate("/document_library/permission")} className="button-box-1">
                    กำหนดสิทธิ
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="profile-content-2">
            {/* <div className="searchbar-box">
              <Searchbar onSearch={handleSearch} searchType="documents" />
            </div> */}
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
                      <td>{item.doc_number}</td>
                      <td>{item.doc_name}</td>
                      <td>{item.subject}</td>
                      <td>{item.department}</td>
                      <td>{item.doc_date?.split("T")[0]}</td>
                      <td>{item.doc_time?.split("T")[1]?.split(".")[0]}</td>
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
