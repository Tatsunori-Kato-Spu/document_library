import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Actiondropdown = ({ show, onClose, onConfirm, docName }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>ยืนยันการลบ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "{docName}" ?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          ลบ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Actiondropdown;
