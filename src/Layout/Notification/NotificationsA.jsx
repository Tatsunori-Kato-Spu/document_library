import React, { useState, useEffect } from 'react';
import "./NotificationsA.css";
import { docdata } from "../../data/docdata";

const NotificationsA = () => {
  const [notifications, setNotifications] = useState(docdata); 

  return (
    <div className="notification-container">
      <h2>การแจ้งเตือน</h2>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>ยังไม่มีการแจ้งเตือน</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification['หมายเลข']} className="custom-notification-item">
              <h4>{notification['หน่วยงาน']}</h4>
              <p>ชื่อเอกสาร: {notification['ชื่อเอกสาร']}</p>
              <p>เรื่อง: {notification['เรื่อง']}</p>
              <p>วันที่: {notification['วันที่']} เวลา: {notification['เวลา']}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsA;
