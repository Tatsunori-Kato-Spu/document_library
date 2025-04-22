import React, { useState, useEffect } from "react";
import "./history.css";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";

function History() {
  const [user, setUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (username && role) {
      setUser({ username, role });

      fetch(`http://localhost:3001/api/documents?username=${username}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setFilteredData(data);
          } else {
            console.error("Unexpected response format:", data);
            setFilteredData([]); // fallback
          }
        })
        .catch((error) => console.error("Error fetching documents:", error));
    }
  }, []);

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
            <button
              className="button-style"
              onClick={() => navigate("/document_library/profile")}
            >
              ข้อมูลพื้นฐาน
            </button>

            {/* ปุ่มกำหนดสิทธิ์เฉพาะ admin */}
            {user && user.role === "admin" && (
              <div>
                <button onClick={() => navigate("/document_library/history")} className='button-box-1'>ประวัติ</button>
                <button
                  onClick={() => navigate("/document_library/permission")}
                  className="button-box-1"
                >
                  กำหนดสิทธิ
                </button>
                <button onClick={() => navigate("/document_library/editmember")} className='button-box-1'>จัดการสมาชิก</button>
              </div>
            )}
          </div>

          <div className="profile-content-2">
            <div className="table-wrapper2">
              <table className="table-contenner">
                <thead className="table-th">
                  <tr>
                    <th>หมายเลข</th>
                    <th>ชื่อเอกสาร</th>
                    <th>เรื่อง</th>
                    <th>หน่วยงาน</th>
                    <th>วันที่</th>
                    {/* <th>เวลา</th> */}
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(filteredData) ? filteredData : []).map(
                    (item, index) => (
                      <tr key={index}>
                        <td>{item.doc_number}</td>
                        <td>{item.doc_name}</td>
                        <td>{item.subject}</td>
                        <td>{item.department}</td>
                        <td>{item.doc_date?.split("T")[0]}</td>
                        {/* <td>{item.doc_date?.split("T")[1]?.split(".")[0]}</td> */}
                      </tr>
                    )
                  )}
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
