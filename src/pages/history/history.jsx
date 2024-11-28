import React, { useState, useEffect } from "react";
import "./history.css";
import { userdata } from "../../data/userdata";
import { useNavigate } from "react-router-dom";
import { docdata } from "../../data/docdata";
import Header from "../../Layout/Header/Header";
import Searchbar from "../Searchbar/Searchbar";

function History() {
  const [user, setUser] = useState(null); // เพิ่ม state สำหรับ user
  const [filteredData, setFilteredData] = useState(docdata);
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
      // ดึง token จาก localStorage เมื่อ component โหลด
      const storedToken = localStorage.getItem('token');
      console.log('Retrieved token from localStorage:', storedToken);
      setToken(storedToken); // ตั้งค่า token ใน state

  }, []);



  useEffect(() => {
      // ตรวจสอบว่า token ถูกตั้งค่าแล้ว
      if (token) {
          const currentUser = userdata.find(u => u.token === token);
          if (currentUser) {
              setUser(currentUser); // กำหนดข้อมูลผู้ใช้ใน state
          } else {
              console.log('ไม่พบผู้ใช้สำหรับ token นี้');
          }
      }
  }, [token]); // ใช้ token เป็น dependency เพื่อให้ effect นี้ทำงานเมื่อ token ถูกเปลี่ยนแปลง


  if (!user) {
      return <div>กำลังโหลดข้อมูล...</div>;  // หรือสามารถแสดงหน้าจอโหลด
  }
  const handleSearch = (filtered) => {
    setFilteredData(filtered);
  };


  
  const permissionClick = () => {
    navigate('/permission');
};

const statsClick = () => {
    navigate('/stats');
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
            {user.role === "admin" && (
                            <>
                                <div>
                                    <button onClick={permissionClick} className='button-box-1'>กำหนดสิทธิ</button>
                                </div>

                                <div>
                                    <button onClick={statsClick} className='button-box-1'>สถิติ</button>
                                </div>
                            </>
                        )}
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
