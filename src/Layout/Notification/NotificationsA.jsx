// NotificationsA.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./NotificationsA.css"; // ใช้ไฟล์ CSS ที่เกี่ยวข้อง

const NotificationsA = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // ตัวอย่างฟังก์ชันสำหรับการแสดงผลการแจ้งเตือน
  const fetchNotifications = () => {
    // ตัวอย่างข้อมูลแจ้งเตือน
    const newNotifications = [
      {
        id: 1,
        message: "เอกสารใหม่จากฝ่ายการตลาด",
        department: "ฝ่ายการตลาด",
        timestamp: new Date().toLocaleString(),
      },
      {
        id: 2,
        message: "เอกสารใหม่จากฝ่ายการเงิน",
        department: "ฝ่ายการเงิน",
        timestamp: new Date().toLocaleString(),
      },
    ];
    setNotifications(newNotifications);
  };

  // เมื่อกดปุ่มจะไปที่หน้า AddDoc
  const handleAddDocClick = () => {
    navigate("/adddoc"); // เปลี่ยนเส้นทางไปที่ /adddoc
  };

  useEffect(() => {
    fetchNotifications(); // ดึงข้อมูลแจ้งเตือนเมื่อคอมโพเนนต์ถูกโหลด
  }, []);

  return (
    <div className="notification-container">
      <h3>การแจ้งเตือน</h3>
      <ul className="notification-list">
        {notifications.map((notif) => (
          <li key={notif.id} className="notification-item">
            <FontAwesomeIcon icon={faBell} style={{ color: "orange" }} />
            <span className="notification-message">
              {notif.message} - <strong>{notif.department}</strong>
            </span>
            <span className="timestamp">{notif.timestamp}</span>
          </li>
        ))}
      </ul>
      <Button onClick={handleAddDocClick}>อัพโหลดเอกสาร</Button>
    </div>
  );
};

export default NotificationsA;
