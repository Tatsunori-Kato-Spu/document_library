import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./NotificationsA.css";

const NotificationsA = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // ฟังก์ชันในการดึงข้อมูลจาก API
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/documents"); // URL ของ API
        // เรียงข้อมูลจากล่าสุดไปเก่า
        const sortedNotifications = response.data.reverse();  
        setNotifications(sortedNotifications);  // กำหนดค่าให้กับ state notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // เรียกใช้งานฟังก์ชันนี้เมื่อ component mount
  }, []); // ใช้ [] เป็น dependency เพื่อให้ทำงานครั้งเดียวตอน component mount

  return (
    <div className="notification-container">
      <h2>การแจ้งเตือน</h2>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>ยังไม่มีการแจ้งเตือน</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="custom-notification-item">
              <h4>{notification.department}</h4>
              <p>ชื่อเอกสาร: {notification.doc_name}</p>
              <p>เรื่อง: {notification.subject}</p>
              <p>วันที่: {notification.doc_date} เวลา: {notification.doc_time}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsA;
