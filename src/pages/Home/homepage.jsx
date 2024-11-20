// pages/Home/homepage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';  // นำเข้า CSS สำหรับหน้า Homepage

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    // เพิ่มคลาสเพื่อเปลี่ยนพื้นหลังเฉพาะในหน้า Homepage
    document.body.classList.add('homepage-background');
    
    // คืนค่าพื้นหลังเดิมเมื่อออกจากหน้า Homepage
    return () => {
      document.body.classList.remove('homepage-background');
    };
  }, []);

  return (
    <div className="homepage-content">
      <h1>กรรมเชื้อเพลิงธรรมชาติ</h1>
      <p>ส่วนของการแสดงเอกสารที่เกี่ยวข้องขององค์กรสำหรับหาข้อมูลรายละเอียดของกรมเชื้อเพลิงธรรมชาติ กระทรวงพลังงาน</p>
      <button onClick={() => navigate('/login')} className="btn btn-primary">
        Go to Login
      </button>
    </div>
  );
}

export default Homepage;
