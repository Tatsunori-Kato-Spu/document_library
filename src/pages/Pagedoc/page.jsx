import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons";
import "./page.css";
import Searchbar from "../Searchbar/Searchbar";
import Actiondropdown from "../actiondropdown/actiondropdown";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonUpload from "../AddDoc/buttonupload";
import Header from "../../Layout/Header/Header";
import { useNavigate } from "react-router-dom";

const Pagedoc = ({ user, onLogout }) => {
  const userRole = user?.role;
  const username = user?.username;
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const navigate = useNavigate();

  // ดึงเอกสารจาก backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/documents?username=${username}`);
        const data = await response.json();
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    if (username) fetchDocuments();
  }, [username]);
  const handleSearch = (filteredDocuments) => {
    setFilteredData(filteredDocuments);
  };

  const handleSortByDate = () => {
    const sorted = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.doc_date);
      const dateB = new Date(b.doc_date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredData(sorted);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const handleSortByOrder = () => {
    const sorted = [...filteredData].sort((a, b) => {
      const orderA = parseInt(a.doc_number.replace(/\D/g, "")) || 0;
      const orderB = parseInt(b.doc_number.replace(/\D/g, "")) || 0;
      return sortOrder === "desc" ? orderB - orderA : orderA - orderB;
    });
    setFilteredData(sorted);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };


  // ฟังก์ชันเมื่อคลิกอ่าน
  const handleReadClick = async (docNumber) => {
    try {
      const res = await fetch(`http://localhost:3001/api/documents/${docNumber}/file`);
      if (!res.ok) throw new Error("Network error");
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank"); // เปิดไฟล์ในแท็บใหม่
    } catch (error) {
      console.error("Error opening document:", error);
    }
  };
  


  const handleShowModal = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/documents/${selectedDoc.doc_number}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setFilteredData((prev) =>
          prev.filter((doc) => doc.doc_number !== selectedDoc.doc_number)
        );
      } else {
        console.error("ลบไม่สำเร็จ:", await response.json());
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดตอนลบ:", err);
    }

    setShowModal(false);
    setSelectedDoc(null);
  };

  const handleDownload = async (docNumber) => {
    try {
      const res = await fetch(`http://localhost:3001/api/documents/${docNumber}/file`);
      if (!res.ok) throw new Error("Network error");
  
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };
  
  
  
  
  

  return (
    <div className="page-container">
      <Header user={user} onLogout={onLogout} />

      {/* ตารางแสดงเอกสาร */}
      <div className="table-wrapper">
        <table className="table-contenner">
          <thead className="table-th">
            <tr>
              <th>
                ลำดับ
                <button className="icon-button" onClick={handleSortByOrder}>
                  {sortOrder === "desc" ? "🔽" : "🔼"}
                </button>
              </th>
              <th>หมายเลข</th>
              <th>ชื่อเอกสาร</th>
              <th>เรื่อง</th>
              <th>หน่วยงาน</th>
              <th>
                วันที่
                <button className="icon-button" onClick={handleSortByDate}>
                  {sortOrder === "desc" ? "🔽" : "🔼"}
                </button>
              </th>
              <th>เวลา</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={item.isRead ? "row-read" : "row-unread"}
                  onClick={() => handleReadClick(item.doc_number)}
                >                
                  <td>{index + 1}</td>
                  <td>{item["doc_number"]}</td>
                  <td>{item["doc_name"]}</td>
                  <td>{item["subject"]}</td>
                  <td>{item["department"]}</td>
                  <td>{item.doc_date ? item.doc_date.split("T")[0] : "-"}</td>
                  <td>
                    {item.doc_time
                      ? item.doc_time.split("T")[1]?.split(".")[0]
                      : "-"}
                  </td>

                  {/* Dropdown สำหรับการกระทำ */}
                  <div className="dropdown">
                    <Dropdown>
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <i className="bi bi-list"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userRole === "admin" && (
                          <>
                            <Dropdown.Item
                              className="bi bi-pencil-square"
                              onClick={() =>
                                navigate("/document_library/editDoc", { state: { doc: item } })
                              }
                            >
                              {" "}
                              &nbsp;แก้ไข
                            </Dropdown.Item>
                            <Dropdown.Item
                              href="#/action-2"
                              className="bi bi-box-arrow-down"
                              onClick={() => handleDownload(item.doc_number)}
                            >
                              {" "}
                              &nbsp;Download
                            </Dropdown.Item>
                            <Dropdown.Item
                              href="#/action-3"
                              className="bi bi-trash"
                              onClick={() => handleShowModal(item)}
                            >
                              {" "}
                              &nbsp;ลบ
                            </Dropdown.Item>
                          </>
                        )}
                        {userRole === "worker" && (
                          <>
                            <Dropdown.Item
                              href="#/action-2"
                              className="bi bi-box-arrow-down"
                              onClick={() => handleDownload(item.doc_number)}
                            >
                              {" "}
                              &nbsp;Download
                            </Dropdown.Item>
                          </>
                        )}
                        {userRole === "guest" && (
                          <>
                            <Dropdown.Item
                              href="#/action-2"
                              className="bi bi-box-arrow-down"
                              onClick={() =>handleDownload(item.doc_number)}
                            >
                              {" "}
                              &nbsp;Download
                            </Dropdown.Item>
                          </>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">ไม่พบผลลัพธ์</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ปุ่มอัพโหลดเอกสารสำหรับ Admin */}
      {userRole?.toLowerCase() === "admin" && <ButtonUpload />}

      {/* Modal ยืนยันการลบ */}
      <Actiondropdown
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        docName={selectedDoc?.["ชื่อเอกสาร"]}
      />

      {/* ค้นหา */}
      <div className="searchbar-container">
        <Searchbar
          onSearch={handleSearch}
          searchType="documents"
          username={username}
        />
      </div>
    </div>
  );
};

export default Pagedoc;
