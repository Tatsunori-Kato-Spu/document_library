import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homepage.css'; 
import Headerprofile from '../../Layout/Header/Headerprofile'; 

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    
    document.body.classList.add('homepage-background');
    
    
    return () => {
      document.body.classList.remove('homepage-background');
    };
  }, []);

  return (
    <div>
      <Headerprofile /> {/* เพิ่ม Headerprofile ไว้ด้านบน */}
      <div className="homepage-content">
        <h1>กรรมเชื้อเพลิงธรรมชาติ</h1>
        <p>
          ส่วนของการแสดงเอกสารที่เกี่ยวข้องขององค์กรสำหรับหาข้อมูลรายละเอียดของกรมเชื้อเพลิงธรรมชาติ กระทรวงพลังงาน
        </p>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default Homepage;
