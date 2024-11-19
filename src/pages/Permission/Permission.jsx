import { usersdata } from '../../data/user';  // นำเข้าข้อมูลจาก usersdata.js
import React, { useState } from 'react';

function Permission() {

  return (
    <div className="background">
      <div className="table-wrapper">
        <table className="table-container">
          <thead className="table-th">
            <tr>
              <th>รูป</th>
              <th>ชื่อ</th>
              <th>รหัสประจำตัว</th>
              <th>หน่วยงาน</th>
              <th>ตำแหน่ง</th>
              <th>E-mail</th>
              <th>ติดต่อ</th>
              <th>ระดับสิทธิ</th>
            </tr>
          </thead>
          <tbody>
            {usersdata.map((user, index) => (
              <tr key={index}>
                <td>
                 
                </td>
                <td>{user.ชื่อ}</td>
                <td>{user.รหัสประจำตัว}</td>
                <td>{user.หน่วยงาน}</td>
                <td>{user.ตำแหน่ง}</td>
                <td>{user.Email}</td>
                <td>{user.ติดต่อ}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Permission;