import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegStar } from "@fortawesome/free-regular-svg-icons";
import "./page.css";
import Searchbar from "../Searchbar/Searchbar";
import Actiondropdown from "../actiondropdown/actiondropdown";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonUpload from "../AddDoc/buttonupload";
import Header from "../../Layout/Header/Header";
import { useNavigate } from "react-router-dom";

const Pagedoc = ({ userRole }) => {
  // ตัวแปรสำหรับจัดการสถานะ (State variables)
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error("Username not found in storage");
    }
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลเอกสารจาก API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/documents?username=${username}`
        );
        const data = await response.json();
        setFilteredData(data); // อัพเดต state
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    if (username) {
      fetchDocuments(); // เรียกฟังก์ชัน fetchDocuments เมื่อ username ถูกตั้งค่า
    } else {
      console.log("Username is missing or incorrect");
    }
  }, [username]);

  // ฟังก์ชันสำหรับค้นหาเอกสาร
  const handleSearch = (filteredDocuments) => {
    setFilteredData(filteredDocuments);
  };



  // ฟังก์ชันสำหรับจัดเรียงตามวันที่
  const handleSortByDate = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a["doc_date"].split("/").reverse().join("-"));
      const dateB = new Date(b["doc_date"].split("/").reverse().join("-"));
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // ฟังก์ชันสำหรับจัดเรียงตามลำดับ
  const handleSortByOrder = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const orderA = parseInt(a["หมายเลข"]);
      const orderB = parseInt(b["หมายเลข"]);
      return sortOrder === "desc" ? orderB - orderA : orderA - orderB;
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // ฟังก์ชันสำหรับคลิกไอคอนดาวเพื่อทำเครื่องหมายเป็น Favorite
  const handleStarClick = (index) => {
    const newData = [...filteredData];
    newData[index].isFavorite = !newData[index].isFavorite;
    setFilteredData(newData);
  };

  // ฟังก์ชันเมื่อคลิกที่แถว (เปลี่ยนสถานะเป็น "อ่านแล้ว")
  const handleRowClick = (item) => {
    const newData = [...filteredData];
    const index = filteredData.findIndex(
      (doc) => doc["หมายเลข"] === item["หมายเลข"]
    );
    newData[index].isRead = true;
    setFilteredData(newData);
  };

  // ฟังก์ชันแสดง Modal สำหรับลบเอกสาร
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

  // ฟังก์ชันสำหรับดาวน์โหลดเอกสาร
  const handleDownload = (docId) => {
    const fileUrl = `/files/${docId}.pdf`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${docId}.pdf`;
    document.body.appendChild(link); // เพิ่มลิงก์ลงใน DOM
    link.click(); // กระตุ้นการคลิก
    document.body.removeChild(link); // ลบลิงก์ออกจาก DOM
  };

  return (
    <>
      <div className="page-container">
        <Header />
        {/* ส่วนของแถบค้นหา */}
        <div className="searchbar-container">
          <Searchbar onSearch={handleSearch} searchType="documents" />
        </div>

        {/* ตารางแสดงเอกสาร */}
        <div className="table-wrapper">
          <table className="table-contenner">
            <thead className="table-th">
              <tr>
                <th></th>
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
                    key={index}
                    className={item.isRead ? "row-read" : "row-unread"}
                    onClick={() => handleRowClick(item)}
                  >
                    {/* คอลัมน์ Favorite */}
                    <td>
                      <FontAwesomeIcon
                        icon={item.isFavorite ? faStar : faRegStar}
                        style={{
                          cursor: "pointer",
                          color: item.isFavorite ? "#FF8539" : "#ccc",
                        }}
                        onClick={() => handleStarClick(index)}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{item["doc_number"]}</td>
                    <td>{item["doc_name"]}</td>
                    <td>{item["subject"]}</td>
                    <td>{item["department"]}</td>
                    <td>{item["doc_date"].split("T")[0]}</td>
                    <td>{item["doc_time"].split("T")[1].split(".")[0]}</td>

                    {/* ✅ ใส่ dropdown ใน <td> */}
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id={`dropdown-${index}`}
                      >
                        <i className="bi bi-list"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userRole === "admin" && (
                          <>
                            <Dropdown.Item
                              className="bi bi-pencil-square"
                              onClick={(e) => {
                                e.stopPropagation(); // ป้องกันคลิกแถว
                                navigate("/addDoc", { state: { doc: item } });
                              }}
                            >
                              &nbsp;แก้ไข
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="bi bi-box-arrow-down"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item["doc_number"]);
                              }}
                            >
                              &nbsp;Download
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="bi bi-trash"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowModal(item);
                              }}
                            >
                              &nbsp;ลบ
                            </Dropdown.Item>
                          </>
                        )}
                        {(userRole === "worker" || userRole === "guest") && (
                          <Dropdown.Item
                            className="bi bi-box-arrow-down"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item["doc_number"]);
                            }}
                          >
                            &nbsp;Download
                          </Dropdown.Item>
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">ไม่พบผลลัพธ์</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ปุ่มอัพโหลดเอกสารสำหรับ Admin */}
        {userRole === "admin" && <ButtonUpload />}

        {/* Modal ยืนยันการลบ */}
        <Actiondropdown
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          docName={selectedDoc?.["ชื่อเอกสาร"]}
        />
      </div>
    </>
  );
};

export default Pagedoc;
