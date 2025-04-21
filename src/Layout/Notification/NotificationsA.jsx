import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './NotificationsA.css';

const NotificationsA = () => {
  const [notifications, setNotifications] = useState([]);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/documents');
      // เรียงข้อมูลจากล่าสุดไปเก่า
      const sortedNotifications = response.data
        .sort((a, b) => new Date(b.doc_date + ' ' + b.doc_time) - new Date(a.doc_date + ' ' + a.doc_time))
        .slice(0, 5); // ล่าสุด 5 รายการ

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, []);

  useEffect(() => {
    // เรียกครั้งแรกตอน component mount
    fetchNotifications();

    // ฟัง event เมื่อมีการอัพโหลดเอกสาร
    const onDocumentUploaded = () => {
      fetchNotifications();
    };
    window.addEventListener('documentUploaded', onDocumentUploaded);

    // ล้าง listener เมื่อ unmount
    return () => {
      window.removeEventListener('documentUploaded', onDocumentUploaded);
    };
  }, [fetchNotifications]);

  return (
    <div className="notification-container">
      <h2>การแจ้งเตือน</h2>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>ยังไม่มีการแจ้งเตือน</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="custom-notification-item">
              <h4>{notification.doc_name}</h4>
              {/* <p>ชื่อเอกสาร: {notification["doc_name"]}</p> */}
<p>เรื่อง: {notification["subject"]}</p>
<p>วันที่: {notification.doc_date ? notification.doc_date.split("T")[0] : "-"} 

</p>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsA;
