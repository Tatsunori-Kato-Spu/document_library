import express from "express";
import mysql from 'mysql2/promise';
import cors from "cors";

import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',  // ✅ ใช้ชื่อ service ตาม Docker Compose
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'userdocs',
  port: process.env.DB_PORT || 3306,
});

// -------------------------- Upload Document (No PDF) --------------------------
app.post("/api/documents/upload", async (req, res) => {
  const { docNumber, docName, subject, department, date, roles } = req.body;
  const now = new Date();

  try {
    const [insertResult] = await pool.query(
      `INSERT INTO documents (doc_number, doc_name, subject, department, doc_date, doc_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [docNumber, docName, subject, department, date, now]
    );
    const docId = insertResult.insertId;

    const allRoleIds = new Set();

    // ✅ วนเก็บ role_id ที่เกี่ยวข้อง
    for (const roleName of roles) {
      const [roleRows] = await pool.query(
        `SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`,
        [roleName]
      );
      const baseRole = roleRows[0];
      if (!baseRole) {
        return res.status(400).json({ success: false, message: `ไม่พบ role: ${roleName}` });
      }
      allRoleIds.add(baseRole.id); // ✅ เก็บ role_id
    }

    // ✅ ค่อยมา insert document_roles ทีหลัง
    for (const roleId of allRoleIds) {
      await pool.query(
        `INSERT INTO document_roles (document_id, role_id) VALUES (?, ?)`,
        [docId, roleId]
      );
    }

    res.json({ success: true, message: "Document uploaded successfully with correct access" });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ success: false, message: "Upload failed", error: err.message });
  }
});

// -------------------------- Login --------------------------
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT users.*, roles.name AS role 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.username = ? AND users.password = ?`,
      [username, password]
    );
    conn.release();

    if (rows.length === 1) {
      res.json({ success: true, userInfo: rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// Backend: Endpoint เพื่อดึงเลขเอกสารล่าสุด

app.get("/api/documents/lastDocNumber", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT doc_number FROM documents ORDER BY doc_number DESC LIMIT 1");
    if (result.length > 0) {
      const lastDocNumber = result[0].doc_number; // เลขเอกสารล่าสุด
      return res.json({ lastNumber: lastDocNumber });
    } else {
      return res.json({ lastNumber: "0000000" }); // ถ้าไม่มีเอกสารเลยให้เริ่มจาก 0000000
    }
  } catch (err) {
    console.error("Error fetching last document number:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// -------------------------- Documents by Role --------------------------
app.get("/api/documents", async (req, res) => {
  const { username } = req.query;

  try {
    // ดึงชื่อ role ของผู้ใช้
    const [userRows] = await pool.query(
      `SELECT roles.name AS role_name FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE users.username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const userRole = userRows[0].role_name.toLowerCase();

    // สร้าง map ของ role ที่แต่ละคนสามารถเข้าถึงได้
    const roleVisibilityMap = {
      admin: ["admin", "worker", "guest"],
      worker: ["worker", "guest"],
      guest: ["guest"]
    };

    const visibleRoles = roleVisibilityMap[userRole] || [];

    // แปลงชื่อ role เป็น id
    const [roleIdRows] = await pool.query(
      `SELECT id FROM roles WHERE LOWER(name) IN (?)`,
      [visibleRoles]
    );
    const accessibleRoleIds = roleIdRows.map(r => r.id);

    if (accessibleRoleIds.length === 0) {
      return res.json([]);
    }

    // ดึงเอกสารที่ตรงกับ role id ที่เข้าถึงได้
    const [docs] = await pool.query(
      `SELECT DISTINCT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time 
       FROM documents d 
       JOIN document_roles dr ON d.id = dr.document_id 
       WHERE dr.role_id IN (?)`,
      [accessibleRoleIds]
    );

    res.json(docs);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});


// ดึงข้อมูลเอกสารตามหมายเลขเอกสาร
app.get("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM documents WHERE doc_number = ?`,
      [docNumber]
    );
    rows.length > 0 ? res.json(rows[0]) : res.status(404).json({ message: "ไม่พบเอกสารที่มีหมายเลขนี้" });
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});


// -------------------------- Search --------------------------
app.post("/api/documents/search", async (req, res) => {
  const { keyword, username } = req.body;
  try {
    const [userRows] = await pool.query(`SELECT role_id FROM users WHERE username = ?`, [username]);
    if (userRows.length === 0) return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    const roleId = userRows[0].role_id;
    const [docRows] = await pool.query(`
      SELECT d.* FROM documents d JOIN document_roles dr ON d.id = dr.document_id WHERE dr.role_id = ?`, [roleId]);

    const lowerKeyword = (keyword || "").trim().toLowerCase();
    const filtered = docRows.filter(doc =>
      !lowerKeyword ||
      doc.doc_name?.toLowerCase().includes(lowerKeyword) ||
      doc.doc_number?.includes(lowerKeyword)
    );
    res.json(filtered);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
});



app.post("/api/documents/search/filter", async (req, res) => {
  const { keyword, department, days } = req.body;
  const { username } = req.query;

  try {
    const [userRows] = await pool.query(
      `SELECT role_id FROM users WHERE username = ?`, [username]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const roleId = userRows[0].role_id;
    const [docs] = await pool.query(`
      SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
      FROM documents d
      JOIN document_roles dr ON d.id = dr.document_id
      WHERE dr.role_id = ?
    `, [roleId]);

    const now = new Date();
    const filtered = docs.filter((doc) => {
      const lowerKeyword = keyword?.toLowerCase() || "";
      const matchKeyword = keyword
        ? doc.doc_name.toLowerCase().includes(lowerKeyword) ||
        doc.doc_number.includes(lowerKeyword)
        : true;

      const matchDept = department ? doc.department === department : true;

      const createdAt = new Date(doc.doc_date);
      const timeDiff = (now - createdAt) / (1000 * 60 * 60 * 24);
      const matchDays = days ? timeDiff <= days : true;

      return matchKeyword && matchDept && matchDays;
    });

    res.json(filtered);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// -------------------------- Users --------------------------
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT users.id, users.name, users.id_card, users.department, users.position, users.email, users.contact, roles.name AS role
      FROM users JOIN roles ON users.role_id = roles.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.get("/api/roles", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, name FROM roles`);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching roles:", err.message);
    res.status(500).json({ message: "Error fetching roles" });
  }
});

app.put("/api/users/:id/role", async (req, res) => {
  const userId = req.params.id;
  const { role: newRoleName } = req.body;

  try {
    // หา role_id จากชื่อ role
    const [roleRows] = await pool.query(
      `SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`,
      [newRoleName]
    );
    if (roleRows.length === 0) {
      return res.status(400).json({ success: false, message: `ไม่พบ role: ${newRoleName}` });
    }
    const roleId = roleRows[0].id;

    // อัปเดต users.role_id
    await pool.query(
      `UPDATE users SET role_id = ? WHERE id = ?`,
      [roleId, userId]
    );

    res.json({ success: true, message: "เปลี่ยน role สำเร็จ" });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ success: false, message: "อัปเดต role ล้มเหลว", error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  const {
    username,
    password,
    name,
    id_card,
    department,
    position,
    email,
    contact,
    role // ค่าที่ส่งมาเป็น string: "admin"/"worker"/"guest"
  } = req.body;

  try {
    // หา role_id จากชื่อ role
    const [roleRows] = await pool.query(
      `SELECT id FROM roles WHERE LOWER(name)=LOWER(?)`,
      [role]
    );
    if (roleRows.length === 0) {
      return res.status(400).json({ success: false, message: `ไม่พบ role: ${role}` });
    }
    const roleId = roleRows[0].id;
    const token = uuidv4(); // สุ่ม token ให้ user

    // ใส่ข้อมูลลงตาราง users
    const [result] = await pool.query(
      `INSERT INTO users
        (username, password, name, id_card, department, position, email, contact, role_id, token)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, password, name, id_card, department, position, email, contact, roleId, token]
    );

    res.json({ success: true, message: "สร้างผู้ใช้ใหม่สำเร็จ", userId: result.insertId });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, message: "สร้างผู้ใช้ล้มเหลว", error: err.message });
  }
});

// แก้ไข้ข้อมูล member
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT users.id, users.name, users.id_card, users.department, users.position, users.email, users.contact, roles.name AS role
       FROM users
       JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`, [id]
    );

    if (rows.length === 0) {
      console.log("ไม่พบผู้ใช้ id =", id);
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});
// อัปเดตข้อมูล user
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, id_card, department, position, email, contact } = req.body;

  try {
    await pool.query(
      `UPDATE users SET name = ?, id_card = ?, department = ?, position = ?, email = ?, contact = ? WHERE id = ?`,
      [name, id_card, department, position, email, contact, id]
    );

    res.json({ success: true, message: "อัปเดตข้อมูลผู้ใช้สำเร็จ" });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ success: false, message: "อัปเดตล้มเหลว", error: err.message });
  }
});


// -------------------------- Profile --------------------------
app.get("/api/profile", async (req, res) => {
  const { token } = req.query;
  try {
    const [rows] = await pool.query(
      `SELECT users.*, roles.name AS role FROM users JOIN roles ON users.role_id = roles.id WHERE users.token = ?`,
      [token]
    );
    if (rows.length === 1) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.json({ success: false, message: "ไม่พบผู้ใช้สำหรับ token นี้" });
    }
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------------- Delete Document --------------------------
app.delete("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params;
  try {
    await pool.query(`DELETE FROM document_roles WHERE document_id IN (SELECT id FROM documents WHERE doc_number = ?)`, [docNumber]);
    await pool.query(`DELETE FROM documents WHERE doc_number = ?`, [docNumber]);
    res.json({ success: true, message: "ลบเอกสารเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, message: "ลบเอกสารล้มเหลว", error: err.message });
  }
});

// -------------------------- Update edit Document --------------------------
app.put("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params;
  const { doc_name, subject, department, role } = req.body;
  const date = new Date(); // ✅ ใช้เวลาปัจจุบันแทน
  try {
    // อัปเดตข้อมูลเอกสารหลัก
    await pool.query(
      `UPDATE documents SET doc_name = ?, subject = ?, department = ?, doc_date = ? WHERE doc_number = ?`,
      [doc_name, subject, department, date, docNumber]
    );

    // ถ้ามีข้อมูล role ให้จัดการกับตาราง document_roles
    if (role) {
      const [roleRows] = await pool.query(
        `SELECT id FROM roles WHERE LOWER(name) = LOWER(?)`,
        [role]
      );

      const roleId = roleRows[0]?.id;

      if (roleId) {
        // ลบ role เดิมของเอกสารก่อน
        await pool.query(
          `DELETE FROM document_roles WHERE document_id = (SELECT id FROM documents WHERE doc_number = ?)`,
          [docNumber]
        );

        // เพิ่ม role ใหม่
        await pool.query(
          `INSERT INTO document_roles (document_id, role_id) 
           SELECT id, ? FROM documents WHERE doc_number = ?`,
          [roleId, docNumber]
        );
      }
    }

    res.json({ success: true, message: "อัปเดตสำเร็จ" });
  } catch (err) {
    console.error("Error updating document:", err.message);
    res.status(500).json({ success: false, message: "อัปเดตล้มเหลว" });
  }
});



// -------------------------- edit department --------------------------
app.get("/api/departments", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT DISTINCT department FROM documents WHERE department IS NOT NULL AND department <> ''`);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching departments:", err.message);
    res.status(500).json({ message: "Error fetching departments" });
  }
});
////////////////////////////No
app.post('/api/documents', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.id, d.doc_name, d.subject, d.doc_date, d.doc_time, d.department
      FROM documents d
      ORDER BY d.doc_date DESC, d.doc_time DESC
      LIMIT 5;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).send('Server error');
  }
});


// -------------------------- Start server --------------------------
app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});

