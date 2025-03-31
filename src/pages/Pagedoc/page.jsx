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

const Pagedoc = ({ userRole }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [username, setUsername] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);

  const navigate = useNavigate();

  // ดึง username จาก localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      console.error("Username not found in storage");
    }
  }, []);

  // ดึงเอกสารจาก backend
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/documents?username=${username}`
        );
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

  const handleStarClick = (index) => {
    const updated = [...filteredData];
    updated[index].isFavorite = !updated[index].isFavorite;
    setFilteredData(updated);
  };

  // ฟังก์ชันเมื่อคลิกอ่าน
  const handleRowClick = async (docNumber) => {
    console.log("Clicked document number:", docNumber);
    if (!docNumber) {
      console.error("Document number is undefined");
      return; // ไม่ให้ดำเนินการต่อถ้า docNumber เป็น undefined
    }

    try {
      // เมื่อคลิกที่บรรทัดนี้ ดึงข้อมูลเอกสาร
      const response = await fetch(
        `http://localhost:3001/api/documents/${docNumber}`
      );

      if (response.ok) {
        const data = await response.json(); // ดึงข้อมูล JSON ออกจาก response
        console.log("API Response:", data);
        setSelectedDocument(data); // เก็บข้อมูลเอกสารใน state
      } else {
        console.error("Error: ", response.statusText); // ถ้าไม่สำเร็จ
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }

    const handleRowClick = (item) => {
      const index = filteredData.findIndex(
        (doc) => doc.doc_number === item.doc_number
      );
      const updated = [...filteredData];
      updated[index].isRead = true;
      setFilteredData(updated);
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

    const handleDownload = (docId) => {
      const fileUrl = `/files/${docId}.pdf`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${docId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="page-container">
        <Header />

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
                    key={item.id}
                    className={item.isRead ? "row-read" : "row-unread"}
                    onClick={() => handleRowClick(item.doc_number)}
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
                                  navigate("/addDoc", { state: { doc: item } })
                                }
                              >
                                {" "}
                                &nbsp;แก้ไข
                              </Dropdown.Item>
                              <Dropdown.Item
                                href="#/action-2"
                                className="bi bi-box-arrow-down"
                                onClick={() =>
                                  handleDownload(item["ชื่อเอกสาร"])
                                }
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
                                onClick={() =>
                                  handleDownload(item["ชื่อเอกสาร"])
                                }
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
                                onClick={() =>
                                  handleDownload(item["ชื่อเอกสาร"])
                                }
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
        {userRole === "admin" && <ButtonUpload />}

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

        {/* ตารางเอกสาร */}
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
                    <td>
                      <FontAwesomeIcon
                        icon={item.isFavorite ? faStar : faRegStar}
                        style={{
                          cursor: "pointer",
                          color: item.isFavorite ? "#FF8539" : "#ccc",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStarClick(index);
                        }}
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{item.doc_number}</td>
                    <td>{item.doc_name}</td>
                    <td>{item.subject}</td>
                    <td>{item.department}</td>
                    <td>{item.doc_date?.split("T")[0]}</td>
                    <td>{item.doc_time?.split("T")[1]?.split(".")[0]}</td>

                    <Dropdown>
                      <Dropdown.Toggle variant="success" size="sm">
                        <i className="bi bi-list"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userRole === "admin" && (
                          <>
                            <Dropdown.Item
                              className="bi bi-pencil-square"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate("/editDoc", {
                                  state: {
                                    doc: {
                                      ...item,
                                      role: item.role || "",
                                    },
                                  },
                                });
                              }}
                            >
                              &nbsp;แก้ไข
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="bi bi-box-arrow-down"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(item.doc_number);
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
                              handleDownload(item.doc_number);
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

        {/* ปุ่มอัพโหลดสำหรับ admin */}
        {userRole === "admin" && <ButtonUpload />}

        {/* Modal ลบ */}
        <Actiondropdown
          show={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          docName={selectedDoc?.doc_name}
        />
      </div>
    );
  };
};

export default Pagedoc;
