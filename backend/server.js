import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: "sa",
  password: "Sa123456!",
  server: "localhost",
  port: 1433,
  database: "userdocs",
  options: {
    trustServerCertificate: true,
  },
};


// -------------------------- Upload Document (No PDF) --------------------------
app.post("/api/documents/upload", async (req, res) => {
  const { docNumber, docName, department, date, role } = req.body;
  const now = new Date();

  try {
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input("doc_number", sql.NVarChar(20), docNumber)
      .input("doc_name", sql.NVarChar(100), docName)
      .input("subject", sql.NVarChar(255), docName)
      .input("department", sql.NVarChar(100), department)
      .input("doc_date", sql.Date, date)
      .input("doc_time", sql.Time, now)
      .query(`
        INSERT INTO documents (doc_number, doc_name, subject, department, doc_date, doc_time)
        OUTPUT INSERTED.id
        VALUES (@doc_number, @doc_name, @subject, @department, @doc_date, @doc_time)
      `);

    const docId = result.recordset[0].id;

    // ดึง role_id ของ role ที่เลือก (case-insensitive)
    const roleResult = await pool
      .request()
      .input("role", sql.NVarChar, role)
      .query(`SELECT id FROM roles WHERE LOWER(name) = LOWER(@role)`);

    const roleId = roleResult.recordset[0]?.id;

    if (roleId) {
      // ใส่ role ที่เลือก
      await pool
        .request()
        .input("document_id", sql.Int, docId)
        .input("role_id", sql.Int, roleId)
        .query(
          `INSERT INTO document_roles (document_id, role_id) VALUES (@document_id, @role_id)`
        );

      // ถ้าไม่ใช่ admin → เพิ่ม admin ด้วย
      if (role.toLowerCase() !== "admin") {
        const adminRole = await pool
          .request()
          .input("name", sql.NVarChar, "admin")
          .query(`SELECT id FROM roles WHERE LOWER(name) = @name`);

        const adminId = adminRole.recordset[0]?.id;

        if (adminId && adminId !== roleId) {
          await pool
            .request()
            .input("document_id", sql.Int, docId)
            .input("role_id", sql.Int, adminId)
            .query(
              `INSERT INTO document_roles (document_id, role_id) VALUES (@document_id, @role_id)`
            );
        }
      }
    }

    res.json({ success: true, message: "Document uploaded (no file)" });
  } catch (err) {
    console.error("Upload error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Upload failed", error: err.message });
  }
});

// -------------------------- Login --------------------------
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .input("password", sql.VarChar, password)
      .query(`
        SELECT users.*, roles.name AS role 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE users.username = @username AND users.password = @password
      `);

    if (result.recordset.length === 1) {
      res.json({ success: true, userInfo: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------------- Documents by Role --------------------------
app.get("/api/documents", async (req, res) => {
  const { username } = req.query;

  try {
    const pool = await sql.connect(config);

    // ดึง role_id ของผู้ใช้
    const userResult = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query(`SELECT role_id FROM users WHERE username = @username`);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const userRoleId = userResult.recordset[0].role_id;

    // ดึง role_id ของ guest และ admin
    const roleResult = await pool.query(`SELECT id, name FROM roles`);
    const rolesMap = Object.fromEntries(
      roleResult.recordset.map((r) => [r.name.toLowerCase(), r.id])
    );

    const guestId = rolesMap["guest"];
    const adminId = rolesMap["admin"];

    let query;

    if (userRoleId === adminId) {
      // ✅ Admin เห็นทุกอย่าง
      query = `
        SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
        FROM documents d
      `;
    } else if (userRoleId === guestId) {
      // ✅ Guest เห็นของตัวเอง
      query = `
        SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
        FROM documents d
        JOIN document_roles dr ON d.id = dr.document_id
        WHERE dr.role_id = ${guestId}
      `;
    } else {
      // ✅ Worker หรือ role อื่น เห็นของตัวเอง + guest
      query = `
        SELECT DISTINCT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
        FROM documents d
        JOIN document_roles dr ON d.id = dr.document_id
        WHERE dr.role_id IN (${userRoleId}, ${guestId})
      `;
    }

    const result = await pool.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});


// ดึงข้อมูลเอกสารตามหมายเลขเอกสาร
app.get("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params; // รับ doc_number จาก URL

  try {
    const pool = await sql.connect(config);
    // ดึงข้อมูลเอกสารที่มี doc_number ตรงกับที่ผู้ใช้ระบุ
    const result = await pool
      .request()
      .input('docNumber', sql.VarChar, docNumber)
      .query(`
        SELECT * 
        FROM documents 
        WHERE doc_number = @docNumber
      `);
      if (result.recordset.length > 0) {
        // ส่งข้อมูลเอกสารกลับไปให้ frontend
        res.json(result.recordset[0]);
      } else {
        res.status(404).json({ message: "ไม่พบเอกสารที่มีหมายเลขนี้" });
      }
    } catch (err) {
      console.error("SQL error:", err.message);
      res.status(500).json({ message: "Database error", error: err.message });
    }
  });

// -------------------------- Document by doc_number --------------------------
app.get("/api/documents/:id", async (req, res) => {
  try {
    const docId = req.params.id;
    await sql.connect(config);
    const result = await sql.query`
      SELECT * FROM documents WHERE doc_number = ${docId}
    `;

    if (result.recordset.length > 0) {
      // ส่งข้อมูลเอกสารกลับไปให้ frontend
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: "ไม่พบเอกสารที่มีหมายเลขนี้" });
    }
  } catch (err) {
    console.error("SQL error:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// -------------------------- Search --------------------------
app.post("/api/documents/search", async (req, res) => {
  const { keyword, username } = req.body; // รับข้อมูลจาก req.body

  try {
    await sql.connect(config);

    const userResult = await sql.query`SELECT role_id FROM users WHERE username = ${username}`;
    if (userResult.recordset.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const roleId = userResult.recordset[0].role_id;

    const docResult = await sql.query`
      SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
      FROM documents d
      JOIN document_roles dr ON d.id = dr.document_id
      WHERE dr.role_id = ${roleId}
    `;

    const docs = docResult.recordset;
    const lowerKeyword = (keyword || "").trim().toLowerCase();

    const filtered = docs.filter((doc) => {
      return (
        !lowerKeyword ||
        doc.doc_name?.toLowerCase().includes(lowerKeyword) ||
        doc.doc_number?.includes(lowerKeyword)
      );
    });

    // ✅ Log ข้อมูลใน server ให้ชัวร์ (ไม่ crash แน่)
    console.log("🔍 keyword (POST):", keyword);
    console.log("👤 user:", username, "| roleId:", roleId);
    console.log("📄 ทั้งหมด:", docs.length, "| ตรงกับ keyword:", filtered.length);

    return res.json(filtered);
  } catch (err) {
    console.error("❌ Server error (POST search):", err.message);
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
  }
});



app.post("/api/documents/search/filter", async (req, res) => {
  const { keyword, department, days } = req.body;
  const { username } = req.query;

  try {
    await sql.connect(config);

    const userQuery =
      await sql.query`SELECT role_id FROM users WHERE username = ${username}`;
    if (userQuery.recordset.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    const roleId = userQuery.recordset[0].role_id;

    const documentQuery = await sql.query`
      SELECT d.id, d.doc_number, d.doc_name, d.subject, d.department, d.doc_date, d.doc_time
      FROM documents d
      JOIN document_roles dr ON d.id = dr.document_id
      WHERE dr.role_id = ${roleId}
    `;

    const now = new Date();
    const docs = documentQuery.recordset;

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
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดที่ฐานข้อมูล", error: err.message });
  }
});

// -------------------------- Users --------------------------
app.get("/api/users", async (req, res) => {

  try {
    const pool = await sql.connect(config);
    const result = await pool.query(`
      SELECT users.id, users.name, users.id_card, users.department, users.position, users.email, users.contact, roles.name AS role
      FROM users
      JOIN roles ON users.role_id = roles.id
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

app.put("/api/users/:id/role", async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  try {
    const pool = await sql.connect(config);
    const roleResult = await pool
      .request()
      .input("role", sql.NVarChar, role)
      .query("SELECT id FROM roles WHERE name = @role");

    if (roleResult.recordset.length === 0) {
      return res.status(400).json({ message: "Role not found" });
    }

    const roleId = roleResult.recordset[0].id;

    await pool
      .request()
      .input("role_id", sql.Int, roleId)
      .input("id", sql.Int, userId)
      .query("UPDATE users SET role_id = @role_id WHERE id = @id");

    res.json({ message: "Role updated" });
  } catch (err) {
    console.error("Update role error:", err.message);
    res.status(500).json({ message: "Update error", error: err.message });
  }
});

// -------------------------- Profile --------------------------
app.get("/api/profile", async (req, res) => {
  const { token } = req.query;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("token", sql.VarChar, token)
      .query(`
        SELECT users.*, roles.name AS role 
        FROM users 
        JOIN roles ON users.role_id = roles.id 
        WHERE users.token = @token
      `);

    if (result.recordset.length === 1) {
      res.json({ success: true, user: result.recordset[0] });
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
    const pool = await sql.connect(config);

    // ลบจาก document_roles ก่อน (เพราะมี foreign key)
    await pool
      .request()
      .input("doc_number", sql.NVarChar, docNumber)
      .query(`
        DELETE FROM document_roles
        WHERE document_id IN (
          SELECT id FROM documents WHERE doc_number = @doc_number
        )
      `);

    // ลบจาก documents
    await pool
      .request()
      .input("doc_number", sql.NVarChar, docNumber)
      .query(`
        DELETE FROM documents WHERE doc_number = @doc_number
      `);

    res.json({ success: true, message: "ลบเอกสารเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, message: "ลบเอกสารล้มเหลว", error: err.message });
  }
});

// -------------------------- Update edit Document --------------------------
app.put("/api/documents/:docNumber", async (req, res) => {
  const { docNumber } = req.params;
  const { doc_name, subject, department, date, role } = req.body;

  try {
    const pool = await sql.connect(config);

    // อัปเดตตาราง documents
    await pool
      .request()
      .input("doc_number", sql.NVarChar, docNumber)
      .input("doc_name", sql.NVarChar, doc_name)
      .input("subject", sql.NVarChar, subject)
      .input("department", sql.NVarChar, department)
      .input("doc_date", sql.Date, date)
      .query(`
        UPDATE documents
        SET doc_name = @doc_name,
            subject = @subject,
            department = @department,
            doc_date = @doc_date
        WHERE doc_number = @doc_number
      `);

    // อัปเดต role ใน document_roles
    if (role) {
      const roleResult = await pool
        .request()
        .input("role", sql.NVarChar, role)
        .query(`SELECT id FROM roles WHERE LOWER(name) = LOWER(@role)`);

      const roleId = roleResult.recordset[0]?.id;

      if (roleId) {
        // ลบ role เดิมก่อน
        await pool.request().input("doc_number", sql.NVarChar, docNumber).query(`
          DELETE FROM document_roles
          WHERE document_id = (SELECT id FROM documents WHERE doc_number = @doc_number)
        `);

        // ใส่ role ใหม่
        await pool
          .request()
          .input("role_id", sql.Int, roleId)
          .input("doc_number", sql.NVarChar, docNumber)
          .query(`
            INSERT INTO document_roles (document_id, role_id)
            SELECT id, @role_id FROM documents WHERE doc_number = @doc_number
          `);
      }
    }

    res.json({ success: true, message: "อัปเดตสำเร็จ" });
  } catch (err) {
    console.error("Error updating document:", err.message);
    res.status(500).json({ success: false, message: "อัปเดตล้มเหลว" });
  }
});

app.get("/api/roles", async (req, res) => {
  try {
    const result = await sql.connect(config);
    const roles = await result.request().query(`SELECT id, name FROM roles`);
    res.json(roles.recordset);
  } catch (err) {
    console.error("Error fetching roles:", err.message);
    res.status(500).json({ message: "Error fetching roles" });
  }
});


// -------------------------- edit department --------------------------
app.get("/api/departments", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.query(`
      SELECT DISTINCT department
      FROM documents
      WHERE department IS NOT NULL AND department <> ''
    `);

    res.json(result.recordset); // จะได้ [{ department: "บัญชี" }, { department: "การเงิน" }]
  } catch (err) {
    console.error("Error fetching departments:", err.message);
    res.status(500).json({ message: "Error fetching departments" });
  }
});

// -------------------------- Start server --------------------------
app.listen(3001, () => {
  console.log("✅ Backend running on http://localhost:3001");
});
