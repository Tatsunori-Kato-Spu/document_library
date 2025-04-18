import React, { useEffect, useState } from 'react';
import './Permission.css';
import Header from '../../Layout/Header/Header';
import Searchbar from '../Searchbar/Searchbar';
import Swal from "sweetalert2";
import axios from 'axios';

function Permission() {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearchbar, setShowSearchbar] = useState(false); // ✅ default เป็น false (ซ่อนไว้ตั้งแต่เริ่ม)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    id_card: "",
    department: "",
    position: "",
    email: "",
    contact: "",
    role: "worker"
  });
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);

  const fetchUsers = () => {
    axios.get('http://localhost:3001/api/users')
      .then(res => {
        setUsers(res.data);
        setFilteredData(res.data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-wrapper')) {
        setDropdownOpenIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRoleChangeConfirm = (index, newRole) => {
    const userId = users[index].id;
    setDropdownOpenIndex(null);
    Swal.fire({
      title: "คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      denyButtonText: `ยกเลิก`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:3001/api/users/${userId}/role`, { role: newRole })
          .then(() => {
            fetchUsers();
            Swal.fire("บันทึกสำเร็จ!", "", "success");
          })
          .catch(() => Swal.fire("เกิดข้อผิดพลาด", "", "error"));
      }
    });
  };

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/api/users', newUser)
      .then(() => {
        fetchUsers();
        setShowAddForm(false);
        Swal.fire("สร้างผู้ใช้สำเร็จ", "", "success");
        setNewUser({
          username: "", password: "", name: "", id_card: "",
          department: "", position: "", email: "", contact: "", role: "worker"
        });
      })
      .catch(() => Swal.fire("สร้างผู้ใช้ล้มเหลว", "", "error"));
  };

  const toggleDropdown = (index) => {
    setDropdownOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const handleCancelAdd = () => {
    Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "ข้อมูลที่กรอกจะไม่ถูกบันทึก",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ยกเลิก',
      cancelButtonText: 'ไม่',
    }).then((result) => {
      if (result.isConfirmed) {
        setShowAddForm(false);
        setNewUser({
          username: "", password: "", name: "", id_card: "",
          department: "", position: "", email: "", contact: "", role: "worker"
        });
      }
    });
  };

  return (
    <div className="background">
      <Header />
      <div className="searchbar">
        {/* ✅ ตอนเข้าใหม่ ซ่อนไว้, ถ้าอยากโชว์ต้อง setShowSearchbar(true) เอง */}
        {showSearchbar && (
          <Searchbar onSearch={(f) => setFilteredData(f)} searchType="users" />
        )}

        {!showAddForm && (
          <button className="add-user-button" onClick={() => setShowAddForm(true)}>เพิ่มผู้ใช้ใหม่</button>
        )}
      </div>

      <div className="table-wrapper-permission">
        {!showAddForm ? (
          <table className="table-container">
            <thead className="table-th">
              <tr>
                <th className="topic-textBox-1">รูป</th>
                <th className="topic-textBox-2">ชื่อ</th>
                <th className="topic-textBox-3">รหัสประจำตัว</th>
                <th className="topic-textBox-4">หน่วยงาน</th>
                <th className="topic-textBox-5">ตำแหน่ง</th>
                <th className="topic-textBox-6">E-mail</th>
                <th className="topic-textBox-7">ติดต่อ</th>
                <th className="topic-textBox-8">ระดับสิทธิ</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, i) => (
                <tr key={i}>
                  <td className="topic-textBox-1">
                    <img src='/document_library/profile1.png' alt="profile" className="profilePic" />
                  </td>
                  <td className="topic-textBox-2">{user.name}</td>
                  <td className="topic-textBox-3">{user.id_card}</td>
                  <td className="topic-textBox-4">{user.department}</td>
                  <td className="topic-textBox-5">{user.position}</td>
                  <td className="topic-textBox-6">{user.email}</td>
                  <td className="topic-textBox-7">{user.contact}</td>
                  <td className="topic-textBox-8">
                    <div className="dropdown-wrapper">
                      <button className="dropdown-button" onClick={() => toggleDropdown(i)}>
                        {user.role}
                      </button>
                      {dropdownOpenIndex === i && (
                        <div className="dropdown-menu-permission">
                          {["admin", "worker", "guest"].map(r => (
                            <div
                              key={r}
                              className="dropdown-item"
                              onClick={() => handleRoleChangeConfirm(i, r)}
                            >
                              {r}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <form className="add-user-form" onSubmit={handleAddSubmit}>
            <h2 className="form-title">เพิ่มผู้ใช้ใหม่</h2>
            {[
              { label: "Username", name: "username", type: "text" },
              { label: "Password", name: "password", type: "password" },
              { label: "ชื่อ-สกุล", name: "name", type: "text" },
              { label: "รหัสประจำตัว", name: "id_card", type: "text" },
              { label: "หน่วยงาน", name: "department", type: "text" },
              { label: "ตำแหน่ง", name: "position", type: "text" },
              { label: "E-mail", name: "email", type: "email" },
              { label: "ติดต่อ", name: "contact", type: "text" },
            ].map(f => (
              <div key={f.name} className="form-group">
                <label>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={newUser[f.name]}
                  onChange={handleNewChange}
                />
              </div>
            ))}
            <div className="form-group">
              <label>ระดับสิทธิ</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewChange}
              >
                <option value="admin">admin</option>
                <option value="worker">worker</option>
                <option value="guest">guest</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="button" className="btn-secondary" onClick={handleCancelAdd}>ยกเลิก</button>
              <button type="submit" className="btn-primary">บันทึก</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Permission;
