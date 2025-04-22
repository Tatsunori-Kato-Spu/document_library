import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./EditDoc.css";

const EditDoc = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doc } = location.state;

  const [docName, setDocName] = useState(doc.doc_name || "");
  const [subject, setSubject] = useState(doc.subject || "");
  const [department, setDepartment] = useState(doc.department || "");
  const [date, setDate] = useState(doc.doc_date?.split("T")[0] || "");
  const [role, setRole] = useState("");
  const [pdfFile, setPdfFile] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

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

        if (doc.role) {
          setRole(doc.role);
        }
      } catch (err) {
        console.error("Error fetching roles/departments:", err);
      }
    };

    fetchRolesAndDepartments();
  }, [doc.role]);

  const handleSave = async () => {
    if (!docName || !subject || !department || !date || !role) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("doc_name", docName);
      formData.append("subject", subject);
      formData.append("department", department);
      formData.append("role", role);
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      const response = await fetch(`http://localhost:3001/api/documents/${doc.doc_number}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("บันทึกสำเร็จ");
        navigate("/document_library/pagedoc");
      } else {
        alert("บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Error updating document:", err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="EditDoc-container">
      <h2>แก้ไขเอกสาร</h2>
      <div className="form-grid">
        <div>
          <label className="edit-label">ชื่อเอกสาร</label>
          <input
            className="edit-input"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
          />
        </div>

        <div>
          <label className="edit-label">เรื่อง</label>
          <input
            className="edit-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="edit-label">หน่วยงาน</label>
          <select
            className="edit-select"
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

        <div>
          <label className="edit-label">แนบ PDF ใหม่ (ถ้ามี)</label>
          <input
            type="file"
            accept="application/pdf"
            className="edit-file"
            onChange={(e) => setPdfFile(e.target.files[0])}
          />
        </div>

        <div>
          <label className="edit-label">บทบาทผู้เข้าถึงเอกสาร</label>
          <select
            className="edit-select"
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
      </div>
      {doc.pdf_file && (
        <div className="pdf-link">
          <label className="edit-label">ไฟล์ PDF เดิม:</label>
          <div className="mb-2">
            <a
              href={`http://localhost:3001/${doc.pdf_file}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 เปิดไฟล์ PDF เดิม
            </a>
          </div>
          <iframe
            className="pdf-preview"
            src={`http://localhost:3001/${doc.pdf_file}`}
            title="PDF Preview"
          />
        </div>
      )}

      <div className="button-container">
        <span>

          <button
            className="btn-cancel"
            onClick={() => navigate("/document_library/pagedoc")}
            style={{ marginLeft: "10px" }}
          >
            ยกเลิก
          </button>
        </span>
        <span>

          <button className="btn-save" onClick={handleSave}>
            บันทึก
          </button>
        </span>
      </div>
    </div>
  );
};

export default EditDoc;
