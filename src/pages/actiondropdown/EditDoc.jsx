import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const EditDoc = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doc } = location.state;

  // States สำหรับข้อมูล
  const [docName, setDocName] = useState(doc.doc_name || "");
  const [subject, setSubject] = useState(doc.subject || "");
  const [department, setDepartment] = useState(doc.department || "");
  const [date, setDate] = useState(doc.doc_date?.split("T")[0] || "");
  const [role, setRole] = useState(""); // default ยังไม่รู้ role

  // States สำหรับ dropdown
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  // โหลด roles และ departments
  useEffect(() => {
    const fetchRolesAndDepartments = async () => {
      try {
        const [rolesRes, deptRes] = await Promise.all([
          fetch("http://localhost:3001/api/roles"),
          fetch("http://localhost:3001/api/departments"),
        ]);

        const rolesData = await rolesRes.json();
        const deptData = await deptRes.json();

        setRoles(rolesData);
        setDepartments(deptData.map((d) => d.department));

        // ถ้ามี role ใน doc → set ค่าไว้เลย
        if (doc.role) {
          setRole(doc.role);
        }
      } catch (err) {
        console.error("Error fetching roles/departments:", err);
      }
    };

    fetchRolesAndDepartments();
  }, [doc.role]);

  // บันทึกข้อมูล
  const handleSave = async () => {
    if (!docName || !subject || !department || !date || !role) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/documents/${doc.doc_number}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doc_name: docName,
          subject,
          department,
          date,
          role,
        }),
      });

      if (response.ok) {
        alert("บันทึกสำเร็จ");
        navigate("/pagedoc");
      } else {
        alert("บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Error updating document:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">แก้ไขเอกสาร</h2>
      <div className="row g-3 align-items-end">
        <div className="col">
          <label>ชื่อเอกสาร</label>
          <input
            className="form-control"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
        </div>

        <div className="col">
          <label>เรื่อง</label>
          <input
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="col">
          <label>หน่วยงาน</label>
          <select
            className="form-select"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">-- เลือกหน่วยงาน --</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="col">
          <label>วันที่</label>
          <input
            className="form-control"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="col">
          <label>บทบาทผู้เข้าถึงเอกสาร</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- เลือกบทบาท --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <button className="btn btn-primary" onClick={handleSave}>
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoc;
