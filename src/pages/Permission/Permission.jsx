import { userdata } from '../../data/userdata';  // นำเข้าข้อมูลจาก usersdata.js
import React, { useState } from 'react';
import Dropdown from "react-bootstrap/Dropdown";

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
            {userdata.map((user, index) => (
              <tr key={index}>
                <td>
                 
                </td>
                <td>{user.ชื่อ}</td>
                <td>{user.รหัสประจำตัว}</td>
                <td>{user.หน่วยงาน}</td>
                <td>{user.ตำแหน่ง}</td>
                <td>{user.Email}</td>
                <td>{user.ติดต่อ}</td>
                <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                          {user.role}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Admin</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">worker</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                  
                  
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Permission;