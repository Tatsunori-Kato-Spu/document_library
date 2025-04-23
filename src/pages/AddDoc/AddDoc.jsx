import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Layout/Header/Header";
import Swal from "sweetalert2";
import "./AddDoc.css";

const generateDocNumber = async () => {
  try {
    const res = await fetch(
      "http://localhost:3001/api/documents/lastDocNumber"
    );
    const data = await res.json();

    if (data && data.lastNumber !== undefined) {
      const nextNumber = parseInt(data.lastNumber, 10) + 1;
      return String(nextNumber);
    } else {
      return "1";
    }
  } catch (err) {
    console.error("ไม่สามารถดึงเลขเอกสารล่าสุดได้:", err);
    return "1";
  }
};

function AddDoc() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    docNumber: "",
    docName: "",
    budgetYear: "",
    date: "",
    department: "",
    roles: [],
    subject: "",
  });

  const [currentDate, setCurrentDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchDocNumber = async () => {
      const docNumber = await generateDocNumber();
      setFormData((prev) => ({ ...prev, docNumber }));
    };
    fetchDocNumber();

    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, roles: [...prev.roles, value] };
      } else {
        return { ...prev, roles: prev.roles.filter((role) => role !== value) };
      }
    });
  };

  const handleCancel = () => {
    navigate("/document_library/pagedoc");
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      Swal.fire("กรุณาเลือกไฟล์ PDF ก่อน!", "", "warning");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("docNumber", formData.docNumber);
    formDataToSend.append("docName", formData.docName);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("date", formData.date);
    formDataToSend.append("roles", JSON.stringify(formData.roles));
    formDataToSend.append("file", selectedFile);

    try {
      const res = await fetch("http://localhost:3001/api/documents/upload", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      console.log("Response from server:", data);

      if (data.success) {
        Swal.fire("สำเร็จ!", "เอกสารถูกบันทึกเรียบร้อยแล้ว", "success").then(
          () => {
            navigate("/document_library/pagedoc");
          }
        );
      } else {
        Swal.fire(
          "ผิดพลาด",
          data.message || "ไม่สามารถบันทึกเอกสารได้",
          "error"
        );
      }
    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire("ผิดพลาด", "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์", "error");
    }
  };

  return (
    <div className="add-doc-container">
      <Header />
      <div className="add-doc">
        <div className="form-container">
          {/* ฟอร์มเลขเอกสาร + ชื่อเอกสาร */}
          <div className="colum-1">
            <div className="form-group">
              <label
                htmlFor="docNumber"
                className="doc-Number-label"
                style={{ color: "orange" }}
              >
                เลขเอกสาร
              </label>
              <input
                id="docNumber"
                type="text"
                value={formData.docNumber}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="docName"
                className="doc-Text-label"
                style={{ color: "orange" }}
              >
                ชื่อเอกสาร
              </label>
              <input
                id="docName"
                type="text"
                placeholder="กรอกชื่อเอกสาร"
                value={formData.docName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ฟอร์มหัวข้อ */}
          <div className="form-group2">
            <label
              htmlFor="subject"
              className="doc-Topic-label"
              style={{ color: "orange" }}
            >
              หัวข้อเรื่อง
            </label>
            <input
              id="subject"
              type="text"
              placeholder="กรอกหัวข้อเรื่อง"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          {/* ฟอร์มหน่วยงาน, วันที่ */}
          <div className="colum-2">
            <div className="form-group">
              <label
                htmlFor="department"
                className="doc-department-label"
                style={{ color: "orange" }}
              >
                หน่วยงาน
              </label>
              <input
                list="departments"
                id="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                placeholder="เลือกหรือพิมพ์หน่วยงาน"
              />
              <datalist id="departments">
                {/* ใส่ตัวเลือกหน่วยงานตามต้องการ */}
              </datalist>
            </div>

            <div className="form-group">
              <label
                htmlFor="date"
                className="doc-data-label"
                style={{ color: "orange" }}
              >
                วันที่รับ
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={currentDate}
              />
            </div>

            {/* ฟอร์มเลือกไฟล์ PDF */}
            <div className="form-group2">
              <label htmlFor="pdfFile" style={{ color: "orange" }}>
                แนบไฟล์ PDF
              </label>
              <input
                className="uploadPdf"
                id="pdfFile"
                type="file"
                accept="application/pdf"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            {/* ฟอร์มเลือกระดับ (Role) */}
            <div className="form-group2">
              <label className="doc-role" style={{ color: "orange" }}>
                ระดับ
              </label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    value="admin"
                    checked={formData.roles.includes("admin")}
                    onChange={handleCheckboxChange}
                  />
                  Admin
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="worker"
                    checked={formData.roles.includes("worker")}
                    onChange={handleCheckboxChange}
                  />
                  Worker
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="guest"
                    checked={formData.roles.includes("guest")}
                    onChange={handleCheckboxChange}
                  />
                  Guest
                </label>
              </div>
            </div>
          </div>

          {/* Preview PDF ถ้ามีไฟล์ */}
          {selectedFile && (
            <div className="pdf-preview-container">
              <h3 style={{ color: "orange", marginTop: "20px" }}>
                ดูตัวอย่างไฟล์ PDF
              </h3>
              <iframe
                src={URL.createObjectURL(selectedFile)}
                width="100%"
                height="500px"
                title="PDF Preview"
                style={{ border: "1px solid #ccc", borderRadius: "10px" }}
              />
            </div>
          )}

          {/* ปุ่มกด */}
          <div className="button-group">
            <button onClick={handleCancel} className="cancel-button">
              ยกเลิก
            </button>
            <button className="submit-button" onClick={handleSubmit}>
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDoc;
