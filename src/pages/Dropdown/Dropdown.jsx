import React, { useEffect, useRef } from "react";
import "./Dropdown.css";

const Dropdown = ({ isOpen, onClose }) => {
  const menuRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      onClose();  // ปิดเมนูหากคลิกข้างนอก
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="dropdown-menu-container"
      ref={menuRef}
      aria-hidden={!isOpen}  // เพิ่มการเข้าถึง: ซ่อนเมนูเมื่อปิด
    >
      <ul className="dropdown-menu" role="menu">
        <li className="menu-item" role="menuitem">
          <i className="bi bi-folder2-open"></i> เปิด
        </li>
        <li className="menu-item" role="menuitem">
          <i className="bi bi-download"></i> ดาวน์โหลด
        </li>
        <li className="menu-item" role="menuitem">
          <i className="bi bi-share"></i> แชร์
        </li>
        <li className="menu-item" role="menuitem">
          <i className="bi bi-info-circle"></i> รายละเอียด
        </li>
        <li className="menu-item danger" role="menuitem">
          <i className="bi bi-trash"></i> ลบ
        </li>
      </ul>
    </div>
  );
};

export default Dropdown;
