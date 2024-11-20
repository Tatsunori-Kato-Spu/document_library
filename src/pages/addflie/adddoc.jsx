import React, { useState } from 'react';
import { docdata } from '../../data/docdata'; // นำเข้าข้อมูลเอกสารจากไฟล์ docdata
import './adddoc.css';

const AddDoc = () => {
  const [formData, setFormData] = useState({
    หมายเลข: '',
    ชื่อเอกสาร: '',
    เรื่อง: '',
    หน่วยงาน: '',
    วันที่: '',
    เวลา: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ตรวจสอบข้อมูล
    if (!formData.หมายเลข || !formData.ชื่อเอกสาร || !formData.เรื่อง || !formData.หน่วยงาน || !formData.วันที่ || !formData.เวลา) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // เพิ่มข้อมูลใหม่ไปยัง docdata
    const newDocData = {
      ...formData,
      roles: ['admin'], // คุณสามารถปรับเปลี่ยน roles ได้ตามต้องการ
    };
    
    docdata.push(newDocData);

    // แจ้งเตือนสำเร็จ
    setMessage('เพิ่มเอกสารใหม่สำเร็จ');

    // เคลียร์ฟอร์ม
    setFormData({
      หมายเลข: '',
      ชื่อเอกสาร: '',
      เรื่อง: '',
      หน่วยงาน: '',
      วันที่: '',
      เวลา: '',
    });
  };

  return (
    <div className="adddoc-container">
      <h2>เพิ่มเอกสารใหม่</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="หมายเลข">หมายเลข:</label>
          <input
            type="text"
            id="หมายเลข"
            name="หมายเลข"
            value={formData.หมายเลข}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="ชื่อเอกสาร">ชื่อเอกสาร:</label>
          <input
            type="text"
            id="ชื่อเอกสาร"
            name="ชื่อเอกสาร"
            value={formData.ชื่อเอกสาร}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="เรื่อง">เรื่อง:</label>
          <input
            type="text"
            id="เรื่อง"
            name="เรื่อง"
            value={formData.เรื่อง}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="หน่วยงาน">หน่วยงาน:</label>
          <input
            type="text"
            id="หน่วยงาน"
            name="หน่วยงาน"
            value={formData.หน่วยงาน}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="วันที่">วันที่:</label>
          <input
            type="date"
            id="วันที่"
            name="วันที่"
            value={formData.วันที่}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="เวลา">เวลา:</label>
          <input
            type="time"
            id="เวลา"
            name="เวลา"
            value={formData.เวลา}
            onChange={handleChange}
          />
        </div>
        <button type="submit">เพิ่มเอกสาร</button>
      </form>
    </div>
  );
};

export default AddDoc;
