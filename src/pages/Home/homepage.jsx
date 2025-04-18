import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css'; 
import Headerprofile from '../../Layout/Header/Headerprofile'; 
import Develope from '../develope/develope';

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
      <Headerprofile /> 
      <div className="homepage-content">
        <h1>กรรมเชื้อเพลิงธรรมชาติ</h1>
        <p>
          ส่วนของการแสดงเอกสารที่เกี่ยวข้องขององค์กรสำหรับหาข้อมูลรายละเอียดของกรมเชื้อเพลิงธรรมชาติ กระทรวงพลังงาน
        </p>
        <button onClick={() => navigate('/document_library/login')} className="btn btn-primary">
          Go to Login
        </button>
      </div>
      <Develope />
    </div>
  );
}

export default Homepage;
