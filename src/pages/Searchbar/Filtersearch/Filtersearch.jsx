import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { docdata } from "../../../data/docdata";


import "./Filtersearch.css";

const Filtersearch = ({ open, onClose, onApply }) => {
  const [formData, setFormData] = useState({
    docNumber: "",
    docName: "",
    department: "",
    timeRange: "1 วัน",
  });

  const [filteredDocs, setFilteredDocs] = useState(docdata);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData({
      docNumber: "",
      docName: "",
      department: "",
      timeRange: "1 วัน",
    });
    setFilteredDocs(docdata);
  };

  const handleSubmit = () => {
    let filtered = docdata;

    if (formData.docNumber) {
      filtered = filtered.filter((doc) =>
        doc['หมายเลข'].includes(formData.docNumber)
      );
    }

    if (formData.docName) {
      filtered = filtered.filter((doc) =>
        doc['ชื่อเอกสาร'].includes(formData.docName)
      );
    }

    if (formData.department) {
      filtered = filtered.filter(
        (doc) => doc['หน่วยงาน'] === formData.department
      );
    }

    if (formData.timeRange) {
      const today = new Date();
      let days = 1;
      if (formData.timeRange === "7 วัน") days = 7;
      if (formData.timeRange === "30 วัน") days = 30;
      const pastDate = new Date(today.setDate(today.getDate() - days));

      filtered = filtered.filter((doc) => {
        const dateParts = doc['วันที่'].split('/');
        const docDate = new Date(
          parseInt(dateParts[2]) - 543,
          parseInt(dateParts[1]) - 1,
          parseInt(dateParts[0])
        );
        return docDate >= pastDate;
      });
    }

    setFilteredDocs(filtered);
    onClose();
    onApply(filtered);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ค้นหาในเอกสาร</DialogTitle>
      <DialogContent className="filter-search-content">
        <TextField
          name="docNumber"
          label="หมายเลขเอกสาร"
          value={formData.docNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="docName"
          label="ชื่อเอกสาร"
          value={formData.docName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>หน่วยงาน</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <MenuItem value="">เลือกทั้งหมด</MenuItem>
            {["บัญชี", "การเงิน", "การตลาด", "ทรัพยากรบุคคล", "ไอที"].map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>ช่วงเวลา</InputLabel>
          <Select
            name="timeRange"
            value={formData.timeRange}
            onChange={handleChange}
          >
            <MenuItem value="1 วัน">1 วัน</MenuItem>
            <MenuItem value="7 วัน">7 วัน</MenuItem>
            <MenuItem value="30 วัน">30 วัน</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary">
          รีเซ็ต
        </Button>
        <Button onClick={handleSubmit} color="primary">
          ค้นหา
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Filtersearch;
