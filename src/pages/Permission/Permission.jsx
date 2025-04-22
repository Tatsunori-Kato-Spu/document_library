import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Permission.css";
import Header from "../../Layout/Header/Header";
import Swal from "sweetalert2";
import axios from "axios";

function Permission({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    id_card: "",
    department: "",
    position: "",
    email: "",
    contact: "",
    role: "worker",
  });
  const [errors, setErrors] = useState({
    username: "",
    id_card: "",
    department: "",
    email: "",
    contact: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/users?t=${Date.now()}`
      ); // กัน cache
      const data = res.data;
      setUsers(data);
      setFilteredData(data); // รีเซ็ตข้อมูลสด
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/users");
      const users = res.data;
  
      // ดึง department และ filter ไม่ให้ซ้ำ
      const uniqueDepartments = [...new Set(
        users
          .map(u => u.department)
          .filter(dep => dep) // กรอง null/undefined/empty string ออก
      )];
  
      setDepartments(uniqueDepartments);
    } catch (err) {
      console.error("Error fetching departments from users:", err);
    }
  };
  
  

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-wrapper")) setDropdownOpenId(null);
      if (!e.target.closest(".dept-dropdown-wrapper"))
        setDeptDropdownOpen(false);
      if (!e.target.closest(".role-dropdown-wrapper"))
        setRoleDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "username" || name === "password") {
      v = v.replace(/[^a-zA-Z0-9]/g, "");
    }
    if (name === "username" || name === "email") {
      v = v.trim().toLowerCase();
    }
    if (name === "contact") {
      const digits = v.replace(/\D/g, "").slice(0, 10);
      v =
        digits.length >= 3
          ? `${digits.slice(0, 3)}-${digits.slice(3)}`
          : digits;
    }
    if (name === "id_card") {
      v = v.replace(/\D/g, "").slice(0, 6);
    }

    setNewUser((prev) => ({ ...prev, [name]: v }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    const dupMap = {
      username: "Username นี้ถูกใช้ไปแล้ว",
      id_card: "รหัสประจำตัวนี้ถูกใช้ไปแล้ว",
      email: "E-mail นี้ถูกใช้ไปแล้ว",
      contact: "เบอร์ติดต่อถูกใช้ไปแล้ว",
    };
    if (["username", "id_card", "email"].includes(name) && v) {
      if (
        users.some(
          (u) => String(u[name] || "").toLowerCase() === v.toLowerCase()
        )
      ) {
        setErrors((prev) => ({ ...prev, [name]: dupMap[name] }));
      }
    }
    if (name === "contact" && v) {
      const d = v.replace(/\D/g, "");
      if (users.some((u) => (u.contact || "").replace(/\D/g, "") === d)) {
        setErrors((prev) => ({ ...prev, contact: dupMap.contact }));
      }
    }
  };

  const handleBlur = (e) => {
    if (name === "department") {
      const dep = value.trim();
      if (!dep) {
        setErrors((prev) => ({ ...prev, department: "กรุณาระบุหน่วยงาน" }));
      } else {
        // ✅ เช็กว่ามีหน่วยงานนี้แล้วหรือยัง ถ้าไม่มีให้เพิ่ม
        if (!departments.includes(dep)) {
          setDepartments((prev) => [...prev, dep]);
        }
      }
    }

    const { name, value } = e.target;
    if (name === "contact") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        setErrors((prev) => ({
          ...prev,
          contact: "เบอร์ต้องมี 10 ตัว เช่น 085-2763546",
        }));
      }
    }
    if (name === "id_card" && value.replace(/\D/g, "").length !== 6) {
      setErrors((prev) => ({
        ...prev,
        id_card: "กรุณากรอกรหัสประจำตัว 6 หลัก",
      }));
    }
    if (name === "email" && !value.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "E-mail ต้องมี @" }));
    }
    if (name === "department" && !value.trim()) {
      setErrors((prev) => ({ ...prev, department: "กรุณาระบุหน่วยงาน" }));
    }
  };

  const selectDept = (dept) => {
    setNewUser((prev) => ({ ...prev, department: dept }));
    setErrors((prev) => ({ ...prev, department: "" }));
    setDeptDropdownOpen(false);
  };

  const selectRole = (role) => {
    setNewUser((prev) => ({ ...prev, role }));
    setRoleDropdownOpen(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((x) => x)) {
      Swal.fire({ icon: "warning", title: "กรุณาแก้ไขข้อผิดพลาดก่อนบันทึก" });
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/users", newUser);
  
      // ✅ ถ้าเพิ่มสำเร็จ: เพิ่มหน่วยงานใหม่เข้า departments ถ้ายังไม่มี
      if (newUser.department && !departments.includes(newUser.department)) {
        setDepartments((prev) => [...prev, newUser.department]);
      }
  
      await fetchUsers();
      setShowAddForm(false);
      Swal.fire("สร้างผู้ใช้สำเร็จ", "", "success");
      setNewUser({
        username: "",
        password: "",
        name: "",
        id_card: "",
        department: "",
        position: "",
        email: "",
        contact: "",
        role: "worker",
      });
      setErrors({
        username: "",
        id_card: "",
        department: "",
        email: "",
        contact: "",
      });
    } catch {
      Swal.fire("สร้างผู้ใช้ล้มเหลว", "", "error");
    }
  };
  

  const handleRoleChangeConfirm = async (index, newRole) => {
    const userId = users[index].id;
    setDropdownOpenId(null);
    const res = await Swal.fire({
      title: "เปลี่ยนระดับสิทธิ?",
      showCancelButton: true,
      confirmButtonText: "ใช่",
    });
    if (res.isConfirmed) {
      await axios.put(`http://localhost:3001/api/users/${userId}/role`, {
        role: newRole,
      });
      await fetchUsers();
      Swal.fire("บันทึกสำเร็จ", "", "success");
    }
  };

  const toggleDropdown = (id) =>
    setDropdownOpenId((prev) => (prev === id ? null : id));

  const handleCancelAdd = async () => {
    const result = await Swal.fire({
      title: "คุณต้องการยกเลิกการเพิ่มผู้ใช้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ยกเลิก",
      cancelButtonText: "ไม่",
    });
    if (result.isConfirmed) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="background">
      <Header user={user} onLogout={onLogout} />
      <div className="searchbar">
        {!showAddForm && (
          <button
            className="add-user-button"
            onClick={() => setShowAddForm(true)}
          >
            เพิ่มผู้ใช้ใหม่
          </button>
        )}
      </div>

      {!showAddForm ? (
        <div className="table-wrapper-permission">
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
              {filteredData.map((u, i) => (
                <tr key={i}>
                  <td>
                    <img
                      src="/document_library/profile1.png"
                      alt="profile"
                      className="profilePic"
                    />
                  </td>
                  <td>{u.name}</td>
                  <td>{u.id_card}</td>
                  <td>{u.department}</td>
                  <td>{u.position}</td>
                  <td>{u.email}</td>
                  <td>{u.contact}</td>
                  <td>
                    <div className="dropdown-wrapper">
                      <button
                        className="dropdown-button"
                        onClick={() => toggleDropdown(i)}
                      >
                        {u.role}
                      </button>
                      {dropdownOpenId === i && (
                        <div className="dropdown-menu-permission">
                          {["admin", "worker", "guest"].map((r) => (
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
        </div>
      ) : (
        <form className="add-user-form" onSubmit={handleAddSubmit}>
          <h2 className="form-title">เพิ่มผู้ใช้ใหม่</h2>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.username ? "input-error" : ""}
            />
            {errors.username && (
              <div className="error-text">{errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={newUser.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password-button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label>ชื่อ-สกุล</label>
            <input
              type="text"
              name="name"
              value={newUser.name}
              onChange={handleChange}
            />
          </div>

          {/* ID Card */}
          <div className="form-group">
            <label>รหัสประจำตัว</label>
            <input
              type="text"
              name="id_card"
              value={newUser.id_card}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.id_card ? "input-error" : ""}
            />
            {errors.id_card && (
              <div className="error-text">{errors.id_card}</div>
            )}
          </div>

          {/* Department */}
          <div className="form-group-department">
            <label>หน่วยงาน</label>
            <div className="dept-dropdown-wrapper">
              <input
                type="text"
                name="department"
                value={newUser.department}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.department ? "input-error" : ""}
              />
              <button
                type="button"
                className="dept-dropdown-toggle"
                onClick={() => setDeptDropdownOpen((open) => !open)}
              >
                ▼
              </button>
              {deptDropdownOpen && (
                <ul className="dept-dropdown-menu">
                  {departments.map((d) => (
                    <li
                      key={d}
                      className="dept-dropdown-item"
                      onClick={() => selectDept(d)}
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {errors.department && (
              <div className="error-text">{errors.department}</div>
            )}
          </div>

          {/* Position */}
          <div className="form-group">
            <label>ตำแหน่ง</label>
            <input
              type="text"
              name="position"
              value={newUser.position}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          {/* Contact */}
          <div className="form-group">
            <label>ติดต่อ</label>
            <input
              type="text"
              name="contact"
              value={newUser.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.contact ? "input-error" : ""}
            />
            {errors.contact && (
              <div className="error-text">{errors.contact}</div>
            )}
          </div>

          {/* Role */}
          <div className="form-group full-width">
            <label>ระดับสิทธิ</label>
            <div className="role-dropdown-wrapper">
              <input type="text" name="role" value={newUser.role} readOnly />
              <button
                type="button"
                className="role-dropdown-toggle"
                onClick={() => setRoleDropdownOpen((open) => !open)}
              >
                ▼
              </button>
              {roleDropdownOpen && (
                <ul className="role-dropdown-menu">
                  {["admin", "worker", "guest"].map((r) => (
                    <li
                      key={r}
                      className="role-dropdown-item"
                      onClick={() => selectRole(r)}
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancelAdd}
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary">
              บันทึก
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Permission;
